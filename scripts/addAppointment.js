document.addEventListener("DOMContentLoaded", function () {
    fetchDoctors();
});

// Fetch all doctors for the dropdown
function fetchDoctors() {
    let doctorSelect = document.getElementById("doctor-name");
    if (!doctorSelect) {
        console.error("Error: doctor-name select element not found!");
        return;
    }

    db.collection("doctors").get().then(snapshot => {
        snapshot.forEach(doc => {
            let doctor = doc.data();
            let option = document.createElement("option");
            option.value = doctor.name;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }).catch(error => {
        console.error("Error fetching doctors:", error);
    });
}

// Add a new appointment to Firestore
function addAppointment() {
    let doctorName = document.getElementById("doctor-name").value;
    let appointmentDate = document.getElementById("appointment-date").value;
    let appointmentTime = document.getElementById("appointment-time").value;

    // Basic form validation
    if (!doctorName || !appointmentDate || !appointmentTime) {
        alert("Please fill in all fields.");
        return;
    }

    // Combine date and time into a JavaScript Date object
    let appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    // Store appointment in Firestore
    db.collection("appointment").add({
        doctorName: doctorName,
        appointmentTime: appointmentDateTime,
    }).then(() => {
        alert("Appointment added!");
        window.location.href = "appointment.html";  // Redirect to appointment page
    }).catch(error => {
        console.error("Error adding appointment:", error);
    });
}
