/* ===== DATA ===== */
// Updated visa countries: UK, US, Canada, Schengen Area, Dubai, Turkey
const visaCountries = [
  { name:"United Kingdom", code:"GB", type:"Tourist", validity:"2 Years", fees:"$100", documents:"Photo, Passport", guaranteedDate:"31 Mar 2026, 8:32 PM" },
  { name:"United States", code:"US", type:"Tourist", validity:"10 Years", fees:"$200", documents:"Photo, Passport, DS-160", guaranteedDate:"15 Apr 2026, 10:00 AM" },
  { name:"Canada", code:"CA", type:"Tourist", validity:"5 Years", fees:"$300 CAD", documents:"Passport, Email", guaranteedDate:"10 Apr 2026, 2:30 PM" },
  { name:"Schengen Area", code:"EU", type:"Tourist", validity:"90 Days", fees:"$400", documents:"Travel Itinerary, Insurance, Passport", guaranteedDate:"20 Apr 2026, 9:15 AM" },
  { name:"Dubai (UAE)", code:"AE", type:"Tourist", validity:"30 Days", fees:"$500", documents:"Passport, Photo", guaranteedDate:"5 Apr 2026, 11:45 AM" },
  { name:"Turkey", code:"TR", type:"Tourist", validity:"90 Days", fees:"$600", documents:"Passport", guaranteedDate:"8 Apr 2026, 3:20 PM" }
];

// Local image paths - create these folders in your project
const bgUrl = (code) => `images/backgrounds/${code}.avif`;  // or .avif, .png
const flagUrl = (code) => `images/flags/${code}.png`;

// Filter state
let activeFilters = {
  delivery: "any",
  type: "all",
  documents: "any",
  holidays: "any"
};

// Helper to get unique document types from countries
function getAllDocumentTypes() {
  const types = new Set();
  visaCountries.forEach(c => {
    if (c.documents) {
      c.documents.split(',').forEach(d => types.add(d.trim()));
    }
  });
  return Array.from(types);
}

// Helper to get unique visa types
function getAllVisaTypes() {
  const types = new Set();
  visaCountries.forEach(c => types.add(c.type));
  return Array.from(types);
}

// Filter countries based on active filters
function filterCountries() {
  let filtered = [...visaCountries];
  
  // Filter by visa type
  if (activeFilters.type !== "all") {
    filtered = filtered.filter(c => c.type === activeFilters.type);
  }
  
  // Filter by document requirement
  if (activeFilters.documents !== "any") {
    filtered = filtered.filter(c => c.documents && c.documents.includes(activeFilters.documents));
  }
  
  // Filter by delivery time (mock logic - shows countries with guaranteed date in next 7 days for "soon", else "any")
  if (activeFilters.delivery === "soon") {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    filtered = filtered.filter(c => {
      if (!c.guaranteedDate) return false;
      const dateStr = c.guaranteedDate.split(',')[0];
      const [day, month, year] = dateStr.split(' ');
      const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
      const guaranteedDateObj = new Date(parseInt(year), months[month], parseInt(day));
      return guaranteedDateObj <= sevenDaysFromNow;
    });
  }

   // Filter by delivery time (mock logic - shows countries with guaranteed date in next 30 days for "soon", else "any")
  if (activeFilters.delivery === "soon") {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    filtered = filtered.filter(c => {
      if (!c.guaranteedDate) return false;
      const dateStr = c.guaranteedDate.split(',')[0];
      const [day, month, year] = dateStr.split(' ');
      const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
      const guaranteedDateObj = new Date(parseInt(year), months[month], parseInt(day));
      return guaranteedDateObj <= thirtyDaysFromNow;
    });
  }
  
  // Filter by holidays (mock - for demo, just filter to Schengen and UK when "europe" selected)
  if (activeFilters.holidays === "europe") {
    filtered = filtered.filter(c => c.name === "United Kingdom" || c.name === "Schengen Area");
  } else if (activeFilters.holidays === "middle_east") {
    filtered = filtered.filter(c => c.name === "Dubai (UAE)" || c.name === "Turkey");
  } else if (activeFilters.holidays === "north_america") {
    filtered = filtered.filter(c => c.name === "United States" || c.name === "Canada");
  }
  
  return filtered;
}

