// script.js

const bookingForm = document.getElementById("bookingForm");
const bookingList = document.getElementById("bookingList");
const mapFrame = document.getElementById("mapFrame");

// 🔹 Load existing bookings from backend
async function loadBookings() {
  try {
    const res = await fetch("http://localhost:3000/bookings");
    const bookings = await res.json();

    bookingList.innerHTML = "";
    if (bookings.length === 0) {
      bookingList.innerHTML = `<tr><td colspan="7">No bookings yet</td></tr>`;
    } else {
      bookings.forEach(b => {
        const row = `
          <tr>
            <td>${b.name || "-"}</td>
            <td>${b.phone || "-"}</td>
            <td>${b.date}</td>
            <td>${b.persons}</td>
            <td>${b.place}</td>
            <td>${b.orders}</td>
            <td>${b.menu}</td>
          </tr>
        `;
        bookingList.insertAdjacentHTML("beforeend", row);
      });
    }
  } catch (err) {
    console.error("❌ Error loading bookings:", err);
  }
}

// 🔹 Handle form submit
async function handleBooking(e) {
  e.preventDefault(); // stop page reload

  const data = {
    name: document.getElementById("name").value,      // 👈 new
    phone: document.getElementById("phone").value,    // 👈 new
    date: document.getElementById("date").value,
    persons: parseInt(document.getElementById("persons").value, 10),
    place: document.getElementById("place").value,
    orders: parseInt(document.getElementById("orders").value, 10),
    menu: document.getElementById("menu").value,
  };

  try {
    const res = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to save booking");
    const result = await res.json();
    console.log("✅ Booking saved:", result);

    // Update map
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(data.place)}&output=embed`;

    // Reset form + refresh table
    bookingForm.reset();
    loadBookings();

    alert("✅ Booking received and saved to database!");
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    alert("⚠️ Error: Could not save booking.");
  }
}

// 🔹 Event listener
bookingForm.addEventListener("submit", handleBooking);

// 🔹 Load records on startup
window.onload = loadBookings;
