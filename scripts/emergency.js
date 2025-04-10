function displayAllEmergencyContacts() {
    let cardTemplate = document.getElementById("contactCardTemplate");
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("emergency").get().then(allEmergency => {
                allEmergency.forEach(doc => {
                    let emergencyData = doc.data();
                    let emergencyID = doc.id;
                    let newCard = cardTemplate.content.cloneNode(true);
                    newCard.querySelector("#contact-name").innerText = emergencyData.Name;
                    newCard.querySelector("#contact-relationship").innerText = `Relationship: ${emergencyData.Relationship}`;
                    newCard.querySelector("#contact-phone").innerText = `Phone: ${emergencyData["Phone Number"]}`;
                    newCard.querySelector("#contact-address").innerText = `Address: ${emergencyData.Address}`;
                    newCard.querySelector("#contact-email").innerText = `Email: ${emergencyData.Email}`;
                    newCard.querySelector("#contact-email").href = `mailto:${emergencyData.Email}`;
                    let editButton = document.createElement("button");
                    editButton.classList.add("btn", "custom-btn", "mt-2");
                    editButton.innerText = "Edit";
                    editButton.onclick = function() {
                        localStorage.setItem("selectedEmergencyID", emergencyID);
                        window.location.href = "../pages/editEmergency.html";
                    };
                    newCard.querySelector(".card-body").appendChild(editButton); 
                    document.getElementById("contacts-list").appendChild(newCard);
                });
            }).catch(error => {
                console.error("Error fetching contacts:", error);
            });
        }
    })};
displayAllEmergencyContacts();