/* ===== RENDER CARDS ===== */
function renderVisaCards() {
  const filtered = filterCountries();
  const grid = document.getElementById("visa-grid");
  
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:#6b7280;">No visas match your filters. Try adjusting your criteria.</div>`;
    return;
  }
  
  grid.innerHTML = filtered.map(c => `
    <div>
      <div class="country-card" onclick='openModal(${JSON.stringify(c)})'>
        <img class="bg" src="${bgUrl(c.code)}" alt="${c.name}" loading="lazy">
        <div class="overlay"></div>
        <div class="content">
          <img class="flag" src="${flagUrl(c.code)}" alt="">
          <h3>${c.name}</h3>
          <div class="card-meta">
            <div><span class="label">Type</span><span class="val">${c.type}</span></div>
            <div><span class="label">Valid</span><span class="val">${c.validity}</span></div>
            <div><span class="label">Fees</span><span class="val">${c.fees}</span></div>
          </div>
        </div>
      </div>
      <div class="guaranteed-info">
        <p class="gi-label">Guaranteed Visa on</p>
        <p class="gi-date">${c.guaranteedDate}</p>
      </div>
    </div>
  `).join("");
}

// Initialize filter dropdowns
function initFilters() {
  const filterItems = document.querySelectorAll('.filter-dropdown');
  
  // Define dropdown options for each filter
  const filterOptions = {
    delivery: [
      { value: "any", label: "Any Time" },
      { value: "soon", label: "Next 7 Days" },
      { value: "soon", label: "Next 30 Days" }
    ],
    type: [
      { value: "all", label: "All Visa Types" },
      ...getAllVisaTypes().map(t => ({ value: t, label: t }))
    ],
    documents: [
      { value: "any", label: "Any Documents" },
      ...getAllDocumentTypes().map(d => ({ value: d, label: d }))
    ],
    holidays: [
      { value: "any", label: "Any Destination" },
      { value: "europe", label: "Europe (UK/Schengen)" },
      { value: "north_america", label: "North America (US/Canada)" },
      { value: "middle_east", label: "Middle East (Dubai/Turkey)" }
    ]
  };
  
  // Create and append dropdown menus
  filterItems.forEach(item => {
    const filterType = item.getAttribute('data-filter');
    const options = filterOptions[filterType];
    if (!options) return;
    
    const valueElement = document.getElementById(`filter-${filterType}-value`);
    
    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    dropdown.style.display = 'none';
    
    options.forEach(opt => {
      const optDiv = document.createElement('div');
      optDiv.className = `dropdown-item ${activeFilters[filterType] === opt.value ? 'active' : ''}`;
      optDiv.textContent = opt.label;
      optDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        activeFilters[filterType] = opt.value;
        // Update displayed value
        if (valueElement) {
          valueElement.innerHTML = `${opt.label} <span class="chevron">▾</span>`;
        }
        // Close all dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        // Re-render cards
        renderVisaCards();
      });
      dropdown.appendChild(optDiv);
    });
    
    item.appendChild(dropdown);
    
    // Toggle dropdown on click
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m !== dropdown) m.style.display = 'none';
      });
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
  });
  
  // Close dropdowns when clicking elsewhere
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
  });
}

/* ===== MODAL OPEN / CLOSE ===== */
function openModal(country) {
  currentCountry = country;
  currentStep = 0;
  formData = {
    fullName: "",
    email: "",
    phoneNumber: "",
    traveledBefore:"", visitedCountries:"", countryOfResidence:"", applyingFor:"",
    occupation:"", jobTitle:"", incomeRange:"",
    destinationCountry:"", tripPurpose:"", hasInvitation:"", expensesCoveredBy:"", travelDate:"",
    firstTimeApplying:"", everDenied:"", deniedCountry:"", deniedExplanation:"", immigrationIssues:"",
    visaType:"", isRenewal:"", lastVisaExpiry:"",
    hasValidPassport:"", passportNumber:"", passportExpiry:"", docsReady:[],
    addOns:[],
  };
  renderModal();
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

/* ===== RADIO HELPER ===== */
function radioBtn(name, value, label, currentVal) {
  return `<label class="radio-pill ${currentVal === value ? "active" : ""}">
    <input type="radio" name="${name}" value="${value}" ${currentVal === value ? "checked" : ""}> ${label}
  </label>`;
}

/* ===== FORM STATE ===== */
let currentStep = 0;
let currentCountry = null;
let formData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  traveledBefore: "",
  visitedCountries: "",
  countryOfResidence: "",
  applyingFor: "",
  occupation: "",
  jobTitle: "",
  incomeRange: "",
  destinationCountry: "",
  tripPurpose: "",
  hasInvitation: "",
  expensesCoveredBy: "",
  travelDate: "",
  firstTimeApplying: "",
  everDenied: "",
  deniedCountry: "",
  deniedExplanation: "",
  immigrationIssues: "",
  visaType: "",
  isRenewal: "",
  lastVisaExpiry: "",
  hasValidPassport: "",
  passportNumber: "",
  passportExpiry: "",
  docsReady: [],
  addOns: [],
};

