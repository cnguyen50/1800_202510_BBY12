function displayAllMedications() {
    let cardTemplate = document.getElementById("medicationCardTemplate"); // Get the card template

    db.collection("medication").get().then(allMedications => {
        allMedications.forEach(doc => {
            let medicationData = doc.data();
            let newCard = cardTemplate.content.cloneNode(true); 

            // Populate card with medication data
            newCard.querySelector("#medication-name").innerText = `Name: ${medicationData.name}`;
            newCard.querySelector("#medication-dose").innerText = `Dosage: ${medicationData.dose}`;
            newCard.querySelector("#medication-instructions").innerText = `Instructions: ${medicationData.instructions}`;

            // Append card to medication-list
            document.getElementById("medication-list").appendChild(newCard);
        });
    }).catch(error => {
        console.error("Error fetching medications:", error);
    });
}

// Call the function to display all medications
displayAllMedications();




function test() {
    console.log("testing inside from medication");
}

test();