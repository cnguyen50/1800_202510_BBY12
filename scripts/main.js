window.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) 
        displayDoctorCards();
        displayUpcomingAppointments();
    });
});

// Redirect immediately if not logged in
firebase.auth().onAuthStateChanged((user) => {
    const allowedPages = ["login.html"];
    const currentPage = window.location.pathname.split("/").pop(); // Gets "medication.html"

    if (!user && !allowedPages.includes(currentPage)) {
        window.location.replace("/login.html"); // Hard redirect (no back button)
    }
});

// Global Variables
let ImageFile1, ImageFile2;
const carouselTemplate = document.getElementById("carouselItemTemplate");
let carouselInstance = null; // To store carousel instance

// Display Images (Carousel)
function displayImagesFromFirestore() {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = '<div class="carousel-item active text-center py-5"><div class="spinner-border"></div></div>';

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("images")
                .orderBy("uploadedAt", "desc")
                .get()
                .then(snapshot => {
                    carouselInner.innerHTML = '';
                    
                    if (snapshot.empty) {
                        showNoImagesMessage(carouselInner);
                        return;
                    }

                    let firstItem = true;
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        if (data.image1) {
                            addCarouselItem(carouselInner, data.image1, firstItem);
                            firstItem = false;
                        }
                        if (data.image2) {
                            addCarouselItem(carouselInner, data.image2, firstItem);
                            firstItem = false;
                        }
                    });

                    initCarousel();
                })
                .catch(error => {
                    console.error("Error fetching images:", error);
                    showErrorMessage(carouselInner, error.message);
                });
        } else {
            showSignInMessage(carouselInner);
        }
    });
}

displayImagesFromFirestore();

function addCarouselItem(container, imageData, isActive) {
    const item = carouselTemplate.content.cloneNode(true);
    const carouselItem = item.querySelector('.carousel-item');
    const img = item.querySelector('img');
    
    if (isActive) carouselItem.classList.add('active');
    img.src = `data:image/png;base64,${imageData}`;
    img.alt = "Medical document image";
    img.style.maxHeight = "500px";
    img.style.objectFit = "contain";
    
    container.appendChild(item);
}

function initCarousel() {
    if (carouselInstance) {
        carouselInstance.dispose();
    }
    carouselInstance = new bootstrap.Carousel(document.getElementById('imageCarousel'), {
        ride: 'carousel'
    });
}

function displayDoctorCards() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    db.collection("users").doc(user.uid).collection("doctors").get()
        .then(snapshot => {
            const container = document.getElementById("doctors-list");
            container.innerHTML = ""; 
            snapshot.forEach(doc => {
                const doctor = doc.data();
                const card = document.getElementById("doctorCardTemplate").content.cloneNode(true);
                card.querySelector("#doctor-name").textContent = doctor.name;
                card.querySelector("#doctor-specialization").textContent = `Specialization: ${doctor.specialization}`;
                card.querySelector("#doctor-office").textContent = `Office: ${doctor.office}`;
                card.querySelector("#doctor-address").textContent = `Address: ${doctor.address}`;
                card.querySelector("#doctor-email").textContent = doctor.email;
                
                container.appendChild(card);
            });
        });
}


function displayUpcomingAppointments() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("appointments")
                .where("appointmentTime", ">=", new Date())
                .orderBy("appointmentTime", "asc")
                .limit(4)
                .get()
                .then(snapshot => {
                    const container = document.getElementById("appointments-list");
                    container.innerHTML = ""; 
                    const template = document.getElementById("appointmentCardTemplate");
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const appointmentDate = data.appointmentTime.toDate();
                        const formattedDate = appointmentDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric'});
                        const formattedTime = appointmentDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                        let cardClone = template.content.cloneNode(true);
                        cardClone.querySelector(".appointment-doctor").innerText = data.doctorName || "No Doctor Assigned";
                        cardClone.querySelector(".appointment-date").innerText = formattedDate;
                        cardClone.querySelector(".appointment-time").innerText = formattedTime;
                        container.appendChild(cardClone);
                    });
                })
                .catch(error => {
                    console.error("Error fetching upcoming appointments:", error);
                });
        } else {
            console.log("User not signed in to fetch upcoming appointments.");
        }    
    }
)}


function showNoImagesMessage(container) {
    container.innerHTML = `
        <div id="carousel-empty" class="text-center py-5">
            <i class="bi bi-images" style="font-size: 3rem; color: var(--line-clr);"></i>
            <p class="mt-3">No medical images uploaded yet</p>
        </div>
    `;
}

function showErrorMessage(container) {
    container.innerHTML = `
        <div id="carousel-empty" class="text-center py-5">
            <i class="bi bi-images" style="font-size: 3rem; color: var(--line-clr);"></i>
            <p class="mt-3">No medical images uploaded yet</p>
        </div>
    `;
}

function showSignInMessage(container) {
    container.innerHTML = `
        <div class="carousel-item active text-center py-5">
            <p>Please sign in to view medical documents</p>
        </div>
    `;
}
