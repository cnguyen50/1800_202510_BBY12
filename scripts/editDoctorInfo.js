document.addEventListener("DOMContentLoaded", function() {
    let doctorID = localStorage.getItem("selectedDoctorID");

    if (!doctorID) {
        console.error("No doctor selected!");
        return; 
    }

    // Function to save the edited doctor information to database
    function saveDoctorInfo() {
        let doctorName = document.getElementById("doctor-name").value;
        let doctorSpecialization = document.getElementById("doctor-specialization").value;
        let doctorOffice = document.getElementById("doctor-office").value;
        let doctorAddress = document.getElementById("doctor-address").value;
        let doctorEmail = document.getElementById("doctor-email").value;

        console.log(doctorName, doctorSpecialization, doctorOffice, doctorAddress, doctorEmail);

        // Check if the user is authenticated
        var user = firebase.auth().currentUser;
        if (user) {
            // Get the document reference for the selected doctor
            var doctorRef = db.collection("doctors").doc(doctorID);

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
                // window.location.href = "";
            }).catch(error => {
                console.error("Error updating doctor information: ", error);
            });
        } else {
            console.log("No user is signed in");
            window.location.href = 'login.html';
        }
    }

    // Add event listener to save button
    document.getElementById("save-button").addEventListener("click", saveDoctorInfo);

    // Renders the form with existing doctor data on page load
    db.collection("doctors").doc(doctorID).get()
        .then(doc => {
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
        .catch(error => console.error("Error fetching doctor data:", error));
});
