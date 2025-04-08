// Call the function when the page loads (or after user login)
window.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) displayDoctorCards();
    });
});

// ======================
// Global Variables
// ======================
let ImageFile1, ImageFile2;
const carouselTemplate = document.getElementById("carouselItemTemplate");
let carouselInstance = null; // To store carousel instance

// ======================
// Display Images (Carousel)
// ======================
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
    // Destroy previous instance if exists
    if (carouselInstance) {
        carouselInstance.dispose();
    }
    
    // Initialize with native Bootstrap 5
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
            container.innerHTML = ""; // Clear previous results
            
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

// Helper function to create and append a single upcoming appointment card (Simplified)
function createUpcomingAppointmentCard(appointmentData) {
    const appointmentListContainer = document.getElementById("appointments-list");
    let cardTemplate = document.getElementById("appointmentCardTemplate");

    // Basic check upfront: If template or container missing, can't proceed.
    if (!appointmentListContainer || !cardTemplate) {
        console.error("Required elements (container or template) not found for upcoming appointments.");
        return;
    }

    let newCard = cardTemplate.content.cloneNode(true);

    // Convert Firestore Timestamp to JavaScript Date object
    let appointmentDate = appointmentData.appointmentTime.toDate();

    // Populate the card elements based on the new template structure
    newCard.querySelector("#doctor-name").innerText = appointmentData.doctorName || "N/A";

    // Format Date and Time for better display
    newCard.querySelector("#appointment-date").innerText = appointmentDate.toLocaleDateString([], { month: 'short', day: 'numeric' }); // e.g., "Apr 8"
    newCard.querySelector("#appointment-time").innerText = appointmentDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); // e.g., "1:14 AM"


    appointmentListContainer.appendChild(newCard);
}


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