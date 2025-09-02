
  const form = document.getElementById('bookingForm');
  const bookingList = document.getElementById('bookingList');
  const mapFrame = document.getElementById('mapFrame');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const persons = document.getElementById('persons').value;
    const place = document.getElementById('place').value;
    const orders = document.getElementById('orders').value;
    const menu = document.getElementById('menu').value;

    // Show booking in the table
    if (bookingList.querySelector('td') && bookingList.rows.length === 1) {
      bookingList.innerHTML = ''; // remove placeholder
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${date}</td>
      <td>${persons}</td>
      <td>${place}</td>
      <td>${orders}</td>
      <td>${menu}</td>
    `;
    bookingList.appendChild(row);

    // Update map
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;

    // Send booking to Google Sheets
    const bookingData = { date, persons, place, orders, menu };

    fetch("https://script.google.com/macros/s/AKfycbz7okd7a-OG81qmIRhw9Mxz612lrrTAixx6e2o1HVmrKDZ-drL65n3S9S0EM0WIroMGHw/exec", {
  method: "POST",
  body: JSON.stringify(bookingData),
  headers: { "Content-Type": "application/json" }
})

    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        alert("✅ Booking received and saved to Google Sheets!");
      } else {
        alert("⚠️ Booking failed to save.");
      }
    })
    .catch(err => {
      console.error("❌ Error sending booking:", err);
      alert("⚠️ Error: Could not connect to Google Sheets.");
    });

    // Reset form
    form.reset();
  });