const STEPPER_LABELS = ["Personal Info", "About You", "Trip", "Visa History", "Visa Type", "Documents", "Add-Ons"];

function buildStep0() {
  return `
    <h3 class="modal-step-title">Personal Information</h3>
    <p class="q-hint" style="margin-bottom:1.25rem">Please provide your details exactly as they appear on your official ID.</p>
    <div class="q-block">
      <label class="q-label">Full Name (as on ID)</label>
      <input id="f-fullname" class="modal-input" value="${formData.fullName}" placeholder="e.g. John Oluwaseun Adebayo">
    </div>
    <div class="q-block">
      <label class="q-label">Email Address</label>
      <input id="f-email" class="modal-input" type="email" value="${formData.email}" placeholder="you@example.com">
    </div>
    <div class="q-block">
      <label class="q-label">Phone Number</label>
      <input id="f-phone" class="modal-input" value="${formData.phoneNumber}" placeholder="e.g. +234 801 234 5678">
    </div>
  `;
}

function buildStep1() {
  const showVisited = formData.traveledBefore === "yes";
  const showJobTitle = formData.occupation === "employed" || formData.occupation === "self_employed";
  return `
    <h3 class="modal-step-title">About You</h3>
    <div class="q-block">
      <label class="q-label">Have you traveled outside your country before?</label>
      <div class="radio-group">${radioBtn("traveledBefore","yes","Yes",formData.traveledBefore)}${radioBtn("traveledBefore","no","No",formData.traveledBefore)}</div>
    </div>
    <div class="q-block conditional" id="cond-visitedCountries" style="display:${showVisited?"block":"none"}">
      <label class="q-label">Which countries have you visited recently? <span class="q-hint">(optional)</span></label>
      <textarea id="f-visited" class="modal-textarea" placeholder="e.g. Kenya (2023), Ghana (2024)…">${formData.visitedCountries}</textarea>
    </div>
    <div class="q-block">
      <label class="q-label">Where are you currently living?</label>
      <input id="f-residence" class="modal-input" value="${formData.countryOfResidence}" placeholder="e.g. Nigeria">
    </div>
    <div class="q-block">
      <label class="q-label">Are you applying for yourself or someone else?</label>
      <div class="radio-group">${radioBtn("applyingFor","myself","Myself",formData.applyingFor)}${radioBtn("applyingFor","someone_else","Someone Else",formData.applyingFor)}${radioBtn("applyingFor","group","A Group",formData.applyingFor)}</div>
    </div>
    <div class="q-block">
      <label class="q-label">What do you currently do?</label>
      <div class="radio-group">${radioBtn("occupation","employed","Employed",formData.occupation)}${radioBtn("occupation","self_employed","Self-Employed",formData.occupation)}${radioBtn("occupation","student","Student",formData.occupation)}${radioBtn("occupation","unemployed","Unemployed",formData.occupation)}</div>
    </div>
    <div class="q-block conditional" id="cond-jobTitle" style="display:${showJobTitle?"block":"none"}">
      <label class="q-label">What's your job title or business?</label>
      <input id="f-jobtitle" class="modal-input" value="${formData.jobTitle}" placeholder="e.g. Software Engineer / Boutique Owner">
    </div>
    <div class="q-block">
      <label class="q-label">How much do you earn monthly?</label>
      <div class="radio-group pill-group">${radioBtn("incomeRange","low","₦5.5M – ₦8.5M",formData.incomeRange)}${radioBtn("incomeRange","mid","₦8.5M – ₦15M",formData.incomeRange)}${radioBtn("incomeRange","high","₦15M+",formData.incomeRange)}${radioBtn("incomeRange","specify","Prefer to specify",formData.incomeRange)}</div>
    </div>
  `;
}

