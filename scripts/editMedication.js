document.addEventListener("DOMContentLoaded", function() {
    let medicationID = localStorage.getItem("selectedMedicationID");

    if (!medicationID) {
        console.error("No medication selected!");
        return; 
    }

    console.log(medicationID);

    function saveMedication() {
        let medicationName = document.getElementById("medication-name").value;
        let medicationDose = document.getElementById("medication-dose").value;
        let medicationInstructions = document.getElementById("medication-instructions").value;

        console.log(medicationName, medicationDose, medicationInstructions);

        // Check if the user is authenticated
        var user = firebase.auth().currentUser;
        if (user) {
            // Get the document reference for the selected medication
            var medicationRef = db.collection("medication").doc(medicationID);

            // Update the medication document with the new data
            medicationRef.update({
                name: medicationName,
                dose: medicationDose,
                instructions: medicationInstructions,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
            }).then(() => {
                console.log("Medication updated successfully!");
                // window.location.href = "";
            }).catch(error => {
                console.error("Error updating medication: ", error);
            });
        } else {
            console.log("No user is signed in");
            window.location.href = '/login.html';
        }

    }

    // Add event listener to save button
    document.getElementById("save-button").addEventListener("click", saveMedication);


    // Renders the form with existing medication data on page load
    db.collection("medication").doc(medicationID).get()
        .then(doc => {
            if (doc.exists) {
                let medicationData = doc.data();
                // Set the input fields to the medication's current information
                document.getElementById("medication-name").value = medicationData.name;
                document.getElementById("medication-dose").value = medicationData.dose;
                document.getElementById("medication-instructions").value = medicationData.instructions;
            } else {
                console.error("Medication not found!");
            }
        })
        .catch(error => console.error("Error fetching medication data:", error));
});