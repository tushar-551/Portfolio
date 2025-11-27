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
      if (buttonText === "projects") targetPageName = "portfolio";

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
            this.classList.add("active");
            window.scrollTo(0, 0); // Reset scroll to top for desktop
            break;
          }
        }

        // Manually highlight the clicked button since ScrollSpy is disabled on Desktop
        this.classList.add("active");
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
  "SQL Expert",
  "BI Storyteller",
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

// Project Data (Shortened for brevity - ensure your full projectData object is here)
// NOTE: Ensure you keep your full projectData list from the previous version
const projectData = {
  1: {
    title: "Sales Performance Analytics Dashboard 📊",
    name: "Retail Analytics Suite",
    category: "Business Intelligence",
    summary: "Interactive dual-dashboard system analyzing $8.3M in e-commerce revenue across 397K+ transactions. Features customer lifetime value tracking, seasonal trend detection, and geographic intelligence for 4.4K customers across Europe.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7381863483073531904/?originTrackingId=R9uNc5slYpz3%2BvLnL%2FLaaQ%3D%3D",
    githubUrl: "https://github.com/tushar-551/retail-analytics-suite",
    tools: ["Power BI", "DAX", "Power Query", "Data Modeling", "SQL", "Excel"],
    slides: [
      "./assets-2/New Asset/store sale 1.png",
      "./assets-2/New Asset/store sale 2.png"
    ],
    objectives: [
      "Address the question: 'Why did revenue spike 40% in Nov?'",
      "Track Customer Lifetime Value (CLV) & Acquisition Costs",
      "Optimize market-specific strategies across 5+ countries"
    ],
    findings: [
      "Achieved 14% Growth Rate with $448 Average Order Value",
      "Identified 'Regency Cakestand' as top SKU generating $133K",
      "Discovered Netherlands has highest AOV (€100+) vs UK volume",
      "Reduced manual reporting time by 85% via automation"
    ],
    technical: [
      "Star Schema modeling for optimized bidirectional filtering",
      "Aggregated tables reduced query load time by 73%",
      "Advanced DAX for MoM Growth & Customer Retention rates"
    ],
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiNmY1NWFmM2QtMzA5My00ODRkLWIzNTYtZTQ5OWE3YjNjZWU3IiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9"
  },

  2: {
    title: "Blinkit Sales Analytics Dashboard 🛒",
    name: "Blinkit Grocery Analysis",
    category: "Quick Commerce",
    summary: "Comprehensive Excel-based sales dashboard analyzing 8,500+ transactions to optimize outlet performance, inventory distribution, and customer satisfaction.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7265914519523127296/",
    githubUrl: "https://github.com/tushar-551/Blinkit_Excel_dashboard",
    tools: ["Advanced Excel", "Power Query", "Pivot Tables", "VBA"],
    slides: ["./assets-2/New Asset/Blink it excel.png"],
    objectives: [
        "Analyze $1.20M in sales revenue across Tier 1-3 cities",
        "Evaluate Fat Content impact (Low Fat vs Regular) on sales",
        "Optimize inventory for 8,523 SKUs based on outlet size"
    ],
    findings: [
        "Tier 3 cities outperformed with $472.1K revenue (Highest)",
        "Fruits & Vegetables lead market share at 14.8%",
        "Low-fat products show 22% YoY growth vs 11% for regular"
    ],
    technical: [
        "Dynamic Dashboard with Slicers for real-time filtering",
        "Data cleaning & ETL via Power Query (Null/Duplicate handling)",
        "Advanced Charting: Waterfall, Treemap & Combo Charts"
    ],
    dashboardUrl: "https://1drv.ms/x/c/1f9a5160feedd8b8/IQRu1vtDhqwkSboLBOSS6b4MARe1mVkVrOWAuof6pjBLIVw?wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True"
},


3: {
    title: "Interactive Business Intelligence Dashboard 📈",
    name: "Retail Strategy Dashboard",
    category: "Business Intelligence",
    summary: "Advanced Excel-based system automating customer behavior analysis and store performance tracking with custom VBA scripting.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7235836296064057345/",
    githubUrl: "https://github.com/tushar-551/Excel-Interactive-Business-Intelligence-Dashboard",
    tools: ["Excel", "VBA", "Power Query", "Pivot Charts"],
    slides: [
      "./assets-2/New Asset/IBI excel 3.png",
      "./assets-2/New Asset/IBI excel 2.png",
      "./assets-2/New Asset/IBI excel 1.png"
    ],
    objectives: [
      "Automate reporting tasks using VBA Macros",
      "Analyze Profitability by Gender, Age Group, and Weekday",
      "Track Store Revenue vs. Targets Month-over-Month"
    ],
    findings: [
      "Identified most profitable days of the week for sales optimization",
      "Segmented high-value customers by Age Group and Gender",
      "Pinpointed top-selling products vs. high-return items"
    ],
    technical: [
      "VBA automation for toggling dashboard elements",
      "Dynamic shape visibility (e.g., `ActiveSheet.Shapes`)",
      "Multi-view architecture: Time Frame, Store, and Profit dashboards"
    ],
    dashboardUrl: ""
  },


  4: {
    title: "Google Trends Analysis Dashboard 🔍",
    name: "Search Trend Analytics",
    category: "Market Intelligence",
    summary: "Real-time analytics dashboard leveraging Direct Query to track consumer interest shifts, focusing on Data Science and Software Development keywords.",
    githubUrl: "https://github.com/tushar-551/Google-Trends-Analysis-Dashboard",
    tools: ["Power BI", "Direct Query", "DAX"],
    slides: [
      "./assets-2/New Asset/Google 1.png",
      "./assets-2/New Asset/Google 2.png",
      "./assets-2/New Asset/Google 3.png",
      "./assets-2/New Asset/Google 4.png"
    ],
    objectives: [
      "Track popularity of 'Power BI' (4,680 searches) vs 'Data Analyst'",
      "Identify rising keywords like 'The Greatest Estate Developer'",
      "Analyze consumer behavior shifts in real-time"
    ],
    findings: [
      "Total search volume analyzed: 26K+ across key tech domains",
      "Identified 'Visualization' (2,474) as a high-intent keyword",
      "Mapped rising interest in 'Software Developer' job market trends"
    ],
    technical: [
      "Direct Query implementation for real-time data fetching",
      "Complex DAX modeling for keyword ranking & growth rates",
      "Interactive filtering for comparative trend analysis"
    ],
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiYWE1ZGVkNGMtNDYwMi00NjA3LWE5YzAtNjg5Y2ZlMTBhZTJjIiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9"
},


5: {
    title: "Diversity & Inclusion Dashboard 🌍",
    name: "PwC Diversity Analytics",
    category: "HR Analytics",
    summary: "Strategic HR dashboard designed for a telecom client to uncover root causes of gender imbalance in executive management (PwC Switzerland Virtual Case).",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7224994840369881089/",
    githubUrl: "https://github.com/tushar-551/Diversity-and-Inclusion-Dashboard",
    tools: ["Power BI", "DAX", "Power Query", "Excel"],
    slides: [
      "./assets-2/New Asset/Diversity 1.png",
      "./assets-2/New Asset/Diversity 2.png",
      "./assets-2/New Asset/Diversity 3.png"
    ],
    objectives: [
      "Diagnose gender imbalance in Executive Management roles",
      "Calculate & visualize Turnover % and Promotion Rates by Gender",
      "Assess effectiveness of diversity hiring vs. retention strategies"
    ],
    findings: [
      "Executive roles remain male-dominated despite 41% female hires",
      "Identified higher turnover rates for women in middle-management",
      "Promotion to Senior Manager is 15% slower for female employees"
    ],
    technical: [
      "Advanced DAX for 'Turnover Rate' & 'Promotion %' calculations",
      "Data cleaning in Power Query to standardize Job Levels",
      "Visualized 'Leaver' trends using time-intelligence functions"
    ],
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiYmMwZjRkMTgtMDVjYS00MjA5LThjODAtNGRjNjhmZTg2NDBhIiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9&pageName=ReportSection"
},


  6: {
    title: "Pizza Sales Analysis Dashboard 🍕",
    name: "Pizza Sales Strategy Report",
    category: "Food & Beverage",
    summary: "End-to-end data analysis project analyzing 48,000+ order records to identify sales patterns, customer preferences, and inventory inefficiencies using SQL and Power BI.",
    linkedinUrl: "https://www.linkedin.com/in/srinrealyf/",
    githubUrl: "https://github.com/tushar-551/Pizza-Sales-Report",
    
    tools: ["Power BI", "Advanced SQL", "DAX", "Data Modeling"],
    
    slides: [
      "./assets-2/New Asset/Pizza 1.png",
      "./assets-2/New Asset/Pizza 2.png"
    ],
    
    objectives: [
      "Analyze daily and monthly sales trends to optimize staffing during peak hours",
      "Identify best & worst performing pizzas by Revenue, Quantity, and Total Orders",
      "Calculate Average Order Value (AOV) and basket size per category"
    ],
    
    findings: [
      "Friday nights (6 PM - 9 PM) see highest traffic with 25% of weekly orders",
      "The 'Thai Chicken Pizza' generates highest revenue despite lower order volume",
      "Large-size pizzas contribute 45% to total revenue, indicating upsell opportunities",
      "Brie Carre Pizza is underperforming and is a candidate for menu removal"
    ],
    
    technical: [
      "SQL: Used CTEs and Window Functions for complex data extraction",
      "Power BI: Implemented Dynamic Top N filters and Custom Tooltips",
      "Data Modeling: Created a Star Schema with date dimension tables",
      "DAX: Used CALCULATE, SAMEPERIODLASTYEAR, and DIVIDE for time intelligence"
    ],
    
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiZWVjMTljMWEtM2YwMy00YWI5LTkwMzktMmZhMWFmZGQ0ZmU5IiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9"
  },

  7: {
    title: "Amazon E-commerce Analytics Dashboard 📦",
    name: "Amazon Logistics & Sales Analysis",
    category: "E-commerce",
    summary: "A hybrid analytics project using Python (Pandas) for ETL and Power BI for visualization. Analyzed 128,000+ order records to optimize shipping logic and reduce order cancellations.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7239460173038145536/",
    githubUrl: "https://github.com/tushar-551/E-commerce-Analytics-Dashboard",
    
    tools: ["Power BI", "", "Data Cleaning", "Geospatial Analysis"],
    
    slides: [
      "./assets-2/New Asset/Amazon sale 1.png",
      "./assets-2/New Asset/Amazon sale 2.png",
      "./assets-2/New Asset/Amazon sale 3.png"
    ],
    
    objectives: [
      "Analyze the relationship between 'Shipping Service Level' and 'Order Status' (Cancellation rates)",
      "Evaluate regional performance to identify profitable states and cities",
      "Monitor category-wise fulfillment efficiency to reduce 'Undelivered' rates"
    ],
    
    findings: [
      "Expedited Shipping showed a 15% lower cancellation rate compared to Standard Shipping",
      "Maharashtra and Karnataka account for 35% of total sales volume, indicating prime warehousing locations",
      "The 'T-shirt' and 'Shirt' categories drive high volume but suffer from a 12% return rate due to sizing issues",
      "April and May experienced a 20% sales spike due to seasonal summer demand"
    ],
    
    technical: [
      "Python (Pandas): Handled null value imputation and type conversion for 128k rows",
      "Power BI Map Visuals: Created heatmaps to visualize order density across India",
      "Data Transformation: Standardized 15+ inconsistent column formats before import",
      "Trend Analysis: Calculated MoM growth and fulfillment latency metrics"
    ],
    
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiYjMzMGM2NjItNDRiMS00N2I1LTkyYTctNjJlOThlMTMyNWY0IiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9&pageName=ReportSection",
  },

  8: {
    title: "Climate Change Monitoring Dashboard 🌡️",
    name: "Global Climate & CO2 Analytics",
    category: "Environmental",
    summary: "A powerful data storytelling project analyzing 140+ years of NASA GISS and NOAA data to visualize the correlation between CO2 emissions and global temperature anomalies.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7363759182405152768/",
    githubUrl: "https://github.com/tushar-551/climate-change-monitoring-dashboard",

    tools: ["Tableau Public", "Excel", "Statistical Analysis"],

    slides: ["./assets-2/New Asset/tableau .png"],

    objectives: [
      "Analyze longitudinal temperature anomalies from 1880 to present day",
      "Establish the statistical correlation between CO2 PPM levels and Global Mean Temperature",
      "Visualize geospatial warming trends to identify the most affected continents"
    ],

    findings: [
      "Global average temperature has risen by ~1.1°C since the pre-industrial baseline (1880)",
      "The rate of warming has tripled since 1981, showing a clear acceleration trend",
      "Strong positive correlation (0.93) observed between atmospheric CO2 and temperature rise",
      "Northern Hemisphere high-latitudes are warming 2x faster than the global average"
    ],

    technical: [
      "Tableau Animations: Used 'Pages' shelf to create an animated time-lapse of warming maps",
      "Data Blending: Merged disparate datasets (Temp vs CO2) on a Year-level granularity",
      "LOD Expressions: Calculated global averages distinct from regional granularities",
      "Dual-Axis Charts: Combined line and bar charts to show deviations against baseline"
    ],

    /* UPDATED CLEAN TABLEAU LINK */
    dashboardUrl: "https://public.tableau.com/views/ClimateChangeDashboard_17552784874700/Dashboard1?:showVizHome=no&:embed=true"
  },


  9: {
    title: "Live Weather & Air Quality Dashboard 🌦️",
    name: "Real-time Environmental Monitoring",
    category: "Real-time Analytics",
    summary: "A dynamic ETL solution integrating OpenWeatherMap REST APIs with Power BI to monitor meteorological conditions and Air Quality Indices (AQI) across 50+ major cities in real-time.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7369412961871859712/",
    githubUrl: "https://github.com/tushar-551/Real-Time-Weather-Dashboard",
    
    tools: ["Power BI", "Power Query (M)", "REST APIs", "JSON"],
    
    slides: ["./assets-2/New Asset/weather .png"],
    
    objectives: [
      "Establish a dynamic API connection to fetch live weather and pollution data without manual intervention",
      "Visualize the correlation between meteorological factors (Humidity, Wind Speed) and PM2.5 levels",
      "Create an automated alert system for hazardous AQI levels in metropolitan areas"
    ],
    
    findings: [
      "Observed a strong inverse correlation (-0.75) between Wind Speed and PM2.5 concentration",
      "AQI levels in Metro cities spike by 40% during evening peak traffic hours (6 PM - 9 PM)",
      "High humidity levels (>80%) significantly increase the persistence of pollutants in the atmosphere",
      "Real-time refresh cycles reduced data latency from 24 hours to 1 hour"
    ],
    
    technical: [
      "Power Query (M): Wrote custom functions to handle API pagination and API Key authentication",
      "JSON Parsing: Transformed nested JSON API responses into flat fact tables for modeling",
      "Incremental Refresh: Configured policies to archive historical weather data while fetching new actuals",
      "Conditional Formatting: Used DAX to dynamically color-code AQI cards (Green to Maroon) based on WHO standards"
    ],
    
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiODVmMzM0NDgtYjU4Ny00NDNkLWIyY2UtYWI3MGYwMmJmZGE3IiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9"
  },
  
  
  10: {
    title: "AdventureWorks Sales & Returns Dashboard 🚴",
    name: "AdventureWorks Business Intelligence",
    category: "Retail Analytics",
    summary: "A production-ready BI solution analyzing over 3 years of sales data. Focused on a critical profitability leak—Product Returns—by engineering a robust Star Schema model from a complex Snowflake database.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7366280804492120065/",
    githubUrl: "https://github.com/tushar-551/Adventureworks-Powerbi-Dashboard",
    
    tools: ["Power BI","DAX", "DAX Studio", "Power Query", "Data Modeling"],
    
    slides: [
    "./assets-2/New Asset/Adv 1.png",
    "./assets-2/New Asset/Adv 2.png",
    "./assets-2/New Asset/Adv 3.png"
    ],
    
    objectives: [
      "Diagnose the root causes of high product return rates (2.2%) to protect profit margins",
      "Evaluate regional performance against sales targets using dynamic thresholding",
      "Analyze 'Adjusted Price' vs. 'Standard Cost' to determine true product profitability"
    ],
    
    findings: [
      "The 'Shorts' sub-category has a disproportionately high return rate of 4.5%, indicating potential sizing issues",
      "The United States market drives 60% of total revenue but suffers from the highest return volume",
      "December sales spike by 300% (Seasonal), but are followed by a 15% return spike in January",
      "High-value customers (Top 10%) contribute to 40% of profit, justifying a loyalty program initiative"
    ],
    
    technical: [
      "Schema Optimization: Transformed a complex normalized 'Snowflake' schema into a denormalized 'Star Schema' for 40% faster query performance",
      "Advanced DAX: Created Time Intelligence measures (YTD, YoY Growth) and 'Previous Month Returns' calculations",
      "Field Parameters: Implemented dynamic dimension selection, allowing users to switch views between Territory, Product, and Customer",
      "Drill-Through: Configured deep-dive pages to inspect individual transaction details from high-level visuals"
    ],
    
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiMmUyOGViNDQtNjk2MC00OTk1LWJmYjgtMzhiZDUxODg1MWZkIiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9"
  },


  11: {
    title: "IPL Live Analytics Dashboard 🏏",
    name: "IPL Real-Time Scoreboard",
    category: "Sports Analytics",
    summary: "End-to-end live sports tracking solution. Overcame strict API rate limits (100/day) to build a self-updating dashboard that dynamically switches context between match innings using advanced DAX logic.",
    githubUrl: "https://github.com/tushar-551/IPL-Performance-Analytics-Dashboard",
    tools: ["Power BI", "Power Query(M)", "Direct Query", "DAX", "Data Modelling", "Data Storytelling"],
    slides: [
      "./assets-2/New Asset/ipl 1.png",
      "./assets-2/New Asset/ipl 2.png",
      "./assets-2/New Asset/ipl 3.png",
      "./assets-2/New Asset/ipl 4.png"
    ],

    objectives: [
        "Process complex nested JSON data under strict API limits (5 req/sec)",
        "Automate UI transition from 'Toss Result' to 'Target Score' via DAX",
        "Visualize real-time player contributions (Boundaries, Strike Rates, Economy)"
    ],
    findings: [
        "Optimized ETL architecture to execute with <5 API calls per refresh",
        "Validated dynamic logic with complex outcomes (e.g., 'Lucknow Super Giants won by 28 runs')",
        "Achieved real-time sorting of Points Table by Net Run Rate (NRR)"
    ],
    technical: [
        "DAX State Logic: `IF([Total Innings] > 1, [Target Score], [Toss Result])`",
        "Power Query: Unpivoting 'Batsman 1-12' columns into normalized rows",
        "Custom M Logic: `Text.From()` concatenation for live score strings (Runs/Wickets)"
    ],
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiZWJjYWUwYTgtNWY3Mi00NGZjLTgwZGItNzBmNTM4ZjRjNTczIiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9&pageName=ReportSection3507a9166e03e532e161"
},


  

  12: {
    title: "E-commerce Web Analytics Report (Looker Studio) 📈",
    name: "GA4 & Sales Performance Report",
    category: "Cloud Analytics",
    summary: "A cloud-native BI solution integrating Google Analytics 4 (GA4) live web data with sales targets from Google Sheets. Designed to track real-time web traffic, visualize the 'Add-to-Cart' conversion funnel, and monitor marketing channel ROI.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7245983207928549376/",
    githubUrl: "https://github.com/tushar-551/E-commerce-Dashboard-using-Big-Query-and-Looker-Studio?tab=readme-ov-file", 
    
    tools: ["Google Looker Studio", "Big Query", "GA4", "Google Sheets", "REGEX Functions"],
    
    slides: [
      "./assets-2/New Asset/looker 1.png",
      "./assets-2/New Asset/looker 2.png",
      "./assets-2/New Asset/looker 3.png",
      "./assets-2/New Asset/looker 4.png"
    ],
    
    objectives: [
      "Visualize the full 'Acquisition-to-Conversion' funnel to identify critical user drop-off points",
      "Compare 'Actual' traffic metrics against 'Target' goals set in Google Sheets using Data Blending",
      "Analyze Channel Grouping performance (Organic vs. Paid vs. Social) to optimize ad spend"
    ],
    
    findings: [
      "Mobile traffic constitutes 60% of total visits but suffers from a 15% higher 'Bounce Rate' than desktop, indicating UI responsiveness issues",
      "The 'Organic Search' channel provides the highest quality leads with a 3.5% conversion rate (vs 1.2% for Paid Ads)",
      "Significant drop-off (65%) observed specifically at the 'Shipping Information' stage of the checkout flow",
      "Email campaigns sent on Fridays generate the highest spike in 'Returning User' sessions"
    ],
    
    technical: [
      "Data Blending: Joined GA4 session data (Actuals) with Google Sheets (Monthly Targets) on 'Date' keys to visualize KPI progress",
      "Calculated Fields: Used REGEX_MATCH to group specific URL patterns into custom 'Product Categories' (e.g., /men, /women)",
      "Report-Level Filters: Implemented toggles to switch views between 'New Users' and 'Returning Users'",
      "GA4 Events: Mapped custom events (view_item, add_to_cart, purchase) to build the funnel visualization"
    ]

  },

  13: {
    title: "Power BI Finance Dashboard 💰",
    name: "Corporate Financial Reporting & P&L Analysis",
    category: "Financial Analytics",
    summary: "A strategic financial reporting suite automating the Income Statement (P&L), Balance Sheet, and Cash Flow reports. Replaced static Excel models with a dynamic Power BI solution enabling real-time drill-downs into GL (General Ledger) accounts.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7272437443629363201/",
    githubUrl: "https://github.com/tushar-551/Finance_Dashboard",
    
    tools: ["Power BI", "DAX", "Financial Modeling", "Excel"],
    
    slides: ["./assets-2/New Asset/finance.png"],
    
    objectives: [
      "Automate the 'Month-End Close' reporting process, reducing manual compilation time",
      "Visualize EBIT, EBITDA, and Net Profit margins with dynamic Year-over-Year (YoY) comparisons",
      "Enable 'What-If' scenario planning to forecast the impact of exchange rate fluctuations on revenue"
    ],
    
    findings: [
      "Reduced monthly reporting cycle time by 70% (from 5 days to near real-time)",
      "Identified a 12% unexpected spike in 'Administrative Expenses' in Q3, leading to cost-control measures",
      "Gross Margin remained stable at 45%, but Net Profit dipped due to increased marketing spend",
      "Operating Cash Flow improved by 8% YoY due to faster accounts receivable collections"
    ],
    
    technical: [
      "Parent-Child Hierarchy: Flattened complex Chart of Accounts using DAX (PATH, PATHITEM) for navigable P&L statements",
      "Time Intelligence: Engineered dynamic measures for YTD, QTD, and YoY Growth comparisons across fiscal calendars",
      "Waterfall Charts: Implemented custom visuals to bridge the gap between Gross Revenue and Net Income",
      "Sign Logic: Handled database Credit/Debit polarity to ensure Expenses appear correctly in visuals"
    ],
    
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiNGMxYTJkNzMtZjg5OS00NWY5LWE2MmYtYjhlZmY4MDc1YjQ5IiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9"
  
  },
  

  14: {
    title: "Store Sales & Inventory Analysis Dashboard 🏪",
    name: "Retail Operations & Inventory Intelligence",
    category: "Retail Analytics",
    summary: "A retail operations dashboard designed to optimize the supply chain for a brick-and-mortar chain. Analyzed POS (Point of Sale) data to solve critical issues like stockouts, overstocking, and inefficient staff allocation.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7221145639319965697/",
    githubUrl: "https://github.com/tushar-551/Store-Sales-Dashboard-Report-Using-Power-BI",
    
    tools: ["Power BI", "Excwl", "SQL", "DAX", "Supply Chain Analytics"],
    
    slides: [
      "./assets-2/New Asset/store 1.png",
      "./assets-2/New Asset/store 2.png",
      "./assets-2/New Asset/store 3.png",
      "./assets-2/New Asset/store 4.png"
    ],
    
    objectives: [
      "Optimize Inventory Turnover Ratio to reduce holding costs for slow-moving stock",
      "Analyze 'Day-Hour' footfall patterns to align workforce scheduling with peak traffic",
      "Implement Pareto Analysis (80/20 Rule) to identify the top 20% of products driving 80% of revenue"
    ],
    
    findings: [
      "Identified that 'Weekend Evenings' (Saturday 5 PM - 9 PM) account for 35% of weekly revenue, yet staffing was insufficient",
      "Stockouts on 'High-Velocity' items caused an estimated 5% monthly revenue loss",
      "Pareto Analysis revealed that just 15 SKUs drive 60% of total store profits",
      "Optimized shelf placement for 'Impulse Buy' items increased basket size by 8%"
    ],
    
    technical: [
      "Inventory Metrics: Calculated Days Sales of Inventory (DSI) and Stock-to-Sales Ratio using DAX",
      "Heatmaps: Visualized traffic density matrices (Day vs. Hour) for smarter workforce planning",
      "Decomposition Tree: Used AI visuals to drill down into sales performance by City -> Store -> Category",
      "Basket Analysis: Identified product affinity patterns to recommend bundle offers"
    ],
    
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiMjI2M2E0MzQtMzExOS00M2RmLWI4YmUtNWNiZjQyYjI1MTM4IiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9"
  },


  15: {
    title: "Netflix Content Strategy & Market Analysis 🎬",
    name: "Netflix Dashboard",
    category: "Entertainment Analytics",
    summary: "A strategic analysis of Netflix's catalog (8,800+ titles) using Python and Power BI. Focused on uncovering content acquisition strategies, regional market focus, and the shifting trend from licensed movies to original TV series.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7223695387277086720/",
    githubUrl: "https://github.com/tushar-551/Netflix-Dashboard",
    
    tools: ["Power BI", "Excel", "Data Cleaning", "Power Query", "Dax", "Data visualization"],
    
    slides: [
      "./assets-2/New Asset/netflix 1.png",
      "./assets-2/New Asset/netflix 2.png",
      "./assets-2/New Asset/netflix 3.png"
    ],
    
    objectives: [
      "Analyze the 'Movie vs. TV Show' production ratio trend over the last decade (2010-2023)",
      "Evaluate the optimal duration/runtime for content to maximize viewer retention",
      "Map content production volume by country to identify key growth markets outside the US"
    ],
    
    findings: [
      "Identified a strategic pivot post-2016: TV Show production increased by 35% YoY while Movie licensing slowed",
      "The United States leads production, but India and South Korea are the fastest-growing regional markets",
      "The 'Documentary' genre has seen a 200% growth in the last 5 years, indicating a shift in viewer preference",
      "Optimal movie runtime has trended downwards, with the highest density of new content falling in the 85-95 minute range"
    ],
    
    technical: [
      "Python Cleaning: Handled 2,000+ null values in 'Director' and 'Cast' columns using Pandas fillna logic",
      "Text Analysis: Split nested 'Listed_In' (Genre) columns to allow multi-category filtering in Power BI",
      "Decomposition Tree: Used AI visuals to break down content by Type -> Country -> Rating -> Genre",
      "Custom Tooltips: Designed report page tooltips to show the 'Top 5 Cast Members' when hovering over a movie title"
    ],
    
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiMzEyZDY5MWQtYmViOC00NTAyLTk0ZWEtYjA4NGM4MmQ0MDBiIiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9"
  },

  
  
  16: {
    title: "Pizza Sales SQL Data Analysis 🍕",
    name: "Advanced SQL Querying & Optimization",
    category: "SQL Analytics",
    summary: "A pure backend analytics project using MySQL to query, analyze, and optimize a relational database of 21,000+ pizza orders. Focused on writing complex queries to extract KPIs without relying on BI tools.",
    linkedinUrl: "https://www.linkedin.com/in/srinrealyf/",
    githubUrl: "https://github.com/tushar-551/pizza-sales-analysis",
    
    tools: ["MySQL", "Advanced SQL", "Database Design", "ETL"],
    
    slides: [],
    
    objectives: [
      "Execute complex SQL queries to calculate Total Revenue, Average Order Value (AOV), and Total Pizzas Sold",
      "Analyze temporal patterns to identify peak operational hours and busiest days of the week",
      "Perform category-wise performance analysis using ranking window functions"
    ],
    
    findings: [
      "The 'Classic' pizza category contributes to 26.91% of total sales and 25% of total volume",
      "Peak operational load occurs daily between 12:00 PM - 1:00 PM (Lunch Rush), requiring higher staff allocation",
      "The 'Thai Chicken Pizza' generates the highest revenue, whereas the 'Brie Carre' is the lowest revenue generator",
      "Large pizzas account for 45% of sales, suggesting a successful upsell strategy"
    ],
    
    technical: [
      "Window Functions: Used RANK() and DENSE_RANK() to determine top 5 best-selling pizzas by revenue",
      "CTEs (Common Table Expressions): Implemented CTEs to break down complex nested queries for better readability",
      "Aggregations: Used GROUP BY and HAVING clauses to filter aggregated sales data > average threshold",
      "Data Type Casting: Used CAST/CONVERT functions to fix date format inconsistencies during the import process"
    ],
    
    /* LEAVE EMPTY: This tells the code to HIDE the dashboard section */
    dashboardUrl: ""
  },


  17: {
    title: "Store Sales Python Analysis 📊",
    name: "Store Sales Data Analysis",
    category: "Python Analytics",
    summary: "End-to-end retail data analysis pipeline using Python. Leveraged Pandas for cleaning and Matplotlib/Seaborn to visualize seasonal trends, regional performance, and product profitability.",
    linkedinUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7249969411044872192/",
    githubUrl: "https://github.com/tushar-551/Store-Sales-Data-Analysis-Using-Jupyter-Notebook",
    tools: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter"],
    slides: ["./assets-2/New Asset/Store sale cover python.jpg"],
    objectives: [
        "Preprocess raw retail data (handling nulls, date parsing)",
        "Segment performance by Region, Category, and Time",
        "Forecast inventory needs based on seasonality peaks"
    ],
    findings: [
        "Identified Holiday Season (Q4) as the primary revenue driver",
        "Pinpointed top-performing product categories by margin", 
        "Mapped high-value customer clusters across key regions"
    ],
    technical: [
        "Pandas: `groupby`, `pivot_table`, & time-series resampling",
        "Seaborn: Heatmaps for regional correlation & Barplots",
        "Data Cleaning: Null handling & Datetime conversion"
    ],
    dashboardUrl: ""
},

18: {
    title: "Quick Commerce Performance & Growth Multi-Domain Analyzer (Blinkit) 🚀",
    name: "E-Grocery Business Intelligence (BI)",
    category: "Retail / E-Commerce Operations",
    summary: "A comprehensive, multi-page Power BI solution providing end-to-end operational and strategic visibility across Sales, Customer Management, Inventory, Marketing, and critical Customer Feedback for a quick commerce/e-grocery business.",
    linkedinUrl: "https://www.linkedin.com/in/YOUR-LINKEDIN-PROFILE/", // Placeholder
    githubUrl: "https://github.com/YOUR-GITHUB-REPO/Quick-Commerce-Dashboard", // Placeholder
    tools: ["Power BI", "DAX (Time Intelligence)", "Power Query", "Conditional Formatting"],
    slides: [
        "./assets-2/New Asset/blinkit 1.png",
        "./assets-2/New Asset/blinkit 2.png",
        "./assets-2/New Asset/blinkit 3.png",
        "./assets-2/New Asset/blinkit 4.png",
        "./assets-2/New Asset/blinkit 5.png",
        "./assets-2/New Asset/blinkit 6.png"
    ],
    objectives: [
        "Track Year-over-Year (YoY) Quantity and Revenue Growth.",
        "Diagnose root causes for declining quantity via Customer Feedback analysis.",
        "Monitor inventory health, including Available Stock % and Damaged Stock.",
        "Segment customers and identify New vs. Lost customer sales impact.",
        "Assess digital marketing campaign performance (Clicks, Conversions, ROAS)."
    ],
    findings: [
        "Identified a critical -58.62% YoY quantity decline over 9 months.",
        "Pinpointed Product Quality and Delivery as primary drivers of 34.45% Negative Feedback.",
        "Revealed 4.99% of inventory is Damaged Stock, linking to product quality complaints.",
        "Noticed a positive 3.23% sales growth in the last 3 months, suggesting new customer acquisition is offset by high churn."
    ],
    technical: [
        "Complex Time-Intelligence DAX for YoY growth and trend analysis.",
        "Dynamic Top N filtering using parameter/slicer controls.",
        "Advanced UI/UX design with custom navigation buttons and visual grouping.",
        "Calculation of multi-domain KPIs (Stock Movement %, ROAS, Customer Churn)."
    ],
    dashboardUrl: "https://app.powerbi.com/view?r=eyJrIjoiYTA5NTY1NGMtYzNkYy00YTU3LTlkZWMtODg0N2M2ZGRiMTFmIiwidCI6IjI1Y2UwMjYxLWJiZDYtNDljZC1hMWUyLTU0MjYwODg2ZDE1OSJ9&pageName=2887c70019a431a7cff3"
}



};

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
  const dashboardSection = document.querySelector('.live-dashboard'); // The whole section (Title + Box)
  const frame = document.getElementById('powerBIFrame');
  const newTabBtn = document.getElementById('openDashboardNewTab');

  // Check if URL exists
  if (url && url.trim() !== "") {
    // 1. Show the Whole Section
    if (dashboardSection) dashboardSection.style.display = 'block';

    // 2. Load the URL into the Frame
    if (frame) {
      frame.src = url;
      frame.style.display = 'block';
    }

    // 3. Show the "Open in New Tab" Button
    if (newTabBtn) {
      newTabBtn.href = url;
      newTabBtn.style.display = 'inline-flex';
    }

  } else {
    // --- NO URL PROVIDED ---
    
    // 1. HIDE the Whole Section (Title, Text, and Box)
    if (dashboardSection) dashboardSection.style.display = 'none';

    // 2. Clear the frame to stop any background loading
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