document.addEventListener("DOMContentLoaded", function() {
    let doctorID = localStorage.getItem("selectedDoctorID");

    if (!doctorID) {
        console.error("No doctor selected!");
        return;
    }

    db.collection("doctors").doc(doctorID).get()
        .then(doc => {
            if (doc.exists) {
                let doctorData = doc.data();

                // Set default values (placeholders) for each input field
                document.getElementById("doctor-name").value = doctorData.name;
                document.getElementById("doctor-specialization").value = doctorData.specialization;
                document.getElementById("doctor-office").value = doctorData.office;
                document.getElementById("doctor-address").value = doctorData.address;
                document.getElementById("doctor-email").value = doctorData.email;
            } else {
                console.error("Doctor not found!");
            }
        })
        .catch(error => console.error("Error fetching doctor:", error));
});