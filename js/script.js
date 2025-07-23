import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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
const db = getFirestore(app);

const matchLink = document.getElementById("matchStatusLink");

onAuthStateChanged(auth, async (user) => {
  if (!matchLink) return;

  if (!user) {
    alert("Login to view your match status")
    return;
  }

  const email = user.email;

  try {
    const receiverQuery = query(collection(db, "ReceiverConsents"), where("email", "==", email));
    const donorQuery = query(collection(db, "DonorConsents"), where("email", "==", email));

    const [receiverSnap, donorSnap] = await Promise.all([
      getDocs(receiverQuery),
      getDocs(donorQuery)
    ]);

    if (!receiverSnap.empty) {
      matchLink.href = "recievermatchstat.html";
    } else if (!donorSnap.empty) {
      matchLink.href = "donormatchstat.html";
    } else {
      matchLink.href = "#";
      matchLink.onclick = (e) => {
        e.preventDefault();
        alert("You are not registered as a Donor or Receiver.");
      };
    }

  } catch (err) {
    console.error("Error checking role:", err);
    matchLink.href = "#";
    matchLink.onclick = (e) => {
      e.preventDefault();
      alert("Unable to fetch match status. Try again later.");
    };
  }
});


// Global Variables
let scrollDirection = 'down';
let lastScrollTop = 0;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    setupNavigation();
    setupForms();
    setupInteractiveElements();
    setupCursorFollow();
    setupCounterAnimations();
}

// Navbar scroll effects
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.classList.add('navbar-hidden');
            scrollDirection = 'down';
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


// Forms Setup
function setupForms() {
    // Contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm(this);
        });
    }

    // Form input animations
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Handle Contact Form
function handleContactForm(form) {
    const formData = new FormData(form);
    const name = formData.get('name') ;
    const email = formData.get('email') ;
    const phone = formData.get('phone') ;
    const inquiry = formData.get('inquiry') ;
    const message = formData.get('message') ;

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert(`Thank you, ${name}! Your message is sent. `, 'success');
        
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function setupInteractiveElements() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

    // Process cards hover effects
    const processCards = document.querySelectorAll('.process-card');
    processCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Story cards hover effects
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

// Cursor Follow Setup
function setupCursorFollow() {
    const cursor = document.getElementById('cursor-follow');
    
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
              console.log('Mouse moved to:', e.clientX, e.clientY); 
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }); 
    }
}
window.addEventListener('DOMContentLoaded', setupCursorFollow);



// Counter Animations Setup
function setupCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseFloat(finalValue.match(/[\d.]+/)[0]);
                
                if (numericValue) {
                    animateCounter(target, numericValue, finalValue);
                }
                
                counterObserver.unobserve(target);
            }
        });
    });

    statNumbers.forEach(number => {
        counterObserver.observe(number);
    });
}
   window.addEventListener('DOMContentLoaded',setupCounterAnimations); 
// Animate Counter
function animateCounter(element, finalValue, originalText) {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const suffix = originalText.replace(finalValue.toString(), '');
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOut * finalValue);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = originalText;
        }
    }
    
    requestAnimationFrame(updateCounter);
}
 
async function loadStats() {
    try {
        const response = await fetch("../organsdonateddata.json");
        const data = await response.json();

        // Find India (2023 if exists, fallback to 2022)
        const india = data.find(entry => entry.COUNTRY === "India" && entry.REPORTYEAR == 2023) 
                   || data.find(entry => entry.COUNTRY === "India");

        if (!india) throw new Error("India data not found in JSON.");

        const stats = {
            donors: parseInt(india["TOTAL Actual DD"]) || 0,
            lives: parseInt(india["Total Utilized DD"]) || 0,
            requests: (parseInt(india["TOTAL Lung Tx"]) || 0) + (parseInt(india["Total Heart TX"]) || 0),
            matches: (parseInt(india["TOTAL Kidney Tx"]) || 0) + (parseInt(india["TOTAL Liver TX"]) || 0)
        };

        animateStat("donors", stats.donors);
        animateStat("lives", stats.lives);
        animateStat("requests", stats.requests);
        animateStat("matches", stats.matches);
    } catch (err) {
        console.error("Error loading stats:", err);
    }
}

// Animate from 0 to final value
function animateStat(id, finalValue) {
    const element = document.getElementById(id);
    let current = 0;
    const duration = 1500;
    const increment = Math.ceil(finalValue / (duration / 30));

    const counter = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
            current = finalValue;
            clearInterval(counter);
        }
        element.textContent = current.toLocaleString();
    }, 30);
}

window.addEventListener("DOMContentLoaded", loadStats);

document.addEventListener("DOMContentLoaded", () => { 
  const profileIcon = document.querySelector('.profile-icon');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (profileIcon) {
    profileIcon.addEventListener("click", () => {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    });
  }

  overlay.addEventListener("click", () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });

 document.getElementById("logout")?.addEventListener("click", () => {
  const confres=confirm("Are you sure you want to logout?");
  if(!confres) return;
  signOut(auth)
    .then(() => {
      console.log("User signed out.");
      document.getElementById("sidebar").classList.remove("open");
      document.getElementById("sidebarOverlay").classList.remove("show");
      window.location.href = "login.html"; 
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert("Logout failed. Try again.");
    });
 });
});
