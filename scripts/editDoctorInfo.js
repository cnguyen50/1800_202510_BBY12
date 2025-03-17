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
                console.log(doctorData);
            } else {
                console.error("Doctor not found!");
            }
        })
        .catch(error => console.error("Error fetching doctor:", error));
});