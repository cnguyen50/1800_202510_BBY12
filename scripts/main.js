function writeDoctors() {
    var doctorsRef = db.collection("doctors");



    
}

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
