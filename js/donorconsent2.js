import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const storage = getStorage(app);

document.getElementById("step2-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const selectedOrgans = Array.from(document.querySelectorAll("input[name='organs']:checked"))
    .map((checkbox) => checkbox.value);

  const chronicIllness = document.querySelector("input[name='illness']").value;
  const allergies = document.querySelector("input[name='allergies']").value;
  const surgeries = document.querySelector("input[name='surgeries']").value;
  const notes = document.getElementById("notes").value;
  const finalConsent = document.getElementById("finalConsent").checked;

  const checklistItems = document.querySelectorAll("input[name='fit']");
  let checklistValid = true;
  checklistItems.forEach((item) => {
    if (!item.checked) {
      checklistValid = false;
    }
  });

  if (selectedOrgans.length === 0) {
    alert("Please select at least one organ to donate.");
    return;
  }

  if (!checklistValid) {
    alert("Please confirm all health checklist conditions.");
    return;
  }

  if (!finalConsent) {
    alert("Please agree to the final declaration.");
    return;
  }

  const step2data = {
    organs: selectedOrgans,
    illness: chronicIllness,
    allergies,
    surgeries,
    notes,
    finalConsent,
    submittedat: new Date().toISOString()
  };
  Object.keys(sessionStorage).forEach(key => {
      step2data[key] = sessionStorage.getItem(key);
  });

  const step1data = {};
 Object.keys(sessionStorage).forEach(key => {
    step1data[key] = sessionStorage.getItem(key);
});

  const fullData = {
    ...step1data,
    ...step2data,
    submittedAt: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, "DonorConsents"), fullData);
      const auth = getAuth();
      const user = auth.currentUser;

        if (user) {
      await setDoc(doc(db, "users", user.uid), {
      type: "donor",
      name: sessionStorage.getItem("fullname") || "",
      email: user.email || "",
      timestamp: new Date().toISOString()
    });
  }
    alert("Donor consent submitted successfully!");
    sessionStorage.clear();
    window.location.href="hometest.html";
  } catch (err) {
    console.error("Error saving form:", err);
    alert("Failed to save form.");
  }
});

document.querySelectorAll("input, textarea").forEach((element) => {
  if (element.type === "checkbox") {
    element.addEventListener("change", () => {
      sessionStorage.setItem(element.id, element.checked);
    });
  } else {
    element.addEventListener("input", () => {
      sessionStorage.setItem(element.id, element.value);
    });
  }
});
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input, select, textarea").forEach((element) => {
    const storedValue = sessionStorage.getItem(element.id);
    if (storedValue !== null) {
      if (element.type === "checkbox") {
        element.checked = storedValue === "true";
      } else {
        element.value = storedValue;
      }
    }
  });
});

