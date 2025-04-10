document.addEventListener("DOMContentLoaded", function () { 
    // Add an event listener to the "Add Doctor" button
    const addButton = document.getElementById("add-doctor-button");
    addButton.addEventListener("click", function() {
        addDoctor();
    });
});    

// Function to add a new doctor to Firestore under the current user
function addDoctor() {
    // Get values from the correct doctor input fields
    let docName = document.getElementById("doctor-name").value;
    let docSpec = document.getElementById("doctor-specialization").value;
    let docOffice = document.getElementById("doctor-office").value;
    let docAddr = document.getElementById("doctor-address").value;
    let docEmail = document.getElementById("doctor-email").value;
    // Form validation for filled form fields
    if (!docName || !docSpec || !docOffice || !docAddr || !docEmail) {
        Swal.fire({
            title: "Error Adding Doctor",
            text: "Please Fill In All Doctor Fields.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#4BDEA3"
        });
        return;
    }
    // Get the current user
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Add the new doctor document to the user's doctors subcollection
            db.collection("users").doc(user.uid).collection("doctors").add({
                name: docName,
                specialization: docSpec,
                office: docOffice,
                address: docAddr,
                email: docEmail,
                createdAt: firebase.firestore.FieldValue.serverTimestamp() 
            }).then(() => {
                return Swal.fire({
                    title: "Doctor Added!",
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
                window.location.href = "../pages/doctorInfo.html"; 
            }).catch(error => {
                console.error("Error adding doctor: ", error);
                Swal.fire({
                    title: "Error Adding Doctor",
                    text: "Please Try Again",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#4BDEA3"
                });
            });
        } else {
            console.log("No user signed in to add doctor.");
        }
    });
}