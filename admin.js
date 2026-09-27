// AMRID PUBLIC SCHOOL - Admin Panel Core Application Logic

let contentData = null;
let submissionData = null;
let mediaLibrary = [];
let activeTab = 'dashboard';
let currentMediaSelectTarget = null; // Stores input ID for media picker

// Expose functions globally for inline HTML events at the earliest possible stage
window.openAddGalleryModal = openAddGalleryModal;
window.openEditGalleryModal = openEditGalleryModal;
window.toggleGalleryPublish = toggleGalleryPublish;
window.deleteGalleryItem = deleteGalleryItem;
window.moveGalleryItem = moveGalleryItem;
window.openCategoryManagerModal = openCategoryManagerModal;
window.openUploadGalleryModal = openUploadGalleryModal;

window.openAddNoticeModal = openAddNoticeModal;
window.openEditNoticeModal = openEditNoticeModal;
window.toggleNoticePublish = toggleNoticePublish;
window.toggleNoticeArchive = toggleNoticeArchive;
window.toggleNoticeImportant = toggleNoticeImportant;
window.deleteNotice = deleteNotice;

window.openAddEventModal = openAddEventModal;
window.openEditEventModal = openEditEventModal;
window.toggleEventPublish = toggleEventPublish;
window.deleteEvent = deleteEvent;

window.openAddFacilityModal = openAddFacilityModal;
window.openEditFacilityModal = openEditFacilityModal;
window.deleteFacility = deleteFacility;

window.openAddFacultyModal = openAddFacultyModal;
window.openEditFacultyModal = openEditFacultyModal;
window.deleteFacultyMember = deleteFacultyMember;
window.toggleFacultyStatus = toggleFacultyStatus;
window.moveFacultyMember = moveFacultyMember;
window.filterFacultyTable = filterFacultyTable;

window.openEnquiryDetailsModal = openEnquiryDetailsModal;
window.saveEnquiryNoteAndStatus = saveEnquiryNoteAndStatus;
window.openMessageDetailsModal = openMessageDetailsModal;
window.toggleMessageReadState = toggleMessageReadState;
window.updateSubmissionStatus = updateSubmissionStatus;
window.deleteSubmission = deleteSubmission;

window.triggerMediaUpload = triggerMediaUpload;
window.handleMediaUpload = handleMediaUpload;
window.deleteMediaFile = deleteMediaFile;

window.closeAdminModal = closeAdminModal;
window.closeMediaSelectModal = closeMediaSelectModal;
window.copyToClipboard = copyToClipboard;
window.selectMediaForInput = selectMediaForInput;

// ==========================================
// TOAST NOTIFICATIONS & CONFIRM DIALOGS
// ==========================================
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '✓';
  if (type === 'error') icon = '⚠';
  else if (type === 'info') icon = 'ℹ';
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function showConfirm(message, onConfirm) {
  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Confirm Action';
  
  body.innerHTML = `
    <div style="padding: 10px 0 20px; font-size: 15px; color: var(--text-dark); line-height: 1.5;">
      ${escapeHtml(message)}
    </div>
    <div class="form-submit-row" style="margin-top: 0; justify-content: flex-end; gap: 10px;">
      <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
      <button type="button" class="btn btn-danger" id="confirm-action-btn">Delete</button>
    </div>
  `;
  
  document.getElementById('confirm-action-btn').addEventListener('click', () => {
    closeAdminModal();
    onConfirm();
  });
  
  openAdminModal();
}

// ==========================================
// ADMIN THEME TOGGLE
// ==========================================
function initAdminThemeToggle() {
  const toggleBtn = document.getElementById('admin-theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateAdminThemeButtonUI(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme') || 'light';
    const next = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('aps_theme', next);
    } catch (e) {}
    updateAdminThemeButtonUI(next);
  });
}

function updateAdminThemeButtonUI(theme) {
  const label = document.getElementById('admin-theme-label');
  if (label) {
    label.textContent = theme === 'dark' ? 'Dark' : 'Light';
  }
}

function setButtonLoading(button, text = 'Processing...') {
  if (!button) return;
  button.disabled = true;
  button.dataset.originalText = button.innerHTML;
  button.innerHTML = `<span class="loading-spinner"></span> ${text}`;
}

function resetButtonLoading(button) {
  if (!button) return;
  button.disabled = false;
  if (button.dataset.originalText) {
    button.innerHTML = button.dataset.originalText;
  }
}

// Global direct file upload handler
window.uploadFileDirectly = async function(input, urlInputId, previewImgId) {
  const files = input.files;
  if (files.length === 0) return;
  
  const formData = new FormData();
  formData.append('files', files[0]);
  
  const previewContainer = document.getElementById(urlInputId + '-preview-container');
  const previewImg = document.getElementById(urlInputId + '-preview');
  
  showToast('Uploading file...', 'info');
  
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success && data.files.length > 0) {
      const fileUrl = data.files[0].url;
      document.getElementById(urlInputId).value = fileUrl;
      
      if (previewImg) {
        previewImg.src = fileUrl;
      }
      if (previewContainer) {
        previewContainer.style.display = 'flex';
      }
      
      showToast('File uploaded successfully!', 'success');
      
      // Sync media library cache
      const mediaRes = await fetch('/api/media');
      mediaLibrary = await mediaRes.json();
      if (activeTab === 'media-library') {
        renderMediaLibraryTab();
      }
    } else {
      showToast(data.message || 'File upload failed.', 'error');
    }
  } catch (err) {
    console.error('File upload failed:', err);
    showToast('Network error during file upload.', 'error');
  }
  
  input.value = ''; // clear input
};

function showPreviewIfValueExists(urlInputId, previewImgId) {
  const inputEl = document.getElementById(urlInputId);
  if (!inputEl) return;
  const val = inputEl.value;
  const container = document.getElementById(urlInputId + '-preview-container');
  const img = document.getElementById(urlInputId + '-preview');
  if (val && img && container) {
    img.src = val;
    container.style.display = 'flex';
  } else if (container) {
    container.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  bindGlobalEvents();
});

// ==========================================
// 1. INITIALIZATION & ROUTING
// ==========================================
async function initApp() {
  if (window.location.protocol === 'file:') {
    const warningEl = document.getElementById('file-protocol-warning');
    if (warningEl) {
      warningEl.style.display = 'block';
    }
  }

  const isAuth = await checkSession();
  if (isAuth) {
    showDashboard();
    await loadAllData();
    renderActiveTab();
  } else {
    showLogin();
  }
}

async function checkSession() {
  try {
    const res = await fetch('/api/check-session');
    const data = await res.json();
    if (data.success) {
      document.getElementById('logged-username').textContent = data.username;
      return true;
    }
  } catch (err) {
    console.error('Session check failed:', err);
  }
  return false;
}

function showLogin() {
  document.getElementById('login-section').style.display = 'flex';
  document.getElementById('admin-container').style.display = 'none';
}

function showDashboard() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('admin-container').style.display = 'flex';
}

// Load Content, Submissions and Media files from the server
async function loadAllData() {
  try {
    // 1. Load website editable content
    const contentRes = await fetch('/api/content');
    contentData = await contentRes.json();
    if (contentData) {
      contentData.notices = contentData.notices || [];
      contentData.events = contentData.events || [];
      contentData.gallery = contentData.gallery || [];
      contentData.facilities = contentData.facilities || [];
      contentData.school_info = contentData.school_info || {};
      contentData.director_info = contentData.director_info || {};
      contentData.principal_info = contentData.principal_info || {};
      contentData.hero_section = contentData.hero_section || {};
      contentData.social_media = contentData.social_media || {};
      contentData.contact_settings = contentData.contact_settings || {};
      contentData.hostel_info = contentData.hostel_info || {};

      // Keep admin sidebar & login logo synchronized with school_info.logo_url
      if (contentData.school_info && contentData.school_info.logo_url) {
        const sidebarLogo = document.querySelector('.admin-sidebar-logo');
        if (sidebarLogo) sidebarLogo.src = contentData.school_info.logo_url;
        const loginLogo = document.querySelector('.admin-login-logo');
        if (loginLogo) loginLogo.src = contentData.school_info.logo_url;
      }
    }

    // 2. Load enquiries and contact messages
    const submissionsRes = await fetch('/api/submissions');
    submissionData = await submissionsRes.json();
    if (submissionData) {
      submissionData.enquiries = submissionData.enquiries || [];
      submissionData.messages = submissionData.messages || [];
    }

    // 3. Load media assets
    const mediaRes = await fetch('/api/media');
    mediaLibrary = await mediaRes.json();
    mediaLibrary = mediaLibrary || [];

    // Update notifications badge counts
    updateBadgeCounts();

  } catch (err) {
    console.error('Error loading admin data:', err);
    showToast('Failed to load website database content. Please ensure the server is running.', 'error');
  }
}

function updateBadgeCounts() {
  if (!submissionData) return;
  
  const newEnqCount = submissionData.enquiries.filter(e => e.status === 'new').length;
  const newMsgCount = submissionData.messages.filter(m => !m.is_read).length;

  const enqBadge = document.getElementById('badge-new-enquiries');
  const msgBadge = document.getElementById('badge-new-messages');

  if (newEnqCount > 0) {
    enqBadge.textContent = newEnqCount;
    enqBadge.style.display = 'inline-block';
  } else {
    enqBadge.style.display = 'none';
  }

  if (newMsgCount > 0) {
    msgBadge.textContent = newMsgCount;
    msgBadge.style.display = 'inline-block';
  } else {
    msgBadge.style.display = 'none';
  }
}

