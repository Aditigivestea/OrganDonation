 
 
 function goToNext() {
      window.location.href = "receiverconsent2.html";
    }

const recieverfiles = {};

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input, select, textarea").forEach((element) => {
    if (element.type !== "file") {
      element.addEventListener("input", () => {
        sessionStorage.setItem(element.id, element.type === "checkbox" ? element.checked : element.value);
      });
    }
  });

  const fileInputs = ["bloodReport", "aadharFile", "otherReports"];
  fileInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("change", () => {
        fileCache[id] = input.files;
        sessionStorage.setItem(`${id}-uploaded`, "true"); 
      });
    }
  });

  document.querySelectorAll("input, select, textarea").forEach((element) => {
    const stored = sessionStorage.getItem(element.id);
    if (stored !== null) {
      if (element.type === "checkbox") {
        element.checked = stored === "true";
      } else {
        element.value = stored;
      }
    }
  });
});

window.recieverfiles = recieverfiles;

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
//state->district
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

function goToNext() {
  window.location.href = "recieverconsent2.html";
}

const diagnosisInput = document.getElementById("diagnosis");
  const message = document.getElementById("supportMessage");

  diagnosisInput.addEventListener("input", () => {
    message.classList.add("show");

    clearTimeout(window.messageTimer);
    window.messageTimer = setTimeout(() => {
      message.classList.remove("show");
    }, 3000); // Hide after 3 seconds
  });