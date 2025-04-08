function displayAllEmergencyContacts() {
    // Get the card template
    let cardTemplate = document.getElementById("contactCardTemplate");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            // Access Firestore collection and get all emergency contacts
            db.collection("users").doc(user.uid).collection("emergency").get().then(allEmergency => {
                // Loop through each document (contact)
                allEmergency.forEach(doc => {
                    let emergencyData = doc.data();
                    let emergencyID = doc.id;
                    let newCard = cardTemplate.content.cloneNode(true); // Clone the template

                    // Populate the card with the contact data
                    newCard.querySelector("#contact-name").innerText = emergencyData.Name;
                    newCard.querySelector("#contact-relationship").innerText = `Relationship: ${emergencyData.Relationship}`;
                    newCard.querySelector("#contact-phone").innerText = `Phone: ${emergencyData["Phone Number"]}`;
                    newCard.querySelector("#contact-address").innerText = `Address: ${emergencyData.Address}`;
                    newCard.querySelector("#contact-email").innerText = `Email: ${emergencyData.Email}`;
                    newCard.querySelector("#contact-email").href = `mailto:${emergencyData.Email}`; // Make email clickable
                    
                    // Create Edit button
                    let editButton = document.createElement("button");
                    editButton.classList.add("btn", "custom-btn", "mt-2");
                    editButton.innerText = "Edit";
                    editButton.onclick = function() {
                        localStorage.setItem("selectedEmergencyID", emergencyID); // Store emergencyID
                        window.location.href = "../pages/editEmergency.html"; // Redirect to edit page
                    };

                    // Append button
                    newCard.querySelector(".card-body").appendChild(editButton); 

                    // Append the new card to the contacts list
                    document.getElementById("contacts-list").appendChild(newCard);
                });
            }).catch(error => {
                console.error("Error fetching contacts:", error);
            });
        }
    })};
// Call the function to display all contacts
displayAllEmergencyContacts();
