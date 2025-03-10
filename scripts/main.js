function displayDoctorInfo() {
    let params = new URL(window.location.href);
    let docID = params.searchParams.get("docID");

    if (docID) {
        db.collection("doctors").doc(docID)
            .onSnapshot(doc => { 
                if (doc.exists) {
                    let doctorData = doc.data();

                    document.getElementById("doctor-name").innerText = doctorData.name;
                    document.getElementById("doctor-specialization").innerText = doctorData.specialization;
                    document.getElementById("doctor-office").innerText = doctorData.office;
                    document.getElementById("doctor-address").innerText = doctorData.address;
                    document.getElementById("doctor-email").innerText = doctorData.email;
                    document.getElementById("doctor-email").href = `mailto:${doctorData.email}`;
                } else {
                    console.log("No doctor found!");
                }
            }, (error) => {
                console.error("Error fetching doctor:", error);
            });
    } else {
        console.log("No doctor ID found in URL.");
    }
}

displayDoctorInfo();


    


function readEmergency(GT2LNyBtUpTutpUeA5NO) {
    db.collection("emergency").doc(GT2LNyBtUpTutpUeA5NO)      
        .onSnapshot(GT2LNyBtUpTutpUeA5NODoc => {                                                       
            console.log("current document data: " + GT2LNyBtUpTutpUeA5NODoc.data());                     
            document.getElementById("info-goes-here").innerHTML = `
                <p><strong>Name:</strong> ${GT2LNyBtUpTutpUeA5NODoc.data().Name}</p>
                <p><strong>Phone Number:</strong> ${GT2LNyBtUpTutpUeA5NODoc.data()["Phone Number"]}</p>
                <p><strong>Address:</strong> ${GT2LNyBtUpTutpUeA5NODoc.data().Address}</p>
                <p><strong>Email:</strong> ${GT2LNyBtUpTutpUeA5NODoc.data().Email}</p>
            `;    
        }, (error) => {
            console.log ("Error calling onSnapshot", error);
        });
    }
 readEmergency("GT2LNyBtUpTutpUeA5NO");        
