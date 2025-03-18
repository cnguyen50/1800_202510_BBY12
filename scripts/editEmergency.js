document.addEventListener("DOMContentLoaded", function () {
    let emergencyID = localStorage.getItem("selectedEmergencyID");

    if (!emergencyID) {
        console.error("No contacts selected!");
        return;
    }

    console.log("Fetching emergency contact with ID:", emergencyID);

    db.collection("emergency")
        .doc(emergencyID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                let emergencyData = doc.data();
                console.log("Emergency contact data:", emergencyData);

                // Check if the "contact-name" element exists
                let nameInput = document.getElementById("contact-name");
                if (nameInput) {
                    nameInput.value = emergencyData.Name || ""; // Set the value
                } else {
                    console.error("Element with ID 'contact-name' not found!");
                }

                // Repeat for other elements
                let relationshipInput = document.getElementById("contact-relationship");
                if (relationshipInput) {
                    relationshipInput.value = emergencyData.Relationship || "";
                } else {
                    console.error("Element with ID 'contact-relationship' not found!");
                }

                let phoneInput = document.getElementById("contact-phone");
                if (phoneInput) {
                    phoneInput.value = emergencyData["Phone Number"] || "";
                } else {
                    console.error("Element with ID 'contact-phone' not found!");
                }

                let addressInput = document.getElementById("contact-address");
                if (addressInput) {
                    addressInput.value = emergencyData.Address || "";
                } else {
                    console.error("Element with ID 'contact-address' not found!");
                }

                let emailInput = document.getElementById("contact-email");
                if (emailInput) {
                    emailInput.value = emergencyData.Email || "";
                } else {
                    console.error("Element with ID 'contact-email' not found!");
                }
            } else {
                console.error("Emergency contact not found!");
            }
        })
        .catch((error) => console.error("Error fetching emergency contact:", error));
});

document.addEventListener("DOMContentLoaded", function() {
    let emergencyID = localStorage.getItem("selectedEmergencyID");

    if (!emergencyID) {
        console.error("No contacts selected!");
        return;
    }

    console.log("Fetching emergency contact with ID:", emergencyID);

    db.collection("emergency").doc(emergencyID).get()
        .then(doc => {
            if (doc.exists) {
                let emergencyData = doc.data();
                console.log("Emergency contact data:", emergencyData);

                // Set default values (placeholders) for each input field
                document.getElementById("contact-name").value = emergencyData.Name || "";
                document.getElementById("contact-relationship").value = emergencyData.Relationship || "";
                document.getElementById("contact-phone").value = emergencyData["Phone Number"] || "";
                document.getElementById("contact-address").value = emergencyData.Address || "";
                document.getElementById("contact-email").value = emergencyData.Email || "";
            } else {
                console.error("Emergency contact not found!");
            }
        })
        .catch(error => console.error("Error fetching emergency contact:", error));
});

// Function to save the edited doctor information to database
function saveEmergencyInfo() {
    let contactName = document.getElementById("contact-name").value;
    let contactRelationship = document.getElementById("contact-relationship").value;
    let contactPhone = document.getElementById("contact-phone").value;
    let contactAddress = document.getElementById("contact-address").value;
    let contactEmail = document.getElementById("contact-email").value;

    console.log(contactName, contactRelationship, contactPhone, contactAddress, contactEmail);

    // Check if the user is authenticated
    var user = firebase.auth().currentUser;
    if (user) {
        // Get the document reference for the selected doctor
        var emergencyRef = db.collection("emergency").doc(emergencyID);

        // Update the doctor document with the new data
        emergencyRef.update({
            name: contactName,
            relationship: contactRelationship,
            Phone: contactPhone,
            address: contactAddress,
            email: contactEmail,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
        }).then(() => {
            console.log("Emergency contact information updated successfully!");
            // window.location.href = "";
        }).catch(error => {
            console.error("Error updating emergency contact information: ", error);
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'login.html';
    }
}

// Add event listener to save button
document.getElementById("save-button").addEventListener("click", saveEmergencyInfo);