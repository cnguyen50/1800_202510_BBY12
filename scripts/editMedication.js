document.addEventListener("DOMContentLoaded", function() {
    let medicationID = localStorage.getItem("selectedMedicationID");
    if (!medicationID) {
        console.error("No medication selected!");
        return; 
    }
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userDocRef = db.collection("users").doc(user.uid);
            const medicationRef = userDocRef.collection("medications").doc(medicationID);

            function saveMedication() {
                let medicationName = document.getElementById("medication-name").value;
                let medicationDose = document.getElementById("medication-dose").value;
                let medicationInstructions = document.getElementById("medication-instructions").value;
                    medicationRef.update({
                        name: medicationName,
                        dose: medicationDose,
                        instructions: medicationInstructions,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
                    }).then(() => {
                        return Swal.fire({
                            title: "Medication Updated!",
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
                        window.location.href = "medication.html";
                    }).catch(error => {
                        console.error("Error updating medication: ", error);
                    });
        
        
            }
            document.getElementById("save-button").addEventListener("click", saveMedication);
            document.getElementById("delete-button").addEventListener("click", deleteMedication);
            function deleteMedication() {
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
                        medicationRef.delete().then(() => {
                            Swal.fire({
                                title: "Medication Successfully Deleted!",
                                icon: "success",
                                confirmButtonColor: "#4BDEA3",
                                allowOutsideClick: false,
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true
                            }).then(() => {
                                localStorage.removeItem("selectedMedicationID");
                                window.location.href = "../pages/medication.html";
                            });
                        }).catch(error => {
                            console.error("Error deleting medication:", error);
                            Swal.fire({
                                title: "Error!",
                                text: "There was an error deleting the medication.",
                                icon: "error"
                            });
                        });
                    }
                });
            }            
            medicationRef.get()
                .then(doc => {
                    if (doc.exists) {
                        let medicationData = doc.data();
                        document.getElementById("medication-name").value = medicationData.name;
                        document.getElementById("medication-dose").value = medicationData.dose;
                        document.getElementById("medication-instructions").value = medicationData.instructions;
                    } else {
                        console.error("Medication not found!");
                    }
                })
                .catch(error => console.error("Error fetching medication data:", error));
        } else {
            console.log("No user is signed in");
            window.location.href = '/login.html';
        }
    })

});