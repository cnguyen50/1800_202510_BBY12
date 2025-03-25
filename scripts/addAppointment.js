// Fetch all doctors for the dropdown
function fetchDoctors() {
    db.collection("doctors").get().then(snapshot => {
        let doctorSelect = document.getElementById("doctor-name");
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

    // Combine date and time into a JavaScript Date object
    let appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    // Store appointment in Firestore
    db.collection("appointment").add({
        doctorName: doctorName,
        appointmentTime: appointmentDateTime, // Store as Firestore Timestamp
    }).then(() => {
        alert("Appointment added!");
        window.location.href = "appointments.html"; // Redirect to appointments page
    }).catch(error => {
        console.error("Error adding appointment:", error);
    });
}

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
        appointmentTime: appointmentDateTime, // Store as Firestore Timestamp
    }).then(() => {
        alert("Appointment added!");
        window.location.href = "appointments.html"; // Redirect to appointments page
    }).catch(error => {
        console.error("Error adding appointment:", error);
    });
}

// Initialize page
fetchDoctors();

// Add event listener to add button
document.getElementById("add-button").onclick = addAppointment;
