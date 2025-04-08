// Declare global variables to store the image data
let ImageFile1 = null;
let ImageFile2 = null;

// ============================
// Listening for File Select
// ============================
function listenFileSelect() {
    document.getElementById("mypic-input1").addEventListener('change', handleFileUpload);
    document.getElementById("mypic-input2").addEventListener('change', handleFileUpload);
}
listenFileSelect();

// ======================
// File Upload Handling
// ======================
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const inputId = e.target.id; // Store input ID before reader runs
    const reader = new FileReader();

    reader.onload = function(e) {
        const base64Data = e.target.result.split(',')[1];
        const previewId = inputId.replace('input', 'goes-here'); // Use stored input ID
        
        // Store in correct variable and update preview
        if (inputId.includes('1')) {
            ImageFile1 = base64Data;
        } else {
            ImageFile2 = base64Data;
        }
        updatePreview(previewId, base64Data);
    };
    reader.readAsDataURL(file);
}

// ======================
// Display image preview
// ======================
function updatePreview(elementId, imageData) {
    const element = document.getElementById(elementId);
    if (element) {
        element.src = "data:image/png;base64," + imageData;
    }
}

// ============
// Save images
// ============
function saveImages() {
    if (!ImageFile1 || !ImageFile2) {
        Swal.fire({
            icon: "warning",
            title: "Images Missing",
            text: "Please Upload Both Images Before Saving.",
            allowOutsideClick: false,
            confirmButtonColor: "#4BDEA3"
        });
        return;
    }

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            Swal.fire({
                icon: "error",
                title: "Not signed in",
                text: "You Must Be Signed In To Save Images.",
                allowOutsideClick: false,
                confirmButtonColor: "#4BDEA3"
            });
            return;
        }

        // loader.innerHTML = '<div class="spinner-border"></div>';
        const userImagesRef = db.collection("users").doc(user.uid).collection("images");

        userImagesRef.limit(1).get()
            .then(snapshot => {
                snapshot.empty 
                    ? createNewImage(userImagesRef) 
                    : updateExistingImage(userImagesRef, snapshot);
            })
            .catch(error => console.error("Error checking for existing images:", error));
    });
}

// ========================
// Update images for user
// ========================
function updateExistingImage(userImagesRef, snapshot) {
    const docId = snapshot.docs[0].id;
    userImagesRef.doc(docId).update({
        image1: ImageFile1,
        image2: ImageFile2,
        uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        return Swal.fire({
            title: "Images Updated Successfully!",
            icon: "success",
            confirmButtonColor: "#4BDEA3",
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
        })
    }).then(() => {
        // alert("Images updated successfully!");
        // setTimeout(() => {
        //     window.location.href = "/index.html";
        // }, 1000); // 1-second delay before redirection
        window.location.href = "/index.html";
    }).catch(error => {
        console.error("Error updating images:", error);
        alert("Error updating images: " + error.message);
    });
}

// ============================
// Listening for File Select
// ============================
function createNewImage(userImagesRef) {
    userImagesRef.add({
        image1: ImageFile1,
        image2: ImageFile2,
        uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        return Swal.fire({
            title: "Images Added Successfully!",
            icon: "success",
            allowOutsideClick: false,
            confirmButtonColor: "#4BDEA3",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        })
    }).catch(error => {
        console.error("Error saving images:", error);
        alert("Error saving images: " + error.message);
    });
}

