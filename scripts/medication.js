function displayAllMedications() {
    let cardTemplate = document.getElementById("medicationCardTemplate"); // Get the card template

    db.collection("medication").get().then(allMedications => {
        allMedications.forEach(doc => {
            let medicationData = doc.data();
            let medicationID = doc.id;
            let newCard = cardTemplate.content.cloneNode(true);

            // Populate card with medication data
            newCard.querySelector("#medication-name").innerText = `Name: ${medicationData.name}`;
            newCard.querySelector("#medication-dose").innerText = `Dosage: ${medicationData.dose}`;
            newCard.querySelector("#medication-instructions").innerText = `Instructions: ${medicationData.instructions}`;

            // Creating Edit button
            let editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-primary", "mt-2");
            editButton.innerText = "Edit";
            editButton.onclick = function () {
                localStorage.setItem("selectedMedicationID", medicationID); // Store medicationID
                window.location.href = "editMedication.html"; // Redirect to edit page
            };

            // Append edit button
            newCard.querySelector(".card-body").appendChild(editButton);

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