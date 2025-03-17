function displayAllDoctors() {
    let cardTemplate = document.getElementById("doctorCardTemplate"); // Get the card template

    db.collection("doctors").get().then(allDoctors => {
        allDoctors.forEach(doc => {
            let doctorData = doc.data();
            let doctorID = doc.id;
            let newCard = cardTemplate.content.cloneNode(true); 

            // Populate card with doctor data
            newCard.querySelector("#doctor-name").innerText = doctorData.name;
            newCard.querySelector("#doctor-specialization").innerText = `Specialization: ${doctorData.specialization}`;
            newCard.querySelector("#doctor-office").innerText = `Office: ${doctorData.office}`;
            newCard.querySelector("#doctor-address").innerText = `Address: ${doctorData.address}`;
            newCard.querySelector("#doctor-email").innerText = doctorData.email;
            newCard.querySelector("#doctor-email").href = `mailto:${doctorData.email}`;

            // Create Edit button
            let editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-primary", "mt-2");
            editButton.innerText = "Edit";
            editButton.onclick = function() {
                localStorage.setItem("selectedDoctorID", doctorID); // Store doctorID
                window.location.href = "editDoctorInfo.html"; // Redirect to edit page
            };

            // Append button
            newCard.querySelector(".card-body").appendChild(editButton); 

            // Append card to doctors-list
            document.getElementById("doctors-list").appendChild(newCard);
        });
    }).catch(error => {
        console.error("Error fetching doctors:", error);
    });
}

// Call the function to display all doctors
displayAllDoctors();

function test() {
    console.log("testing inside from doctorsInfo");
}

test();