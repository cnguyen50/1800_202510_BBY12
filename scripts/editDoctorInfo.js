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

                // Update the doctor document with the new data
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

            // Add event listener to save button
            document.getElementById("save-button").addEventListener("click", saveDoctorInfo);

            // Add event listener to delete button
            document.getElementById("delete-button").addEventListener("click", deleteDoctor);

            // Function to delete the doctor from Firestore
            function deleteDoctor() { 
                Swal.fire({
                    title: "Are you sure you want to Delete?",
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

            // Renders the form with existing doctor data on page load
            doctorRef.get().then(doc => {
                if (doc.exists) {
                    let doctorData = doc.data();
                    // Set the input fields to the doctor's current information
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