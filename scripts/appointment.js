document.getElementById("add-appointment-btn").onclick = function() {
    window.location.href = "../pages/addappointment.html";
};

function fetchAppointments(callback) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("appointments")
            .get().then(snapshot => {
                let appointments = [];
                snapshot.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    appointments.push(data);
                });
                callback(appointments);
            }).catch(error => {
                console.error("Error fetching appointments:", error);
            });
        } else {
            console.log("user not logged in to fetch appointments")
        }
    })
}

function fetchDoctorInfo(doctorID, callback) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("doctors").doc(doctorID)
            .get().then(doc => {
                if (doc.exists) {
                    callback(doc.data());
                } else {
                    console.log("No doctor found with ID:", doctorID);
                }
            }).catch(error => {
                console.error("Error fetching doctor information: ", error);
            });
        } else {
            console.log("user not logged in to fetch doctor infor")
        }
    })
}

function createAppointmentCard(appointment) {
    let cardTemplate = document.getElementById("appointmentCardTemplate");
    let newCard = cardTemplate.content.cloneNode(true);
    fetchDoctorInfo(appointment.doctorId, doctorData => {
        let appointmentDate = appointment.appointmentTime.toDate();
        newCard.querySelector("#doctor-name").innerText = doctorData.name;
        newCard.querySelector("#appointment-date").innerText = `Date: ${appointmentDate.toLocaleDateString()}`;
        newCard.querySelector("#appointment-time").innerText = `Time: ${appointmentDate.toLocaleTimeString()}`;
        newCard.querySelector("#doctor-address").innerText = `Address: ${doctorData.address}`;
        newCard.querySelector("#doctor-email").innerText = `Email: ${doctorData.email}`;
        let editButton = newCard.querySelector(".edit-button");
        editButton.onclick = function() {
            localStorage.setItem("selectedAppointmentID", appointment.id);
            window.location.href = "../pages/editAppointment.html";
        };
        document.getElementById("appointment-list").appendChild(newCard);
    });
}

function displayAllAppointments() {
    fetchAppointments(appointments => {
        appointments.forEach(createAppointmentCard);
    });
}

window.onload = function() {
    displayAllAppointments();
};