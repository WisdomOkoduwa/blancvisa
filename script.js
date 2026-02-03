/* ================================
   BLANC VISAS - JavaScript
   ================================ */

// ================================
// Mobile Menu
// ================================
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.remove('active');
}

// ================================
// Modal
// ================================
function openModal() {
  const modal = document.getElementById('modal');
  const form = document.getElementById('applicationForm');
  const success = document.getElementById('successMessage');
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Reset to form view
  form.style.display = 'block';
  success.style.display = 'none';
  form.reset();
  document.getElementById('fileLabel').textContent = 'Click to upload or drag and drop';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ================================
// Form Submission
// ================================
function submitForm(event) {
  event.preventDefault();
  
  const form = document.getElementById('applicationForm');
  const success = document.getElementById('successMessage');
  const formData = new FormData(form);
  
  // Basic validation
  const requiredFields = ['fullName', 'email', 'phone', 'nationality', 'destination', 'purpose', 'passportNumber'];
  let isValid = true;
  
  requiredFields.forEach(field => {
    const input = document.getElementById(field);
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = 'hsl(0, 84%, 60%)';
    } else {
      input.style.borderColor = '';
    }
  });
  
  // Email validation
  const email = document.getElementById('email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    isValid = false;
    email.style.borderColor = 'hsl(0, 84%, 60%)';
  }
  
  if (!isValid) {
    return;
  }
  
  // Simulate API call
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

// ================================
// File Upload
// ================================
function handleFileUpload(event) {
  const file = event.target.files[0];
  const label = document.getElementById('fileLabel');
  
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      event.target.value = '';
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or PDF file');
      event.target.value = '';
      return;
    }
    
    label.textContent = file.name;
  } else {
    label.textContent = 'Click to upload or drag and drop';
  }
}

// ================================
// Search
// ================================
function handleSearch() {
  const input = document.getElementById('searchInput');
  if (input.value.trim()) {
    openModal();
    // Pre-fill destination if matching
    const destination = document.getElementById('destination');
    const searchTerm = input.value.toLowerCase();
    
    if (searchTerm.includes('uk') || searchTerm.includes('united kingdom') || searchTerm.includes('britain') || searchTerm.includes('england')) {
      destination.value = 'UK';
    } else if (searchTerm.includes('us') || searchTerm.includes('usa') || searchTerm.includes('united states') || searchTerm.includes('america')) {
      destination.value = 'US';
    } else if (searchTerm.includes('canada')) {
      destination.value = 'CA';
    } else if (searchTerm.includes('europe') || searchTerm.includes('schengen') || searchTerm.includes('france') || searchTerm.includes('germany') || searchTerm.includes('italy')) {
      destination.value = 'EU';
    } else if (searchTerm.includes('turkey')) {
      destination.value = 'TR';
    } else if (searchTerm.includes('dubai') || searchTerm.includes('uae') || searchTerm.includes('emirates')) {
      destination.value = 'AE';
    }
  }
}

// ================================
// Chatbot
// ================================
function toggleChatbot() {
  const chatbot = document.getElementById('chatbot');
  const toggle = document.getElementById('chatbotToggle');
  const chatIcon = toggle.querySelector('.chat-icon');
  const closeIcon = toggle.querySelector('.close-icon');
  
  chatbot.classList.toggle('active');
  
  if (chatbot.classList.contains('active')) {
    chatIcon.style.display = 'none';
    closeIcon.style.display = 'block';
  } else {
    chatIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  }
}

