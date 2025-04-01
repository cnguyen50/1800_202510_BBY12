function sayHello() {
    
}
//sayHello();

document.addEventListener("DOMContentLoaded", function () {
    const loadingText = document.getElementById("loading-text");
    const loadingScreen = document.getElementById("loading-screen");
    const content = document.getElementById("content");
    loadingText.dataset.text = "Loading HealthHub...";
    loadingText.textContent = "Loading HealthHub...";
    const fillDuration = 2500;
    const fadeOutDelay = 500; 
    setTimeout(() => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
            loadingScreen.style.display = "none";
            content.style.display = "block";
            setTimeout(() => {
                content.style.opacity = "1";
            }, 50);
        }, fadeOutDelay);
    }, fillDuration);
});