function buildStep2() {
  const showInvite = formData.tripPurpose === "business";
  const showExpenses = formData.tripPurpose === "business" && formData.hasInvitation === "yes";
  return `
    <h3 class="modal-step-title">Trip Details</h3>
    <div class="q-block">
      <label class="q-label">Which country are you planning to travel to?</label>
      <input id="f-dest" class="modal-input" value="${formData.destinationCountry || currentCountry.name}" placeholder="e.g. United Kingdom">
    </div>
    <div class="q-block">
      <label class="q-label">What's the purpose of your trip?</label>
      <div class="radio-group">${radioBtn("tripPurpose","tourism","Tourism",formData.tripPurpose)}${radioBtn("tripPurpose","business","Business",formData.tripPurpose)}${radioBtn("tripPurpose","medical","Medical",formData.tripPurpose)}${radioBtn("tripPurpose","study","Study",formData.tripPurpose)}${radioBtn("tripPurpose","work","Work (temporary)",formData.tripPurpose)}</div>
    </div>
    <div class="q-block conditional" id="cond-invitation" style="display:${showInvite?"block":"none"}">
      <label class="q-label">Do you have an invitation from a company?</label>
      <div class="radio-group">${radioBtn("hasInvitation","yes","Yes",formData.hasInvitation)}${radioBtn("hasInvitation","no","No",formData.hasInvitation)}</div>
    </div>
    <div class="q-block conditional" id="cond-expenses" style="display:${showExpenses?"block":"none"}">
      <label class="q-label">Who is covering your expenses?</label>
      <div class="radio-group">${radioBtn("expensesCoveredBy","self","Self",formData.expensesCoveredBy)}${radioBtn("expensesCoveredBy","company","Company",formData.expensesCoveredBy)}${radioBtn("expensesCoveredBy","host","Host",formData.expensesCoveredBy)}</div>
    </div>
    <div class="q-block">
      <label class="q-label">When are you planning to travel?</label>
      <input id="f-tdate" class="modal-input" type="date" value="${formData.travelDate}">
    </div>
  `;
}

function buildStep3() {
  const showDenied = formData.everDenied === "yes";
  const showImmigMsg = formData.immigrationIssues === "yes";
  return `
    <h3 class="modal-step-title">Visa History &amp; Risk Check</h3>
    <div class="q-block">
      <label class="q-label">Is this your first time applying for a visa?</label>
      <div class="radio-group">${radioBtn("firstTimeApplying","yes","Yes",formData.firstTimeApplying)}${radioBtn("firstTimeApplying","no","No",formData.firstTimeApplying)}</div>
    </div>
    <div class="q-block">
      <label class="q-label">Have you ever been denied a visa before?</label>
      <div class="radio-group">${radioBtn("everDenied","yes","Yes",formData.everDenied)}${radioBtn("everDenied","no","No",formData.everDenied)}</div>
    </div>
    <div class="q-block conditional" id="cond-denied" style="display:${showDenied?"block":"none"}">
      <label class="q-label">Which country denied you and when?</label>
      <input id="f-denied-country" class="modal-input" value="${formData.deniedCountry}" placeholder="e.g. UK — 2022">
      <label class="q-label" style="margin-top:.75rem">Would you like to share what happened? <span class="q-hint">(optional)</span></label>
      <textarea id="f-denied-explain" class="modal-textarea" placeholder="Brief description…">${formData.deniedExplanation}</textarea>
    </div>
    <div class="q-block">
      <label class="q-label">Have you ever overstayed a visa or had any immigration issues?</label>
      <div class="radio-group">${radioBtn("immigrationIssues","yes","Yes",formData.immigrationIssues)}${radioBtn("immigrationIssues","no","No",formData.immigrationIssues)}</div>
    </div>
    <div class="q-block info-box" id="cond-immigration-msg" style="display:${showImmigMsg?"flex":"none"}">
      <span class="info-icon">💬</span>
      <p>Thanks for sharing. This might require a quick consultation to guide you properly.</p>
    </div>
  `;
}

