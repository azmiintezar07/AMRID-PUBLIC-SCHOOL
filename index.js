/* ==========================================================================
   AMRID PUBLIC SCHOOL - Core Application Logic
   ========================================================================== */

// API base URL helper supporting VITE_API_URL or runtime window.__API_URL__
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '')
  : ((typeof window !== 'undefined' && window.__API_URL__) ? String(window.__API_URL__).replace(/\/$/, '') : '');

function getApiUrl(endpoint) {
  if (!API_BASE) return endpoint;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${path}`;
}

document.addEventListener('DOMContentLoaded', () => {

  let websiteData = null;

  // 0. LIGHT / DARK THEME SYSTEM
  function initThemeToggle() {
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem('aps_theme', theme);
      } catch (e) {}
    }

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
      });
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('aps_theme')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  initThemeToggle();

  // 1. MOBILE DRAWER NAVIGATION MENU
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('visible');
    hamburgerToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('visible');
    hamburgerToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeLightbox();
      closeStaffModal();
    }
  });


  // 2. SCROLL HEADER STATE & ACTIVE NAVIGATION LINK SPY
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section.scroll-offset-section, section#home');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // offset header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });


  // 3. INTERACTIVE LIGHTBOX VIEWER (Image & Video)
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxImgContainer = document.getElementById('lightbox-image-container');
  const lightboxVideoContainer = document.getElementById('lightbox-video-container');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxIframe = document.getElementById('lightbox-iframe');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  function openLightbox(title, desc, isVideo, mediaUrl, svgPlaceholderElement = null) {
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    if (isVideo) {
      lightboxImgContainer.style.display = 'none';
      lightboxVideoContainer.style.display = 'block';
      lightboxIframe.src = mediaUrl;
    } else {
      lightboxVideoContainer.style.display = 'none';
      lightboxImgContainer.style.display = 'block';
      
      if (svgPlaceholderElement) {
        // Convert SVG to Data URI for lightbox render
        const svgString = new XMLSerializer().serializeToString(svgPlaceholderElement);
        const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);
        lightboxImg.src = blobURL;
        lightboxImg.alt = title;
      } else {
        lightboxImg.src = mediaUrl;
        lightboxImg.alt = title;
      }
    }

    lightboxModal.style.display = 'flex';
    setTimeout(() => {
      lightboxModal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    setTimeout(() => {
      lightboxModal.style.display = 'none';
      lightboxIframe.src = '';
      lightboxImg.src = '';
    }, 300);
    document.body.style.overflow = '';
  }

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });


  // 4. DYNAMIC DATA LOADING AND RENDERING
  async function loadWebsiteContent() {
    try {
      let res = await fetch(getApiUrl('/data/content.json?t=' + new Date().getTime()));
      if (!res.ok) {
        res = await fetch(getApiUrl('/api/content?t=' + new Date().getTime()));
      }
      if (!res.ok) throw new Error('Failed to load JSON');
      
      websiteData = await res.json();
      applyDynamicData(websiteData);
    } catch (err) {
      console.warn('Could not load dynamic website database. Falling back to static HTML elements.', err);
      // Fallback: Bind event listeners to existing static components
      bindStaticComponents();
    }
  }

  function applyDynamicData(data) {
    // 4.1 Update School Metadata
    const school = data.school_info;
    document.title = `${school.name} | Nursery to Class 8 School in Purnia, Bihar`;
    
    // School Registration No
    const regEl = document.getElementById('editable-reg-number');
    if (regEl) regEl.textContent = school.reg_number;
    const footerRegEl = document.getElementById('footer-reg-number');
    if (footerRegEl) footerRegEl.textContent = school.reg_number;

    // Logo image swap
    const logos = document.querySelectorAll('.school-logo');
    logos.forEach(el => {
      if (school.logo_url) {
        if (el.tagName.toLowerCase() === 'svg') {
          const img = document.createElement('img');
          img.className = 'school-logo custom-logo-img';
          img.src = school.logo_url;
          img.alt = school.name + ' Logo';
          img.style.width = '50px';
          img.style.height = '50px';
          img.style.objectFit = 'contain';
          el.parentNode.replaceChild(img, el);
        } else {
          el.src = school.logo_url;
        }
      }
    });

    // Logo title
    const schoolTitles = document.querySelectorAll('.logo-text .school-title, .drawer-logo .school-title, .branding-col .footer-title');
    schoolTitles.forEach(el => el.textContent = school.name);
    
    // Logo subtitle
    const schoolSubtitles = document.querySelectorAll('.logo-text .school-subtitle');
    schoolSubtitles.forEach(el => el.textContent = school.tagline);

    // Hero Section
    const hero = data.hero_section;
    const badgeEl = document.getElementById('hero-badge-container');
    if (badgeEl) badgeEl.innerHTML = `<span class="badge-dot"></span> ${hero.badge}`;
    
    const heroTitleEl = document.getElementById('hero-title-container');
    if (heroTitleEl) heroTitleEl.textContent = hero.title;
    
    const heroTaglineEl = document.getElementById('hero-tagline-container');
    if (heroTaglineEl) heroTaglineEl.textContent = hero.tagline;

    const heroDescEl = document.getElementById('hero-desc-container');
    if (heroDescEl) heroDescEl.textContent = hero.description;

    const heroBtn1 = document.getElementById('hero-btn1');
    if (heroBtn1 && hero.button1_text) heroBtn1.textContent = hero.button1_text;

    const heroBtn2 = document.getElementById('hero-btn2');
    if (heroBtn2 && hero.button2_text) heroBtn2.textContent = hero.button2_text;

    // Hero background image
    const heroSec = document.getElementById('home');
    if (heroSec && hero.image_url) {
      heroSec.style.backgroundImage = `url('${hero.image_url}')`;
    }

    // 4.2 About Us Section
    const aboutTitleEl = document.getElementById('about-title-container');
    if (aboutTitleEl) aboutTitleEl.textContent = school.about_title;

    const aboutTextEl = document.getElementById('about-text-container');
    if (aboutTextEl && school.about_text) {
      aboutTextEl.innerHTML = school.about_text.split('\n\n')
        .map(p => `<p class="about-text">${p.replace(/AMRID PUBLIC SCHOOL/g, '<strong>AMRID PUBLIC SCHOOL</strong>').replace(/Nursery to Class 8/g, '<strong>Nursery to Class 8</strong>')}</p>`)
        .join('');
    }

    // Admission Guidelines description text
    const admissionTextEl = document.querySelector('.admission-text');
    if (admissionTextEl && school.admission_info) {
      admissionTextEl.textContent = school.admission_info;
    }

    // 4.3 Leadership messages
    const leadersContainer = document.getElementById('messages-grid-container');
    const leadersSection = document.getElementById('leadership') || document.getElementById('messages');
    if (leadersContainer && leadersSection) {
      if (school.show_leaders === false) {
        leadersSection.style.display = 'none';
      } else {
        leadersSection.style.display = 'block';

        const dirMsg = data.director_info.message || '';
        const dirShort = dirMsg.length > 220 ? dirMsg.slice(0, 215) + '...' : dirMsg;
        const dirRest = dirMsg.length > 220 ? dirMsg.slice(215) : '';

        const prinMsg = data.principal_info.message || '';
        const prinShort = prinMsg.length > 220 ? prinMsg.slice(0, 215) + '...' : prinMsg;
        const prinRest = prinMsg.length > 220 ? prinMsg.slice(215) : '';

        leadersContainer.innerHTML = `
          <!-- Director Card -->
          <div class="leader-card">
            <div class="leader-card-header">
              <div class="leader-avatar-wrapper">
                ${data.director_info.photo_url ? 
                  `<img src="${escapeHtml(data.director_info.photo_url)}" class="leader-avatar-img" alt="${escapeHtml(data.director_info.name)} - Director">` :
                  `<svg class="leader-svg-icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>`
                }
                <div class="leader-role-badge">Director</div>
              </div>
              <div class="leader-header-details">
                <h3 class="leader-name">${escapeHtml(data.director_info.name)}</h3>
                <span class="leader-designation">${escapeHtml(data.director_info.designation || 'Director')}, AMRID Public School</span>
                <div class="leader-contact-row">
                  <a href="tel:${data.director_info.phone.replace(/[^0-9]/g, '')}" class="leader-contact-link link-call-btn">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    ${escapeHtml(data.director_info.phone)}
                  </a>
                  <a href="https://wa.me/${data.director_info.phone.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" class="leader-contact-link whatsapp">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.43-.003 9.85-4.427 9.853-9.86.002-2.63-1.023-5.102-2.884-6.964C16.377 1.916 13.91 1.892 11.997 1.892c-5.435 0-9.855 4.425-9.858 9.86-.002 1.81.488 3.579 1.419 5.118l-.993 3.624 3.71-.973zm11.233-6.223c-.302-.15-1.78-.88-2.057-.98-.277-.1-.48-.15-.68.15-.2.3-.77.98-.94 1.18-.17.2-.34.22-.64.07-1.125-.565-1.92-1.01-2.684-2.324-.31-.53.31-.49.88-1.62.09-.19.04-.35-.02-.5-.06-.15-.48-1.16-.66-1.59-.17-.42-.35-.36-.48-.37-.12-.005-.27-.005-.42-.005-.15 0-.4.06-.61.28-.21.23-.8.78-.8 1.9 0 1.12.8 2.2 0.93 2.37.13.17 1.6 2.45 3.88 3.43.54.23 1.0.38 1.34.49.54.17 1.03.15 1.42.09.43-.06 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.3-.21-.6-.36z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div class="leader-card-body">
              <blockquote class="leader-quote">
                <span class="quote-mark">“</span>
                <p class="leader-message-preview">${escapeHtml(dirShort)}</p>
                ${dirRest ? `
                  <div class="leader-message-full" style="display: none;">
                    <p>${escapeHtml(dirRest)}</p>
                  </div>
                ` : ''}
              </blockquote>
              ${dirRest ? `
                <div class="leader-card-footer">
                  <button type="button" class="btn-read-more" onclick="window.toggleLeaderMessage(this)">Read More</button>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Principal Card -->
          <div class="leader-card">
            <div class="leader-card-header">
              <div class="leader-avatar-wrapper">
                ${data.principal_info.photo_url ? 
                  `<img src="${escapeHtml(data.principal_info.photo_url)}" class="leader-avatar-img" alt="${escapeHtml(data.principal_info.name)} - Principal">` :
                  `<svg class="leader-svg-icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>`
                }
                <div class="leader-role-badge">Principal</div>
              </div>
              <div class="leader-header-details">
                <h3 class="leader-name">${escapeHtml(data.principal_info.name)}</h3>
                <span class="leader-designation">${escapeHtml(data.principal_info.designation || 'Principal')}, AMRID Public School</span>
                <div class="leader-contact-row">
                  <a href="tel:${data.principal_info.phone.replace(/[^0-9]/g, '')}" class="leader-contact-link link-call-btn-principal">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    ${escapeHtml(data.principal_info.phone)}
                  </a>
                  <a href="https://wa.me/${data.principal_info.phone.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" class="leader-contact-link whatsapp">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.43-.003 9.85-4.427 9.853-9.86.002-2.63-1.023-5.102-2.884-6.964C16.377 1.916 13.91 1.892 11.997 1.892c-5.435 0-9.855 4.425-9.858 9.86-.002 1.81.488 3.579 1.419 5.118l-.993 3.624 3.71-.973zm11.233-6.223c-.302-.15-1.78-.88-2.057-.98-.277-.1-.48-.15-.68.15-.2.3-.77.98-.94 1.18-.17.2-.34.22-.64.07-1.125-.565-1.92-1.01-2.684-2.324-.31-.53.31-.49.88-1.62.09-.19.04-.35-.02-.5-.06-.15-.48-1.16-.66-1.59-.17-.42-.35-.36-.48-.37-.12-.005-.27-.005-.42-.005-.15 0-.4.06-.61.28-.21.23-.8.78-.8 1.9 0 1.12.8 2.2 0.93 2.37.13.17 1.6 2.45 3.88 3.43.54.23 1.0.38 1.34.49.54.17 1.03.15 1.42.09.43-.06 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.3-.21-.6-.36z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <div class="leader-card-body">
              <blockquote class="leader-quote">
                <span class="quote-mark">“</span>
                <p class="leader-message-preview">${escapeHtml(prinShort)}</p>
                ${prinRest ? `
                  <div class="leader-message-full" style="display: none;">
                    <p>${escapeHtml(prinRest)}</p>
                  </div>
                ` : ''}
              </blockquote>
              ${prinRest ? `
                <div class="leader-card-footer">
                  <button type="button" class="btn-read-more" onclick="window.toggleLeaderMessage(this)">Read More</button>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }
    }

    // 4.3C Faculty & Staff
    renderFaculty(data.faculty_staff || []);

    // 4.4 Why Choose Us & Facilities
    // Preserve Section 4's 8 distinct excellence pillars (do not overwrite with facilities)
    if (data.why_choose && Array.isArray(data.why_choose)) {
      const whyChooseContainer = document.getElementById('why-choose-grid-container');
      if (whyChooseContainer) {
        whyChooseContainer.innerHTML = '';
        data.why_choose.forEach(fac => {
          const div = document.createElement('div');
          div.className = 'why-card';
          div.innerHTML = `
            <div class="why-icon">${fac.icon || '🌟'}</div>
            <h3 class="why-title">${escapeHtml(fac.title)}</h3>
            <p class="why-text">${escapeHtml(fac.description)}</p>
          `;
          whyChooseContainer.appendChild(div);
        });
      }
    }

    // Update School Timings in footer if provided
    if (data.contact_settings?.school_timings || data.school_info?.school_timings) {
      const timings = data.contact_settings?.school_timings || data.school_info?.school_timings;
      const timingsEl = document.getElementById('footer-timings-val');
      if (timingsEl && timings) {
        timingsEl.innerHTML = escapeHtml(timings).replace(/\n/g, '<br>');
      }
    }

    // 4.5 Hostel Section
    const host = data.hostel_info;
    const hostDesc = document.getElementById('hostel-desc-container');
    if (hostDesc) hostDesc.textContent = host.description;

    const hostelGraphic = document.querySelector('.hostel-graphic');
    if (hostelGraphic && host.image_url) {
      hostelGraphic.innerHTML = `<img src="${host.image_url}" alt="Hostel Facility" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">`;
    }

    const hostBullets = document.getElementById('hostel-bullets-container');
    if (hostBullets && host.bullets) {
      hostBullets.innerHTML = '';
      host.bullets.forEach(bullet => {
        const parts = bullet.split(':');
        const strongText = parts[0] || '';
        const normalText = parts.slice(1).join(':') || '';

        const div = document.createElement('div');
        div.className = 'bullet-item';
        div.innerHTML = `
          <svg class="bullet-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span><strong>${escapeHtml(strongText)}</strong>${escapeHtml(normalText ? ':' + normalText : '')}</span>
        `;
        hostBullets.appendChild(div);
      });
    }

    // 4.6 Notice Board
    renderNotices(data.notices);

    // 4.7 Upcoming Events
    renderEvents(data.events);

    // 4.8 Gallery
    renderGallery(data.gallery);

    // 4.9 Social Links and Contact settings
    const con = data.contact_settings;
    const soc = data.social_media;

    // Contact setting changes
    const addrVals = document.querySelectorAll('#contact-address-val, .branding-col .footer-address');
    addrVals.forEach(el => el.innerHTML = con.address.replace(/,/g, ',<br>'));

    const directorPhones = document.querySelectorAll('#contact-director-phone, .contact-col a[href^="tel:9905430742"]');
    directorPhones.forEach(el => {
      el.textContent = con.phone;
      el.href = `tel:${con.phone.replace(/[^0-9]/g, '')}`;
    });

    const principalPhones = document.querySelectorAll('#contact-principal-phone, .contact-col a[href^="tel:9693264161"]');
    principalPhones.forEach(el => {
      el.textContent = data.principal_info.phone;
      el.href = `tel:${data.principal_info.phone.replace(/[^0-9]/g, '')}`;
    });

    const directorNames = document.querySelectorAll('#contact-director-name');
    directorNames.forEach(el => el.textContent = data.director_info.name);

    const principalNames = document.querySelectorAll('#contact-principal-name');
    principalNames.forEach(el => el.textContent = data.principal_info.name);

    // Floating WhatsApp Widget
    const whatsappFloating = document.querySelector('.floating-whatsapp-widget');
    if (whatsappFloating) whatsappFloating.href = `https://wa.me/${soc.whatsapp.replace(/[^0-9]/g, '')}`;

    // WhatsApp Call buttons
    const whatsappCallBtns = document.querySelectorAll('.link-whatsapp-btn, .cta-buttons-wrapper a[href^="https://wa.me/"]');
    whatsappCallBtns.forEach(el => {
      el.href = `https://wa.me/${soc.whatsapp.replace(/[^0-9]/g, '')}`;
    });

    const whatsappCallPrincipal = document.querySelectorAll('.link-whatsapp-btn-principal');
    whatsappCallPrincipal.forEach(el => {
      el.href = `https://wa.me/${data.principal_info.phone.replace(/[^0-9]/g, '')}`;
    });

    // Call Us buttons
    const callUsBtns = document.querySelectorAll('.link-call-btn, .hero-ctas a[href^="tel:"]');
    callUsBtns.forEach(el => {
      el.href = `tel:${con.phone.replace(/[^0-9]/g, '')}`;
    });

    const callUsPrincipal = document.querySelectorAll('.link-call-btn-principal');
    callUsPrincipal.forEach(el => {
      el.href = `tel:${data.principal_info.phone.replace(/[^0-9]/g, '')}`;
    });

    // Instagram Links
    const instagramLinks = document.querySelectorAll('a[href^="https://instagram.com/"], .socials-col a[aria-label^="Follow us on Instagram"]');
    instagramLinks.forEach(el => {
      el.href = soc.instagram;
    });
    
    // Facebook and YouTube if exists
    const facebookLink = document.querySelector('.facebook-social-link');
    if (facebookLink) facebookLink.href = soc.facebook;
    
    const youtubeLink = document.querySelector('.youtube-social-link');
    if (youtubeLink) youtubeLink.href = soc.youtube;

    // Google Maps Embed
    const mapIframe = document.querySelector('.google-map-iframe');
    if (mapIframe) mapIframe.src = con.google_maps_embed;

    const mapDirections = document.querySelectorAll('.link-map-directions, .location-ctas a[href^="https://www.google.com/maps/"]');
    mapDirections.forEach(el => {
      el.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(con.address)}`;
    });
  }

  // --- RENDERING SUB-SECTIONS ---

  // Notice board rendering
  function renderNotices(notices) {
    const container = document.getElementById('notices-wrapper');
    if (!container) return;

    container.innerHTML = '';
    
    // Filter published AND non-expired notices
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const published = notices.filter(n => {
      const isPub = n.is_published !== false;
      let notExpired = true;
      if (n.expiry_date) {
        const expDate = new Date(n.expiry_date);
        expDate.setHours(0, 0, 0, 0);
        notExpired = expDate >= now;
      }
      return isPub && notExpired;
    });

    if (published.length === 0) {
      container.innerHTML = '<p style="text-align:center; color:rgba(255,255,255,0.4); padding:40px 0;">No notices published currently.</p>';
      return;
    }

    published.forEach(n => {
      // Parse Date (Eg: "14 Aug 2026")
      const dateParts = n.date.split(' ');
      const day = dateParts[0] || '';
      const monthYear = dateParts.slice(1).join(' ') || '';

      const div = document.createElement('div');
      div.className = 'notice-item';
      div.setAttribute('data-category', n.category);

      let badgeClass = 'badge-general';
      let badgeLabel = 'General';
      if (n.category === 'admission') {
        badgeClass = 'badge-admission';
        badgeLabel = 'Admission Announcement';
      } else if (n.category === 'events') {
        badgeClass = 'badge-events';
        badgeLabel = 'Important Event';
      }

      div.innerHTML = `
        <div class="notice-date">
          <span class="date-day">${escapeHtml(day)}</span>
          <span class="date-month">${escapeHtml(monthYear)}</span>
        </div>
        <div class="notice-details">
          <span class="notice-badge ${badgeClass}">${escapeHtml(badgeLabel)}</span>
          ${n.is_important ? '<span class="notice-badge badge-admission" style="background-color:var(--danger-red); margin-left:8px;">Urgent</span>' : ''}
          <h3 class="notice-title">${escapeHtml(n.title)}</h3>
          <p class="notice-text">${escapeHtml(n.text)}</p>
        </div>
      `;

      container.appendChild(div);
    });

    // Re-bind notice filtering logic
    bindNoticeFilters();
  }

  // Events list rendering (with Upcoming vs Past separation)
  let activeEventFilter = 'upcoming'; // 'upcoming' | 'past' | 'all'
  let cachedEvents = [];

  function renderEvents(events) {
    if (events) {
      cachedEvents = events;
    }
    const container = document.getElementById('events-grid-container');
    if (!container) return;

    container.innerHTML = '';
    const published = (cachedEvents || []).filter(e => e.is_published !== false);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const filtered = published.filter(ev => {
      const evDate = new Date(ev.date);
      evDate.setHours(0, 0, 0, 0);
      const isPast = ev.status === 'past' || (ev.status !== 'upcoming' && evDate < now);

      if (activeEventFilter === 'upcoming') {
        return !isPast;
      } else if (activeEventFilter === 'past') {
        return isPast;
      }
      return true; // 'all'
    });

    if (filtered.length === 0) {
      const msg = activeEventFilter === 'upcoming' 
        ? 'No upcoming events scheduled at this time. Check back soon or view our Past Events archive!' 
        : activeEventFilter === 'past'
        ? 'No archived past events to show.'
        : 'No events published at this time.';
      container.innerHTML = `<p class="empty-list-text" style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px 0;">${msg}</p>`;
      bindEventTabs();
      return;
    }

    filtered.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card';

      const evDate = new Date(ev.date);
      evDate.setHours(0, 0, 0, 0);
      const isPast = ev.status === 'past' || (ev.status !== 'upcoming' && evDate < now);
      const displayDateStr = new Date(ev.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

      card.innerHTML = `
        <div class="event-card-img-wrapper">
          ${ev.image_url ? 
            `<img src="${ev.image_url}" alt="${escapeHtml(ev.title)}" loading="lazy">` : 
            `<svg viewBox="0 0 400 250" width="100%" height="100%" fill="none">
              <rect width="100%" height="100%" fill="#1b3a57"/>
              <polygon points="200,60 215,100 260,100 225,125 238,165 200,140 162,165 175,125 140,100 185,100" fill="#c5a059" opacity="0.3"/>
            </svg>`
          }
          <div class="event-date-badge">${displayDateStr}</div>
        </div>
        <div class="event-card-content">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
            <h3 class="event-card-title" style="margin-bottom: 0;">${escapeHtml(ev.title)}</h3>
            <span class="event-status-tag ${isPast ? 'event-status-past' : 'event-status-upcoming'}">
              ${isPast ? 'Past Event' : 'Upcoming'}
            </span>
          </div>
          <p class="event-card-desc">${escapeHtml(ev.description)}</p>
          <div class="event-card-meta">
            <div class="meta-item">
              <span class="meta-icon">⏰</span>
              <span>${escapeHtml(ev.time)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <span>${escapeHtml(ev.location)}</span>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    bindEventTabs();
  }

  function bindEventTabs() {
    const tabs = document.querySelectorAll('.event-tab');
    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeEventFilter = tab.getAttribute('data-event-type') || 'all';
        renderEvents();
      };
    });
  }

  // Gallery grid rendering
  function renderGallery(galleryItems) {
    const container = document.getElementById('gallery-items-container');
    if (!container) return;

    container.innerHTML = '';

    const publishedItems = galleryItems.filter(item => item.is_published !== false);

    publishedItems.forEach(item => {
      const card = document.createElement('div');
      card.className = `gallery-item-card ${item.type === 'video' ? 'video-card' : ''}`;
      card.setAttribute('data-category', item.type === 'video' ? 'videos' : item.category);
      if (item.type === 'video') {
        card.setAttribute('data-video-url', item.url);
      }

      let mediaWrapperHtml = '';

      if (item.type === 'video') {
        if (item.thumbnail_url) {
          mediaWrapperHtml = `
            <img src="${item.thumbnail_url}" alt="${escapeHtml(item.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
            <div class="gallery-item-overlay">
              <div class="play-btn-circle">
                <span class="play-triangle"></span>
              </div>
              <span class="gallery-item-tag">Reels / Video</span>
            </div>
          `;
        } else {
          mediaWrapperHtml = `
            <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" class="gallery-svg-placeholder">
              <rect width="100%" height="100%" fill="#0d233a"/>
              <polygon points="175,110 235,140 175,170" fill="#c5a059"/>
              <circle cx="200" cy="140" r="45" stroke="#c5a059" stroke-width="2" />
              <text x="200" y="235" font-family="'Outfit', sans-serif" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="middle">${escapeHtml(item.title)}</text>
            </svg>
            <div class="gallery-item-overlay">
              <div class="play-btn-circle">
                <span class="play-triangle"></span>
              </div>
              <span class="gallery-item-tag">Reels / Video</span>
            </div>
          `;
        }
      } else {
        // Image item
        if (item.url) {
          mediaWrapperHtml = `
            <img src="${item.url}" alt="${escapeHtml(item.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
            <div class="gallery-item-overlay">
              <span class="zoom-icon">+</span>
              <span class="gallery-item-tag" style="text-transform: capitalize;">${item.category}</span>
            </div>
          `;
        } else {
          // Categories SVG placeholders mapping
          let svgContent = `<rect width="100%" height="100%" fill="#1b3a57"/><circle cx="200" cy="130" r="45" stroke="#c5a059" stroke-width="2" />`;
          if (item.category === 'hostel') {
            svgContent = `<rect width="100%" height="100%" fill="#0d233a"/><path d="M 100 210 L 200 130 L 300 210 Z" fill="#c5a059" opacity="0.8"/><rect x="150" y="210" width="100" height="50" fill="#1b3a57" />`;
          } else if (item.category === 'events') {
            svgContent = `<rect width="100%" height="100%" fill="#1b3a57"/><polygon points="200,60 215,100 260,100 225,125 238,165 200,140 162,165 175,125 140,100 185,100" fill="#c5a059"/>`;
          }
          
          mediaWrapperHtml = `
            <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" class="gallery-svg-placeholder">
              ${svgContent}
              <text x="200" y="245" font-family="'Outfit', sans-serif" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="middle">${escapeHtml(item.title)}</text>
            </svg>
            <div class="gallery-item-overlay">
              <span class="zoom-icon">+</span>
              <span class="gallery-item-tag" style="text-transform: capitalize;">${item.category}</span>
            </div>
          `;
        }
      }

      card.innerHTML = `
        <div class="gallery-media-wrapper">
          ${mediaWrapperHtml}
        </div>
        <div class="gallery-item-info">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description || '')}</p>
        </div>
      `;

      container.appendChild(card);
    });

    // Re-bind gallery tab & lightbox listeners
    bindGalleryActions();
  }

  // --- BIND FILTER EVENT HANDLERS ---
  function bindNoticeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noticeItems = document.querySelectorAll('.notice-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        noticeItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');

          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'flex';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  function bindGalleryActions() {
    // Gallery Category tab clicks
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item-card');

    galleryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        galleryTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const tabValue = tab.getAttribute('data-tab');

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');

          if (tabValue === 'all' || itemCategory === tabValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // Lightbox hooks
    galleryItems.forEach(card => {
      const mediaWrapper = card.querySelector('.gallery-media-wrapper');
      if (!mediaWrapper) return;

      mediaWrapper.addEventListener('click', () => {
        const title = card.querySelector('.gallery-item-info h3').textContent;
        const desc = card.querySelector('.gallery-item-info p').textContent;
        const isVideo = card.classList.contains('video-card');
        
        if (isVideo) {
          const videoUrl = card.getAttribute('data-video-url');
          openLightbox(title, desc, true, videoUrl);
        } else {
          const img = mediaWrapper.querySelector('img');
          if (img) {
            openLightbox(title, desc, false, img.src);
          } else {
            const svg = mediaWrapper.querySelector('.gallery-svg-placeholder');
            openLightbox(title, desc, false, '', svg);
          }
        }
      });
    });
  }

  // --- FACULTY & STAFF RENDERING & MODAL ---
  let activeFacultyCategory = 'all';

  function renderFaculty(facultyList) {
    const container = document.getElementById('faculty-grid-container');
    if (!container) return;

    container.innerHTML = '';
    
    const activeStaff = (facultyList || [])
      .filter(f => f.is_active !== false)
      .sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));

    const filtered = activeFacultyCategory === 'all' 
      ? activeStaff 
      : activeStaff.filter(f => f.category === activeFacultyCategory);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-faculty-notice">
          <p>No faculty profiles currently listed under this category.</p>
        </div>
      `;
      return;
    }

    const categoryLabels = {
      'leadership': 'School Leadership',
      'teaching': 'Teaching Faculty',
      'admin': 'Administrative Staff',
      'support': 'Support Staff'
    };

    filtered.forEach(member => {
      const card = document.createElement('div');
      card.className = 'staff-card';
      card.setAttribute('data-id', member.id);
      card.setAttribute('data-category', member.category || 'teaching');

      const categoryClass = member.category || 'teaching';
      const categoryTitle = categoryLabels[member.category] || 'Faculty Member';

      const photoHtml = member.photo_url ? 
        `<img src="${escapeHtml(member.photo_url)}" alt="${escapeHtml(member.name)}" class="staff-avatar-img" loading="lazy">` :
        `<div class="staff-avatar-placeholder">
          <span>${escapeHtml((member.name || 'APS').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase())}</span>
        </div>`;

      card.innerHTML = `
        <div class="staff-card-header">
          <div class="staff-avatar-wrapper">
            ${photoHtml}
          </div>
          <span class="staff-category-pill pill-${categoryClass}">${escapeHtml(categoryTitle)}</span>
        </div>
        <div class="staff-card-body">
          <h3 class="staff-name">${escapeHtml(member.name)}</h3>
          <p class="staff-designation">${escapeHtml(member.designation || 'Staff')}</p>
          
          <div class="staff-meta-badges">
            ${member.qualification ? `<span class="staff-badge badge-qual" title="Qualification">🎓 ${escapeHtml(member.qualification)}</span>` : ''}
            ${member.subject ? `<span class="staff-badge badge-subj" title="Subject / Focus">📚 ${escapeHtml(member.subject)}</span>` : ''}
            ${member.experience ? `<span class="staff-badge badge-exp" title="Experience">⏳ ${escapeHtml(member.experience)}</span>` : ''}
          </div>

          ${member.bio ? `
            <p class="staff-bio-excerpt">
              ${escapeHtml(member.bio.length > 105 ? member.bio.slice(0, 102) + '...' : member.bio)}
            </p>
          ` : ''}
        </div>
        <div class="staff-card-footer">
          <button type="button" class="btn-staff-detail" onclick="window.openStaffModal('${escapeHtml(member.id)}')">
            <span>View Full Profile</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  function bindFacultyFilters() {
    const tabs = document.querySelectorAll('.faculty-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        activeFacultyCategory = tab.getAttribute('data-category') || 'all';
        if (websiteData && websiteData.faculty_staff) {
          renderFaculty(websiteData.faculty_staff);
        }
      });
    });
  }

  window.openStaffModal = function(memberId) {
    if (!websiteData || !websiteData.faculty_staff) return;
    const member = websiteData.faculty_staff.find(m => String(m.id) === String(memberId));
    if (!member) return;

    const modal = document.getElementById('staff-modal');
    const modalBody = document.getElementById('staff-modal-body');
    if (!modal || !modalBody) return;

    const categoryLabels = {
      'leadership': 'School Leadership',
      'teaching': 'Teaching Faculty',
      'admin': 'Administrative Staff',
      'support': 'Support Staff'
    };

    const categoryTitle = categoryLabels[member.category] || 'Faculty & Staff';

    const photoHtml = member.photo_url ? 
      `<img src="${escapeHtml(member.photo_url)}" alt="${escapeHtml(member.name)}" class="staff-detail-photo">` :
      `<div class="staff-detail-placeholder">
        <span>${escapeHtml((member.name || 'APS').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase())}</span>
      </div>`;

    modalBody.innerHTML = `
      <div class="staff-detail-container">
        <div class="staff-detail-sidebar">
          <div class="staff-detail-photo-box">
            ${photoHtml}
          </div>
          <span class="staff-category-pill pill-${member.category || 'teaching'}">${escapeHtml(categoryTitle)}</span>
          ${member.phone ? `
            <div class="staff-detail-actions">
              <a href="tel:${member.phone.replace(/[^0-9]/g, '')}" class="btn btn-blue-solid btn-sm btn-full">
                📞 Call Staff
              </a>
              <a href="https://wa.me/${member.phone.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-solid btn-sm btn-full">
                WhatsApp
              </a>
            </div>
          ` : ''}
        </div>
        <div class="staff-detail-main">
          <h2 class="staff-detail-name">${escapeHtml(member.name)}</h2>
          <p class="staff-detail-designation">${escapeHtml(member.designation || 'Staff')}</p>
          
          <div class="staff-detail-grid">
            <div class="detail-cell">
              <span class="detail-cell-label">Qualification</span>
              <span class="detail-cell-value">${escapeHtml(member.qualification || 'Standard Qualification')}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Subject / Area</span>
              <span class="detail-cell-value">${escapeHtml(member.subject || 'All Subjects')}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Experience</span>
              <span class="detail-cell-value">${escapeHtml(member.experience || 'Experienced')}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Department</span>
              <span class="detail-cell-value">${escapeHtml(categoryTitle)}</span>
            </div>
          </div>

          <div class="staff-detail-bio-box">
            <h4 class="bio-heading">About / Background</h4>
            <p class="bio-text">${escapeHtml(member.bio || 'Dedicated educator at AMRID Public School committed to fostering student knowledge, moral discipline, and personal growth.')}</p>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  function closeStaffModal() {
    const modal = document.getElementById('staff-modal');
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 250);
    document.body.style.overflow = '';
  }

  const staffCloseBtn = document.getElementById('staff-modal-close');
  const staffBackdrop = document.getElementById('staff-modal-backdrop');
  if (staffCloseBtn) staffCloseBtn.addEventListener('click', closeStaffModal);
  if (staffBackdrop) staffBackdrop.addEventListener('click', closeStaffModal);

  function bindStaticComponents() {
    bindNoticeFilters();
    bindGalleryActions();
    bindFacultyFilters();
  }


  // 5. FORM SUBMISSION VALIDATION & API SUBMIT

  // Helper validation
  function validateInput(input, errorElementId, validationFn) {
    const value = input.value.trim();
    const isValid = validationFn(value);
    const errorMsg = document.getElementById(errorElementId);

    if (!isValid) {
      input.classList.add('invalid');
      if (errorMsg) errorMsg.classList.add('visible');
      return false;
    } else {
      input.classList.remove('invalid');
      if (errorMsg) errorMsg.classList.remove('visible');
      return true;
    }
  }

  const isNotEmpty = value => value !== '';
  const isValidPhone = value => /^[0-9]{10}$/.test(value); // strictly 10 digits

  // 5.1 Admission Enquiry Form
  const enquiryForm = document.getElementById('enquiry-form');
  const parentNameInput = document.getElementById('parent-name');
  const studentNameInput = document.getElementById('student-name');
  const phoneInput = document.getElementById('phone-number');
  const classSelect = document.getElementById('class-apply');
  const successBanner = document.getElementById('form-success-banner');
  const errorBanner = document.getElementById('form-error-banner');

  if (enquiryForm) {
    parentNameInput.addEventListener('blur', () => validateInput(parentNameInput, 'parent-name-error', isNotEmpty));
    studentNameInput.addEventListener('blur', () => validateInput(studentNameInput, 'student-name-error', isNotEmpty));
    phoneInput.addEventListener('blur', () => validateInput(phoneInput, 'phone-number-error', isValidPhone));
    classSelect.addEventListener('change', () => validateInput(classSelect, 'class-apply-error', isNotEmpty));

    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isParentValid = validateInput(parentNameInput, 'parent-name-error', isNotEmpty);
      const isStudentValid = validateInput(studentNameInput, 'student-name-error', isNotEmpty);
      const isPhoneValid = validateInput(phoneInput, 'phone-number-error', isValidPhone);
      const isClassValid = validateInput(classSelect, 'class-apply-error', isNotEmpty);

      if (!(isParentValid && isStudentValid && isPhoneValid && isClassValid)) {
        errorBanner.style.display = 'flex';
        successBanner.style.display = 'none';
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Prepare payload
      const emailInput = document.getElementById('enquiry-email');
      const payload = {
        parentName: parentNameInput.value.trim(),
        studentName: studentNameInput.value.trim(),
        phoneNumber: phoneInput.value.trim(),
        email: emailInput ? emailInput.value.trim() : '',
        classApply: classSelect.value,
        message: document.getElementById('message').value.trim()
      };

      // Set loader/disabled states
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
      if (submitBtn) submitBtn.textContent = 'Submitting Enquiry...';

      errorBanner.style.display = 'none';
      enquiryForm.style.opacity = '0.4';
      const elements = enquiryForm.elements;
      for (let i = 0; i < elements.length; i++) elements[i].disabled = true;

      try {
        const res = await fetch(getApiUrl('/api/enquiry'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          enquiryForm.style.display = 'none';
          successBanner.style.display = 'flex';
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error(data.message || 'Submission rejected by server.');
        }
      } catch (err) {
        console.error('Enquiry API submission error:', err);
        
        // Re-enable form fields
        enquiryForm.style.opacity = '1';
        if (submitBtn) submitBtn.textContent = originalBtnText;
        for (let i = 0; i < elements.length; i++) elements[i].disabled = false;
        
        errorBanner.querySelector('p').textContent = err.message || 'There was a connection issue. Please try again.';
        errorBanner.style.display = 'flex';
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 5.2 General Contact Form
  const contactForm = document.getElementById('contact-form');
  const contactNameInput = document.getElementById('contact-name-input');
  const contactEmailInput = document.getElementById('contact-email-input');
  const contactPhoneInput = document.getElementById('contact-phone-input');
  const contactSubjectInput = document.getElementById('contact-subject-input');
  const contactMessageInput = document.getElementById('contact-message-input');
  const contactSuccessBanner = document.getElementById('contact-success-banner');
  const contactErrorBanner = document.getElementById('contact-error-banner');

  if (contactForm) {
    contactNameInput.addEventListener('blur', () => validateInput(contactNameInput, 'contact-name-error', isNotEmpty));
    contactMessageInput.addEventListener('blur', () => validateInput(contactMessageInput, 'contact-message-error', isNotEmpty));

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNameValid = validateInput(contactNameInput, 'contact-name-error', isNotEmpty);
      const isMessageValid = validateInput(contactMessageInput, 'contact-message-error', isNotEmpty);

      if (!(isNameValid && isMessageValid)) {
        contactErrorBanner.style.display = 'flex';
        contactSuccessBanner.style.display = 'none';
        contactErrorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Prepare payload
      const payload = {
        name: contactNameInput.value.trim(),
        email: contactEmailInput.value.trim(),
        phone: contactPhoneInput.value.trim(),
        subject: contactSubjectInput.value.trim(),
        message: contactMessageInput.value.trim()
      };

      // Set loader/disabled states
      const contactSubmitBtn = contactForm.querySelector('button[type="submit"]');
      const originalContactBtnText = contactSubmitBtn ? contactSubmitBtn.textContent : 'Send';
      if (contactSubmitBtn) contactSubmitBtn.textContent = 'Sending Message...';

      contactErrorBanner.style.display = 'none';
      contactForm.style.opacity = '0.4';
      const elements = contactForm.elements;
      for (let i = 0; i < elements.length; i++) elements[i].disabled = true;

      try {
        const res = await fetch(getApiUrl('/api/contact'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          contactForm.style.display = 'none';
          contactSuccessBanner.style.display = 'flex';
          contactSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error(data.message || 'Submission rejected by server.');
        }
      } catch (err) {
        console.error('Contact API submission error:', err);
        
        // Re-enable form fields
        contactForm.style.opacity = '1';
        if (contactSubmitBtn) contactSubmitBtn.textContent = originalContactBtnText;
        for (let i = 0; i < elements.length; i++) elements[i].disabled = false;
        
        contactErrorBanner.querySelector('p').textContent = err.message || 'There was a connection issue. Please try again.';
        contactErrorBanner.style.display = 'flex';
        contactErrorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }


  // 6. FAQ ACCORDION TOGGLES
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const faqItem = trigger.parentElement;
      const faqContent = faqItem.querySelector('.faq-content');
      const isOpen = faqItem.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        item.querySelector('.faq-content').style.maxHeight = '0';
      });

      if (!isOpen) {
        faqItem.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
      } else {
        faqItem.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        faqContent.style.maxHeight = '0';
      }
    });
  });

  // Run dynamic fetch
  loadWebsiteContent();

});

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.toggleLeaderMessage = function(button) {
  const leaderCard = button.closest('.leader-card');
  if (!leaderCard) return;
  const fullMsg = leaderCard.querySelector('.leader-message-full');
  if (!fullMsg) return;
  const isHidden = fullMsg.style.display === 'none' || !fullMsg.style.display;
  if (isHidden) {
    fullMsg.style.display = 'block';
    button.textContent = 'Read Less';
  } else {
    fullMsg.style.display = 'none';
    button.textContent = 'Read More';
  }
};
