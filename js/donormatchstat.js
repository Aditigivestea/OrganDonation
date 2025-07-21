// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBKKmIZrBX517WXieCv1ZSn5z2FV1lTAsw",
    authDomain: "organ-donation-35930.firebaseapp.com",
    projectId: "organ-donation-35930",
    storageBucket: "organ-donation-35930.appspot.com",
    messagingSenderId: "611473361260",
    appId: "1:611473361260:web:fb69c641ff37c211b6cb49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, async function (user) {
    if (!user) {
        alert("Login to view your match status");
        return;
    }

    const userEmail = user.email;

    const donorQuery = query(
        collection(db, "DonorConsents"),
        where("email", "==", userEmail)
    );

    const donordata = await getDocs(donorQuery);

    if (donordata.empty) {
        alert("Login to view your match status");
        console.log("No donor found for email:", user.email);
        return;
    }

    const donorData = donordata.docs[0].data();
    const donorOrgans = donorData.organs;
    const donorName = donorData.name || "Donor";
    const donorBlood = donorData.bloodgroup || "--";

    document.getElementById("donorName").innerText = donorName;
    document.getElementById("donorBloodGroup").innerText = donorBlood;


    const recieverdata = await getDocs(collection(db, "ReceiverConsents"));

    let matchCount = 0;
    let matchedReceivers = [];

    recieverdata.forEach(function (doc) {
        const receiver = doc.data();

        const neededOrgan = receiver.organNeeded;
        const receiverName = receiver.name;
        const receiverCity = receiver.city;

        if (!neededOrgan || !receiverName || !receiverCity) {
            return;
        }

        if (donorOrgans.includes(neededOrgan)) {
            matchCount++;
            if (matchedReceivers.length < 5) {
                matchedReceivers.push({
                    name: receiverName,
                    organ: neededOrgan,
                    city: receiverCity
                });
            }
        }
    });


    const matchPercentElement = document.getElementById("matchPercent");
    if (matchPercentElement) {
        const percent = recieverdata.size > 0 ? Math.round((matchCount / recieverdata.size) * 100) : 0;
        matchPercentElement.innerText = percent + "%";
    }

    const matchCountDiv = document.getElementById("matchCount");
    if (matchCountDiv) {
        matchCountDiv.innerText = "Compatible receivers found: " + matchCount;
    }

   const matchContainer = document.getElementById("criteriacompatibledata");
if (matchContainer) {
    matchContainer.innerHTML = ""; 

    matchedReceivers.forEach((r) => {
        const recieverh3 = document.createElement("h3");
        recieverh3.textContent = r.name;

        const recieverp = document.createElement("p");
        recieverp.innerHTML = `
            Organ: ${r.organ}<br>
            City: ${r.city}
        `;

        matchContainer.appendChild(recieverh3);
        matchContainer.appendChild(recieverp);
    });
}
});


let lastScrollTop = 0;
let scrollDirection = "down";
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.classList.add('navbar-hidden');
        scrollDirection = "down";
    } else {
        // Scrolling up
        navbar.classList.remove('navbar-hidden');
        scrollDirection = 'up';
    }

    // Add background to navbar when scrolling
    if (scrollTop > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }

    lastScrollTop = scrollTop;
});


function setupCursorFollow() {
    const cursor = document.getElementById('cursor-follow');

    if (cursor) {
        document.addEventListener('mousemove', function (e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }
}
window.addEventListener('DOMContentLoaded', setupCursorFollow);

