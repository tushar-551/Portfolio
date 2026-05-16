"use strict";

/*-----------------------------------*\
  #UTILITY FUNCTIONS
\*-----------------------------------*/

/**
 * Element toggle function - adds/removes 'active' class
 */
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

/*-----------------------------------*\
  #PAGE NAVIGATION SYSTEM (HYBRID)
\*-----------------------------------*/

// Variables
const navToggler = document.querySelector("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navOverlay = document.querySelector("[data-nav-overlay]");
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Function: Toggle Menu
const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navOverlay.classList.toggle("active");

  // Recalculate active link immediately when opening menu
  if (navbar.classList.contains("active")) {
    setTimeout(updateActiveLinkOnScroll, 50);
  }
};

// Function: Close Menu
const closeNavbar = function () {
  navbar.classList.remove("active");
  navOverlay.classList.remove("active");
};

// 1. Click Hamburger -> Toggle
if (navToggler) {
  navToggler.addEventListener("click", toggleNavbar);
}

// 2. Click Overlay -> Close
if (navOverlay) {
  navOverlay.addEventListener("click", closeNavbar);
}

// 3. Navigation Link Logic (The Hybrid Fix)
if (navigationLinks.length > 0) {
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {
      // Get the target page name (e.g., "Projects" -> "portfolio")
      // Handles both icon+text structure and plain text
      const buttonText = this.querySelector("span")
        ? this.querySelector("span").innerText.toLowerCase().trim()
        : this.innerText.toLowerCase().trim();

      let targetPageName = buttonText;
      if (buttonText === "experience") targetPageName = "resume";
      if (buttonText === "projects" || buttonText === "view projects") targetPageName = "portfolio";

      // Close the menu immediately
      closeNavbar();

      // --- HYBRID LOGIC START ---

      // CHECK 1: MOBILE VIEW (< 1024px)
      // Behavior: Just scroll to the section. Do NOT hide other sections.
      if (window.innerWidth < 1024) {
        const targetSection = document.querySelector(
          `[data-page="${targetPageName}"]`,
        );
        if (targetSection) {
          setTimeout(() => {
            targetSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 300);
        }
      }

      // CHECK 2: DESKTOP VIEW (>= 1024px)
      // Behavior: Hide all other sections, Show only the target section (SPA Style)
      else {
        // Remove active class from all pages and links
        for (let j = 0; j < pages.length; j++) {
          pages[j].classList.remove("active");
          navigationLinks[j].classList.remove("active");
        }

        // Activate the correct page and link
        for (let k = 0; k < pages.length; k++) {
          if (targetPageName === pages[k].dataset.page) {
            pages[k].classList.add("active");
            window.scrollTo(0, 0); // Reset scroll to top for desktop
            break;
          }
        }

        // Properly highlight the corresponding navbar link (not just the clicked button)
        const allNavLinks = document.querySelectorAll(".navbar-link");
        allNavLinks.forEach((link) => {
          link.classList.remove("active");
          const linkText = link.querySelector("span")
            ? link.querySelector("span").innerText.toLowerCase().trim()
            : link.innerText.toLowerCase().trim();
          let linkTarget = linkText;
          if (linkText === "experience") linkTarget = "resume";
          if (linkText === "projects") linkTarget = "portfolio";
          if (linkTarget === targetPageName) {
            link.classList.add("active");
          }
        });
      }

      // --- HYBRID LOGIC END ---

      // Fix for Project Grid visibility on mobile
      if (typeof manageMobileProjects === "function") {
        setTimeout(manageMobileProjects, 100);
      }
    });
  }
}

/*-----------------------------------*\
  #SCROLL SPY (Active Link on Scroll)
\*-----------------------------------*/

