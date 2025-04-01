document.addEventListener("DOMContentLoaded", function() {
    let doctorID = localStorage.getItem("selectedDoctorID");

    if (!doctorID) {
        console.error("No doctor selected!");
        return;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userDocRef = db.collection("users").doc(user.uid);
            const doctorRef = userDocRef.collection("doctors").doc(doctorID);

            function saveDoctorInfo() {
                let doctorName = document.getElementById("doctor-name").value;
                let doctorSpecialization = document.getElementById("doctor-specialization").value;
                let doctorOffice = document.getElementById("doctor-office").value;
                let doctorAddress = document.getElementById("doctor-address").value;
                let doctorEmail = document.getElementById("doctor-email").value;

                console.log(doctorName, doctorSpecialization, doctorOffice, doctorAddress, doctorEmail);

                // Update the doctor document with the new data
                doctorRef.update({
                    name: doctorName,
                    specialization: doctorSpecialization,
                    office: doctorOffice,
                    address: doctorAddress,
                    email: doctorEmail,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
                }).then(() => {
                    console.log("Doctor information updated successfully!");
                    window.location.href = "doctorInfo.html";
                }).catch(error => {
                    console.error("Error updating doctor information: ", error);
                });
            }

            // Add event listener to save button
            document.getElementById("save-button").addEventListener("click", saveDoctorInfo);

            // Add event listener to delete button
            document.getElementById("delete-button").addEventListener("click", deleteDoctor);

            // Function to delete the doctor from Firestore
            function deleteDoctor() {            
                if (confirm("Are you sure you want to delete?")) {
                    doctorRef.delete().then(() => {
                        alert("Doctor successfully deleted!");
                        localStorage.removeItem("selectedDoctorID");
                        window.location.href = "doctorInfo.html";
                    }).catch(error => {
                        console.error("Error deleting doctor:", error);
                    });
                }
            }

            // Renders the form with existing doctor data on page load
            doctorRef.get().then(doc => {
                if (doc.exists) {
                    let doctorData = doc.data();
                    // Set the input fields to the doctor's current information
                    document.getElementById("doctor-name").value = doctorData.name;
                    document.getElementById("doctor-specialization").value = doctorData.specialization;
                    document.getElementById("doctor-office").value = doctorData.office;
                    document.getElementById("doctor-address").value = doctorData.address;
                    document.getElementById("doctor-email").value = doctorData.email;
            } else {
                console.error("Doctor not found!");
            }
        })

        } else {
            console.log("No user is signed in");
            window.location.href = 'login.html';
        }
    })
})