function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   
		        // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('../text/navbar.html'));
            console.log($('#footerPlaceholder').load('../text/footer.html'));
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('../text/navbarBeforeLogin.html'));
            console.log($('#footerPlaceholder').load('../text/footer.html'));
        }
    });
}

loadSkeleton();  //invoke the functionde