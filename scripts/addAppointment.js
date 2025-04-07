document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in, fetch their specific doctors
            fetchDoctors(user.uid);

            // Add event listener to the button
            const addButton = document.getElementById("add-appointment-button");
            if (addButton) {
                addButton.addEventListener("click", function() {
                    // Pass user uid to the addAppointment function
                    addAppointment(user.uid);
                });
            } else {
                console.error("Add Appointment button not found!");
            }

        } else {
            console.log("No user signed in. Redirecting to login.");
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

    db.collection("users").doc(userId).collection("doctors").get().then(snapshot => {
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
function addAppointment(userId) {
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
    db.collection("users").doc(userId).collection("appointments").add({
        doctorName: doctorName,
        appointmentTime: appointmentDateTime,
    }).then(() => {
        alert("Appointment added!");
        window.location.href = "../pages/appointment.html";  // Redirect to appointment page
    }).catch(error => {
        console.error("Error adding appointment:", error);
    });
}