function buildStep4() {
  const showExpiry = formData.isRenewal === "renewal";
  return `
    <h3 class="modal-step-title">Visa Type &amp; Qualification</h3>
    <div class="q-block">
      <label class="q-label">What type of visa are you applying for?</label>
      <div class="radio-group">${radioBtn("visaType","tourist","Tourist",formData.visaType)}${radioBtn("visaType","business","Business",formData.visaType)}${radioBtn("visaType","medical","Medical",formData.visaType)}${radioBtn("visaType","study","Study",formData.visaType)}${radioBtn("visaType","work","Work",formData.visaType)}</div>
    </div>
    <div class="q-block">
      <label class="q-label">Is this a new application or a renewal?</label>
      <div class="radio-group">${radioBtn("isRenewal","first_time","First-time",formData.isRenewal)}${radioBtn("isRenewal","renewal","Renewal",formData.isRenewal)}</div>
    </div>
    <div class="q-block conditional" id="cond-lastexpiry" style="display:${showExpiry?"block":"none"}">
      <label class="q-label">When did your last visa expire?</label>
      <input id="f-lastexpiry" class="modal-input" type="date" value="${formData.lastVisaExpiry}">
    </div>
  `;
}

function buildStep5() {
  const docOptions = [{ val:"bank_statement", label:"Bank Statement" },{ val:"employment_letter", label:"Employment Letter" },{ val:"cac", label:"Business Registration (CAC)" },{ val:"invitation_letter", label:"Invitation Letter" },{ val:"none", label:"None yet" }];
  const showPassFields = formData.hasValidPassport === "yes";
  return `
    <h3 class="modal-step-title">Document Readiness</h3>
    <div class="q-block">
      <label class="q-label">Do you currently have a valid international passport?</label>
      <div class="radio-group">${radioBtn("hasValidPassport","yes","Yes",formData.hasValidPassport)}${radioBtn("hasValidPassport","no","No",formData.hasValidPassport)}</div>
    </div>
    <div class="q-block conditional" id="cond-passportfields" style="display:${showPassFields?"block":"none"}">
      <label class="q-label">Passport Number</label>
      <input id="f-pass" class="modal-input" value="${formData.passportNumber}" placeholder="A12345678">
      <label class="q-label" style="margin-top:.75rem">Passport Expiry</label>
      <input id="f-pexp" class="modal-input" type="date" value="${formData.passportExpiry}">
    </div>
    <div class="q-block">
      <label class="q-label">Do you already have any of these documents ready? <span class="q-hint">(select all that apply)</span></label>
      <div class="check-group">${docOptions.map(o => `<label class="check-pill ${formData.docsReady.includes(o.val)?"active":""}"><input type="checkbox" name="docsReady" value="${o.val}" ${formData.docsReady.includes(o.val)?"checked":""}> ${o.label}</label>`).join("")}</div>
    </div>
  `;
}

function buildStep6() {
  const addOnOptions = [{ val:"insurance", label:"✈️ Travel Insurance" },{ val:"flights", label:"🛫 Flight Booking" },{ val:"hotel", label:"🏨 Hotel Reservation" },{ val:"interview", label:"🎤 Visa Interview Prep" },{ val:"none", label:"None" }];
  return `
    <h3 class="modal-step-title">Add-On Services</h3>
    <p class="q-hint" style="margin-bottom:1.25rem">Would you like help with any of these alongside your visa?</p>
    <div class="check-group">${addOnOptions.map(o => `<label class="check-pill ${formData.addOns.includes(o.val)?"active":""}"><input type="checkbox" name="addOns" value="${o.val}" ${formData.addOns.includes(o.val)?"checked":""}> ${o.label}</label>`).join("")}</div>
  `;
}

function getAIDecision() {
  const d = formData;
  if (d.immigrationIssues === "yes" || d.everDenied === "yes") return "high_risk";
  if (d.isRenewal === "renewal" && d.traveledBefore === "yes" && d.firstTimeApplying === "no") return "simple";
  return "complex";
}

