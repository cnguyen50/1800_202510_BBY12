// function readDoctorInfo() {
//     db.collection
// }
function displayDoctorInfo() {
    let params = new URLSearchParams(window.location.search); // Fix URL parsing
    let docID = params.get("docID"); // Get the doctor ID from the URL

    console.log("Doctor ID:", docID); // Debugging: check if docID is retrieved correctly

    if (docID) {
        db.collection("doctors")
            .doc(docID)
            .get()
            .then(doc => {
                if (doc.exists) {
                    let doctorData = doc.data();
                    document.getElementById("doctorName").innerText = doctorData.name;
                    document.getElementById("doctorSpecialization").innerText = `Specialization: ${doctorData.specialization}`;
                    document.getElementById("doctorOffice").innerText = `Office: ${doctorData.office}`;
                    document.getElementById("doctorAddress").innerText = `Address: ${doctorData.address}`;
                    document.getElementById("doctorEmail").innerText = doctorData.email;
                    document.getElementById("doctorEmail").href = `mailto:${doctorData.email}`;
                } else {
                    console.log("No such doctor found!");
                }
            })
            .catch(error => {
                console.error("Error fetching doctor:", error);
            });
    } else {
        console.error("No doctor ID found in URL. Make sure the link includes ?docID=xyz123");
    }
}

displayDoctorInfo();



function test() {
    console.log("testing inside from doctorsInfo");
}

test();