function updateActiveLinkOnScroll() {
  // FIX: Disable scroll spy on Desktop to prevent "Contact" auto-selection
  if (window.innerWidth >= 1024) return;

  const sections = document.querySelectorAll("article[data-page]");
  const navLinks = document.querySelectorAll("[data-nav-link]");

  let currentSection = "";

  // Find which section is currently visible
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    // Offset of 150px accounts for the header/top spacing
    if (window.scrollY >= sectionTop - 150) {
      currentSection = section.getAttribute("data-page");
    }
  });

  // Map internal IDs to Menu Names
  if (currentSection === "resume") currentSection = "experience";
  if (currentSection === "portfolio") currentSection = "projects";

  // Loop through links and update active class
  navLinks.forEach((link) => {
    link.classList.remove("active");

    const linkText = link.querySelector("span")
      ? link.querySelector("span").innerText.toLowerCase().trim()
      : link.innerText.toLowerCase().trim();

    if (linkText === currentSection) {
      link.classList.add("active");
    }
  });
}

// Event Listeners for Scroll Spy
window.addEventListener("scroll", updateActiveLinkOnScroll);
window.addEventListener("load", updateActiveLinkOnScroll);

/*-----------------------------------*\
  #TYPEWRITER EFFECT
\*-----------------------------------*/

const typewriterElement = document.getElementById("typewriter");
const titles = [
  "Data Analyst",
  "Power BI Developer",
  "SQL Developer",
  "Excel Developer",
  "Tableau Developer",
  "ETL Developer"
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  if (!typewriterElement) return;

  const currentTitle = titles[titleIndex];
  typewriterElement.textContent = currentTitle.substring(0, charIndex);

  if (!isDeleting) {
    if (charIndex < currentTitle.length) {
      charIndex++;
      setTimeout(type, 100);
    } else {
      isDeleting = true;
      setTimeout(type, 1000);
    }
  } else {
    if (charIndex > 0) {
      charIndex--;
      setTimeout(type, 50);
    } else {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      setTimeout(type, 500);
    }
  }
}

/*-----------------------------------*\
  #TECH STACK MARQUEE
\*-----------------------------------*/

function initializeMarquee() {
  const marquee = document.querySelector(".logo-marquee");
  const marqueeContent = document.querySelector(".logo-marquee-content");

  if (marquee && marqueeContent && marquee.children.length === 1) {
    marquee.appendChild(marqueeContent.cloneNode(true));
  }
}

/*-----------------------------------*\
  #PROJECT MODAL FUNCTIONALITY
\*-----------------------------------*/

// Modal elements
const projectModalOverlay = document.getElementById("projectModal");
const projectModalCloseBtn = document.querySelector(".project-modal-close");
let currentSlideIndex = 0;
let currentProjectSlides = [];

// --- NEW SLIDESHOW TIMER VARIABLES ---
let slideInterval; // Variable to hold the timer
const SLIDE_DELAY = 3000; // Time in milliseconds (3 seconds)

function startSlideshow() {
  stopSlideshow(); // Clear any existing timer first
  // Auto-click "Next" every 3 seconds
  slideInterval = setInterval(() => {
    const nextIndex = (currentSlideIndex + 1) % currentProjectSlides.length;
    window.goToSlide(nextIndex);
  }, SLIDE_DELAY);
}

function stopSlideshow() {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
}