// ==========================================
// 2. EVENT BINDING
// ==========================================
function bindGlobalEvents() {
  // Login Form Submit
  document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);

  // Toggle Password
  document.getElementById('toggle-password-btn').addEventListener('click', togglePasswordVisibility);

  // Logout Buttons
  document.getElementById('btn-logout-sidebar').addEventListener('click', handleLogout);
  document.getElementById('btn-logout-header').addEventListener('click', handleLogout);

  // Sidebar Hamburger Toggle (Mobile)
  const sidebar = document.getElementById('admin-sidebar');
  document.getElementById('admin-hamburger').addEventListener('click', () => {
    sidebar.classList.add('open');
  });
  document.getElementById('sidebar-close-btn').addEventListener('click', () => {
    sidebar.classList.remove('open');
  });

  // Sidebar Tab Navigation Links
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      switchTab(tab);
      sidebar.classList.remove('open'); // close mobile sidebar
    });
  });

  // Quick Action navigation buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-tab-trigger')) {
      const tab = e.target.getAttribute('data-target-tab');
      if (tab) switchTab(tab);
    }
  });

  // Form Submit Handlers
  document.getElementById('form-homepage-settings').addEventListener('submit', saveHomepageSettings);
  document.getElementById('form-school-info').addEventListener('submit', saveSchoolInfo);
  document.getElementById('form-hostel-settings').addEventListener('submit', saveHostelSettings);
  document.getElementById('form-social-settings').addEventListener('submit', saveSocialSettings);

  // Gallery Filter & Search Change
  document.getElementById('search-gallery').addEventListener('input', renderGalleryTab);
  document.getElementById('filter-gallery-category').addEventListener('change', renderGalleryTab);

  // Notices Search & Filters
  document.getElementById('search-notices').addEventListener('input', renderNoticesTab);
  document.getElementById('filter-notices-category').addEventListener('change', renderNoticesTab);
  const filterNoticesStatus = document.getElementById('filter-notices-status');
  if (filterNoticesStatus) filterNoticesStatus.addEventListener('change', renderNoticesTab);

  // Events Search & Filters
  document.getElementById('search-events').addEventListener('input', renderEventsTab);
  const filterEventsStatus = document.getElementById('filter-events-status');
  if (filterEventsStatus) filterEventsStatus.addEventListener('change', renderEventsTab);

  // Enquiries Filters
  document.getElementById('search-enquiries').addEventListener('input', renderEnquiriesTab);
  document.getElementById('filter-enquiries-class').addEventListener('change', renderEnquiriesTab);
  document.getElementById('filter-enquiries-status').addEventListener('change', renderEnquiriesTab);
  const filterEnquiriesDate = document.getElementById('filter-enquiries-date');
  if (filterEnquiriesDate) filterEnquiriesDate.addEventListener('change', renderEnquiriesTab);

  // Messages Filters
  document.getElementById('search-messages').addEventListener('input', renderMessagesTab);
  document.getElementById('filter-messages-state').addEventListener('change', renderMessagesTab);

  // Alert Banner Action
  const alertBtn = document.getElementById('btn-alert-view-enquiries');
  if (alertBtn) alertBtn.addEventListener('click', () => switchTab('enquiries'));

  // Theme Toggle Button
  initAdminThemeToggle();

  // Media Library Search
  document.getElementById('search-media').addEventListener('input', renderMediaLibraryTab);
  document.getElementById('search-media-select').addEventListener('input', renderMediaSelectGrid);

  // Media Library selection triggers
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-select-media')) {
      const inputId = e.target.getAttribute('data-target-input');
      openMediaSelectModal(inputId);
    }
  });
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById('login-password');
  const btn = document.getElementById('toggle-password-btn');
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    `;
  } else {
    pwdInput.type = 'password';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const errorAlert = document.getElementById('login-error-alert');

  errorAlert.style.display = 'none';

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim()
      })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById('logged-username').textContent = data.username;
      passwordInput.value = '';
      showDashboard();
      await loadAllData();
      switchTab('dashboard');
    } else {
      errorAlert.textContent = data.message || 'Invalid username or password.';
      errorAlert.style.display = 'block';
    }
  } catch (err) {
    console.error('Login error:', err);
    errorAlert.textContent = 'Network or server error during login.';
    errorAlert.style.display = 'block';
  }
}

async function handleLogout(e) {
  e.preventDefault();
  showConfirm('Are you sure you want to securely log out?', async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showLogin();
      }
    } catch (err) {
      console.error('Logout error:', err);
      showLogin(); // Force show login anyway
    }
  });
}

function syncActiveTabToState() {
  if (!contentData) return;

  switch (activeTab) {
    case 'homepage':
      const heroBadge = document.getElementById('hero-badge');
      const heroTitle = document.getElementById('hero-title');
      const heroTagline = document.getElementById('hero-tagline');
      const heroDescription = document.getElementById('hero-description');
      const heroBtn1Text = document.getElementById('hero-btn1-text');
      const heroBtn2Text = document.getElementById('hero-btn2-text');
      const heroImage = document.getElementById('hero-image');
      const showLeaders = document.getElementById('homepage-show-leaders');

      if (heroBadge) contentData.hero_section.badge = heroBadge.value.trim();
      if (heroTitle) contentData.hero_section.title = heroTitle.value.trim();
      if (heroTagline) contentData.hero_section.tagline = heroTagline.value.trim();
      if (heroDescription) contentData.hero_section.description = heroDescription.value.trim();
      if (heroBtn1Text) contentData.hero_section.button1_text = heroBtn1Text.value.trim();
      if (heroBtn2Text) contentData.hero_section.button2_text = heroBtn2Text.value.trim();
      if (heroImage) contentData.hero_section.image_url = heroImage.value.trim();
      if (showLeaders) contentData.school_info.show_leaders = showLeaders.checked;
      break;

    case 'school-info':
      const schoolName = document.getElementById('school-name');
      const schoolRegNumber = document.getElementById('school-reg-number');
      const schoolLogo = document.getElementById('school-logo');
      const schoolDescription = document.getElementById('school-description');
      const schoolTimings = document.getElementById('school-timings');
      const officeTimings = document.getElementById('office-timings');
      const aboutTitle = document.getElementById('about-title');
      const aboutText = document.getElementById('about-text');
      const admissionInfoText = document.getElementById('admission-info-text');

      if (schoolName) contentData.school_info.name = schoolName.value.trim();
      if (schoolRegNumber) contentData.school_info.reg_number = schoolRegNumber.value.trim();
      if (schoolLogo) {
        contentData.school_info.logo_url = schoolLogo.value.trim();
        const sidebarLogo = document.querySelector('.admin-sidebar-logo');
        if (sidebarLogo) sidebarLogo.src = contentData.school_info.logo_url || '/uploads/media-1786798848541-655607772.png';
        const loginLogo = document.querySelector('.admin-login-logo');
        if (loginLogo) loginLogo.src = contentData.school_info.logo_url || '/uploads/media-1786798848541-655607772.png';
      }
      if (schoolDescription) contentData.school_info.description = schoolDescription.value.trim();
      if (schoolTimings) contentData.school_info.school_timings = schoolTimings.value.trim();
      if (officeTimings) contentData.school_info.office_timings = officeTimings.value.trim();
      if (aboutTitle) contentData.school_info.about_title = aboutTitle.value.trim();
      if (aboutText) contentData.school_info.about_text = aboutText.value.trim();
      if (admissionInfoText) contentData.school_info.admission_info = admissionInfoText.value.trim();

      // Director
      const dirName = document.getElementById('director-name');
      const dirPhone = document.getElementById('director-phone');
      const dirPhoto = document.getElementById('director-photo');
      const dirMessage = document.getElementById('director-message');

      if (dirName) contentData.director_info.name = dirName.value.trim();
      if (dirPhone) contentData.director_info.phone = dirPhone.value.trim();
      if (dirPhoto) contentData.director_info.photo_url = dirPhoto.value.trim();
      if (dirMessage) contentData.director_info.message = dirMessage.value.trim();

      // Principal
      const prinName = document.getElementById('principal-name');
      const prinPhone = document.getElementById('principal-phone');
      const prinPhoto = document.getElementById('principal-photo');
      const prinMessage = document.getElementById('principal-message');

      if (prinName) contentData.principal_info.name = prinName.value.trim();
      if (prinPhone) contentData.principal_info.phone = prinPhone.value.trim();
      if (prinPhoto) contentData.principal_info.photo_url = prinPhoto.value.trim();
      if (prinMessage) contentData.principal_info.message = prinMessage.value.trim();
      break;

    case 'hostel-facilities':
      const hostelDesc = document.getElementById('hostel-description');
      const hostelBoys = document.getElementById('hostel-boys');
      const hostelGirls = document.getElementById('hostel-girls');
      const hostelImg = document.getElementById('hostel-image');
      const hostelBullets = document.getElementById('hostel-bullets');

      if (hostelDesc) contentData.hostel_info.description = hostelDesc.value.trim();
      if (hostelBoys) contentData.hostel_info.boys_hostel = hostelBoys.value.trim();
      if (hostelGirls) contentData.hostel_info.girls_hostel = hostelGirls.value.trim();
      if (hostelImg) contentData.hostel_info.image_url = hostelImg.value.trim();
      if (hostelBullets) {
        contentData.hostel_info.bullets = hostelBullets.value.split('\n')
          .map(line => line.trim())
          .filter(line => line !== '');
      }
      break;

    case 'social-settings':
      const socialInsta = document.getElementById('social-instagram');
      const socialFb = document.getElementById('social-facebook');
      const socialYt = document.getElementById('social-youtube');
      const socialWa = document.getElementById('social-whatsapp');
      const contactAddr = document.getElementById('contact-address');
      const contactPh = document.getElementById('contact-phone');
      const contactEmail = document.getElementById('contact-email');
      const contactMap = document.getElementById('contact-map');

      if (socialInsta) contentData.social_media.instagram = socialInsta.value.trim();
      if (socialFb) contentData.social_media.facebook = socialFb.value.trim();
      if (socialYt) contentData.social_media.youtube = socialYt.value.trim();
      if (socialWa) {
        contentData.social_media.whatsapp = socialWa.value.trim();
        contentData.contact_settings.whatsapp = socialWa.value.trim();
      }
      if (contactAddr) contentData.contact_settings.address = contactAddr.value.trim();
      if (contactPh) contentData.contact_settings.phone = contactPh.value.trim();
      if (contactEmail) contentData.contact_settings.email = contactEmail.value.trim();
      if (contactMap) contentData.contact_settings.google_maps_embed = contactMap.value.trim();
      break;
  }
}

function switchTab(tabId) {
  syncActiveTabToState();
  activeTab = tabId;

  // Update Nav highlighting
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    }
  });

  // Update Header Title
  const titles = {
    'dashboard': 'Dashboard Statistics',
    'homepage': 'Homepage Content Settings',
    'school-info': 'School & Leadership Info',
    'gallery': 'Gallery Content Management',
    'notices': 'School Notice Board Manager',
    'events': 'Events & Assemblies Scheduler',
    'hostel-facilities': 'Hostel & Facilities Settings',
    'enquiries': 'Online Admission Enquiries',
    'messages': 'General Contact Messages',
    'media-library': 'Media Library Assets',
    'social-settings': 'Social Links & Contact Channels'
  };
  document.getElementById('page-title').textContent = titles[tabId] || 'Admin Dashboard';

  // Show Active Tab Content Panel
  const contents = document.querySelectorAll('.content-wrapper .tab-content');
  contents.forEach(panel => panel.classList.remove('active'));
  document.getElementById(`tab-${tabId}`).classList.add('active');

  renderActiveTab();
}

// Render dynamic elements depending on active tab
function renderActiveTab() {
  if (!contentData) return;

  switch (activeTab) {
    case 'dashboard':
      renderDashboardOverview();
      break;
    case 'homepage':
      populateHomepageSettings();
      break;
    case 'school-info':
      populateSchoolInfo();
      break;
    case 'faculty':
      renderFacultyTab();
      break;
    case 'gallery':
      renderGalleryTab();
      break;
    case 'notices':
      renderNoticesTab();
      break;
    case 'events':
      renderEventsTab();
      break;
    case 'hostel-facilities':
      renderHostelAndFacilitiesTab();
      break;
    case 'enquiries':
      renderEnquiriesTab();
      break;
    case 'messages':
      renderMessagesTab();
      break;
    case 'media-library':
      renderMediaLibraryTab();
      break;
    case 'social-settings':
      populateSocialSettings();
      break;
  }
}

// ==========================================
// 3. TAB RENDERING LOGIC
// ==========================================

// --- DASHBOARD OVERVIEW ---
function renderDashboardOverview() {
  if (!contentData || !submissionData) return;

  // Enquiries counts
  const enquiries = submissionData.enquiries || [];
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const followupEnquiries = enquiries.filter(e => e.status === 'follow-up').length;
  const convertedEnquiries = enquiries.filter(e => e.status === 'converted' || e.status === 'completed').length;
  const closedEnquiries = enquiries.filter(e => e.status === 'closed').length;

  const statEnqCount = document.getElementById('stat-enquiries-count');
  if (statEnqCount) statEnqCount.textContent = totalEnquiries;

  const statNewEnqCount = document.getElementById('stat-new-enquiries-count');
  if (statNewEnqCount) statNewEnqCount.textContent = newEnquiries;

  const statFollowupCount = document.getElementById('stat-followup-count');
  if (statFollowupCount) statFollowupCount.textContent = followupEnquiries;

  const statConvertedCount = document.getElementById('stat-converted-count');
  if (statConvertedCount) statConvertedCount.textContent = convertedEnquiries;

  const statClosedCount = document.getElementById('stat-closed-count');
  if (statClosedCount) statClosedCount.textContent = closedEnquiries;

  // Messages counts
  const messages = submissionData.messages || [];
  const unreadMessagesCount = messages.filter(m => !m.is_read || m.status === 'new').length;
  const statMessagesCount = document.getElementById('stat-messages-count');
  if (statMessagesCount) statMessagesCount.textContent = messages.length;
  const statMessagesUnread = document.getElementById('stat-messages-unread');
  if (statMessagesUnread) statMessagesUnread.textContent = `${unreadMessagesCount} unread`;

  // Events count (Upcoming vs Past)
  const events = contentData.events || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter(ev => {
    if (ev.is_published === false) return false;
    const d = new Date(ev.date);
    d.setHours(0, 0, 0, 0);
    return isNaN(d.getTime()) || d >= today;
  });
  const statEventsCount = document.getElementById('stat-events-count');
  if (statEventsCount) statEventsCount.textContent = events.length;
  const statEventsDesc = document.getElementById('stat-events-desc');
  if (statEventsDesc) statEventsDesc.textContent = `${upcomingEvents.length} upcoming`;

  // Notices count
  const notices = contentData.notices || [];
  const publishedNotices = notices.filter(n => n.is_published !== false && !n.is_archived);
  const statNoticesCount = document.getElementById('stat-notices-count');
  if (statNoticesCount) statNoticesCount.textContent = notices.length;
  const statNoticesDesc = document.getElementById('stat-notices-desc');
  if (statNoticesDesc) statNoticesDesc.textContent = `${publishedNotices.length} published`;

  // Alert Banner
  const alertBanner = document.getElementById('admin-alert-banner');
  const alertText = document.getElementById('admin-alert-text');
  if (alertBanner) {
    if (newEnquiries > 0 || unreadMessagesCount > 0) {
      alertBanner.style.display = 'flex';
      let msg = 'Attention: ';
      if (newEnquiries > 0 && unreadMessagesCount > 0) {
        msg += `You have ${newEnquiries} new admission ${newEnquiries === 1 ? 'enquiry' : 'enquiries'} and ${unreadMessagesCount} unread ${unreadMessagesCount === 1 ? 'message' : 'messages'} waiting for review.`;
      } else if (newEnquiries > 0) {
        msg += `You have ${newEnquiries} new admission ${newEnquiries === 1 ? 'enquiry' : 'enquiries'} waiting for review.`;
      } else {
        msg += `You have ${unreadMessagesCount} unread contact ${unreadMessagesCount === 1 ? 'message' : 'messages'} waiting for review.`;
      }
      if (alertText) alertText.textContent = msg;
    } else {
      alertBanner.style.display = 'none';
    }
  }

  // Render Recent Admission Enquiries
  const recentEnqContainer = document.getElementById('dashboard-recent-enquiries');
  if (recentEnqContainer) {
    recentEnqContainer.innerHTML = '';
    const recentEnquiries = [...enquiries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    if (recentEnquiries.length === 0) {
      recentEnqContainer.innerHTML = '<p class="empty-list-text">No admission enquiries received yet.</p>';
    } else {
      recentEnquiries.forEach(item => {
        const timeStr = formatRelativeTime(item.date);
        const div = document.createElement('div');
        div.className = 'submission-item';
        div.style.cursor = 'pointer';
        div.innerHTML = `
          <span class="status-badge ${item.status || 'new'}">${item.status || 'new'}</span>
          <div class="sub-info">
            <div class="sub-name">${escapeHtml(item.student_name)} (Parent: ${escapeHtml(item.parent_name)})</div>
            <div class="sub-details">Applying for ${item.class_apply.replace('class-', 'Class ').toUpperCase()} | Phone: ${item.phone}</div>
          </div>
          <div class="sub-date">${timeStr}</div>
        `;
        div.addEventListener('click', () => openEnquiryDetailsModal(item.id));
        recentEnqContainer.appendChild(div);
      });
    }
  }

  // Render Recent Contact Messages
  const container = document.getElementById('dashboard-recent-submissions');
  if (container) {
    container.innerHTML = '';
    const recentMessages = [...messages].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    if (recentMessages.length === 0) {
      container.innerHTML = '<p class="empty-list-text">No recent contact messages.</p>';
    } else {
      recentMessages.forEach(item => {
        const timeStr = formatRelativeTime(item.date);
        const div = document.createElement('div');
        div.className = 'submission-item';
        div.style.cursor = 'pointer';
        div.innerHTML = `
          <span class="sub-badge message">${item.is_read ? 'Read' : 'New'}</span>
          <div class="sub-info">
            <div class="sub-name">${escapeHtml(item.name)}</div>
            <div class="sub-details">${escapeHtml(item.subject || 'General message')}</div>
          </div>
          <div class="sub-date">${timeStr}</div>
        `;
        div.addEventListener('click', () => openMessageDetailsModal(item.id));
        container.appendChild(div);
      });
    }
  }
}

// --- HOMEPAGE SETTINGS ---
function populateHomepageSettings() {
  const hero = contentData.hero_section;
  document.getElementById('hero-badge').value = hero.badge || '';
  document.getElementById('hero-title').value = hero.title || '';
  document.getElementById('hero-tagline').value = hero.tagline || '';
  document.getElementById('hero-description').value = hero.description || '';
  document.getElementById('hero-btn1-text').value = hero.button1_text || 'Apply for Admission';
  document.getElementById('hero-btn2-text').value = hero.button2_text || 'Admission Enquiry';
  document.getElementById('hero-image').value = hero.image_url || '';
  document.getElementById('homepage-show-leaders').checked = contentData.school_info.show_leaders !== false;

  showPreviewIfValueExists('hero-image', 'hero-image-preview');
}

async function saveHomepageSettings(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setButtonLoading(btn, 'Saving...');

  syncActiveTabToState();

  await saveContentData('Homepage content saved successfully!', () => {
    resetButtonLoading(btn);
  });
}

// --- SCHOOL INFO ---
function populateSchoolInfo() {
  const info = contentData.school_info;
  const dir = contentData.director_info;
  const prin = contentData.principal_info;

  // School
  document.getElementById('school-name').value = info.name || '';
  document.getElementById('school-reg-number').value = info.reg_number || '';
  document.getElementById('school-logo').value = info.logo_url || '';
  document.getElementById('school-description').value = info.description || '';
  const schoolTimingsEl = document.getElementById('school-timings');
  if (schoolTimingsEl) schoolTimingsEl.value = info.school_timings || 'Mon – Sat: 8:00 AM – 2:00 PM';
  const officeTimingsEl = document.getElementById('office-timings');
  if (officeTimingsEl) officeTimingsEl.value = info.office_timings || 'Mon – Sat: 8:00 AM – 3:30 PM';
  document.getElementById('about-title').value = info.about_title || '';
  document.getElementById('about-text').value = info.about_text || '';
  document.getElementById('admission-info-text').value = info.admission_info || '';

  // Director
  document.getElementById('director-name').value = dir.name || '';
  document.getElementById('director-phone').value = dir.phone || '';
  document.getElementById('director-photo').value = dir.photo_url || '';
  document.getElementById('director-message').value = dir.message || '';

  // Principal
  document.getElementById('principal-name').value = prin.name || '';
  document.getElementById('principal-phone').value = prin.phone || '';
  document.getElementById('principal-photo').value = prin.photo_url || '';
  document.getElementById('principal-message').value = prin.message || '';

  showPreviewIfValueExists('school-logo', 'school-logo-preview');
  showPreviewIfValueExists('director-photo', 'director-photo-preview');
  showPreviewIfValueExists('principal-photo', 'principal-photo-preview');
}

async function saveSchoolInfo(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setButtonLoading(btn, 'Saving...');

  syncActiveTabToState();

  await saveContentData('School metadata and leadership messages saved successfully!', () => {
    resetButtonLoading(btn);
  });
}

// --- FACULTY & STAFF MANAGEMENT ---
function renderFacultyTab() {
  const tbody = document.getElementById('admin-faculty-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!contentData.faculty_staff) {
    contentData.faculty_staff = [];
  }

  // Sort by order ascending
  const faculty = [...contentData.faculty_staff].sort((a, b) => (a.order || 0) - (b.order || 0));

  const filterCatEl = document.getElementById('filter-faculty-category');
  const searchEl = document.getElementById('search-faculty');
  const filterCat = filterCatEl ? filterCatEl.value : 'all';
  const searchQuery = searchEl ? searchEl.value.toLowerCase().trim() : '';

  const filtered = faculty.filter(f => {
    const matchesCategory = filterCat === 'all' || f.category === filterCat;
    const matchesSearch = !searchQuery || 
      (f.name && f.name.toLowerCase().includes(searchQuery)) ||
      (f.designation && f.designation.toLowerCase().includes(searchQuery)) ||
      (f.subject && f.subject.toLowerCase().includes(searchQuery)) ||
      (f.qualification && f.qualification.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="table-empty" style="text-align: center; padding: 30px; color: var(--text-light);">
          No faculty or staff profiles found matching criteria. Click "Add Staff Profile" to add one.
        </td>
      </tr>
    `;
    return;
  }

  const categoryLabels = {
    'leadership': 'School Leadership',
    'teaching': 'Teaching Faculty',
    'admin': 'Administrative Staff',
    'support': 'Support Staff'
  };

  const categoryBadges = {
    'leadership': 'background:#fef3c7; color:#92400e; border:1px solid #fde68a;',
    'teaching': 'background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;',
    'admin': 'background:#f3e8ff; color:#6b21a8; border:1px solid #e9d5ff;',
    'support': 'background:#dcfce7; color:#15803d; border:1px solid #bbf7d0;'
  };

  filtered.forEach((staff, index) => {
    const tr = document.createElement('tr');
    tr.className = staff.is_active === false ? 'row-inactive' : '';
    if (staff.is_active === false) {
      tr.style.opacity = '0.65';
    }

    const catBadgeStyle = categoryBadges[staff.category] || 'background:#f1f5f9; color:#475569;';
    const catLabel = categoryLabels[staff.category] || staff.category || 'General';

    const photoMarkup = staff.photo_url ?
      `<img src="${staff.photo_url}" alt="${escapeHtml(staff.name)}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 50%; border: 2px solid var(--border-color);">` :
      `<div style="width: 44px; height: 44px; border-radius: 50%; background: #e2e8f0; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px;">
        ${escapeHtml((staff.name || 'S').charAt(0))}
      </div>`;

    tr.innerHTML = `
      <td style="text-align: center;">
        <div style="display: flex; flex-direction: column; gap: 3px; align-items: center;">
          <button type="button" class="btn-icon-subtle" onclick="moveFacultyMember('${staff.id}', -1)" title="Move Up" style="font-size: 11px; padding: 2px 5px; cursor: pointer; border-radius: 3px; background: #f1f5f9; border: 1px solid #cbd5e1;">▲</button>
          <span style="font-weight: 600; font-size: 12px; color: var(--text-dark);">${staff.order || (index + 1)}</span>
          <button type="button" class="btn-icon-subtle" onclick="moveFacultyMember('${staff.id}', 1)" title="Move Down" style="font-size: 11px; padding: 2px 5px; cursor: pointer; border-radius: 3px; background: #f1f5f9; border: 1px solid #cbd5e1;">▼</button>
        </div>
      </td>
      <td style="text-align: center;">${photoMarkup}</td>
      <td>
        <div style="font-weight: 600; color: var(--text-dark); font-size: 14px;">${escapeHtml(staff.name)}</div>
        <div style="font-size: 12.5px; color: var(--text-light); margin-top: 2px;">${escapeHtml(staff.designation || 'Staff')}</div>
      </td>
      <td>
        <span style="display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; ${catBadgeStyle}">
          ${escapeHtml(catLabel)}
        </span>
      </td>
      <td>
        <span style="font-weight: 500; font-size: 13px; color: var(--text-dark);">${escapeHtml(staff.subject || '—')}</span>
      </td>
      <td>
        <div style="font-size: 12.5px; font-weight: 500; color: var(--text-dark);">${escapeHtml(staff.qualification || '—')}</div>
        ${staff.experience ? `<div style="font-size: 11px; color: #16a34a; font-weight: 600; margin-top: 2px;">★ ${escapeHtml(staff.experience)} Exp</div>` : ''}
      </td>
      <td style="text-align: center;">
        <button type="button" onclick="toggleFacultyStatus('${staff.id}')" style="cursor: pointer; border: none; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; transition: all 0.2s ease; ${staff.is_active !== false ? 'background: #dcfce7; color: #15803d;' : 'background: #fee2e2; color: #b91c1c;'}">
          ${staff.is_active !== false ? '✓ Active' : '✕ Inactive'}
        </button>
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 6px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="openEditFacultyModal('${staff.id}')" style="padding: 4px 10px; font-size: 12px;">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteFacultyMember('${staff.id}')" style="padding: 4px 10px; font-size: 12px;">Delete</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function filterFacultyTable() {
  renderFacultyTab();
}

function openAddFacultyModal() {
  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Add Faculty & Staff Profile';

  const defaultOrder = (contentData.faculty_staff || []).length + 1;

  body.innerHTML = `
    <form id="modal-faculty-form">
      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-name">Full Name *</label>
          <input type="text" id="modal-staff-name" required placeholder="e.g. Md Danish Raza">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-category">Staff Category *</label>
          <select id="modal-staff-category" required>
            <option value="teaching" selected>Teaching Faculty</option>
            <option value="leadership">School Leadership</option>
            <option value="admin">Administrative Staff</option>
            <option value="support">Support Staff</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-designation">Designation *</label>
          <input type="text" id="modal-staff-designation" required placeholder="e.g. Mathematics Teacher">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-subject">Subject / Department *</label>
          <input type="text" id="modal-staff-subject" required placeholder="e.g. Mathematics / Urdu / Science">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-qualification">Educational Qualification *</label>
          <input type="text" id="modal-staff-qualification" required placeholder="e.g. M.Sc. Mathematics, B.Ed.">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-experience">Teaching Experience (Optional)</label>
          <input type="text" id="modal-staff-experience" placeholder="e.g. 5+ Years">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-12">
          <label for="modal-staff-bio">Short Introduction / Bio</label>
          <textarea id="modal-staff-bio" rows="3" placeholder="Brief introduction about teaching philosophy, expertise, and contribution to student development."></textarea>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-8">
          <label for="modal-staff-photo">Profile Photo URL (Select from Library or Upload)</label>
          <div class="input-select-media-wrapper">
            <input type="text" id="modal-staff-photo" placeholder="/uploads/staff.jpg">
            <button type="button" class="btn btn-secondary btn-select-media" data-target-input="modal-staff-photo">Choose Media</button>
          </div>
          <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
            <input type="file" id="modal-staff-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'modal-staff-photo', 'modal-staff-photo-preview')">
            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-staff-file').click()">📤 Upload Photo</button>
            <div id="modal-staff-photo-preview-container" style="display: none; align-items: center; gap: 8px;">
              <img id="modal-staff-photo-preview" src="" style="max-height: 45px; border-radius: 50%; border: 1px solid var(--border-color);">
              <span style="font-size: 11px; color: var(--text-light);">Uploaded!</span>
            </div>
          </div>
        </div>
        <div class="form-group col-4">
          <label for="modal-staff-order">Display Order</label>
          <input type="number" id="modal-staff-order" value="${defaultOrder}" min="1" step="1">
        </div>
      </div>

      <div class="form-row" style="margin-top: 10px;">
        <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="modal-staff-active" checked>
          <span>Active Profile (Visible on public website)</span>
        </label>
      </div>

      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="btn-save-faculty">Add Staff Profile</button>
      </div>
    </form>
  `;

  bindModalMediaSelect();

  document.getElementById('modal-faculty-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('btn-save-faculty');
    setButtonLoading(submitBtn, 'Adding Profile...');

    if (!contentData.faculty_staff) contentData.faculty_staff = [];

    const newStaff = {
      id: 'staff-' + Date.now(),
      name: document.getElementById('modal-staff-name').value.trim(),
      category: document.getElementById('modal-staff-category').value,
      designation: document.getElementById('modal-staff-designation').value.trim(),
      subject: document.getElementById('modal-staff-subject').value.trim(),
      qualification: document.getElementById('modal-staff-qualification').value.trim(),
      experience: document.getElementById('modal-staff-experience').value.trim(),
      bio: document.getElementById('modal-staff-bio').value.trim(),
      photo_url: document.getElementById('modal-staff-photo').value.trim(),
      order: parseInt(document.getElementById('modal-staff-order').value) || (contentData.faculty_staff.length + 1),
      is_active: document.getElementById('modal-staff-active').checked
    };

    contentData.faculty_staff.push(newStaff);

    await saveContentData('Faculty profile added successfully!', () => {
      closeAdminModal();
      renderFacultyTab();
      renderDashboardOverview();
    });
  });

  openAdminModal();
}

function openEditFacultyModal(id) {
  if (!contentData.faculty_staff) return;
  const staff = contentData.faculty_staff.find(s => s.id === id);
  if (!staff) return;

  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Edit Faculty & Staff Profile';

  body.innerHTML = `
    <form id="modal-faculty-edit-form">
      <input type="hidden" id="modal-staff-id" value="${staff.id}">
      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-name">Full Name *</label>
          <input type="text" id="modal-staff-name" required value="${escapeHtml(staff.name)}">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-category">Staff Category *</label>
          <select id="modal-staff-category" required>
            <option value="teaching" ${staff.category === 'teaching' ? 'selected' : ''}>Teaching Faculty</option>
            <option value="leadership" ${staff.category === 'leadership' ? 'selected' : ''}>School Leadership</option>
            <option value="admin" ${staff.category === 'admin' ? 'selected' : ''}>Administrative Staff</option>
            <option value="support" ${staff.category === 'support' ? 'selected' : ''}>Support Staff</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-designation">Designation *</label>
          <input type="text" id="modal-staff-designation" required value="${escapeHtml(staff.designation || '')}">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-subject">Subject / Department *</label>
          <input type="text" id="modal-staff-subject" required value="${escapeHtml(staff.subject || '')}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-qualification">Educational Qualification *</label>
          <input type="text" id="modal-staff-qualification" required value="${escapeHtml(staff.qualification || '')}">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-experience">Teaching Experience (Optional)</label>
          <input type="text" id="modal-staff-experience" value="${escapeHtml(staff.experience || '')}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-12">
          <label for="modal-staff-bio">Short Introduction / Bio</label>
          <textarea id="modal-staff-bio" rows="3">${escapeHtml(staff.bio || '')}</textarea>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-8">
          <label for="modal-staff-photo">Profile Photo URL (Select from Library or Upload)</label>
          <div class="input-select-media-wrapper">
            <input type="text" id="modal-staff-photo" value="${escapeHtml(staff.photo_url || '')}">
            <button type="button" class="btn btn-secondary btn-select-media" data-target-input="modal-staff-photo">Choose Media</button>
          </div>
          <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
            <input type="file" id="modal-staff-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'modal-staff-photo', 'modal-staff-photo-preview')">
            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-staff-file').click()">📤 Upload Photo</button>
            <div id="modal-staff-photo-preview-container" style="display: ${staff.photo_url ? 'flex' : 'none'}; align-items: center; gap: 8px;">
              <img id="modal-staff-photo-preview" src="${escapeHtml(staff.photo_url || '')}" style="max-height: 45px; border-radius: 50%; border: 1px solid var(--border-color);">
              <span style="font-size: 11px; color: var(--text-light);">Photo Loaded</span>
            </div>
          </div>
        </div>
        <div class="form-group col-4">
          <label for="modal-staff-order">Display Order</label>
          <input type="number" id="modal-staff-order" value="${staff.order || 1}" min="1" step="1">
        </div>
      </div>

      <div class="form-row" style="margin-top: 10px;">
        <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="modal-staff-active" ${staff.is_active !== false ? 'checked' : ''}>
          <span>Active Profile (Visible on public website)</span>
        </label>
      </div>

      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="btn-save-faculty">Save Changes</button>
      </div>
    </form>
  `;

  bindModalMediaSelect();

  document.getElementById('modal-faculty-edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('btn-save-faculty');
    setButtonLoading(submitBtn, 'Saving Changes...');

    staff.name = document.getElementById('modal-staff-name').value.trim();
    staff.category = document.getElementById('modal-staff-category').value;
    staff.designation = document.getElementById('modal-staff-designation').value.trim();
    staff.subject = document.getElementById('modal-staff-subject').value.trim();
    staff.qualification = document.getElementById('modal-staff-qualification').value.trim();
    staff.experience = document.getElementById('modal-staff-experience').value.trim();
    staff.bio = document.getElementById('modal-staff-bio').value.trim();
    staff.photo_url = document.getElementById('modal-staff-photo').value.trim();
    staff.order = parseInt(document.getElementById('modal-staff-order').value) || 1;
    staff.is_active = document.getElementById('modal-staff-active').checked;

    await saveContentData('Faculty profile updated successfully!', () => {
      closeAdminModal();
      renderFacultyTab();
      renderDashboardOverview();
    });
  });

  openAdminModal();
}

function deleteFacultyMember(id) {
  const staff = (contentData.faculty_staff || []).find(s => s.id === id);
  if (!staff) return;

  showConfirm(`Are you sure you want to delete profile for "${staff.name}" (${staff.designation})?`, async () => {
    contentData.faculty_staff = contentData.faculty_staff.filter(s => s.id !== id);
    await saveContentData('Faculty profile deleted successfully!', () => {
      renderFacultyTab();
      renderDashboardOverview();
    });
  });
}

function toggleFacultyStatus(id) {
  const staff = (contentData.faculty_staff || []).find(s => s.id === id);
  if (!staff) return;

  staff.is_active = staff.is_active === false ? true : false;
  saveContentData(
    staff.is_active ? `Activated profile for ${staff.name}` : `Deactivated profile for ${staff.name}`,
    () => {
      renderFacultyTab();
      renderDashboardOverview();
    }
  );
}

function moveFacultyMember(id, direction) {
  const list = contentData.faculty_staff || [];
  const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  const idx = sorted.findIndex(s => s.id === id);
  if (idx === -1) return;

  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= sorted.length) return;

  const currentItem = sorted[idx];
  const targetItem = sorted[targetIdx];

  // Swap orders
  const currentOrder = currentItem.order || (idx + 1);
  const targetOrder = targetItem.order || (targetIdx + 1);

  currentItem.order = targetOrder === currentOrder ? (direction > 0 ? currentOrder + 1 : currentOrder - 1) : targetOrder;
  targetItem.order = currentOrder;

  // Re-normalize all orders
  sorted.sort((a, b) => (a.order || 0) - (b.order || 0));
  sorted.forEach((item, i) => {
    item.order = i + 1;
  });

  saveContentData('Faculty order updated successfully!', () => {
    renderFacultyTab();
  });
}

// --- GALLERY MANAGEMENT ---
function renderGalleryTab() {
  const container = document.getElementById('admin-gallery-grid');
  container.innerHTML = '';

  const filter = document.getElementById('filter-gallery-category').value;
  const search = document.getElementById('search-gallery').value.toLowerCase().trim();
  
  const items = contentData.gallery.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(search) || (item.description || '').toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  }).sort((a, b) => a.order - b.order);

  if (items.length === 0) {
    container.innerHTML = '<p class="empty-list-text">No gallery items found matching filters.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'admin-gallery-card';
    card.setAttribute('data-id', item.id);

    const isPublished = item.is_published !== false;
    const statusText = isPublished ? 'Published' : 'Draft';
    const statusClass = isPublished ? 'published' : 'draft';

    let mediaHtml = '';
    if (item.type === 'video') {
      if (item.thumbnail_url) {
        mediaHtml = `<img src="${item.thumbnail_url}" alt="${escapeHtml(item.title)}">`;
      } else {
        mediaHtml = `
          <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none">
            <rect width="100%" height="100%" fill="#0d233a"/>
            <polygon points="175,110 235,140 175,170" fill="#c5a059"/>
            <circle cx="200" cy="140" r="45" stroke="#c5a059" stroke-width="2" />
          </svg>
        `;
      }
    } else {
      if (item.url) {
        mediaHtml = `<img src="${item.url}" alt="${escapeHtml(item.title)}">`;
      } else {
        mediaHtml = `
          <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none">
            <rect width="100%" height="100%" fill="#1b3a57"/>
            <text x="200" y="150" font-family="'Outfit', sans-serif" font-weight="bold" font-size="14" fill="#ffffff" text-anchor="middle">No Image Chosen</text>
          </svg>
        `;
      }
    }

    card.innerHTML = `
      <div class="gallery-card-media">
        ${mediaHtml}
        <div class="gallery-card-badges">
          <span class="gallery-card-badge">${item.category}</span>
          <span class="status-badge ${statusClass}">${statusText}</span>
          ${item.is_featured ? '<span class="gallery-card-badge featured">Featured</span>' : ''}
        </div>
      </div>
      <div class="gallery-card-info">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description || '')}</p>
      </div>
      <div class="gallery-card-actions">
        <div class="reorder-btns">
          <button class="btn btn-secondary btn-sm" onclick="moveGalleryItem('${item.id}', -1)" title="Move Up">↑</button>
          <button class="btn btn-secondary btn-sm" onclick="moveGalleryItem('${item.id}', 1)" title="Move Down">↓</button>
        </div>
        <div class="edit-btns">
          <button class="btn btn-secondary btn-sm" onclick="openEditGalleryModal('${item.id}')" title="Edit">✏️</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleGalleryPublish('${item.id}')" title="${isPublished ? 'Unpublish' : 'Publish'}">${isPublished ? '👁️' : '🕶️'}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteGalleryItem('${item.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function openAddGalleryModal() {
  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Add Gallery Item';
  
  body.innerHTML = `
    <form id="modal-gallery-form">
      <div class="form-group">
        <label for="gal-type">Media Type</label>
        <select id="gal-type" onchange="toggleGalleryTypeForm(this.value)" required>
          <option value="image">Photo</option>
          <option value="video">YouTube Video</option>
        </select>
      </div>
      
      <div class="form-group" id="group-gal-image">
        <label for="gal-image-url">Photo Image URL</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="gal-image-url" placeholder="Upload photo or select from media library">
          <button type="button" class="btn btn-secondary btn-select-media" data-target-input="gal-image-url">Choose Media</button>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
          <input type="file" id="gal-image-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'gal-image-url', 'gal-image-preview')">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('gal-image-file').click()">📤 Upload File</button>
          <div id="gal-image-preview-container" style="display: none; align-items: center; gap: 8px;">
            <img id="gal-image-preview" src="" style="max-height: 50px; border-radius: 4px; border: 1px solid var(--border-color);">
            <span style="font-size: 11px; color: var(--text-light);">Uploaded!</span>
          </div>
        </div>
      </div>
      
      <div class="form-group" id="group-gal-video" style="display: none;">
        <label for="gal-video-url">YouTube Embed URL</label>
        <input type="url" id="gal-video-url" placeholder="https://www.youtube.com/embed/...">
        <span class="text-muted" style="font-size: 11px; margin-top: 4px; display: block;">Tip: Copy the YouTube 'embed' iframe source url.</span>
      </div>

      <div class="form-group" id="group-gal-video-thumbnail" style="display: none;">
        <label for="gal-video-thumbnail">Video Thumbnail Image (Optional)</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="gal-video-thumbnail" placeholder="Select thumbnail image">
          <button type="button" class="btn btn-secondary btn-select-media" data-target-input="gal-video-thumbnail">Choose Media</button>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
          <input type="file" id="gal-video-thumbnail-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'gal-video-thumbnail', 'gal-video-thumbnail-preview')">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('gal-video-thumbnail-file').click()">📤 Upload Thumbnail</button>
          <div id="gal-video-thumbnail-preview-container" style="display: none; align-items: center; gap: 8px;">
            <img id="gal-video-thumbnail-preview" src="" style="max-height: 50px; border-radius: 4px; border: 1px solid var(--border-color);">
            <span style="font-size: 11px; color: var(--text-light);">Uploaded!</span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="gal-category">Category</label>
        <select id="gal-category" required>
          <option value="classroom">Classroom & Learning</option>
          <option value="hostel">Hostel Life</option>
          <option value="events">School Events</option>
          <option value="videos">Videos & Reels</option>
        </select>
      </div>
      <div class="form-group">
        <label for="gal-title">Title / Caption</label>
        <input type="text" id="gal-title" required>
      </div>
      <div class="form-group">
        <label for="gal-desc">Short Description</label>
        <textarea id="gal-desc" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="gal-featured"> Featured Gallery Item (Visible in preview blocks)
        </label>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="gal-published" checked> Publish immediately
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-gallery-submit-btn">Add Gallery Item</button>
      </div>
    </form>
  `;

  document.getElementById('modal-gallery-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('gal-type').value;
    const url = type === 'image' ? document.getElementById('gal-image-url').value.trim() : document.getElementById('gal-video-url').value.trim();
    
    const submitBtn = document.getElementById('modal-gallery-submit-btn');
    setButtonLoading(submitBtn, 'Saving...');

    const newItem = {
      id: 'gal-' + Date.now(),
      type: type,
      category: document.getElementById('gal-category').value,
      url: url,
      thumbnail_url: type === 'video' ? document.getElementById('gal-video-thumbnail').value.trim() : '',
      title: document.getElementById('gal-title').value.trim(),
      description: document.getElementById('gal-desc').value.trim(),
      is_featured: document.getElementById('gal-featured').checked,
      is_published: document.getElementById('gal-published').checked,
      order: contentData.gallery.length + 1
    };

    contentData.gallery.push(newItem);
    await saveContentData('Gallery item added successfully!', () => {
      closeAdminModal();
      renderGalleryTab();
    });
  });

  openAdminModal();
}

