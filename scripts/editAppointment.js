let appointmentID = localStorage.getItem("selectedAppointmentID");

// Fetch all doctors for dropdown
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

// Fetch details of the selected appointment
function fetchAppointmentDetails() {
    db.collection("appointment").doc(appointmentID).get().then(doc => {
        if (doc.exists) {
            let data = doc.data();
            
            // Setting doctor name
            document.getElementById("doctor-name").value = data.doctorName;

            // Converting Firestore Timestamp to a JavaScript Date object
            let appointmentDate = data.appointmentTime.toDate();

            // Setting appointment date (format: YYYY-MM-DD)
            document.getElementById("appointment-date").value = appointmentDate.toISOString().split('T')[0]; // Get 'YYYY-MM-DD'

            // Setting appointment time (format: HH:mm)
            let appointmentTime = appointmentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            document.getElementById("appointment-time").value = appointmentTime;
        } else {
            console.error("No such appointment!");
        }
    }).catch(error => {
        console.error("Error fetching appointment:", error);
    });
}

// Update appointment details in Firestore
function updateAppointment() {
    let updatedDoctor = document.getElementById("doctor-name").value;
    let updatedDate = document.getElementById("appointment-date").value;
    let updatedTime = document.getElementById("appointment-time").value;

    // Combine date and time into a single JavaScript Date object
    let appointmentDateTime = new Date(`${updatedDate}T${updatedTime}:00`);

    db.collection("appointment").doc(appointmentID).update({
        doctorName: updatedDoctor,
        appointmentTime: appointmentDateTime // Store as Firestore Timestamp
    }).then(() => {
        alert("Appointment updated!");
        window.location.href = "appointment.html";
    }).catch(error => {
        console.error("Error updating appointment:", error);
    });
}

// Initialize page
fetchDoctors();
fetchAppointmentDetails();

// Add event listener to save button
document.getElementById("save-button").onclick = updateAppointment;