function openProjectModal(projectId) {
  const project = projectData[projectId] || projectData[1];
  if (!project) return;

  // Populate Text Data
  document.getElementById('modalProjectTitle').textContent = project.title;
  document.getElementById('modalProjectName').textContent = project.name;
  document.getElementById('modalProjectCategory').textContent = project.category;
  document.getElementById('modalProjectSummary').textContent = project.summary;

  // Smart Links
  const linkedIn = document.getElementById('modalLinkedInLink');
  const github = document.getElementById('modalGitHubLink');

  if (linkedIn) {
    if (project.linkedinUrl && project.linkedinUrl.trim() !== "") {
      linkedIn.href = project.linkedinUrl;
      linkedIn.style.display = 'inline-flex';
    } else {
      linkedIn.style.display = 'none';
    }
  }

  if (github) {
    if (project.githubUrl && project.githubUrl.trim() !== "") {
      github.href = project.githubUrl;
      github.style.display = 'inline-flex';
    } else {
      github.style.display = 'none';
    }
  }

  // Tools
  const toolsList = document.getElementById('modalToolsList');
  if (toolsList) {
    toolsList.innerHTML = project.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('');
  }

  // Details
  const details = document.getElementById('modalProjectDetails');
  if (details) {
    details.innerHTML = `
      <div class="detail-section"><h4>🎯 Key Objectives</h4><ul>${project.objectives.map(o => `<li>${o}</li>`).join('')}</ul></div>
      <div class="detail-section"><h4>🔍 Key Findings</h4><ul>${project.findings.map(f => `<li>${f}</li>`).join('')}</ul></div>
      <div class="detail-section"><h4>📊 Technical Implementation</h4><ul>${project.technical.map(t => `<li>${t}</li>`).join('')}</ul></div>
    `;
  }

  // --- UPDATED SLIDESHOW LOGIC (Handles "No Slides") ---
  const modalMain = document.querySelector('.project-modal-main');

  if (!project.slides || project.slides.length === 0 || project.slides[0] === "") {
    // CASE A: NO SLIDES -> Hide Gallery, Make Text Full Width
    modalMain.classList.add('no-gallery');
    stopSlideshow(); // Ensure no timer runs
  } else {
    // CASE B: HAS SLIDES -> Show Gallery, Start Timer
    modalMain.classList.remove('no-gallery');
    currentProjectSlides = project.slides;
    currentSlideIndex = 0;
    setupSlideshow();
    startSlideshow();
  }

  // Dashboard Setup
  setupDashboard(project.dashboardUrl);

  if (projectModalOverlay) {
    projectModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}




function closeProjectModal() {
  if (projectModalOverlay) {
    projectModalOverlay.classList.remove("active");
    document.body.style.overflow = "auto";

    // --- NEW: STOP AUTO LOOP & UNLOAD DASHBOARD ---
    stopSlideshow();

    // Clear the iframe src to stop it from playing/loading in background
    const frame = document.getElementById("powerBIFrame");
    if (frame) frame.src = "about:blank";
  }
}

function setupSlideshow() {
  const container = document.querySelector(".slideshow-container");
  const indicators = document.querySelector(".slide-indicators");

  if (!container || !currentProjectSlides.length) return;

  container.innerHTML = currentProjectSlides
    .map(
      (slide, i) =>
        `<div class="slide ${i === 0 ? "active" : ""}"><img src="${slide}" loading="lazy"></div>`,
    )
    .join("");

  if (indicators) {
    indicators.innerHTML = currentProjectSlides
      .map(
        (_, i) =>
          `<span class="indicator ${i === 0 ? "active" : ""}" onclick="goToSlide(${i})"></span>`,
      )
      .join("");
  }
}

window.goToSlide = function (index) {
  const slides = document.querySelectorAll(".slide");
  const indicators = document.querySelectorAll(".indicator");

  slides.forEach((s) => s.classList.remove("active"));
  indicators.forEach((i) => i.classList.remove("active"));

  currentSlideIndex = index;
  if (slides[index]) slides[index].classList.add("active");
  if (indicators[index]) indicators[index].classList.add("active");

  startSlideshow();
};

function setupDashboard(url) {
  const dashboardSection = document.querySelector('.live-dashboard');
  const iframeContainer = document.getElementById('dashboardIframeContainer');
  const fallback = document.getElementById('dashboardFallback');
  const frame = document.getElementById('powerBIFrame');
  const newTabBtn = document.getElementById('openDashboardNewTab');

  // Check if URL exists
  if (url && url.trim() !== "") {
    if (dashboardSection) dashboardSection.style.display = 'block';

    // Show iframe container, hide fallback
    if (iframeContainer) iframeContainer.style.display = 'block';
    if (fallback) fallback.style.display = 'none';

    // Load the URL into the Frame
    if (frame) {
      frame.src = url;
    }

    // Configure the "Open in New Tab" Button
    if (newTabBtn) {
      newTabBtn.href = url;
    }

  } else {
    // --- NO URL PROVIDED ---

    // Completely hide the dashboard section
    if (dashboardSection) dashboardSection.style.display = 'none';

    // Ensure fallback is also hidden
    if (fallback) fallback.style.display = 'none';

    // Clear the frame to stop any background loading
    if (frame) {
      frame.src = "about:blank";
    }
  }
}

/*-----------------------------------*\
  #MOBILE PROJECT VIEW ALL
\*-----------------------------------*/

const viewAllBtn = document.getElementById("viewAllBtn");
const projectItems = document.querySelectorAll(".project-card");

function manageMobileProjects() {
  if (window.innerWidth <= 768) {
    let visibleCount = 0;
    projectItems.forEach((item) => {
      item.classList.remove("mobile-hidden");
      if (item.classList.contains("active")) {
        visibleCount++;
        // CHANGE THIS NUMBER FROM 4 TO 5
        if (visibleCount > 5) item.classList.add("mobile-hidden");
      }
    });

    if (viewAllBtn) {
      // CHANGE THIS NUMBER FROM 4 TO 5
      viewAllBtn.parentElement.style.display =
        visibleCount > 5 ? "flex" : "none";
      viewAllBtn.style.display = "flex";
    }
  } else {
    projectItems.forEach((item) => item.classList.remove("mobile-hidden"));
    if (viewAllBtn) viewAllBtn.parentElement.style.display = "none";
  }
}

// Run on resize and load
window.addEventListener("resize", manageMobileProjects);

// View All Click
if (viewAllBtn) {
  viewAllBtn.addEventListener("click", function () {
    projectItems.forEach((item) => item.classList.remove("mobile-hidden"));
    this.parentElement.style.display = "none";
  });
}

/*-----------------------------------*\
  #FILTER SYSTEM
\*-----------------------------------*/

const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");
const selectValue = document.querySelector("[data-selecct-value]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (
      selectedValue === "all" ||
      selectedValue === filterItems[i].dataset.category
    ) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
  // Re-run mobile visibility check after filtering
  setTimeout(manageMobileProjects, 50);
};