function toggleGalleryTypeForm(val) {
  if (val === 'video') {
    document.getElementById('group-gal-image').style.display = 'none';
    document.getElementById('group-gal-video').style.display = 'block';
    document.getElementById('group-gal-video-thumbnail').style.display = 'block';
    document.getElementById('gal-category').value = 'videos';
  } else {
    document.getElementById('group-gal-image').style.display = 'block';
    document.getElementById('group-gal-video').style.display = 'none';
    document.getElementById('group-gal-video-thumbnail').style.display = 'none';
    document.getElementById('gal-category').value = 'classroom';
  }
}

function openEditGalleryModal(id) {
  const item = contentData.gallery.find(g => g.id === id);
  if (!item) return;

  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Edit Gallery Item';

  body.innerHTML = `
    <form id="modal-gallery-form">
      <input type="hidden" id="gal-id" value="${item.id}">
      <div class="form-group">
        <label for="gal-type">Media Type</label>
        <select id="gal-type" onchange="toggleGalleryTypeForm(this.value)" required disabled>
          <option value="image" ${item.type === 'image' ? 'selected' : ''}>Photo</option>
          <option value="video" ${item.type === 'video' ? 'selected' : ''}>YouTube Video</option>
        </select>
      </div>
      <div class="form-group" id="group-gal-image" style="display: ${item.type === 'image' ? 'block' : 'none'};">
        <label for="gal-image-url">Photo Image URL</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="gal-image-url" value="${item.type === 'image' ? item.url : ''}">
          <button type="button" class="btn btn-secondary btn-select-media" data-target-input="gal-image-url">Choose Media</button>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
          <input type="file" id="gal-image-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'gal-image-url', 'gal-image-preview')">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('gal-image-file').click()">📤 Upload File</button>
          <div id="gal-image-preview-container" style="display: none; align-items: center; gap: 8px;">
            <img id="gal-image-preview" src="" style="max-height: 50px; border-radius: 4px; border: 1px solid var(--border-color);">
            <span style="font-size: 11px; color: var(--text-light);">Uploaded!</span>
          </div>
        </div>
      </div>
      <div class="form-group" id="group-gal-video" style="display: ${item.type === 'video' ? 'block' : 'none'};">
        <label for="gal-video-url">YouTube Embed URL</label>
        <input type="url" id="gal-video-url" value="${item.type === 'video' ? item.url : ''}">
        <span class="text-muted" style="font-size: 11px; margin-top: 4px; display: block;">Tip: Copy the YouTube 'embed' iframe source url.</span>
      </div>
      <div class="form-group" id="group-gal-video-thumbnail" style="display: ${item.type === 'video' ? 'block' : 'none'};">
        <label for="gal-video-thumbnail">Video Thumbnail Image (Optional)</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="gal-video-thumbnail" value="${item.thumbnail_url || ''}">
          <button type="button" class="btn btn-secondary btn-select-media" data-target-input="gal-video-thumbnail">Choose Media</button>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
          <input type="file" id="gal-video-thumbnail-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'gal-video-thumbnail', 'gal-video-thumbnail-preview')">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('gal-video-thumbnail-file').click()">📤 Upload Thumbnail</button>
          <div id="gal-video-thumbnail-preview-container" style="display: none; align-items: center; gap: 8px;">
            <img id="gal-video-thumbnail-preview" src="" style="max-height: 50px; border-radius: 4px; border: 1px solid var(--border-color);">
            <span style="font-size: 11px; color: var(--text-light);">Uploaded!</span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="gal-category">Category</label>
        <select id="gal-category" required>
          <option value="classroom" ${item.category === 'classroom' ? 'selected' : ''}>Classroom & Learning</option>
          <option value="hostel" ${item.category === 'hostel' ? 'selected' : ''}>Hostel Life</option>
          <option value="events" ${item.category === 'events' ? 'selected' : ''}>School Events</option>
          <option value="videos" ${item.category === 'videos' ? 'selected' : ''}>Videos & Reels</option>
        </select>
      </div>
      <div class="form-group">
        <label for="gal-title">Title / Caption</label>
        <input type="text" id="gal-title" value="${escapeHtml(item.title)}" required>
      </div>
      <div class="form-group">
        <label for="gal-desc">Short Description</label>
        <textarea id="gal-desc" rows="3">${escapeHtml(item.description || '')}</textarea>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="gal-featured" ${item.is_featured ? 'checked' : ''}> Featured Gallery Item (Visible in preview blocks)
        </label>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="gal-published" ${item.is_published !== false ? 'checked' : ''}> Published status
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-gallery-edit-btn">Update Gallery Item</button>
      </div>
    </form>
  `;

  if (item.type === 'image') {
    showPreviewIfValueExists('gal-image-url', 'gal-image-preview');
  } else {
    showPreviewIfValueExists('gal-video-thumbnail', 'gal-video-thumbnail-preview');
  }

  document.getElementById('modal-gallery-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = item.type === 'image' ? document.getElementById('gal-image-url').value.trim() : document.getElementById('gal-video-url').value.trim();
    
    const submitBtn = document.getElementById('modal-gallery-edit-btn');
    setButtonLoading(submitBtn, 'Saving...');

    item.url = url;
    item.thumbnail_url = item.type === 'video' ? document.getElementById('gal-video-thumbnail').value.trim() : '';
    item.category = document.getElementById('gal-category').value;
    item.title = document.getElementById('gal-title').value.trim();
    item.description = document.getElementById('gal-desc').value.trim();
    item.is_featured = document.getElementById('gal-featured').checked;
    item.is_published = document.getElementById('gal-published').checked;

    await saveContentData('Gallery item updated successfully!', () => {
      closeAdminModal();
      renderGalleryTab();
    });
  });

  openAdminModal();
}

