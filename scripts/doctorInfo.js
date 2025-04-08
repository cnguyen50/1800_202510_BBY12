function displayAllDoctors() {
    let cardTemplate = document.getElementById("doctorCardTemplate"); // Get the card template

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in. Get their UID.
            // console.log("Fetching doctors for user:", user.uid);
            
            db.collection("users").doc(user.uid).collection("doctors").get().then(userDoctors => {
                userDoctors.forEach(doc => {
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
                    editButton.classList.add("btn", "custom-btn", "mt-2");
                    editButton.innerText = "Edit";
                    editButton.onclick = function() {
                        localStorage.setItem("selectedDoctorID", doctorID); // Store doctorID
                        window.location.href = "../pages/editDoctorInfo.html"; // Redirect to edit page
                    };
        
                    // Append button
                    newCard.querySelector(".card-body").appendChild(editButton); 
        
                    // Append card to doctors-list
                    document.getElementById("doctors-list").appendChild(newCard);
                });
            }).catch(error => {
                console.error("Error fetching doctors:", error);
            });
        } else {
            // No user is signed in.
            console.log("No user signed in to display doctors.");
            document.getElementById("doctors-list").innerHTML = '<p>Please log in to see your doctors.</p>';
        }
    })
}

// Call the function to display all doctors
displayAllDoctors();