if (filterBtn.length > 0) {
  let lastClickedBtn = filterBtn[0];
  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);
      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}

/*-----------------------------------*\
  #MOBILE FILTER DROPDOWN
\*-----------------------------------*/

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");

if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });
}

if (selectItems.length > 0) {
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }
}

/*-----------------------------------*\
  #INITIALIZATION
\*-----------------------------------*/

document.addEventListener("DOMContentLoaded", function () {
  type();
  initializeMarquee();
  manageMobileProjects();

  // Event Listeners for Modals
  if (projectModalCloseBtn)
    projectModalCloseBtn.addEventListener("click", closeProjectModal);
  if (projectModalOverlay) {
    projectModalOverlay.addEventListener("click", (e) => {
      if (e.target === projectModalOverlay) closeProjectModal();
    });
  }

  const projectButtons = document.querySelectorAll("[data-project-btn]");
  projectButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const projectCard = this.closest(".project-card");
      const projectId = projectCard.getAttribute("data-project-id");
      if (projectId) openProjectModal(projectId);
    });
  });

  // Navigation for slideshow
  const prevBtn = document.querySelector(".slide-nav.prev");
  const nextBtn = document.querySelector(".slide-nav.next");
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      const prevIndex =
        (currentSlideIndex - 1 + currentProjectSlides.length) %
        currentProjectSlides.length;
      window.goToSlide(prevIndex);
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      const nextIndex = (currentSlideIndex + 1) % currentProjectSlides.length;
      window.goToSlide(nextIndex);
    });
});

/*-----------------------------------*\
  #CERTIFICATE IMAGE MODAL
\*-----------------------------------*/

// Get the modal
const imgModal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const certificateCards = document.querySelectorAll(".certificate-card");
const imgCloseBtn = document.querySelector(".image-modal-close");

// Add click event to all certificate cards
certificateCards.forEach((card) => {
  card.addEventListener("click", function () {
    const imgSource =
      this.getAttribute("data-certificate-img") ||
      this.querySelector("img").src;

    if (imgSource) {
      imgModal.style.display = "block";
      modalImg.src = imgSource;
      document.body.style.overflow = "hidden"; // Disable background scrolling
    }
  });
});

// Close the modal
if (imgCloseBtn) {
  imgCloseBtn.addEventListener("click", function () {
    imgModal.style.display = "none";
    document.body.style.overflow = "auto"; // Enable background scrolling
  });
}

