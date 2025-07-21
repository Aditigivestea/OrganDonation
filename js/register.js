import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBKKmIZrBX517WXieCv1ZSn5z2FV1lTAsw",
    authDomain: "organ-donation-35930.firebaseapp.com",
    projectId: "organ-donation-35930",
    storageBucket: "organ-donation-35930.firebasestorage.app",
    messagingSenderId: "611473361260",
    appId: "1:611473361260:web:fb69c641ff37c211b6cb49"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submit = document.getElementById("registerbtn");

submit.addEventListener("click", function (event) {
    event.preventDefault();//prevents page from reloading

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmpass").value;

    if (pass !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Account created: " + user.email);
            window.location.href="hometest.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});
//cursor
  function setupCursorFollow() {
    const cursor = document.getElementById('cursor-follow');
    
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hide cursor on mobile
        if (window.innerWidth <= 768) {
            cursor.style.display = 'none';
        }
    }
}
window.addEventListener('DOMContentLoaded', setupCursorFollow);