function buildStep7() {
  const decision = getAIDecision();
  const c = currentCountry;
  if (decision === "simple") return `<div class="ai-decision"><div class="ai-badge ai-badge-green">✅ Straightforward Profile</div><h3>You're good to go!</h3><p>Based on your answers, your application looks clean and ready.</p><div class="ai-price-card"><div class="ai-price-label">Visa Fee</div><div class="ai-price-value">${c.fees}</div><div class="ai-price-sub">${c.type} · ${c.validity}</div></div><div class="ai-decision-actions"><button class="btn-next" onclick="currentStep=8;renderModal()">Review &amp; Submit →</button></div></div>`;
  if (decision === "high_risk") return `<div class="ai-decision"><div class="ai-badge ai-badge-red">🚨 Consultation Recommended</div><h3>Let's make sure you're protected</h3><p>Proceeding without expert guidance could increase rejection risk.</p><div class="ai-decision-actions"><button class="btn-consult" onclick="bookConsultation()">Book a Consultation →</button></div></div>`;
  return `<div class="ai-decision"><div class="ai-badge ai-badge-yellow">⚠️ Review Suggested</div><h3>A quick heads-up</h3><p>Speaking with a consultant often improves approval odds.</p><div class="ai-decision-actions"><button class="btn-consult" onclick="bookConsultation()">Talk to a Consultant</button><button class="btn-back" onclick="currentStep=8;renderModal()">Continue Anyway →</button></div></div>`;
}

function buildStep8() {
  const d = formData;
  const c = currentCountry;
  return `<h3 class="modal-step-title">Review &amp; Submit</h3><div class="review-cards"><div class="review-card"><h4>Personal Info</h4><p>Name: <strong>${d.fullName||"—"}</strong></p><p>Email: <strong>${d.email||"—"}</strong></p><p>Phone: <strong>${d.phoneNumber||"—"}</strong></p></div><div class="review-card"><h4>About You</h4><p>Traveled before: <strong>${d.traveledBefore||"—"}</strong></p><p>Living in: <strong>${d.countryOfResidence||"—"}</strong></p><p>Occupation: <strong>${d.occupation||"—"}</strong></p></div><div class="review-card"><h4>Trip</h4><p>Destination: <strong>${d.destinationCountry||c.name}</strong></p><p>Purpose: <strong>${d.tripPurpose||"—"}</strong></p></div><div class="review-card"><h4>Visa Type</h4><p>Type: <strong>${d.visaType||"—"}</strong></p><p>Application: <strong>${d.isRenewal||"—"}</strong></p></div></div>`;
}

function saveFields() {
  const val = id => (document.getElementById(id)||{}).value || "";
  const radios = name => { const el = document.querySelector(`input[name="${name}"]:checked`); return el ? el.value : ""; };
  const checkboxGroup = name => Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
  if (currentStep === 0) { formData.fullName = val("f-fullname"); formData.email = val("f-email"); formData.phoneNumber = val("f-phone"); }
  else if (currentStep === 1) { formData.traveledBefore = radios("traveledBefore"); formData.visitedCountries = val("f-visited"); formData.countryOfResidence = val("f-residence"); formData.applyingFor = radios("applyingFor"); formData.occupation = radios("occupation"); formData.jobTitle = val("f-jobtitle"); formData.incomeRange = radios("incomeRange"); }
  else if (currentStep === 2) { formData.destinationCountry = val("f-dest"); formData.tripPurpose = radios("tripPurpose"); formData.hasInvitation = radios("hasInvitation"); formData.expensesCoveredBy = radios("expensesCoveredBy"); formData.travelDate = val("f-tdate"); }
  else if (currentStep === 3) { formData.firstTimeApplying = radios("firstTimeApplying"); formData.everDenied = radios("everDenied"); formData.deniedCountry = val("f-denied-country"); formData.deniedExplanation = val("f-denied-explain"); formData.immigrationIssues = radios("immigrationIssues"); }
  else if (currentStep === 4) { formData.visaType = radios("visaType"); formData.isRenewal = radios("isRenewal"); formData.lastVisaExpiry = val("f-lastexpiry"); }
  else if (currentStep === 5) { formData.hasValidPassport = radios("hasValidPassport"); formData.passportNumber = val("f-pass"); formData.passportExpiry = val("f-pexp"); formData.docsReady = checkboxGroup("docsReady"); }
  else if (currentStep === 6) { formData.addOns = checkboxGroup("addOns"); }
}