// Close if clicking outside the image
if (imgModal) {
  imgModal.addEventListener("click", function (e) {
    if (e.target === imgModal) {
      imgModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

/*-----------------------------------*\
  #CERTIFICATES: MOBILE LIMIT & AUTO-RESET
\*-----------------------------------*/

const certGrid = document.querySelector(".certificates-grid");
const certCards = document.querySelectorAll(".certificate-card");
const viewAllCertBtn = document.getElementById("viewAllCertBtn");
const viewAllCertContainer = document.getElementById("viewAllCertContainer");
const certSection = document.querySelector(".certificates");

// Function to manage visibility
function manageCertificates() {
  // Only apply rule if Mobile View (< 768px)
  if (window.innerWidth <= 768) {
    let visibleLimit = 5; // The Rule: Only 5 certificates
    let totalCerts = certCards.length;

    // Loop through certificates
    certCards.forEach((card, index) => {
      if (index >= visibleLimit) {
        card.classList.add("cert-mobile-hidden");
      } else {
        card.classList.remove("cert-mobile-hidden");
      }
    });

    // Show/Hide Button based on count
    if (totalCerts > visibleLimit) {
      viewAllCertContainer.style.display = "flex";
      // Ensure button text is reset
      if (viewAllCertBtn) {
        viewAllCertBtn.style.display = "flex";
        viewAllCertBtn.querySelector("span").innerText =
          "View All Certificates";
      }
    } else {
      viewAllCertContainer.style.display = "none";
    }
  } else {
    // Desktop View: Show everything always
    certCards.forEach((card) => card.classList.remove("cert-mobile-hidden"));
    viewAllCertContainer.style.display = "none";
  }
}

// 1. "View All" Click Event
if (viewAllCertBtn) {
  viewAllCertBtn.addEventListener("click", function () {
    // Reveal all hidden certs
    certCards.forEach((card) => card.classList.remove("cert-mobile-hidden"));
    // Hide the button itself after clicking
    this.style.display = "none";
  });
}

// 2. Run on Resize & Load
window.addEventListener("resize", manageCertificates);
window.addEventListener("load", manageCertificates);

// 3. THE MODERN RULE: Auto-Collapse when scrolling away
// We use IntersectionObserver to watch the Certificate Section
if (certSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If the section is NOT visible (user scrolled past it)
        if (!entry.isIntersecting) {
          // Reset the list back to 5 items
          manageCertificates();
        }
      });
    },
    { threshold: 0 },
  ); // Trigger as soon as 1 pixel is out of view

  observer.observe(certSection);
}

/*-----------------------------------*\
  #PROJECTS: AUTO-RESET ON SCROLL
\*-----------------------------------*/

const projectSection = document.querySelector(".projects"); // Selects the project section container

if (projectSection) {
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && window.innerWidth <= 768) {
          // Run the manager function again.
          // This automatically re-applies the "Limit to 5" rule
          // and brings the "View All" button back.
          manageMobileProjects();
        }
      });
    },
    { threshold: 0 },
  );

  projectObserver.observe(projectSection);
}

/*-----------------------------------*\
  #BACK TO TOP (MODERN SMOOTH SCROLL)
\*-----------------------------------*/

const backToTopBtn = document.querySelector("[data-back-to-top]");

// 1. Visibility Logic (Show button after scrolling down 100px)
window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    if (backToTopBtn) backToTopBtn.classList.add("active");
  } else {
    if (backToTopBtn) backToTopBtn.classList.remove("active");
  }
});

// 2. Custom Slow Scroll Logic
if (backToTopBtn) {
  backToTopBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Stop the instant "jump"
    smoothScrollToTop(1000); // Duration in milliseconds (1.5 seconds)
  });
}

// Helper Function: Smooth Scroll with Easing
function smoothScrollToTop(duration) {
  const start = window.scrollY;
  const startTime = performance.now();

  function scroll(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Ease-Out Cubic function (Starts fast, slows down gently at the end)
    const ease = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, start * (1 - ease));

    if (timeElapsed < duration) {
      requestAnimationFrame(scroll);
    }
  }

  requestAnimationFrame(scroll);
}


/*-----------------------------------*\
  #CONSOLE WELCOME MESSAGE
\*-----------------------------------*/

console.log(`
🚀 Tushar Kshirsagar Portfolio
📧 Contact: tusharkshirsagar551@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/tushar-kshirsagar11/
💻 GitHub: https://github.com/tushar-551

Portfolio loaded successfully! ✨
`);


