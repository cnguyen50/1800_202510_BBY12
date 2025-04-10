document.addEventListener("DOMContentLoaded", function() {
    let doctorID = localStorage.getItem("selectedDoctorID");

    if (!doctorID) {
        console.error("No doctor selected!");
        return;
    }
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userDocRef = db.collection("users").doc(user.uid);
            const doctorRef = userDocRef.collection("doctors").doc(doctorID);

            function saveDoctorInfo() {
                let doctorName = document.getElementById("doctor-name").value;
                let doctorSpecialization = document.getElementById("doctor-specialization").value;
                let doctorOffice = document.getElementById("doctor-office").value;
                let doctorAddress = document.getElementById("doctor-address").value;
                let doctorEmail = document.getElementById("doctor-email").value;
                console.log(doctorName, doctorSpecialization, doctorOffice, doctorAddress, doctorEmail);
                doctorRef.update({
                    name: doctorName,
                    specialization: doctorSpecialization,
                    office: doctorOffice,
                    address: doctorAddress,
                    email: doctorEmail,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
                }).then(() => {
                    return Swal.fire({
                        title: "Doctor Updated!",
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
                    window.location.href = "doctorInfo.html";
                }).catch(error => {
                    console.error("Error updating doctor information: ", error);
                });
            }
            document.getElementById("save-button").addEventListener("click", saveDoctorInfo);
            document.getElementById("delete-button").addEventListener("click", deleteDoctor);
            function deleteDoctor() { 
                Swal.fire({
                    title: "Are You Sure You Want To Delete?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#4BDEA3",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Delete It!",
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        doctorRef.delete().then(() => {
                            Swal.fire({
                                title: "Doctor Successfully Deleted!",
                                icon: "success",
                                confirmButtonColor: "#4BDEA3",
                                allowOutsideClick: false,
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true
                            }).then(() => {
                                localStorage.removeItem("selectedDoctorID");
                                window.location.href = "../pages/doctorInfo.html";
                            });
                        }).catch(error => {
                            console.error("Error deleting doctor:", error);
                            Swal.fire({
                                title: "Error!",
                                text: "There was an error deleting the doctor.",
                                icon: "error"
                            });
                        });
                    }
                });
            }
            doctorRef.get().then(doc => {
                if (doc.exists) {
                    let doctorData = doc.data();
                    document.getElementById("doctor-name").value = doctorData.name;
                    document.getElementById("doctor-specialization").value = doctorData.specialization;
                    document.getElementById("doctor-office").value = doctorData.office;
                    document.getElementById("doctor-address").value = doctorData.address;
                    document.getElementById("doctor-email").value = doctorData.email;
            } else {
                console.error("Doctor not found!");
            }
        })
        } else {
            console.log("No user is signed in");
            window.location.href = 'login.html';
        }
    })
})