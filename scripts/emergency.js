function displayAllEmergencyContacts() {
    // Get the card template
    let cardTemplate = document.getElementById("contactCardTemplate");

    // Access Firestore collection and get all emergency contacts
    db.collection("emergency").get().then(allEmergency => {
        // Loop through each document (contact)
        allEmergency.forEach(doc => {
            let emergencyData = doc.data();
            let newCard = cardTemplate.content.cloneNode(true); // Clone the template

            // Populate the card with the contact data
            newCard.querySelector("#contact-name").innerText = emergencyData.Name;
            newCard.querySelector("#contact-relationship").innerText = `Relationship: ${emergencyData.Relationship}`;
            newCard.querySelector("#contact-phone").innerText = `Phone: ${emergencyData["Phone Number"]}`;
            newCard.querySelector("#contact-address").innerText = `Address: ${emergencyData.Address}`;
            newCard.querySelector("#contact-email").innerText = `Email: ${emergencyData.Email}`;
            newCard.querySelector("#contact-email").href = `mailto:${emergencyData.Email}`; // Make email clickable

            // Append the new card to the contacts list
            document.getElementById("contacts-list").appendChild(newCard);
        });
    }).catch(error => {
        console.error("Error fetching contacts:", error);
    });
}

// Call the function to display all contacts
displayAllEmergencyContacts();

function test() {
    console.log("testing inside from emergency");
}
test();