function openCategoryManagerModal() {
  showToast('Category management features are pre-configured. Use the category dropdowns to filter content.', 'info');
}

function openUploadGalleryModal() {
  openAddGalleryModal();
}

function toggleGalleryPublish(id) {
  const item = contentData.gallery.find(g => g.id === id);
  if (!item) return;

  item.is_published = item.is_published === false ? true : false;
  saveContentData(
    item.is_published ? 'Gallery item published!' : 'Gallery item set to draft.',
    () => { renderGalleryTab(); }
  );
}

function deleteGalleryItem(id) {
  showConfirm('Are you sure you want to delete this gallery item? This action is permanent.', async () => {
    contentData.gallery = contentData.gallery.filter(g => g.id !== id);
    contentData.gallery.forEach((g, index) => {
      g.order = index + 1;
    });

    await saveContentData('Gallery item deleted successfully!', () => {
      renderGalleryTab();
    });
  });
}

async function moveGalleryItem(id, direction) {
  const index = contentData.gallery.findIndex(g => g.id === id);
  if (index === -1) return;

  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= contentData.gallery.length) return; // limit bounds

  const currentItem = contentData.gallery[index];
  const targetItem = contentData.gallery[targetIndex];

  const tempOrder = currentItem.order;
  currentItem.order = targetItem.order;
  targetItem.order = tempOrder;

  contentData.gallery[index] = targetItem;
  contentData.gallery[targetIndex] = currentItem;

  await saveContentData('Gallery order updated!', () => {
    renderGalleryTab();
  });
}

