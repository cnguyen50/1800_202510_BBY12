// Redirect to Add Appointment Page
document.getElementById("add-appointment-btn").onclick = function() {
    window.location.href = "addappointment.html";
};

function fetchAppointments(callback) {
    db.collection("appointment").get().then(snapshot => {
        let appointments = [];
        snapshot.forEach(doc => {
            let data = doc.data();
            data.id = doc.id; // Store document ID
            appointments.push(data);
        });
        callback(appointments);  // Pass appointments data to the callback function
    }).catch(error => {
        console.error("Error fetching appointments:", error);
    });
}

function fetchDoctorInfo(doctorID, callback) {
    db.collection("doctors").doc(doctorID).get().then(doc => {
        if (doc.exists) {
            callback(doc.data());  // Pass doctor data to callback function
        } else {
            console.log("No doctor found with ID:", doctorID);
        }
    }).catch(error => {
        console.error("Error fetching doctor information: ", error);
    });
}

// Create and append an appointment card
function createAppointmentCard(appointment) {
    let cardTemplate = document.getElementById("appointmentCardTemplate");
    let newCard = cardTemplate.content.cloneNode(true);

    // Get doctor data using doctorID from the appointment
    fetchDoctorInfo(appointment.doctorID, doctorData => {
        // Convert Firestore Timestamp to JavaScript Date object
        let appointmentDate = appointment.appointmentTime.toDate(); // Convert Timestamp to Date

        // Populate the card with doctor and appointment details
        newCard.querySelector("#doctor-name").innerText = doctorData.name;
        newCard.querySelector("#appointment-date").innerText = `Date: ${appointmentDate.toLocaleDateString()}`;
        newCard.querySelector("#appointment-time").innerText = `Time: ${appointmentDate.toLocaleTimeString()}`;
        newCard.querySelector("#doctor-address").innerText = `Address: ${doctorData.address}`;
        newCard.querySelector("#doctor-email").innerText = `Email: ${doctorData.email}`;

        // Add event listener to Edit button
        let editButton = newCard.querySelector(".edit-button");
        editButton.onclick = function() {
            localStorage.setItem("selectedAppointmentID", appointment.id);
            window.location.href = "editAppointment.html";
        };

        // Append card to the list
        document.getElementById("appointment-list").appendChild(newCard);
    });
}

// Display all appointments
function displayAllAppointments() {
    fetchAppointments(appointments => {
        appointments.forEach(createAppointmentCard);  // For each appointment, create a card
    });
}

window.onload = function() {
    displayAllAppointments();
};
