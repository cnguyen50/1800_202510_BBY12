document.addEventListener("DOMContentLoaded", function() {
    let medicationID = localStorage.getItem("selectedMedicationID");

    if (!medicationID) {
        console.error("No medication selected!");
        return; 
    }

    console.log(medicationID);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userDocRef = db.collection("users").doc(user.uid);
            const medicationRef = userDocRef.collection("medications").doc(medicationID);

            function saveMedication() {
                let medicationName = document.getElementById("medication-name").value;
                let medicationDose = document.getElementById("medication-dose").value;
                let medicationInstructions = document.getElementById("medication-instructions").value;
        
                console.log(medicationName, medicationDose, medicationInstructions);
        
                    // Update the medication document with the new data
                    medicationRef.update({
                        name: medicationName,
                        dose: medicationDose,
                        instructions: medicationInstructions,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
                    }).then(() => {
                        console.log("Medication updated successfully!");
                        window.location.href = "medication.html";
                    }).catch(error => {
                        console.error("Error updating medication: ", error);
                    });
        
        
            }
        
            // Add event listener to save button
            document.getElementById("save-button").addEventListener("click", saveMedication);

            // Add event listener to delete button
            document.getElementById("delete-button").addEventListener("click", deleteMedication);

            // Function to delete the medication from Firestore
            function deleteMedication() {            
                if (confirm("Are you sure you want to delete?")) {
                    medicationRef.delete().then(() => {
                        alert("Medication successfully deleted!");
                        localStorage.removeItem("selectedMedicationID");
                        window.location.href = "medication.html";
                    }).catch(error => {
                        console.error("Error deleting medication:", error);
                    });
                }
            }
        
            // Renders the form with existing medication data on page load
            medicationRef.get()
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

        } else {
            console.log("No user is signed in");
            window.location.href = 'login.html';
        }
    })

});