document.addEventListener("DOMContentLoaded", function () {
    let emergencyID = localStorage.getItem("selectedEmergencyID");
    if (!emergencyID) {
        console.error("No contacts selected!");
        return;
    }

    console.log("Fetching emergency contact with ID:", emergencyID);

    db.collection("emergency").doc(emergencyID).get()
        .then((doc) => {
            if (doc.exists) {
                let emergencyData = doc.data();
                console.log("Emergency contact data:", emergencyData);

                // Populate fields if they exist
                [
                    { id: "contact-name", key: "Name" },
                    { id: "contact-relationship", key: "Relationship" },
                    { id: "contact-phone", key: "Phone Number" },
                    { id: "contact-address", key: "Address" },
                    { id: "contact-email", key: "Email" }
                ].forEach(({ id, key }) => {
                    let input = document.getElementById(id);
                    if (input) {
                        input.value = emergencyData[key] || "";
                    } else {
                        console.error(`Element with ID '${id}' not found!`);
                    }
                });
            } else {
                console.error("Emergency contact not found!");
            }
        })
        .catch(error => console.error("Error fetching emergency contact:", error));
});

// Function to save the edited emergency contact information
function saveEmergencyInfo() {
    let emergencyID = localStorage.getItem("selectedEmergencyID");
    if (!emergencyID) {
        console.error("No emergency contact selected for update!");
        return;
    }

    let contactData = {
        Name: document.getElementById("contact-name").value,
        Relationship: document.getElementById("contact-relationship").value,
        "Phone Number": document.getElementById("contact-phone").value,
        Address: document.getElementById("contact-address").value,
        Email: document.getElementById("contact-email").value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    console.log("Updating emergency contact:", contactData);

    var user = firebase.auth().currentUser;
    if (user) {
        db.collection("emergency").doc(emergencyID).update(contactData)
            .then(() => {
                console.log("Emergency contact information updated successfully!");
                // Optionally redirect or give feedback to the user
            })
            .catch(error => console.error("Error updating emergency contact information: ", error));
    } else {
        console.log("No user is signed in");
        window.location.href = '/login.html';
    }
}

// Add event listener to save button
const saveButton = document.getElementById("save-button");
if (saveButton) {
    saveButton.addEventListener("click", saveEmergencyInfo);
} else {
    console.error("Save button not found!");
}
