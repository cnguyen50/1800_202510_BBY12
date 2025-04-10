document.addEventListener("DOMContentLoaded", function () { 
    // Add an event listener to the "Add Medication" button
    const addButton = document.getElementById("add-medication-button");
    addButton.addEventListener("click", function() {
        addMedication();
    });
})    

// Function to add a new medication to Firestore under the current user
function addMedication() {
    let medName = document.getElementById("medication-name").value;
    let medDose = document.getElementById("medication-dose").value;
    let medInstructions = document.getElementById("medication-instructions").value;

    // Form validation, check if fields are filled
    if (!medName || !medDose || !medInstructions) {
        Swal.fire({
            title: "Error Adding Medication",
            text: "Please Fill In All Medication Fields.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#4BDEA3"
        });
        return;
    }
    // Get the current user
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in, proceed to add the medication
            // console.log("Adding medication for user:", user.uid);
            db.collection("users").doc(user.uid).collection("medications").add({
                name: medName,
                dose: medDose,
                instructions: medInstructions,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                return Swal.fire({
                    title: "Medication Added!",
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
                window.location.href = "../pages/medication.html";
            }).catch(error => {
                console.error("Error adding medication: ", error);
                Swal.fire({
                    title: "Error adding medication",
                    text: "Please try again.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#4BDEA3"
                });
            });
        } else {
            console.log("No user signed in to add medication.");

        }
    });
}