// --- NOTICE BOARD MANAGER ---
function renderNoticesTab() {
  const tbody = document.getElementById('admin-notices-table-body');
  tbody.innerHTML = '';

  const search = document.getElementById('search-notices').value.toLowerCase().trim();
  const categoryFilter = document.getElementById('filter-notices-category').value;
  const statusFilterEl = document.getElementById('filter-notices-status');
  const statusFilter = statusFilterEl ? statusFilterEl.value : 'all';

  const filteredNotices = contentData.notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search) || n.text.toLowerCase().includes(search);
    const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;
    let matchesStatus = true;
    if (statusFilter === 'published') {
      matchesStatus = n.is_published !== false && !n.is_archived;
    } else if (statusFilter === 'unpublished') {
      matchesStatus = n.is_published === false && !n.is_archived;
    } else if (statusFilter === 'archived') {
      matchesStatus = !!n.is_archived;
    }
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (filteredNotices.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No notices match the filters.</td></tr>';
    return;
  }

  filteredNotices.forEach(n => {
    let statusText = 'Published';
    let statusClass = 'published';
    if (n.is_archived) {
      statusText = 'Archived';
      statusClass = 'closed';
    } else if (n.is_published === false) {
      statusText = 'Draft';
      statusClass = 'draft';
    }

    const importantText = n.is_important ? 'Important' : 'Normal';
    const importantClass = n.is_important ? 'important' : 'read';

    let expiryLabel = '';
    if (n.expiry_date) {
      const expired = new Date(n.expiry_date) < new Date();
      expiryLabel = `<div style="font-size: 11px; margin-top: 4px; font-weight: 600; color: ${expired ? '#f44336' : 'var(--accent-gold)'};">
        ${expired ? '⚠️ Expired' : '⏰ Expires'}: ${n.expiry_date}
      </div>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      <td>
        <div class="text-bold">${escapeHtml(n.title)}</div>
        <div class="text-muted" style="max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(n.text)}</div>
        ${expiryLabel}
      </td>
      <td><span class="text-bold" style="text-transform: capitalize;">${n.category}</span></td>
      <td>${n.date}</td>
      <td><span class="status-badge ${importantClass}">${importantText}</span></td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditNoticeModal('${n.id}')" title="Edit notice">✏️</button>
          <button class="btn-icon-only" onclick="toggleNoticeImportant('${n.id}')" title="${n.is_important ? 'Remove Star/Important' : 'Mark as Important'}">${n.is_important ? '⭐' : '☆'}</button>
          <button class="btn-icon-only" onclick="toggleNoticePublish('${n.id}')" title="${n.is_published ? 'Unpublish notice' : 'Publish notice'}">${n.is_published ? '👁️' : '🕶️'}</button>
          <button class="btn-icon-only" onclick="toggleNoticeArchive('${n.id}')" title="${n.is_archived ? 'Restore from Archive' : 'Archive notice'}">${n.is_archived ? '📂' : '📁'}</button>
          <button class="btn-icon-only delete" onclick="deleteNotice('${n.id}')" title="Delete notice">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddNoticeModal() {
  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Add Notice';

  body.innerHTML = `
    <form id="modal-notice-form">
      <div class="form-group">
        <label for="not-title">Notice Title</label>
        <input type="text" id="not-title" required placeholder="Eg: Admissions Open for 2026-27">
      </div>
      <div class="form-group">
        <label for="not-category">Category</label>
        <select id="not-category" required>
          <option value="admission">Admissions</option>
          <option value="events">Events</option>
          <option value="general">General Info</option>
        </select>
      </div>
      <div class="form-group">
        <label for="not-text">Announcement Details</label>
        <textarea id="not-text" rows="4" required></textarea>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label for="not-date">Publish Date (Display Label)</label>
          <input type="text" id="not-date" value="${formatDisplayDate(new Date())}" required>
        </div>
        <div class="form-group col-6">
          <label for="not-expiry-date">Expiry Date (Optional)</label>
          <input type="date" id="not-expiry-date">
        </div>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="not-important"> Mark Notice as Important / Important Badge
        </label>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="not-published" checked> Publish immediately
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-notice-submit-btn">Add Notice</button>
      </div>
    </form>
  `;

  document.getElementById('modal-notice-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('modal-notice-submit-btn');
    setButtonLoading(submitBtn, 'Saving...');

    const newNotice = {
      id: 'not-' + Date.now(),
      title: document.getElementById('not-title').value.trim(),
      text: document.getElementById('not-text').value.trim(),
      date: document.getElementById('not-date').value.trim(),
      expiry_date: document.getElementById('not-expiry-date').value,
      category: document.getElementById('not-category').value,
      is_important: document.getElementById('not-important').checked,
      is_published: document.getElementById('not-published').checked
    };

    contentData.notices.unshift(newNotice); // newest first
    await saveContentData('Notice posted successfully!', () => {
      closeAdminModal();
      renderNoticesTab();
    });
  });

  openAdminModal();
}

function openEditNoticeModal(id) {
  const notice = contentData.notices.find(n => n.id === id);
  if (!notice) return;

  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Edit Notice';

  body.innerHTML = `
    <form id="modal-notice-form">
      <div class="form-group">
        <label for="not-title">Notice Title</label>
        <input type="text" id="not-title" value="${escapeHtml(notice.title)}" required>
      </div>
      <div class="form-group">
        <label for="not-category">Category</label>
        <select id="not-category" required>
          <option value="admission" ${notice.category === 'admission' ? 'selected' : ''}>Admissions</option>
          <option value="events" ${notice.category === 'events' ? 'selected' : ''}>Events</option>
          <option value="general" ${notice.category === 'general' ? 'selected' : ''}>General Info</option>
        </select>
      </div>
      <div class="form-group">
        <label for="not-text">Announcement Details</label>
        <textarea id="not-text" rows="4" required>${escapeHtml(notice.text)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label for="not-date">Publish Date (Display Label)</label>
          <input type="text" id="not-date" value="${escapeHtml(notice.date)}" required>
        </div>
        <div class="form-group col-6">
          <label for="not-expiry-date">Expiry Date (Optional)</label>
          <input type="date" id="not-expiry-date" value="${notice.expiry_date || ''}">
        </div>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="not-important" ${notice.is_important ? 'checked' : ''}> Mark Notice as Important / Important Badge
        </label>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="not-published" ${notice.is_published !== false ? 'checked' : ''}> Published status
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-notice-edit-btn">Update Notice</button>
      </div>
    </form>
  `;

  document.getElementById('modal-notice-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('modal-notice-edit-btn');
    setButtonLoading(submitBtn, 'Saving...');

    notice.title = document.getElementById('not-title').value.trim();
    notice.text = document.getElementById('not-text').value.trim();
    notice.date = document.getElementById('not-date').value.trim();
    notice.expiry_date = document.getElementById('not-expiry-date').value;
    notice.category = document.getElementById('not-category').value;
    notice.is_important = document.getElementById('not-important').checked;
    notice.is_published = document.getElementById('not-published').checked;

    await saveContentData('Notice updated successfully!', () => {
      closeAdminModal();
      renderNoticesTab();
    });
  });

  openAdminModal();
}

function toggleNoticePublish(id) {
  const notice = contentData.notices.find(n => n.id === id);
  if (!notice) return;

  notice.is_published = notice.is_published === false ? true : false;
  saveContentData(
    notice.is_published ? 'Notice published!' : 'Notice set to draft.',
    () => { renderNoticesTab(); }
  );
}

function toggleNoticeArchive(id) {
  const notice = contentData.notices.find(n => n.id === id);
  if (!notice) return;

  notice.is_archived = !notice.is_archived;
  saveContentData(
    notice.is_archived ? 'Notice archived successfully.' : 'Notice restored from archive.',
    () => { renderNoticesTab(); }
  );
}

function toggleNoticeImportant(id) {
  const notice = contentData.notices.find(n => n.id === id);
  if (!notice) return;

  notice.is_important = !notice.is_important;
  saveContentData(
    notice.is_important ? 'Notice marked as important.' : 'Important badge removed from notice.',
    () => { renderNoticesTab(); }
  );
}

function deleteNotice(id) {
  showConfirm('Are you sure you want to delete this notice? This action is permanent.', async () => {
    contentData.notices = contentData.notices.filter(n => n.id !== id);
    await saveContentData('Notice deleted successfully!', () => {
      renderNoticesTab();
    });
  });
}

// --- EVENTS MANAGEMENT ---
function renderEventsTab() {
  const tbody = document.getElementById('admin-events-table-body');
  tbody.innerHTML = '';

  const search = document.getElementById('search-events').value.toLowerCase().trim();
  const statusFilterEl = document.getElementById('filter-events-status');
  const statusFilter = statusFilterEl ? statusFilterEl.value : 'all';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = contentData.events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(search) || ev.description.toLowerCase().includes(search);
    const evDate = new Date(ev.date);
    evDate.setHours(0, 0, 0, 0);
    const isUpcoming = isNaN(evDate.getTime()) || evDate >= today;

    let matchesStatus = true;
    if (statusFilter === 'upcoming') matchesStatus = isUpcoming;
    else if (statusFilter === 'past') matchesStatus = !isUpcoming;

    return matchesSearch && matchesStatus;
  });

  if (filteredEvents.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No events found matching the filters.</td></tr>';
    return;
  }

  filteredEvents.forEach(ev => {
    const statusText = ev.is_published ? 'Published' : 'Draft';
    const statusClass = ev.is_published ? 'published' : 'draft';

    const evDate = new Date(ev.date);
    evDate.setHours(0, 0, 0, 0);
    const isUpcoming = isNaN(evDate.getTime()) || evDate >= today;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <span class="status-badge ${statusClass}">${statusText}</span>
        <div style="margin-top: 4px;"><span class="status-badge ${isUpcoming ? 'published' : 'closed'}" style="font-size: 10px;">${isUpcoming ? 'Upcoming' : 'Past'}</span></div>
      </td>
      <td>
        ${ev.image_url ? `<img src="${ev.image_url}" class="event-table-img" alt="${escapeHtml(ev.title)}">` : `<div style="text-align: center; color: var(--text-light); font-size: 11px; padding: 12px; background: var(--bg-light); border-radius: 4px;">No Image</div>`}
      </td>
      <td>
        <div class="text-bold">${escapeHtml(ev.title)}</div>
        <div class="text-muted">${escapeHtml(ev.description || '')}</div>
      </td>
      <td>
        <div class="text-bold">${ev.date}</div>
        <div>${ev.time || ''}</div>
      </td>
      <td>${escapeHtml(ev.location || 'School Campus')}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditEventModal('${ev.id}')" title="Edit event">✏️</button>
          <button class="btn-icon-only" onclick="toggleEventPublish('${ev.id}')" title="${ev.is_published ? 'Unpublish' : 'Publish'}">${ev.is_published ? '👁️' : '🕶️'}</button>
          <button class="btn-icon-only delete" onclick="deleteEvent('${ev.id}')" title="Delete event">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddEventModal() {
  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Add Upcoming Event';

  body.innerHTML = `
    <form id="modal-event-form">
      <div class="form-group">
        <label for="evt-title">Event Title</label>
        <input type="text" id="evt-title" required placeholder="Eg: Annual Sports Meet 2026">
      </div>
      <div class="form-group">
        <label for="evt-desc">Event Description</label>
        <textarea id="evt-desc" rows="3" required></textarea>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label for="evt-date">Event Date (YYYY-MM-DD)</label>
          <input type="date" id="evt-date" required>
        </div>
        <div class="form-group col-6">
          <label for="evt-time">Event Time</label>
          <input type="text" id="evt-time" placeholder="Eg: 09:30 AM" required>
        </div>
      </div>
      <div class="form-group">
        <label for="evt-location">Location / Venue</label>
        <input type="text" id="evt-location" placeholder="Eg: School Assembly Ground" required>
      </div>
      <div class="form-group">
        <label for="evt-image">Event Banner Image</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="evt-image" placeholder="Upload or select image URL">
          <button type="button" class="btn btn-secondary btn-select-media" data-target-input="evt-image">Choose Media</button>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
          <input type="file" id="evt-image-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'evt-image', 'evt-image-preview')">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('evt-image-file').click()">📤 Upload File</button>
          <div id="evt-image-preview-container" style="display: none; align-items: center; gap: 8px;">
            <img id="evt-image-preview" src="" style="max-height: 50px; border-radius: 4px; border: 1px solid var(--border-color);">
            <span style="font-size: 11px; color: var(--text-light);">Uploaded!</span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="evt-published" checked> Publish Event Immediately
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-event-submit-btn">Add Event</button>
      </div>
    </form>
  `;

  document.getElementById('modal-event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('modal-event-submit-btn');
    setButtonLoading(submitBtn, 'Saving...');

    const newEvent = {
      id: 'evt-' + Date.now(),
      title: document.getElementById('evt-title').value.trim(),
      description: document.getElementById('evt-desc').value.trim(),
      date: document.getElementById('evt-date').value,
      time: document.getElementById('evt-time').value.trim(),
      location: document.getElementById('evt-location').value.trim(),
      image_url: document.getElementById('evt-image').value.trim(),
      is_published: document.getElementById('evt-published').checked
    };

    contentData.events.unshift(newEvent); // newest first
    await saveContentData('Event added successfully!', () => {
      closeAdminModal();
      renderEventsTab();
    });
  });

  openAdminModal();
}

function openEditEventModal(id) {
  const ev = contentData.events.find(e => e.id === id);
  if (!ev) return;

  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Edit Event';

  body.innerHTML = `
    <form id="modal-event-form">
      <div class="form-group">
        <label for="evt-title">Event Title</label>
        <input type="text" id="evt-title" value="${escapeHtml(ev.title)}" required>
      </div>
      <div class="form-group">
        <label for="evt-desc">Event Description</label>
        <textarea id="evt-desc" rows="3" required>${escapeHtml(ev.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label for="evt-date">Event Date (YYYY-MM-DD)</label>
          <input type="date" id="evt-date" value="${ev.date}" required>
        </div>
        <div class="form-group col-6">
          <label for="evt-time">Event Time</label>
          <input type="text" id="evt-time" value="${escapeHtml(ev.time || '')}" required>
        </div>
      </div>
      <div class="form-group">
        <label for="evt-location">Location / Venue</label>
        <input type="text" id="evt-location" value="${escapeHtml(ev.location || '')}" required>
      </div>
      <div class="form-group">
        <label for="evt-image">Event Banner Image</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="evt-image" value="${escapeHtml(ev.image_url || '')}">
          <button type="button" class="btn btn-secondary btn-select-media" data-target-input="evt-image">Choose Media</button>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
          <input type="file" id="evt-image-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'evt-image', 'evt-image-preview')">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('evt-image-file').click()">📤 Upload File</button>
          <div id="evt-image-preview-container" style="display: none; align-items: center; gap: 8px;">
            <img id="evt-image-preview" src="" style="max-height: 50px; border-radius: 4px; border: 1px solid var(--border-color);">
            <span style="font-size: 11px; color: var(--text-light);">Uploaded!</span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="evt-published" ${ev.is_published !== false ? 'checked' : ''}> Publish Event Status
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-event-edit-btn">Update Event</button>
      </div>
    </form>
  `;

  showPreviewIfValueExists('evt-image', 'evt-image-preview');

  document.getElementById('modal-event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('modal-event-edit-btn');
    setButtonLoading(submitBtn, 'Saving...');

    ev.title = document.getElementById('evt-title').value.trim();
    ev.description = document.getElementById('evt-desc').value.trim();
    ev.date = document.getElementById('evt-date').value;
    ev.time = document.getElementById('evt-time').value.trim();
    ev.location = document.getElementById('evt-location').value.trim();
    ev.image_url = document.getElementById('evt-image').value.trim();
    ev.is_published = document.getElementById('evt-published').checked;

    await saveContentData('Event updated successfully!', () => {
      closeAdminModal();
      renderEventsTab();
    });
  });

  openAdminModal();
}

function toggleEventPublish(id) {
  const ev = contentData.events.find(e => e.id === id);
  if (!ev) return;

  ev.is_published = ev.is_published === false ? true : false;
  saveContentData(
    ev.is_published ? 'Event published!' : 'Event set to draft.',
    () => { renderEventsTab(); }
  );
}

function deleteEvent(id) {
  showConfirm('Are you sure you want to delete this event? This action is permanent.', async () => {
    contentData.events = contentData.events.filter(e => e.id !== id);
    await saveContentData('Event deleted successfully!', () => {
      renderEventsTab();
    });
  });
}

// --- HOSTEL & FACILITIES ---
function renderHostelAndFacilitiesTab() {
  // 1. Render Facilities Table
  const tbody = document.getElementById('admin-facilities-table-body');
  tbody.innerHTML = '';

  contentData.facilities.forEach(fac => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${fac.svg_id}</code></td>
      <td><span class="text-bold">${escapeHtml(fac.title)}</span></td>
      <td style="max-width: 450px;">${escapeHtml(fac.description)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditFacilityModal('${fac.id}')" title="Edit facility">✏️</button>
          <button class="btn-icon-only delete" onclick="deleteFacility('${fac.id}')" title="Delete facility">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // 2. Populate Hostel settings fields
  const host = contentData.hostel_info;
  document.getElementById('hostel-description').value = host.description || '';
  document.getElementById('hostel-boys').value = host.boys_hostel || '';
  document.getElementById('hostel-girls').value = host.girls_hostel || '';
  document.getElementById('hostel-image').value = host.image_url || '';
  document.getElementById('hostel-bullets').value = (host.bullets || []).join('\n');

  showPreviewIfValueExists('hostel-image', 'hostel-image-preview');
}

function openAddFacilityModal() {
  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Add Facility Pillar';

  body.innerHTML = `
    <form id="modal-fac-form">
      <div class="form-group">
        <label for="fac-title">Facility Title / Heading</label>
        <input type="text" id="fac-title" required placeholder="Eg: Experienced Teachers">
      </div>
      <div class="form-group">
        <label for="fac-desc">Pillar Short Description</label>
        <textarea id="fac-desc" rows="3" required></textarea>
      </div>
      <div class="form-group">
        <label for="fac-svg">SVG Icon Style ID (Variables used in public CSS)</label>
        <select id="fac-svg" required>
          <option value="teachers">Teachers (People Icon)</option>
          <option value="heart">Heart (Learning Environment Icon)</option>
          <option value="book">Book (Islamic studies Icon)</option>
          <option value="camera">Camera (CCTV Icon)</option>
          <option value="lock">Lock (Security Icon)</option>
          <option value="check-circle">Check Circle (Progress tracking Icon)</option>
          <option value="shield">Shield (Supervision Icon)</option>
          <option value="dollar-sign">Utensils / Dollar (Nutritious meals Icon)</option>
        </select>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-fac-submit-btn">Add Facility</button>
      </div>
    </form>
  `;

  document.getElementById('modal-fac-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('modal-fac-submit-btn');
    setButtonLoading(submitBtn, 'Saving...');

    const newFac = {
      id: 'fac-' + Date.now(),
      title: document.getElementById('fac-title').value.trim(),
      description: document.getElementById('fac-desc').value.trim(),
      svg_id: document.getElementById('fac-svg').value
    };

    contentData.facilities.push(newFac);
    await saveContentData('New facility pillar added successfully!', () => {
      closeAdminModal();
      renderHostelAndFacilitiesTab();
    });
  });

  openAdminModal();
}

function openEditFacilityModal(id) {
  const fac = contentData.facilities.find(f => f.id === id);
  if (!fac) return;

  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Edit Facility Pillar';

  body.innerHTML = `
    <form id="modal-fac-form">
      <div class="form-group">
        <label for="fac-title">Facility Title / Heading</label>
        <input type="text" id="fac-title" value="${escapeHtml(fac.title)}" required>
      </div>
      <div class="form-group">
        <label for="fac-desc">Pillar Short Description</label>
        <textarea id="fac-desc" rows="3" required>${escapeHtml(fac.description)}</textarea>
      </div>
      <div class="form-group">
        <label for="fac-svg">SVG Icon Style ID</label>
        <select id="fac-svg" required>
          <option value="teachers" ${fac.svg_id === 'teachers' ? 'selected' : ''}>Teachers (People Icon)</option>
          <option value="heart" ${fac.svg_id === 'heart' ? 'selected' : ''}>Heart (Learning Environment Icon)</option>
          <option value="book" ${fac.svg_id === 'book' ? 'selected' : ''}>Book (Islamic studies Icon)</option>
          <option value="camera" ${fac.svg_id === 'camera' ? 'selected' : ''}>Camera (CCTV Icon)</option>
          <option value="lock" ${fac.svg_id === 'lock' ? 'selected' : ''}>Lock (Security Icon)</option>
          <option value="check-circle" ${fac.svg_id === 'check-circle' ? 'selected' : ''}>Check Circle (Progress tracking Icon)</option>
          <option value="shield" ${fac.svg_id === 'shield' ? 'selected' : ''}>Shield (Supervision Icon)</option>
          <option value="dollar-sign" ${fac.svg_id === 'dollar-sign' ? 'selected' : ''}>Utensils / Dollar (Nutritious meals Icon)</option>
        </select>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-fac-edit-btn">Update Facility</button>
      </div>
    </form>
  `;

  document.getElementById('modal-fac-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('modal-fac-edit-btn');
    setButtonLoading(submitBtn, 'Saving...');

    fac.title = document.getElementById('fac-title').value.trim();
    fac.description = document.getElementById('fac-desc').value.trim();
    fac.svg_id = document.getElementById('fac-svg').value;

    await saveContentData('Facility pillar updated successfully!', () => {
      closeAdminModal();
      renderHostelAndFacilitiesTab();
    });
  });

  openAdminModal();
}

function deleteFacility(id) {
  showConfirm('Are you sure you want to delete this facility pillar?', async () => {
    contentData.facilities = contentData.facilities.filter(f => f.id !== id);
    await saveContentData('Facility pillar removed!', () => {
      renderHostelAndFacilitiesTab();
    });
  });
}

async function saveHostelSettings(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setButtonLoading(btn, 'Saving...');

  syncActiveTabToState();

  await saveContentData('Hostel details and features list saved successfully!', () => {
    resetButtonLoading(btn);
  });
}

// --- ADMISSION ENQUIRIES ---
function renderEnquiriesTab() {
  const tbody = document.getElementById('admin-enquiries-table-body');
  tbody.innerHTML = '';

  const search = (document.getElementById('search-enquiries')?.value || '').toLowerCase().trim();
  const classFilter = document.getElementById('filter-enquiries-class')?.value || 'all';
  const statusFilter = document.getElementById('filter-enquiries-status')?.value || 'all';
  const dateFilter = document.getElementById('filter-enquiries-date')?.value || 'all';

  const now = new Date();

  const filtered = (submissionData.enquiries || []).filter(e => {
    const student = (e.student_name || '').toLowerCase();
    const parent = (e.parent_name || '').toLowerCase();
    const phone = (e.phone || '');
    const email = (e.email || '').toLowerCase();
    const matchesSearch = !search || student.includes(search) || parent.includes(search) || phone.includes(search) || email.includes(search);

    const matchesClass = classFilter === 'all' || e.class_apply === classFilter;
    
    // Status normalisation
    const curStatus = (e.status === 'completed') ? 'converted' : (e.status || 'new');
    const matchesStatus = statusFilter === 'all' || curStatus === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const enqDate = new Date(e.date);
      if (dateFilter === 'today') {
        matchesDate = enqDate.toDateString() === now.toDateString();
      } else if (dateFilter === '7days') {
        matchesDate = (now - enqDate) <= (7 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === '30days') {
        matchesDate = (now - enqDate) <= (30 * 24 * 60 * 60 * 1000);
      }
    }

    return matchesSearch && matchesClass && matchesStatus && matchesDate;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No admission enquiries found matching the filters.</td></tr>';
    return;
  }

  filtered.forEach(e => {
    const dateStr = formatDate(e.date);
    const curStatus = (e.status === 'completed') ? 'converted' : (e.status || 'new');
    
    let statusLabel = curStatus.charAt(0).toUpperCase() + curStatus.slice(1);
    if (curStatus === 'follow-up') statusLabel = 'Follow-up';

    let followUpDateDisplay = '<span class="text-muted" style="font-size: 11px;">None set</span>';
    if (e.follow_up_date) {
      const fDate = new Date(e.follow_up_date);
      const isPast = fDate < new Date();
      followUpDateDisplay = `<span class="text-bold" style="color: ${isPast ? '#f44336' : 'var(--accent-gold)'}; font-size: 12px;">📅 ${e.follow_up_date}</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="status-badge ${curStatus}">${statusLabel}</span></td>
      <td>
        <div class="text-bold">${escapeHtml(e.student_name)}</div>
        <div class="text-muted" style="font-size: 12px;">Parent: ${escapeHtml(e.parent_name)}</div>
      </td>
      <td>
        <div class="text-bold"><a href="tel:${e.phone}" style="color: #2196f3;">${e.phone}</a></div>
        ${e.email ? `<div class="text-muted" style="font-size: 11px; max-width: 170px; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(e.email)}</div>` : ''}
      </td>
      <td><span class="text-bold" style="text-transform: uppercase;">${(e.class_apply || '').replace('class-', 'Class ')}</span></td>
      <td>${followUpDateDisplay}</td>
      <td style="font-size: 12px;">${dateStr}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="openEnquiryDetailsModal('${e.id}')">👁️ View</button>
          <select class="filter-select" style="padding: 4px 6px; font-size: 11px;" onchange="updateSubmissionStatus('enquiry', '${e.id}', this.value)">
            <option value="new" ${curStatus === 'new' ? 'selected' : ''}>New</option>
            <option value="contacted" ${curStatus === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="follow-up" ${curStatus === 'follow-up' ? 'selected' : ''}>Follow-up</option>
            <option value="converted" ${curStatus === 'converted' ? 'selected' : ''}>Converted</option>
            <option value="closed" ${curStatus === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
          <button class="btn-icon-only delete" onclick="deleteSubmission('enquiry', '${e.id}')" title="Delete enquiry">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openEnquiryDetailsModal(id) {
  const enq = (submissionData.enquiries || []).find(e => e.id === id);
  if (!enq) return;

  const dateStr = formatDate(enq.date);
  const curStatus = (enq.status === 'completed') ? 'converted' : (enq.status || 'new');
  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = `Enquiry: ${enq.student_name} (${(enq.class_apply || '').replace('class-', 'Class ').toUpperCase()})`;

  // Build Notification Report markup
  let notifReportHtml = '';
  if (enq.notification_status) {
    const wDir = enq.notification_status.whatsapp?.director?.status || 'unconfigured';
    const wPrin = enq.notification_status.whatsapp?.principal?.status || 'unconfigured';
    const sDir = enq.notification_status.sms?.director?.status || 'unconfigured';
    const sPrin = enq.notification_status.sms?.principal?.status || 'unconfigured';

    const getPill = (st) => {
      if (st === 'sent' || st === 'delivered') return '<span style="color:#4caf50; font-weight:600;">✓ Dispatched</span>';
      if (st === 'queued') return '<span style="color:#ff9800; font-weight:600;">⏳ Queued</span>';
      return '<span style="color:var(--text-light); font-size:11px;">(Ready - configure API key)</span>';
    };

    notifReportHtml = `
      <div style="background: var(--bg-light); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; margin-bottom: 15px; font-size: 12px;">
        <div style="font-weight: 700; margin-bottom: 6px; color: var(--text-dark);">📢 School Admin Notification Dispatch Report:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div><strong>Director WhatsApp:</strong> ${getPill(wDir)}</div>
          <div><strong>Principal WhatsApp:</strong> ${getPill(wPrin)}</div>
          <div><strong>Director SMS:</strong> ${getPill(sDir)}</div>
          <div><strong>Principal SMS:</strong> ${getPill(sPrin)}</div>
        </div>
      </div>
    `;
  }

  // Build Follow-up Notes list markup
  let notesHtml = '';
  if (enq.notes && enq.notes.length > 0) {
    notesHtml = `
      <div style="margin-top: 15px;">
        <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--text-dark);">Previous Follow-up Notes (${enq.notes.length})</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
          ${enq.notes.slice().reverse().map(n => `
            <div style="background: var(--bg-light); border-left: 3px solid var(--accent-gold); padding: 8px 12px; border-radius: 4px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; color: var(--text-light); font-size: 11px; margin-bottom: 3px;">
                <span class="text-bold">${escapeHtml(n.author || 'Admin')}</span>
                <span>${formatRelativeTime(n.date)}</span>
              </div>
              <div style="color: var(--text-dark); white-space: pre-wrap;">${escapeHtml(n.text)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Build Audit History timeline markup
  let historyHtml = '';
  if (enq.history && enq.history.length > 0) {
    historyHtml = `
      <div style="margin-top: 15px;">
        <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--text-dark);">Activity & Status Timeline</h4>
        <div style="font-size: 11px; color: var(--text-light); display: flex; flex-direction: column; gap: 4px; max-height: 120px; overflow-y: auto;">
          ${enq.history.slice().reverse().map(h => `
            <div style="padding: 4px 0; border-bottom: 1px dashed var(--border-color);">
              <span class="text-bold" style="color: var(--text-dark);">${escapeHtml(h.action.replace('_', ' ').toUpperCase())}:</span>
              ${h.note ? escapeHtml(h.note) : ''}
              ${h.from && h.to ? `Changed from <em>${h.from}</em> to <strong>${h.to}</strong>` : ''}
              ${h.date_set ? `Follow-up set to <strong>${h.date_set}</strong>` : ''}
              <span style="float: right;">${formatRelativeTime(h.date)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  body.innerHTML = `
    ${notifReportHtml}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Student Name</div>
        <div class="detail-value text-bold">${escapeHtml(enq.student_name)}</div>
      </div>
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Parent Name</div>
        <div class="detail-value text-bold">${escapeHtml(enq.parent_name)}</div>
      </div>
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Applying Class</div>
        <div class="detail-value" style="text-transform: uppercase;">${(enq.class_apply || '').replace('class-', 'Class ')}</div>
      </div>
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Date Submitted</div>
        <div class="detail-value">${dateStr}</div>
      </div>
    </div>

    <div class="detail-view-row" style="margin-bottom: 12px;">
      <div class="detail-label">Phone & Contact</div>
      <div class="detail-value" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <a href="tel:${enq.phone}" class="text-bold" style="color: #2196f3; font-size: 14px;">${enq.phone}</a>
        <a href="https://wa.me/91${enq.phone}" target="_blank" class="btn btn-success btn-sm" style="padding: 3px 8px; font-size: 11px;">💬 WhatsApp Parent</a>
        <a href="tel:${enq.phone}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">📞 Call</a>
        ${enq.email ? `<a href="mailto:${enq.email}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">✉️ ${escapeHtml(enq.email)}</a>` : ''}
      </div>
    </div>

    <div class="detail-view-row" style="flex-direction: column; align-items: flex-start; gap: 6px; margin-bottom: 15px;">
      <div class="detail-label">Applicant Enquiry Message</div>
      <div class="detail-value" style="width:100%; padding: 10px; background: var(--bg-light); border-radius: 4px; white-space: pre-wrap; font-size: 13px;">${escapeHtml(enq.message || 'No additional message was submitted.')}</div>
    </div>

    <!-- Enquiry Pipeline Follow-up Card -->
    <div style="background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 6px; padding: 14px; margin-bottom: 15px;">
      <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 10px; color: var(--text-dark);">📌 Update Admission Pipeline & Follow-up</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Enquiry Status</label>
          <select class="filter-select" id="detail-enquiry-status" style="width: 100%;">
            <option value="new" ${curStatus === 'new' ? 'selected' : ''}>New (Uncontacted)</option>
            <option value="contacted" ${curStatus === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="follow-up" ${curStatus === 'follow-up' ? 'selected' : ''}>Follow-up Needed</option>
            <option value="converted" ${curStatus === 'converted' ? 'selected' : ''}>Converted (Admitted)</option>
            <option value="closed" ${curStatus === 'closed' ? 'selected' : ''}>Closed / Declined</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Next Follow-up Date</label>
          <input type="date" id="modal-follow-up-date" value="${enq.follow_up_date || ''}" style="width: 100%; padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-dark);">
        </div>
      </div>
      <div>
        <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Add Follow-up Conversation Note</label>
        <textarea id="modal-new-note" rows="2" placeholder="Record discussion details with parent, fee queries, campus visit date, etc." style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-dark); font-size: 13px; resize: vertical;"></textarea>
      </div>
      <div style="margin-top: 10px; text-align: right;">
        <button type="button" class="btn btn-primary btn-sm" id="btn-save-enquiry-note" onclick="saveEnquiryNoteAndStatus('${enq.id}')">💾 Save Note & Update Status</button>
      </div>
    </div>

    ${notesHtml}
    ${historyHtml}

    <div class="form-submit-row" style="margin-top: 20px;">
      <button class="btn btn-danger" onclick="deleteSubmission('enquiry', '${enq.id}'); closeAdminModal();" style="float: left;">🗑️ Delete Enquiry</button>
      <button class="btn btn-primary" onclick="closeAdminModal()">Close Window</button>
    </div>
  `;

  openAdminModal();
}

async function saveEnquiryNoteAndStatus(id) {
  const enq = (submissionData.enquiries || []).find(e => e.id === id);
  if (!enq) return;

  const statusSelect = document.getElementById('detail-enquiry-status');
  const followUpDateInput = document.getElementById('modal-follow-up-date');
  const noteTextarea = document.getElementById('modal-new-note');
  const saveBtn = document.getElementById('btn-save-enquiry-note');

  const newStatus = statusSelect ? statusSelect.value : enq.status;
  const followUpDate = followUpDateInput ? followUpDateInput.value : enq.follow_up_date;
  const noteText = noteTextarea ? noteTextarea.value.trim() : '';

  if (saveBtn) setButtonLoading(saveBtn, 'Saving...');

  try {
    const res = await fetch('/api/enquiry-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        status: newStatus,
        followUpDate: followUpDate || null,
        noteText: noteText
      })
    });

    const data = await res.json();
    if (data.success && data.enquiry) {
      const idx = submissionData.enquiries.findIndex(e => e.id === id);
      if (idx !== -1) {
        submissionData.enquiries[idx] = data.enquiry;
      }
      showToast('Enquiry pipeline & note updated successfully!', 'success');
      renderEnquiriesTab();
      updateBadgeCounts();
      renderDashboardOverview();
      openEnquiryDetailsModal(id);
    } else {
      showToast(data.message || 'Failed to save note.', 'error');
      if (saveBtn) resetButtonLoading(saveBtn);
    }
  } catch (err) {
    console.error('Error saving enquiry note:', err);
    showToast('Network error while saving note.', 'error');
    if (saveBtn) resetButtonLoading(saveBtn);
  }
}

// --- CONTACT MESSAGES ---
function renderMessagesTab() {
  const tbody = document.getElementById('admin-messages-table-body');
  tbody.innerHTML = '';

  const search = (document.getElementById('search-messages')?.value || '').toLowerCase().trim();
  const stateFilter = document.getElementById('filter-messages-state')?.value || 'all';

  const filtered = (submissionData.messages || []).filter(m => {
    const name = (m.name || '').toLowerCase();
    const subject = (m.subject || '').toLowerCase();
    const message = (m.message || '').toLowerCase();
    const matchesSearch = !search || name.includes(search) || subject.includes(search) || message.includes(search);

    const curStatus = m.status || (m.is_read ? 'read' : 'new');
    let matchesState = true;
    if (stateFilter === 'new') matchesState = (curStatus === 'new');
    else if (stateFilter === 'read') matchesState = (curStatus === 'read');
    else if (stateFilter === 'replied') matchesState = (curStatus === 'replied');
    else if (stateFilter === 'closed') matchesState = (curStatus === 'closed');

    return matchesSearch && matchesState;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No contact messages match the filters.</td></tr>';
    return;
  }

  filtered.forEach(m => {
    const dateStr = formatDate(m.date);
    const curStatus = m.status || (m.is_read ? 'read' : 'new');
    
    let statusClass = curStatus;
    let statusLabel = curStatus.charAt(0).toUpperCase() + curStatus.slice(1);

    const tr = document.createElement('tr');
    tr.className = (curStatus === 'new') ? 'unread-row-highlight' : '';
    tr.innerHTML = `
      <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
      <td>
        <div class="text-bold">${escapeHtml(m.name)}</div>
        <div class="text-muted" style="font-size: 12px;">${escapeHtml(m.email || 'No Email')} | ${m.phone || 'No Phone'}</div>
      </td>
      <td>
        <div class="text-bold">${escapeHtml(m.subject)}</div>
        <div class="text-muted" style="max-width: 350px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(m.message)}</div>
      </td>
      <td style="font-size: 12px;">${dateStr}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="openMessageDetailsModal('${m.id}')">📖 Read</button>
          <select class="filter-select" style="padding: 4px 6px; font-size: 11px;" onchange="updateSubmissionStatus('message', '${m.id}', this.value)">
            <option value="new" ${curStatus === 'new' ? 'selected' : ''}>New</option>
            <option value="read" ${curStatus === 'read' ? 'selected' : ''}>Read</option>
            <option value="replied" ${curStatus === 'replied' ? 'selected' : ''}>Replied</option>
            <option value="closed" ${curStatus === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
          <button class="btn-icon-only delete" onclick="deleteSubmission('message', '${m.id}')" title="Delete message">🗑</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function openMessageDetailsModal(id) {
  const msg = (submissionData.messages || []).find(m => m.id === id);
  if (!msg) return;

  const dateStr = formatDate(msg.date);
  const curStatus = msg.status || (msg.is_read ? 'read' : 'new');
  
  const body = document.getElementById('modal-body');
  document.getElementById('modal-title').textContent = 'Contact Message Details';

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Sender Name</div>
        <div class="detail-value text-bold">${escapeHtml(msg.name)}</div>
      </div>
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Date Received</div>
        <div class="detail-value">${dateStr}</div>
      </div>
    </div>

    <div class="detail-view-row" style="margin-bottom: 12px;">
      <div class="detail-label">Direct Communication</div>
      <div class="detail-value" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        ${msg.phone ? `
          <a href="tel:${msg.phone}" class="text-bold" style="color: #2196f3; font-size: 14px;">${msg.phone}</a>
          <a href="https://wa.me/91${msg.phone}" target="_blank" class="btn btn-success btn-sm" style="padding: 3px 8px; font-size: 11px;">💬 WhatsApp</a>
          <a href="tel:${msg.phone}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">📞 Call</a>
        ` : '<span class="text-muted" style="font-size: 12px;">No phone number provided</span>'}
        ${msg.email ? `<a href="mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject || 'School Enquiry')}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">✉️ Email (${escapeHtml(msg.email)})</a>` : ''}
      </div>
    </div>

    <div class="detail-view-row" style="margin-bottom: 12px;">
      <div class="detail-label">Subject</div>
      <div class="detail-value text-bold">${escapeHtml(msg.subject)}</div>
    </div>

    <div class="detail-view-row" style="flex-direction: column; align-items: flex-start; gap: 6px; margin-bottom: 15px;">
      <div class="detail-label">Message Content</div>
      <div class="detail-value" style="width:100%; padding: 14px; background: var(--bg-light); border-radius: 4px; white-space: pre-wrap; font-size: 13px;">${escapeHtml(msg.message)}</div>
    </div>

    <div class="detail-view-row" style="align-items: center; gap: 10px; margin-bottom: 20px;">
      <div class="detail-label">Message Status</div>
      <div class="detail-value">
        <select class="filter-select" id="detail-msg-status" onchange="updateSubmissionStatus('message', '${msg.id}', this.value); closeAdminModal();">
          <option value="new" ${curStatus === 'new' ? 'selected' : ''}>New (Unread)</option>
          <option value="read" ${curStatus === 'read' ? 'selected' : ''}>Read</option>
          <option value="replied" ${curStatus === 'replied' ? 'selected' : ''}>Replied</option>
          <option value="closed" ${curStatus === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
      </div>
    </div>

    <div class="form-submit-row">
      <button class="btn btn-danger" onclick="deleteSubmission('message', '${msg.id}'); closeAdminModal();" style="float: left;">🗑️ Delete Message</button>
      <button class="btn btn-primary" onclick="closeAdminModal()">Close Window</button>
    </div>
  `;

  openAdminModal();

  // If message was unread, automatically mark as read on the backend
  if (!msg.is_read || msg.status === 'new') {
    msg.is_read = true;
    if (msg.status === 'new') msg.status = 'read';
    updateBadgeCounts();
    renderMessagesTab();
    renderDashboardOverview();
    
    try {
      await fetch('/api/update-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'message', id: id, status: 'read', is_read: true })
      });
    } catch (err) {
      console.error('Failed to update read state on server:', err);
    }
  }
}

async function toggleMessageReadState(id) {
  const msg = (submissionData.messages || []).find(m => m.id === id);
  if (!msg) return;

  msg.is_read = !msg.is_read;
  msg.status = msg.is_read ? 'read' : 'new';
  updateBadgeCounts();
  renderMessagesTab();
  renderDashboardOverview();

  try {
    await fetch('/api/update-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'message', id: id, status: msg.status, is_read: msg.is_read })
    });
  } catch (err) {
    console.error('Failed to toggle read status:', err);
  }
}

async function updateSubmissionStatus(type, id, newStatus) {
  try {
    const res = await fetch('/api/update-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, status: newStatus })
    });
    
    const data = await res.json();
    if (data.success) {
      if (type === 'enquiry') {
        const item = (submissionData.enquiries || []).find(e => e.id === id);
        if (item) item.status = newStatus;
        renderEnquiriesTab();
      } else {
        const item = (submissionData.messages || []).find(m => m.id === id);
        if (item) {
          item.status = newStatus;
          item.is_read = (newStatus !== 'new');
        }
        renderMessagesTab();
      }
      updateBadgeCounts();
      renderDashboardOverview();
      showToast('Status updated successfully!', 'success');
    } else {
      showToast('Failed to update status.', 'error');
    }
  } catch (err) {
    console.error('Error updating status:', err);
    showToast('Network error during status update.', 'error');
  }
}

async function deleteSubmission(type, id) {
  showConfirm(`Are you sure you want to permanently delete this ${type === 'enquiry' ? 'admission enquiry' : 'contact message'}?`, async () => {
    try {
      const res = await fetch('/api/submission', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      });

      const data = await res.json();
      if (data.success) {
        if (type === 'enquiry') {
          submissionData.enquiries = submissionData.enquiries.filter(e => e.id !== id);
          renderEnquiriesTab();
        } else {
          submissionData.messages = submissionData.messages.filter(m => m.id !== id);
          renderMessagesTab();
        }
        updateBadgeCounts();
        renderDashboardOverview(); // update dashboard too
        showToast('Submission deleted successfully!', 'success');
      } else {
        showToast('Failed to delete submission.', 'error');
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
      showToast('Network error during deletion.', 'error');
    }
  });
}

// --- MEDIA LIBRARY ---
function renderMediaLibraryTab() {
  const container = document.getElementById('admin-media-library-grid');
  container.innerHTML = '';

  const search = document.getElementById('search-media').value.toLowerCase().trim();
  const filteredMedia = mediaLibrary.filter(m => m.name.toLowerCase().includes(search));

  if (filteredMedia.length === 0) {
    container.innerHTML = '<p class="empty-list-text">No uploaded assets found matching search.</p>';
    return;
  }

  filteredMedia.forEach(m => {
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(m.name);
    
    const card = document.createElement('div');
    card.className = 'media-item-card';
    card.setAttribute('data-name', m.name);

    let thumbHtml = '';
    if (isImage) {
      thumbHtml = `<img src="${m.url}" alt="${m.name}" loading="lazy">`;
    } else {
      thumbHtml = `<span class="media-icon-placeholder">🎥</span>`;
    }

    card.innerHTML = `
      <div class="media-thumbnail-wrapper">
        ${thumbHtml}
      </div>
      <div class="media-item-details">
        <div class="media-filename" title="${m.name}">${m.name}</div>
      </div>
      <div class="media-actions-overlay">
        <button class="btn-media-action" onclick="copyToClipboard('${m.url}'); event.stopPropagation();" title="Copy file URL">🔗</button>
        <button class="btn-media-action delete" onclick="deleteMediaFile('${m.name}'); event.stopPropagation();" title="Delete file">🗑️</button>
      </div>
    `;

    card.addEventListener('click', () => {
      copyToClipboard(m.url);
    });

    container.appendChild(card);
  });
}

function triggerMediaUpload() {
  document.getElementById('media-upload-input').click();
}

async function handleMediaUpload(input) {
  const files = input.files;
  if (files.length === 0) return;

  const btn = document.querySelector('.btn-media-upload-trigger');
  setButtonLoading(btn, 'Uploading...');

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  showToast('Uploading files...', 'info');

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      const mediaRes = await fetch('/api/media');
      mediaLibrary = await mediaRes.json();
      renderMediaLibraryTab();
      showToast(`Successfully uploaded ${data.files.length} file(s)!`, 'success');
    } else {
      showToast(data.message || 'File upload failed.', 'error');
    }
  } catch (err) {
    console.error('Upload failed:', err);
    showToast('Network error during file upload.', 'error');
  } finally {
    resetButtonLoading(btn);
    input.value = '';
  }
}

async function deleteMediaFile(name) {
  showConfirm(`Are you sure you want to permanently delete '${name}'? This will break any page reference that displays it.`, async () => {
    try {
      const res = await fetch(`/api/media/${name}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        mediaLibrary = mediaLibrary.filter(m => m.name !== name);
        renderMediaLibraryTab();
        showToast('File deleted successfully.', 'success');
      } else {
        showToast(data.message || 'Delete failed.', 'error');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Network error during file deletion.', 'error');
    }
  });
}

// --- SOCIAL & CONTACT SETTINGS ---
function populateSocialSettings() {
  const soc = contentData.social_media;
  const con = contentData.contact_settings;

  // Socials
  document.getElementById('social-instagram').value = soc.instagram || '';
  document.getElementById('social-facebook').value = soc.facebook || '';
  document.getElementById('social-youtube').value = soc.youtube || '';
  document.getElementById('social-whatsapp').value = soc.whatsapp || '';

  // Contacts
  document.getElementById('contact-address').value = con.address || '';
  document.getElementById('contact-phone').value = con.phone || '';
  document.getElementById('contact-email').value = con.email || '';
  document.getElementById('contact-map').value = con.google_maps_embed || '';
}

async function saveSocialSettings(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setButtonLoading(btn, 'Saving...');

  syncActiveTabToState();

  await saveContentData('Social media and Google Map settings saved successfully!', () => {
    resetButtonLoading(btn);
  });
}

// ==========================================
// 4. MEDIA SELECTION DIALOG (OVERLAY PICKER)
// ==========================================
function openMediaSelectModal(inputTargetId) {
  currentMediaSelectTarget = inputTargetId;
  renderMediaSelectGrid();
  document.getElementById('media-select-modal').style.display = 'flex';
}

function closeMediaSelectModal() {
  document.getElementById('media-select-modal').style.display = 'none';
  currentMediaSelectTarget = null;
}

function renderMediaSelectGrid() {
  const grid = document.getElementById('modal-media-grid');
  grid.innerHTML = '';

  const search = document.getElementById('search-media-select').value.toLowerCase().trim();
  const filtered = mediaLibrary.filter(m => m.name.toLowerCase().includes(search));

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-list-text" style="grid-column: 1/-1;">No media matches.</p>';
    return;
  }

  filtered.forEach(m => {
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(m.name);
    
    const card = document.createElement('div');
    card.className = 'media-item-card';
    
    let thumbHtml = '';
    if (isImage) {
      thumbHtml = `<img src="${m.url}" alt="${m.name}" loading="lazy">`;
    } else {
      thumbHtml = `<span class="media-icon-placeholder">🎥</span>`;
    }

    card.innerHTML = `
      <div class="media-thumbnail-wrapper">${thumbHtml}</div>
      <div class="media-item-details">
        <div class="media-filename">${m.name}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      selectMediaForInput(m.url);
    });

    grid.appendChild(card);
  });
}

function selectMediaForInput(url) {
  if (currentMediaSelectTarget) {
    const input = document.getElementById(currentMediaSelectTarget);
    if (input) {
      input.value = url;
      // Also update the preview box automatically
      showPreviewIfValueExists(currentMediaSelectTarget, currentMediaSelectTarget + '-preview');
    }
  }
  closeMediaSelectModal();
}

// ==========================================
// 5. HELPER FUNCTIONS
// ==========================================

// Write updated `contentData` back to the server database
async function saveContentData(successMessage, callback) {
  try {
    const res = await fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData)
    });
    
    const data = await res.json();
    if (data.success) {
      showToast(successMessage || 'Database updated successfully!', 'success');
      if (callback) callback();
    } else {
      showToast('Save operation failed: ' + data.message, 'error');
    }
  } catch (err) {
    console.error('Error saving content:', err);
    showToast('Failed to send content save request to server.', 'error');
  }
}

// HTML modal popup manager
function openAdminModal() {
  document.getElementById('admin-modal').style.display = 'flex';
}

function closeAdminModal() {
  document.getElementById('admin-modal').style.display = 'none';
  document.getElementById('modal-body').innerHTML = '';
}

// Helper date formatting
function formatDisplayDate(date) {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options); // Eg: "15 Aug 2026"
}

function formatDate(isoString) {
  if (!isoString) return 'N/A';
  const d = new Date(isoString);
  return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
 
  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
}

function copyToClipboard(text) {
  // Try navigator API first
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('URL copied to clipboard! You can paste it into content forms.', 'success');
    }).catch(err => {
      console.error('Failed to copy using clipboard API:', err);
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed'; // prevent scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('URL copied to clipboard!', 'success');
  } catch (err) {
    showToast('Failed to copy link. Please manually copy URL: ' + text, 'error');
  }
  document.body.removeChild(textArea);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

