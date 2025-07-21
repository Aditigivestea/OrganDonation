
// age check
document.getElementById("dob").addEventListener("input", function() {
      const dob = new Date(this.value);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age <= 18) {
        alert("You must be 18 years or older to register as a donor.");
        this.value = "";
      }
    });

// otp generate 
    let generatedOTP = "";

 function sendOTP() {
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  document.getElementById('otp-section').style.display = 'block';
  alert("OTP sent: " + generatedOTP);
}
// otp verify
function verifyOTP() {
  const otp = document.getElementById('otp').value;
  if (otp === generatedOTP) {
    alert("Aadhar verified successfully.");
  } else {
    alert("Invalid OTP. Please try again.");
  }
}
window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;

// session storage 
document.querySelectorAll("input, select, textarea").forEach((element) => {
  if (element.type !== "file") {
    element.addEventListener("input", () => {
      sessionStorage.setItem(element.id, element.value);
    });
  }
});
//look back data 
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

function goToStep2() {
  window.location.href = "donorconsent2.html";
}
window.goToStep2 = goToStep2;
let stateDistrictMap = {};

// Load districts.json 
fetch("../districts.json")
  .then(res => res.json())
  .then(data => {
    data.districts.forEach(entry => {
      const state = entry.state.trim();
      const district = entry.district.trim();

      if (!stateDistrictMap[state]) {
        stateDistrictMap[state] = new Set();
      }
      stateDistrictMap[state].add(district);
    });

    // Populate state list
    const stateList = document.getElementById("statelist");
    Object.keys(stateDistrictMap).sort().forEach(state => {
      const option = document.createElement("option");
      option.value = state;
      stateList.appendChild(option);
    });
  });

 document.getElementById("state").addEventListener("input", function () {
  const inputState = this.value.trim();
  const districtList = document.getElementById("districtlist");
  districtList.innerHTML = "";
  document.getElementById("district").value = "";

  const matchedState = Object.keys(stateDistrictMap).find(
    (state) => state.toLowerCase() === inputState.toLowerCase()
  );

  if (matchedState) {
    Array.from(stateDistrictMap[matchedState]).sort().forEach((district) => {
      const option = document.createElement("option");
      option.value = district;
      districtList.appendChild(option);
    });
  }
});

const donorfiles = {};
window.addEventListener("DOMContentLoaded", () => {
  const fileInputs = ["bloodreport", "aadharupload", "otherreports"];
  fileInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("change", () => {
        donorfiles[id] = input.files;
        sessionStorage.setItem(`${id}-uploaded`, "true");
      });
    }
  });

  window.donorfiles = donorfiles;
});