function attachConditionals() {
  const toggle = (name, targetId, matchVal, extraCheck) => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(el => el.addEventListener("change", () => { const show = extraCheck ? extraCheck() : (el.value === matchVal && el.checked); const block = document.getElementById(targetId); if (block) block.style.display = show ? "block" : "none"; }));
  };
  toggle("traveledBefore", "cond-visitedCountries", "yes");
  toggle("occupation", "cond-jobTitle", null, () => { const el = document.querySelector('input[name="occupation"]:checked'); return el && (el.value === "employed" || el.value === "self_employed"); });
  toggle("tripPurpose", "cond-invitation", "business");
  toggle("everDenied", "cond-denied", "yes");
  toggle("isRenewal", "cond-lastexpiry", "renewal");
  toggle("hasValidPassport", "cond-passportfields", "yes");
  
// Fix radio button active states - removes active from all in same group, then adds to checked one
document.querySelectorAll(".radio-pill input").forEach(input => {
  input.addEventListener("change", () => {
    // Get the radio group name
    const radioName = input.getAttribute('name');
    // Remove active class from all radio-pills in this group
    document.querySelectorAll(`.radio-pill input[name="${radioName}"]`).forEach(radio => {
      radio.closest(".radio-pill").classList.remove("active");
    });
    // Add active class to the checked one
    if (input.checked) {
      input.closest(".radio-pill").classList.add("active");
    }
  });
});
  
  document.querySelectorAll(".check-pill input").forEach(input => input.addEventListener("change", () => { input.closest(".check-pill").classList.toggle("active", input.checked); }));
}

function renderModal() {
  const m = document.getElementById("modal-content");
  const c = currentCountry;
  if (!c) return;
  const stepperHTML = STEPPER_LABELS.map((s, i) => { const cls = i === Math.min(currentStep,6) ? (currentStep>6?"done":"active") : i<currentStep ? "done" : ""; const dot = i<currentStep ? "✓" : i+1; const line = i<STEPPER_LABELS.length-1 ? `<div class="stepper-line"></div>` : ""; return `<div class="stepper-step ${cls}"><div class="stepper-dot">${dot}</div><span>${s}</span>${line}</div>`; }).join("");
  const builders = [buildStep0, buildStep1, buildStep2, buildStep3, buildStep4, buildStep5, buildStep6, buildStep7, buildStep8];
  const bodyHTML = (builders[currentStep] || (()=>""))();
  const isAIStep = currentStep === 7;
  const backBtn = (currentStep>0 && currentStep!==7) ? `<button class="btn-back" onclick="saveFields();currentStep--;renderModal()">← Back</button>` : "";
  let nextBtn = "";
  if (currentStep < 6) nextBtn = `<button class="btn-next" onclick="saveFields();currentStep++;renderModal()">Next →</button>`;
  else if (currentStep === 6) nextBtn = `<button class="btn-next" onclick="saveFields();currentStep++;renderModal()">See My Result →</button>`;
  else if (currentStep === 8) nextBtn = `<button class="btn-submit" onclick="submitForm()">Submit Application →</button>`;
  m.innerHTML = `<div class="modal-head"><div class="modal-head-left"><img src="${flagUrl(c.code)}" alt="" class="modal-flag"><div><h2>${c.name} Visa</h2><span class="modal-meta">${c.type} · ${c.validity} · ${c.fees}</span></div></div><button class="modal-x" onclick="closeModal()">×</button></div><div class="stepper">${stepperHTML}</div><div class="modal-body">${bodyHTML}</div>${!isAIStep ? `<div class="modal-foot">${backBtn}<div style="flex:1"></div>${nextBtn}</div>` : ""}`;
  attachConditionals();
}

function bookConsultation() {
  const m = document.getElementById("modal-content");
  m.innerHTML = `<div class="success-box"><div class="success-check" style="background:#f59e0b">📅</div><h2>Consultation Requested</h2><p>A Blanc Visa consultant will reach out to you shortly.</p></div>`;
  setTimeout(closeModal, 3000);
}

