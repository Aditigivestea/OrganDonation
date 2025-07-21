import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {getStorage,ref,uploadBytes,getDownloadURL} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
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

const recieverfiles = window.uploadCache || {};


//slider
const slider = document.getElementById("urgencyMeter");
const label = document.getElementById("urgencyLabel");

const urgencyLevels = {
  0: "None",
  1: "Low",
  2: "Moderate",
  3: "High",
  4: "Critical",
  5: "Life-threatening"
};

const urgencyColors = {
  0: "#3c096c",
  1: "#4caf50",
  2: "#cddc39",
  3: "#ff9800",
  4: "#f44336",
  5: "#ff1744"
};

function updateSlider(value) {
  label.textContent = urgencyLevels[value];
  label.style.color = urgencyColors[value];
  label.style.textShadow = "white";

  const percent = (value / 5) * 100;
  const fillColor = urgencyColors[value];
  slider.style.background = `linear-gradient(to right, ${fillColor} ${percent}%, #3c096c ${percent}%)`;
}

window.addEventListener("DOMContentLoaded", () => {
  slider.value = 0;
  updateSlider(0);
});

slider.addEventListener("input", () => {
  updateSlider(Number(slider.value));
});

document.getElementById("backbtn").addEventListener("click", function (event) {
  window.location.href = "recieverconsent1.html";
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

async function uploadFile(file, folder, namePrefix) {
  if (!file) return null;
  const fileRef = ref(storage, `${folder}/${namePrefix}/${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  return await getDownloadURL(snapshot.ref);
}


//store form to db 
document.getElementById("receiver-form-step2").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Step 2 values
  const step2Data = {};
  document.querySelectorAll("input, select, textarea").forEach(el => {
    if (el.id) {
      step2Data[el.id] = el.type === "checkbox" ? el.checked : el.value;
    }
  });

  // from session
   const step1Data = {};
  Object.keys(sessionStorage).forEach(key => {
    step1Data[key] = sessionStorage.getItem(key);
  });

  const uploadedFiles = {};

  try {
  const bloodInput = recieverfiles.bloodReport?.[0];
  const aadharInput = recieverfiles.aadharFile?.[0];
  const othersInput = recieverfiles.otherReports || [];


    if (bloodInput?.files[0]) {
      uploadedFiles.bloodReportUrl = await uploadFile(bloodInput, "reports/blood", Date.now());
    }

    if (aadharInput?.files[0]) {
      uploadedFiles.aadharUrl = await uploadFile(aadharInput, "reports/aadhar", Date.now());
    }

      if (othersInput.length > 0) {
    uploadedFiles.otherReportUrls = [];
    for (let i = 0; i < othersInput.length; i++) {
      const url = await uploadFile(othersInput[i], "reports/other", `${i}_${Date.now()}`);
      uploadedFiles.otherReportUrls.push(url);
    }
  }
  } catch (err) {
    console.error("Upload error:", err);
    alert("File upload failed. Try again.");
    return;
  }

  const fullData = {
    ...step1Data,
    ...step2Data,
    ...uploadedFiles,
    submittedAt: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, "ReceiverConsents"), fullData);
     const auth = getAuth();
      const user = auth.currentUser;

   if (user) {
      await setDoc(doc(db, "users", user.uid), {
      type: "reciever",
      name: sessionStorage.getItem("fullname") || "",
      email: user.email || "",
      timestamp: new Date().toISOString()
      });
    }
    alert("Your Consent Form is submitted, Thankyou!");
    sessionStorage.clear();
     } catch (err) {
    console.error("Error saving form:", err);
    alert("Error submitting form. Try again.");
  }
});