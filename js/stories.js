import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKKmIZrBX517WXieCv1ZSn5z2FV1lTAsw",
  authDomain: "organ-donation-35930.firebaseapp.com",
  projectId: "organ-donation-35930",
  storageBucket: "organ-donation-35930.firebasestorage.app",
  messagingSenderId: "611473361260",
  appId: "1:611473361260:web:fb69c641ff37c211b6cb49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const matchLink = document.getElementById("matchstatlink");

onAuthStateChanged(auth, async (user) => {
  const matchLink = document.getElementById("matchstatlink");
  if (!matchLink) return;

  if (!user) {
    matchLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Please login to view match status");
    });
    return;
  }

  try {
    const userEmail = user.email;

    const receiverSnap = await getDocs(
      query(collection(db, "ReceiverConsents"), where("email", "==", userEmail))
    );

    const donorSnap = await getDocs(
      query(collection(db, "DonorConsents"), where("email", "==", userEmail))
    );

    matchLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (!receiverSnap.empty) {
        window.open("recievermatchstat.html", "_blank");
      } else if (!donorSnap.empty) {
        window.open("donormatchstat.html", "_blank");
      } else {
        alert("No match record found for this email.");
      }
    });

  } catch (error) {
    console.error("Error while checking user match:", error);
  }
});

// Cursor follow
function setupCursorFollow() {
  const cursor = document.getElementById("cursor-follow");
  if (!cursor) return;

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
}
window.addEventListener("DOMContentLoaded", setupCursorFollow);

// Like button glow
window.addEventListener("DOMContentLoaded", () => {
  const likeBtn = document.getElementById("likeBtn");
  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      likeBtn.style.transition = "background 0.4s ease";
      likeBtn.style.background = "#ff0054";
    });
  }
});

// Circle image trigger
window.addEventListener("DOMContentLoaded", () => {
  const imgInput = document.getElementById("addStoryImage");
  const trigger = document.getElementById("addImageTrigger");

  if (trigger && imgInput) {
    trigger.addEventListener("click", () => imgInput.click());

    imgInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function () {
        trigger.innerHTML = `<img src="${reader.result}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
      };
      reader.readAsDataURL(file);
    });
  }
});

// Submit story to Firestore
const submitBtn = document.getElementById("submitStoryBtn");
submitBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    const redirect = confirm("Login to submit a story.");
    if (redirect) window.location.href = "login.html";
    return;
  }

  const name = document.querySelector(".card-name")?.innerText.trim();
  const type = document.querySelector(".card-type")?.innerText.trim();
  const story = document.querySelector(".card-story")?.innerText.trim();
  const duration = document.getElementById("storyDuration")?.value.trim();
  const success = document.getElementById("storySuccess")?.value.trim();
  const image = document.querySelector("#addImageTrigger img")?.src || "";

  if (!name || !type || !story) {
    alert("Please fill all fields!");
    return;
  }

  const storyData = {
    uid: user.uid,
    email: user.email,
    name,
    type,
    story,
    duration,
    success,
    image,
    timestamp: Date.now()
  };

  try {
    await addDoc(collection(db, "stories"), storyData);
    alert("Your story has been shared!");
  } catch (err) {
    console.error("Error submitting story:", err);
    alert("Something went wrong. Please try again.");
  }
});

// Dynamic card creation
function createCard(data) {
  const card = document.createElement("div");
  card.className = "story-card";

  card.innerHTML = `
    <div class="card-image">
      ${data.image ? `<img src="${data.image}" alt="user" />` : `<span>+</span>`}
    </div>
    <div class="card-content">
      <h3 class="card-name">${data.name}</h3>
      <div class="card-type">${data.type}</div>
      <div class="card-story">${data.story}</div>
      <div class="card-stats">
        <div class="stat-value">${data.duration}</div>
        <div class="stat-value">${data.success}</div>
      </div>
    </div>
  `;

  return card;
}


// Display shared stories
const cardStack = document.getElementById("cardStack");
onSnapshot(collection(db, "stories"), (snapshot) => {
  cardStack.innerHTML = "";
  const docs = snapshot.docs.map((doc) => doc.data()).reverse();

  docs.forEach((story) => {
    const card = createCard(story);
    cardStack.appendChild(card);
  });
});

let currentIndex = 0;
let allCards = [];

function showsinglecard(index, direction = "right") {
  if (!allCards[index]) return;

  const oldCard = cardStack.firstChild;
  const newCard = allCards[index].cloneNode(true); 
  if (oldCard) {
    oldCard.classList.add(direction === "right" ? "slide-out-left" : "slide-out-right");
    setTimeout(() => {
      cardStack.innerHTML = "";
      newCard.classList.add(direction === "right" ? "slide-in-right" : "slide-in-left");
      cardStack.appendChild(newCard);
    }, 400); 
  } else {
    newCard.classList.add("slide-in-right");
    cardStack.appendChild(newCard);
  }

  updateSwipeButtons();
}

// populate cards
onSnapshot(collection(db, "stories"), (snapshot) => {
  allCards = snapshot.docs.map(doc => createCard(doc.data())).reverse();
  currentIndex = 0;
  showsinglecard(currentIndex);
});

//  swipe buttons
window.addEventListener("DOMContentLoaded", () => {
  const cardStack = document.getElementById("cardStack");
  const displaySection = document.querySelector(".display-cards-section");


  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.gap = "1.5rem";
  wrapper.style.marginTop = "2rem";
  wrapper.style.flexWrap = "nowrap";


  cardStack.parentNode.insertBefore(wrapper, cardStack);
  wrapper.appendChild(cardStack);


  const prevBtn = document.createElement("button");
  prevBtn.id = "prevBtn";
  prevBtn.textContent = "←";

  const nextBtn = document.createElement("button");
  nextBtn.id = "nextBtn";
  nextBtn.textContent = "→";

  [prevBtn, nextBtn].forEach(btn => {
    btn.className = "control-btn";
    btn.style.width = "80px";
    btn.style.height = "80px";
    btn.style.borderRadius = "50%";
    btn.style.border = "none";
    btn.style.background = "#ff6d00";
    btn.style.color = "#fff";
    btn.style.fontSize = "2rem";
    btn.style.cursor = "pointer";
  });


  wrapper.insertBefore(prevBtn, cardStack);
  wrapper.appendChild(nextBtn);

 
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showsinglecard(currentIndex,"left");
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < allCards.length - 1) {
      currentIndex++;
      showsinglecard(currentIndex,"right");
    }
  });
});


