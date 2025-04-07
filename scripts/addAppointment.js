document.addEventListener("DOMContentLoaded", function () {
    // Use onAuthStateChanged to ensure user is logged in before fetching/adding
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            fetchUserDoctors(user.uid);

            // Add event listener to the button
            const addButton = document.getElementById("add-appointment-button");
            if (addButton) {
                addButton.addEventListener("click", function() {
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

// Fetch doctors specific to the logged-in user for the dropdown
function fetchUserDoctors(userId) {
    let doctorSelect = document.getElementById("doctor-name");
    if (!doctorSelect) {
        console.error("Error: doctor-name select element not found!");
        return;
    }
    
    doctorSelect.innerHTML = '<option value="">Select a Doctor</option>';

    db.collection("users").doc(userId).collection("doctors").get().then(snapshot => {
        snapshot.forEach(doc => {
            let doctor = doc.data();
            let option = document.createElement("option");
            option.value = doc.id;
            doctorSelect.appendChild(option);
        });
    }).catch(error => {
        console.error("Error fetching user doctors:", error);
    });
}

function addAppointment(userId) {
    let selectedDoctorId = document.getElementById("doctor-name").value;
    let appointmentDate = document.getElementById("appointment-date").value;
    let appointmentTime = document.getElementById("appointment-time").value;

    // Basic form validation
    if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
        alert("Please select a doctor and fill in both date and time.");
        return;
    }

    // Combine date and time into a JavaScript Date object
    let appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

    // Store appointment in Firestore
    db.collection("users").doc(userId).collection("appointments").add({
        doctorId: selectedDoctorId,
        appointmentTime: appointmentDateTime,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("Appointment added for user:", userId);
        alert("Appointment added!");
        window.location.href = "appointment.html";
    }).catch(error => {
        console.error("Error adding appointment:", error);
        alert("Error adding appointment. Please try again.");
    });
}