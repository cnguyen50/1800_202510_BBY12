let appointmentID = localStorage.getItem("selectedAppointmentID");

function fetchDoctors() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("doctors")
            .get().then(snapshot => {
                let doctorSelect = document.getElementById("doctor-name");
                snapshot.forEach(doc => {
                    let doctor = doc.data();
                    let option = document.createElement("option");
                    option.value = doc.id;
                    option.textContent = doctor.name;
                    doctorSelect.appendChild(option);
                });
            }).catch(error => {
                console.error("Error fetching doctors:", error);
            });
        } else {
            console.log("Cannot fetch doctors");
        }
    });
}

function fetchAppointmentDetails() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("appointments").doc(appointmentID)
            .get().then(doc => {
                if (doc.exists) {
                    let data = doc.data();
                    document.getElementById("doctor-name").value = data.doctorId;
                    let appointmentDate = data.appointmentTime.toDate();
                    document.getElementById("appointment-date").value = appointmentDate.toISOString().split('T')[0]; // Get 'YYYY-MM-DD'
                    let hours = appointmentDate.getHours().toString().padStart(2, '0');
                    let minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
                    document.getElementById("appointment-time").value = `${hours}:${minutes}`;
                } else {
                    console.error("No such appointment!");
                }
            }).catch(error => {
                console.error("Error fetching appointment:", error);
            });
        } else {
            console.log("Cannot fetch appointment details");
        }
    })
}

function updateAppointment() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let updatedDoctorName = document.getElementById("doctor-name").selectedOptions[0].text;
            let updatedDoctorId = document.getElementById("doctor-name").value;
            let updatedDate = document.getElementById("appointment-date").value;
            let updatedTime = document.getElementById("appointment-time").value;
            let appointmentDateTime = new Date(`${updatedDate}T${updatedTime}:00`);
            db.collection("users").doc(user.uid).collection("appointments")
            .doc(appointmentID).update({
                doctorName: updatedDoctorName,
                doctorId: updatedDoctorId,
                appointmentTime: appointmentDateTime
            }).then(() => {
                return Swal.fire({
                    title: "Appointment Updated!",
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
            })
            .then(() => {
                window.location.href = "../pages/appointment.html";
            }).catch(error => {
                console.error("Error updating appointment:", error);
            });
        } else {
            console.log("Error with updating appointment");
        }
    })
}

function deleteAppointment() {
    Swal.fire({
        title: "Are You Sure You Want To Delete This Appointment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4BDEA3",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete It!",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    db.collection("users").doc(user.uid).collection("appointments")
                        .doc(localStorage.getItem("selectedAppointmentID"))
                        .delete().then(() => {
                            Swal.fire({
                                title: "Appointment Successfully Deleted!",
                                icon: "success",
                                allowOutsideClick: false,
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true
                            }).then(() => {
                                localStorage.removeItem("selectedAppointmentID");
                                window.location.href = "../pages/appointment.html";
                            });
                        }).catch(error => {
                            console.error("Error deleting appointment:", error);
                        });
                } else {
                    console.log("User is not signed in.");
                }
            });
        }
    });
}         

fetchDoctors();
fetchAppointmentDetails();

document.getElementById("delete-button").addEventListener("click", deleteAppointment);
document.getElementById("save-button").onclick = updateAppointment;
