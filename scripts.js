// Select a match and display the booking form
function selectMatch(element, matchName, logoA, logoB, date) {
    clearSelection();
    element.classList.add('selected');

    // Set match details in hidden fields
    document.getElementById('match').value = matchName;
    document.getElementById('logoA').value = logoA;
    document.getElementById('logoB').value = logoB;
    document.getElementById('matchDate').value = date;

    // Show the booking form
    document.getElementById('bookingForm').classList.add('active');
}

// Clear previously selected match
function clearSelection() {
    const selectedCards = document.querySelectorAll('.card.selected');
    selectedCards.forEach(card => card.classList.remove('selected'));
}

// Show or hide Mobile Money details
function togglePaymentDetails(paymentMethod) {
    const momoDetails = document.getElementById('momoDetails');
    momoDetails.style.display = paymentMethod === 'MoMo' ? 'block' : 'none';
}

// Calculate total ticket price
function calculateTotal(ticketType, quantity) {
    const prices = {
        VIP: 15000,
        'First Class': 10000,
        'Second Class': 5000,
        'Third Class': 2000
    };
    return prices[ticketType] * quantity;
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const match = document.getElementById('match').value;
    const logoA = document.getElementById('logoA').value;
    const logoB = document.getElementById('logoB').value;
    const date = document.getElementById('matchDate').value;
    const ticketType = document.getElementById('ticketType').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    if (!name || !email || !match || !ticketType || isNaN(quantity)) {
        alert('Please fill out all required fields.');
        return;
    }

    const totalAmount = calculateTotal(ticketType, quantity);

    // Update ticket preview
    document.getElementById('previewMatch').textContent = match;
    document.getElementById('previewDate').textContent = date;
    document.getElementById('previewTicketType').textContent = ticketType;
    document.getElementById('previewQuantity').textContent = quantity;
    document.getElementById('previewTotal').textContent = `${totalAmount} SSP`;

    // Display the ticket preview
    document.getElementById('ticketPreview').style.display = 'block';
}

// Generate and download ticket as a PDF
function downloadTicketPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const match = document.getElementById('previewMatch').textContent;
    const logoA = document.getElementById('logoA').value;
    const logoB = document.getElementById('logoB').value;
    const date = document.getElementById('previewDate').textContent;
    const ticketType = document.getElementById('previewTicketType').textContent;
    const quantity = document.getElementById('previewQuantity').textContent;
    const totalAmount = document.getElementById('previewTotal').textContent;

    // Add header and league logo
    pdf.setFontSize(18);
    pdf.text("Football Ticket", 105, 10, { align: "center" });
    pdf.addImage("ssfa_logo.jpg", "JPEG", 85, 15, 40, 40); // Add league logo

    // Add ticket details
    pdf.setFontSize(12);
    pdf.text(`Match: ${match}`, 10, 60);
    pdf.text(`Date: ${date}`, 10, 70);
    pdf.text(`Ticket Type: ${ticketType}`, 10, 80);
    pdf.text(`Quantity: ${quantity}`, 10, 90);
    pdf.text(`Total Amount: ${totalAmount}`, 10, 100);

    // Add team logos
    pdf.addImage(logoA, "JPEG", 10, 110, 30, 30);
    pdf.addImage(logoB, "JPEG", 170, 110, 30, 30);

    // Generate QR code
    const qrCodeData = `Match: ${match}, Date: ${date}, Ticket Type: ${ticketType}, Quantity: ${quantity}, Total Amount: ${totalAmount}`;
    QRCode.toDataURL(qrCodeData, { width: 100 }, function (err, url) {
        if (!err) {
            pdf.addImage(url, "PNG", 80, 150, 50, 50); // Add QR code
            pdf.save(`${match}.pdf`); // Download PDF
        } else {
            console.error("QR Code generation error:", err);
        }
    });
}

// Event Listeners
document.getElementById('paymentMethod').addEventListener('change', function () {
    togglePaymentDetails(this.value);
});

document.getElementById('bookingForm').addEventListener('submit', handleFormSubmission);