function handleChatKeydown(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatbotMessages');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-message user';
  userDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
  messages.appendChild(userDiv);
  
  // Clear input
  input.value = '';
  
  // Scroll to bottom
  messages.scrollTop = messages.scrollHeight;
  
  // Get bot response
  setTimeout(() => {
    const response = getBotResponse(message);
    const botDiv = document.createElement('div');
    botDiv.className = 'chat-message bot';
    botDiv.innerHTML = `<p>${response}</p>`;
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
  }, 500);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Predefined Q&A responses
const predefinedResponses = {
  visa: "We offer visa services for 150+ countries including UK, USA, Canada, Schengen Area, Australia, Turkey, Dubai, and Japan. Our AI-powered platform helps you find the right visa type and guides you through the application process.",
  processing: "Processing times vary by destination:\n• UK: 7-15 working days\n• USA: 10-21 working days\n• Canada: 7-14 working days\n• Schengen: 10-15 working days\n• Turkey: 1-3 working days",
  cost: "Our visa service fees depend on the destination country and visa type. Contact us for a personalized quote. We offer a money-back guarantee if your visa is denied.",
  documents: "Required documents typically include:\n• Valid passport (6+ months validity)\n• Passport photos\n• Proof of funds\n• Travel itinerary\n• Employment/education proof\nOur AI will guide you on specific requirements for your destination.",
  success: "We have a 98.7% success rate backed by 15+ years of combined experience. We've processed over 10,000 visas successfully!",
  support: "We offer 24/7 support via chat, email (info@blancvisas.com), or phone. Our AI assistant is available anytime, and human experts are ready to help during business hours.",
  track: "You can track your application in real-time through our platform. We provide status updates throughout the process.",
  ai: "Our AI-powered consultation analyzes your profile to recommend the best visa type, predict success rates, and verify your documents before submission. Try it free - no credit card required!",
  apply: "To apply, click 'Get Started' or 'Apply Now' on any destination card. You'll fill out a simple form with your details and upload your passport. Our team reviews all applications within 24-48 hours.",
  refund: "Yes! We offer a money-back guarantee if your visa is denied due to any error on our part."
};

function getBotResponse(query) {
  const lowerQuery = query.toLowerCase();
  
  // Check for keywords
  for (const [keyword, response] of Object.entries(predefinedResponses)) {
    if (lowerQuery.includes(keyword)) {
      return response;
    }
  }
  
  // Check for common patterns
  if (lowerQuery.includes('how long') || lowerQuery.includes('time')) {
    return predefinedResponses.processing;
  }
  if (lowerQuery.includes('price') || lowerQuery.includes('fee') || lowerQuery.includes('how much') || lowerQuery.includes('cost')) {
    return predefinedResponses.cost;
  }
  if (lowerQuery.includes('need') || lowerQuery.includes('require') || lowerQuery.includes('what do i')) {
    return predefinedResponses.documents;
  }
  if (lowerQuery.includes('help') || lowerQuery.includes('contact') || lowerQuery.includes('speak')) {
    return predefinedResponses.support;
  }
  if (lowerQuery.includes('start') || lowerQuery.includes('begin') || lowerQuery.includes('how to') || lowerQuery.includes('apply')) {
    return predefinedResponses.apply;
  }
  if (lowerQuery.includes('hi') || lowerQuery.includes('hello') || lowerQuery.includes('hey')) {
    return "Hello! 👋 I'm here to help with your visa questions. You can ask about destinations, processing times, required documents, costs, or how to apply!";
  }
  if (lowerQuery.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with regarding your visa application?";
  }
  
  // Default fallback
  return "I'm not sure about that specific question. For detailed assistance, please chat with our support team on WhatsApp or email us at info@blancvisas.com. You can also ask about:\n• Visa types\n• Processing times\n• Required documents\n• How to apply";
}

// ================================
// Smooth Scroll for Navigation Links
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ================================
// Header Background on Scroll
// ================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    header.style.background = 'hsla(240, 10%, 4%, 0.95)';
  } else {
    header.style.background = 'hsla(240, 10%, 4%, 0.8)';
  }
  
  lastScroll = currentScroll;
});

// ================================
// Intersection Observer for Animations
// ================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe animatable elements
document.querySelectorAll('.destination-card, .step-card, .stat-card, .feature-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
