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
    // Fetch from the user's doctors subcollection
    db.collection("users").doc(userId).collection("doctors").get().then(snapshot => {
        snapshot.forEach(doc => {
            let doctor = doc.data();
            let option = document.createElement("option");
            option.value = doc.id;
            option.textContent = doctor.name || "Unnamed Doctor";
            doctorSelect.appendChild(option);
        });
    }).catch(error => {
        console.error("Error fetching user-specific doctors:", error);
    });
}

// Add a new appointment to Firestore
function addAppointment(userId) {
    let doctorName = document.getElementById("doctor-name").selectedOptions[0].text;
    let doctorId = document.getElementById("doctor-name").value;
    let appointmentDate = document.getElementById("appointment-date").value;
    let appointmentTime = document.getElementById("appointment-time").value;
    // Basic form validation 
    if (!doctorName || !appointmentDate || !appointmentTime) {
        Swal.fire({
            title: "Error Adding Appointment",
            text: "Please Fill In All Appointment Fields.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#4BDEA3"
        });
        return;
    }
    // Combine date and time into a JavaScript Date object
    let appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    // Store appointment in the user's appointments subcollection
    db.collection("users").doc(userId).collection("appointments").add({
        doctorName: doctorName,
        doctorId: doctorId,
        appointmentTime: appointmentDateTime,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        return Swal.fire({
            title: "Appointment Added!",
            icon: "success",
            confirmButtonColor: "#4BDEA3",
            allowOutsideClick: false,
            showConfirmButton: true,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }).then(() => {
        window.location.href = "appointment.html";
    }).catch(error => {
        console.error("Error adding appointment:", error);
    });
}