// FORMSPREE SUBMISSION - Fixed with honeypot and replyto
function submitForm() {
  // Validation
  if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `<div class="success-box" style="color:#991b1b">
      <div class="success-check" style="background:#dc2626">!</div>
      <h2>Missing Information</h2>
      <p>Please fill out all personal information.</p>
      <button class="btn-back" style="margin-top:1rem" onclick="currentStep=0;renderModal()">Go Back →</button>
    </div>`;
    return;
  }
  
  // Show loading state
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `<div class="success-box">
    <div class="success-check" style="background:#f59e0b">⏳</div>
    <h2>Submitting...</h2>
    <p>Please wait while we process your application.</p>
  </div>`;
  
  // Prepare data for Formspree as URL-encoded string
  const formDataToSend = new URLSearchParams();
  
  // REQUIRED FOR FORMSPREE:
  formDataToSend.append('email', formData.email);  // Must have 'email' field
  formDataToSend.append('_replyto', formData.email);  // Where to send replies
  formDataToSend.append('_gotcha', '');  // Honeypot - MUST be empty
  
  // Optional: Custom subject for email notification
  formDataToSend.append('_subject', `New Visa Application - ${formData.fullName} - ${currentCountry.name}`);
  
  // Your application data
  formDataToSend.append('fullName', formData.fullName);
  formDataToSend.append('phoneNumber', formData.phoneNumber);
  formDataToSend.append('countryOfResidence', formData.countryOfResidence);
  formDataToSend.append('traveledBefore', formData.traveledBefore);
  formDataToSend.append('visitedCountries', formData.visitedCountries);
  formDataToSend.append('occupation', formData.occupation);
  formDataToSend.append('jobTitle', formData.jobTitle);
  formDataToSend.append('incomeRange', formData.incomeRange);
  formDataToSend.append('destinationCountry', formData.destinationCountry || currentCountry.name);
  formDataToSend.append('tripPurpose', formData.tripPurpose);
  formDataToSend.append('travelDate', formData.travelDate);
  formDataToSend.append('firstTimeApplying', formData.firstTimeApplying);
  formDataToSend.append('everDenied', formData.everDenied);
  formDataToSend.append('deniedCountry', formData.deniedCountry);
  formDataToSend.append('immigrationIssues', formData.immigrationIssues);
  formDataToSend.append('visaType', formData.visaType);
  formDataToSend.append('isRenewal', formData.isRenewal);
  formDataToSend.append('hasValidPassport', formData.hasValidPassport);
  formDataToSend.append('passportNumber', formData.passportNumber);
  formDataToSend.append('docsReady', formData.docsReady.join(", "));
  formDataToSend.append('addOns', formData.addOns.join(", "));
  formDataToSend.append('selectedCountry', currentCountry.name);
  formDataToSend.append('selectedVisaType', currentCountry.type);
  formDataToSend.append('visaFee', currentCountry.fees);
  formDataToSend.append('guaranteedDate', currentCountry.guaranteedDate);
  
  // Create hidden form
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://formspree.io/f/mdapbpvw';
  form.target = 'hidden_iframe';
  form.style.display = 'none';
  
  // Create hidden iframe
  let iframe = document.getElementById('hidden_iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.id = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  
  // Add all fields to the form
  for (const [key, value] of formDataToSend.entries()) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }
  
  document.body.appendChild(form);
  
  // Set up iframe load handler
  iframe.onload = function() {
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `<div class="success-box">
      <div class="success-check">✓</div>
      <h2>Application Submitted!</h2>
      <p>Your visa application for <strong>${currentCountry.name}</strong> has been received.<br>We'll email you updates at every stage.</p>
    </div>`;
    setTimeout(closeModal, 2500);
    document.body.removeChild(form);
  };
  
  iframe.onerror = function() {
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `<div class="success-box" style="color:#991b1b">
      <div class="success-check" style="background:#dc2626">!</div>
      <h2>Submission Error</h2>
      <p>There was a problem submitting your application. Please try again.</p>
      <button class="btn-back" style="margin-top:1rem" onclick="currentStep=8;renderModal()">Try Again →</button>
    </div>`;
    document.body.removeChild(form);
  };
  
  // Submit the form
  form.submit();
}

document.addEventListener("DOMContentLoaded", () => {
  renderVisaCards();
  initFilters();
  document.getElementById("modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
});