// ======================
// File Upload Handling
// ======================
function listenFileSelect() {
    document.getElementById("mypic-input1").addEventListener('change', handleFileUpload);
    document.getElementById("mypic-input2").addEventListener('change', handleFileUpload);
}

listenFileSelect();

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
            const userImagesRef = db.collection("users").doc(user.uid).collection("images");

            // Check if a document already exists
            userImagesRef.limit(1).get().then(snapshot => {
                if (!snapshot.empty) {
                    // If a document exists, update it
                    const docId = snapshot.docs[0].id;
                    userImagesRef.doc(docId).update({
                        image1: ImageFile1,
                        image2: ImageFile2,
                        uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        alert("Images updated successfully!");
                        resetImageForm();
                    }).catch(error => {
                        console.error("Error updating images:", error);
                        alert("Error updating images: " + error.message);
                    });
                } else {
                    // If no document exists, create a new one
                    userImagesRef.add({
                        image1: ImageFile1,
                        image2: ImageFile2,
                        uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        alert("Images saved successfully!");
                        resetImageForm();
                        // displayImagesFromFirestore();
                    }).catch(error => {
                        console.error("Error saving images:", error);
                        alert("Error saving images: " + error.message);
                    });
                }
            }).catch(error => {
                console.error("Error checking for existing images:", error);
            });
        } else {
            alert("You must be signed in to save images.");
        }
    });
}


// ======================
// Helper Functions
// ======================
// Helper function to clear the form
function resetImageForm() {
    document.getElementById("mypic-input1").value = "";
    document.getElementById("mypic-input2").value = "";
    document.getElementById("mypic-goes-here1").src = "";
    document.getElementById("mypic-goes-here2").src = "";
    ImageFile1 = null;
    ImageFile2 = null;
}

