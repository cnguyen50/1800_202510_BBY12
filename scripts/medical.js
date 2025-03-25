// ======================
// Global Variables
// ======================
let ImageFile1, ImageFile2;
const carouselTemplate = document.getElementById("carouselItemTemplate");
let carouselInstance = null; // To store carousel instance

// ======================
// Initialize Page
// ======================
document.addEventListener('DOMContentLoaded', function() {
    listenFileSelect();
    displayImagesFromFirestore();
});

// ======================
// File Upload Handling
// ======================
function listenFileSelect() {
    document.getElementById("mypic-input1").addEventListener('change', handleFileUpload);
    document.getElementById("mypic-input2").addEventListener('change', handleFileUpload);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result.split(',')[1];
        const previewId = e.target.id.replace('input', 'goes-here');
        
        // Store in correct variable and update preview
        if (e.target.id.includes('1')) {
            ImageFile1 = base64Data;
        } else {
            ImageFile2 = base64Data;
        }
        updatePreview(previewId, base64Data);
    };
    reader.readAsDataURL(file);
}

function updatePreview(elementId, imageData) {
    const element = document.getElementById(elementId);
    if (element) {
        element.src = "data:image/png;base64," + imageData;
    }
}

// ======================
// Save to Firestore
// ======================
function saveImages() {
    if (!ImageFile1 || !ImageFile2) {
        alert("Please upload both images before saving.");
        return;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("medicalImages").add({
                image1: ImageFile1,
                image2: ImageFile2,
                uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                alert("Images saved successfully!");
                resetImageForm();
                displayImagesFromFirestore();
            })
            .catch(error => {
                console.error("Error saving images:", error);
                alert("Error saving images: " + error.message);
            });
        } else {
            alert("You must be signed in to save images.");
        }
    });
}

// ======================
// Display Images (Carousel)
// ======================
function displayImagesFromFirestore() {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = '<div class="carousel-item active text-center py-5"><div class="spinner-border"></div></div>';

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("medicalImages")
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

// ======================
// Helper Functions
// ======================
function showNoImagesMessage(container) {
    container.innerHTML = `
        <div class="carousel-item active text-center py-5">
            <p class="text-muted">No medical documents found</p>
        </div>
    `;
}

function showErrorMessage(container) {
    container.innerHTML = `
        <div class="carousel-item active text-center py-5">
            <p class="text-danger">Error loading images</p>
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