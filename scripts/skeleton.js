document.addEventListener("DOMContentLoaded", function () { 
    document.body.addEventListener("click", function(e) {
        if (e.target && e.target.id === 'logout-btn') {
            logout();
        }
    });
});

function insertNameFromFirestore() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userDoc = db.collection("users").doc(user.uid);
            userDoc.get().then(doc => {
                if (doc.exists) {
                    const user_Name = doc.data().name;
                    document.getElementById("name-goes-here").innerText = user_Name;
                } else {
                    console.log("No user document found!");
                }
            }).catch(error => {
                console.error("Error getting user document:", error);
            });
        } else {
            console.log("No user is signed in");
        }
    });
}
insertNameFromFirestore();

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("User signed out successfully");
        window.location.href = "/login.html";
    }).catch((error) => {
        console.error("Logout error:", error);
    });
}

function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   
            console.log($('#navbarPlaceholder').load('../text/navbar.html'));
            console.log($('#footerPlaceholder').load('../text/footer.html'));
        } else {
            console.log($('#navbarPlaceholder').load('../text/navbarBeforeLogin.html'));
            console.log($('#footerPlaceholder').load('../text/footer.html'));
        }
    });
}

loadSkeleton();