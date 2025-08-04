import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKKmIZrBX517WXieCv1ZSn5z2FV1lTAsw",
  authDomain: "organ-donation-35930.firebaseapp.com",
  projectId: "organ-donation-35930",
  storageBucket: "organ-donation-35930.appspot.com",
  messagingSenderId: "611473361260",
  appId: "1:611473361260:web:fb69c641ff37c211b6cb49"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function isBloodCompatible(receiver, donor) {
  const compatible = {
  "O-": ["O-"],
  "O+": ["O+", "O-"],
  "A-": ["A-", "O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"]
};
  if (compatible[receiver]) {
    return compatible[receiver].includes(donor);
  } else {
    return false;
  }}

function calculateMatchScore(receiver, donor) {
  let score = 0;
  let compatibledata = [];
console.log("Receiver Needs:", receiver.organNeeded);

  const neededOrgans=[].concat(receiver.organNeeded || []);
  const availableOrgans=donor.organs || [];
  const commonOrgans=[];
  for(let org of neededOrgans){
    if (availableOrgans.includes(org)){
      commonOrgans.push(org);
    }
  }
   
  if(commonOrgans.length===0) return null;
  //organs
   score= score+40;
   compatibledata.push("Organs Matched");
  //blood groups
   maxScore=maxScore+20;
  if(isBloodCompatible(receiver.bloodgroup,donor.bloodgroup)){
    score=score+20;
    compatibledata.push("Blood Groups are compatible");
  }
  else{
    compatibledata.push("Blood Types are not comaptible");
  }
 //city
  const reccity=receiver.city.toLowerCase();
  const doncity=donor.city.toLowerCase();

  if(receiver.city && donor.city && reccity===doncity){
    score+=20;
    compatibledata.push(`Your donor is in same city ${donor.city} as yours`);
  }
  else{
    compatibledata.push(`Your donor is in different city ${donor.city}`);
  }
//illness 
const illness=(donor.illness || "").toLowerCase()
if(!illness.includes("hiv")&&!illness.includes("cancer")&&!illness.includes("hepatitis")&&!illness.includes("aids")){
  score=score+15; 
  compatibledata.push("Donor disease is minor, can donate");
}
else{
  compatibledata.push("Donor has an illness, cannot donate unless complelely treated")
}

return{score,compatibledata,donor}
}

function renderBestMatch(match) {
  const { donor, score, compatibledata } = match;

  document.getElementById("donorName").textContent = donor.name || "Donor Name";
  console.log("Donor Object",donor);
  document.getElementById("donorBloodGroup").textContent = `Blood Group: ${donor.bloodgroup || "-"}`;
  document.getElementById("donorOrgan").textContent = `Organs: ${(donor.organs || []).join(", ")}`;
  document.getElementById("matchPercent").textContent = `${score}%`;

  const ring = document.getElementById("matchRing");
  ring.style.strokeDashoffset = 100 - score;

  const compatibledataDiv = document.getElementById("criteriacompatibledata");
  compatibledataDiv.innerHTML = compatibledata.map(b => `<p>${b}</p>`).join("");
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please login to view your match status.");
    return;
  }
  console.log("User ",user.email);
  const receiversnap = await getDocs(query(collection(db, "ReceiverConsents"), where("email", "==", user.email)));
  if (receiversnap.empty) {
    alert("No receiver data found.");
    return;
  }

  const receiverData = receiversnap.docs[0].data();

  const donorssnap = await getDocs(collection(db, "DonorConsents"));
  const donorData = donorssnap.docs.map(doc => doc.data());

  const scoredMatches = donorData.map(donor => calculateMatchScore(receiverData, donor));
  const validMatches = scoredMatches.filter(match => match !== null);
  const bestMatch = validMatches.sort((a, b) => b.score - a.score)[0];

  if (bestMatch) {
    renderBestMatch(bestMatch);
  } else {
    document.getElementById("match-summary").innerHTML = "<p>No matching donor found.</p>";
  }
});

function setupCursorFollow() {
    const cursor = document.getElementById('cursor-follow');
    
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }); 
    }
}
window.addEventListener('DOMContentLoaded', setupCursorFollow);



