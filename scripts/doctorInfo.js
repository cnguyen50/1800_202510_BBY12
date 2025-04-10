function displayAllDoctors() {
    let cardTemplate = document.getElementById("doctorCardTemplate");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("doctors").get().then(userDoctors => {
                userDoctors.forEach(doc => {
                    let doctorData = doc.data();
                    let doctorID = doc.id;
                    let newCard = cardTemplate.content.cloneNode(true); 
                    newCard.querySelector("#doctor-name").innerText = doctorData.name;
                    newCard.querySelector("#doctor-specialization").innerText = `Specialization: ${doctorData.specialization}`;
                    newCard.querySelector("#doctor-office").innerText = `Office: ${doctorData.office}`;
                    newCard.querySelector("#doctor-address").innerText = `Address: ${doctorData.address}`;
                    newCard.querySelector("#doctor-email").innerText = doctorData.email;
                    newCard.querySelector("#doctor-email").href = `mailto:${doctorData.email}`;
                    let editButton = document.createElement("button");
                    editButton.classList.add("btn", "custom-btn", "mt-2");
                    editButton.innerText = "Edit";
                    editButton.onclick = function() {
                        localStorage.setItem("selectedDoctorID", doctorID);
                        window.location.href = "../pages/editDoctorInfo.html";
                    };
                    newCard.querySelector(".card-body").appendChild(editButton); 
                    document.getElementById("doctors-list").appendChild(newCard);
                });
            }).catch(error => {
                console.error("Error fetching doctors:", error);
            });
        } else {
            console.log("No user signed in to display doctors.");
            document.getElementById("doctors-list").innerHTML = '<p>Please log in to see your doctors.</p>';
        }
    })
}

displayAllDoctors();
