document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            fetchDoctors(user.uid);

            const addButton = document.getElementById("add-appointment-button");
            if (addButton) {
                addButton.addEventListener("click", function() {
                    addAppointment(user.uid);
                });
            } else {
                console.error("Add Appointment button ('add-button') not found!");
            }
        } else {
            console.log("No user signed in to fetch doctors or add appointment.");
            window.location.href = 'login.html';
        }
    });
});

// Fetch all doctors for the dropdown
function fetchDoctors(userId) {
    let doctorSelect = document.getElementById("doctor-name");
    if (!doctorSelect) {
        console.error("Error: doctor-name select element not found!");
        return;
    }

    // Fetch from the USER'S doctors subcollection
    db.collection("users").doc(userId).collection("doctors").get().then(snapshot => {
        snapshot.forEach(doc => {
            let doctor = doc.data();
            let option = document.createElement("option");
            option.value = doc.id;
            option.textContent = doctor.name || "Unnamed Doctor"; // Text displayed is still the name
            doctorSelect.appendChild(option);
        });
    }).catch(error => {
        console.error("Error fetching user-specific doctors:", error);
    });
}

// Add a new appointment to Firestore
function addAppointment(userId) { // Added userId parameter
    let doctorName = document.getElementById("doctor-name").value;
    let appointmentDate = document.getElementById("appointment-date").value;
    let appointmentTime = document.getElementById("appointment-time").value;

    // Basic form validation 
    if (!doctorName || !appointmentDate || !appointmentTime) {
        alert("Please select a doctor and fill in all fields.");
        return;
    }

    // Combine date and time into a JavaScript Date object
    let appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    // Store appointment in the user's appointments subcollection
    db.collection("users").doc(userId).collection("appointments").add({
        doctorId: doctorName,
        appointmentTime: appointmentDateTime,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Appointment added!");
        window.location.href = "appointment.html";
    }).catch(error => {
        console.error("Error adding appointment:", error);
    });
}
