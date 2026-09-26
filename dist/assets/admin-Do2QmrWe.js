import"./modulepreload-polyfill-B5Qt9EMX.js";let n=null,p=null,w=[],H="dashboard",q=null;window.openAddGalleryModal=ye;window.openEditGalleryModal=Pe;window.toggleGalleryPublish=je;window.deleteGalleryItem=Ge;window.moveGalleryItem=ze;window.openCategoryManagerModal=He;window.openUploadGalleryModal=Ue;window.openAddNoticeModal=Re;window.openEditNoticeModal=Oe;window.toggleNoticePublish=Ve;window.deleteNotice=Ye;window.openAddEventModal=Je;window.openEditEventModal=Qe;window.toggleEventPublish=We;window.deleteEvent=Ke;window.openAddFacilityModal=Ze;window.openEditFacilityModal=Xe;window.deleteFacility=et;window.openAddFacultyModal=De;window.openEditFacultyModal=qe;window.deleteFacultyMember=Ae;window.toggleFacultyStatus=Fe;window.moveFacultyMember=Ne;window.filterFacultyTable=Te;window.openEnquiryDetailsModal=ve;window.openMessageDetailsModal=be;window.toggleMessageReadState=ot;window.updateSubmissionStatus=it;window.deleteSubmission=at;window.triggerMediaUpload=nt;window.handleMediaUpload=lt;window.deleteMediaFile=st;window.closeAdminModal=h;window.closeMediaSelectModal=he;window.copyToClipboard=xe;window.selectMediaForInput=we;function g(t,e="success"){let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",document.body.appendChild(a));const i=document.createElement("div");i.className=`toast toast-${e}`;let o="✓";e==="error"?o="⚠":e==="info"&&(o="ℹ"),i.innerHTML=`
    <span class="toast-icon">${o}</span>
    <span class="toast-message">${d(t)}</span>
  `,a.appendChild(i),setTimeout(()=>i.classList.add("show"),10),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},4e3)}function $(t,e){const a=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Confirm Action",a.innerHTML=`
    <div style="padding: 10px 0 20px; font-size: 15px; color: var(--text-dark); line-height: 1.5;">
      ${d(t)}
    </div>
    <div class="form-submit-row" style="margin-top: 0; justify-content: flex-end; gap: 10px;">
      <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
      <button type="button" class="btn btn-danger" id="confirm-action-btn">Delete</button>
    </div>
  `,document.getElementById("confirm-action-btn").addEventListener("click",()=>{h(),e()}),b()}function v(t,e="Processing..."){t&&(t.disabled=!0,t.dataset.originalText=t.innerHTML,t.innerHTML=`<span class="loading-spinner"></span> ${e}`)}function A(t){t&&(t.disabled=!1,t.dataset.originalText&&(t.innerHTML=t.dataset.originalText))}window.uploadFileDirectly=async function(t,e,a){const i=t.files;if(i.length===0)return;const o=new FormData;o.append("files",i[0]);const l=document.getElementById(e+"-preview-container"),c=document.getElementById(e+"-preview");g("Uploading file...","info");try{const u=await(await fetch("/api/upload",{method:"POST",body:o})).json();if(u.success&&u.files.length>0){const s=u.files[0].url;document.getElementById(e).value=s,c&&(c.src=s),l&&(l.style.display="flex"),g("File uploaded successfully!","success"),w=await(await fetch("/api/media")).json(),H==="media-library"&&P()}else g(u.message||"File upload failed.","error")}catch(m){console.error("File upload failed:",m),g("Network error during file upload.","error")}t.value=""};function x(t,e){const a=document.getElementById(t);if(!a)return;const i=a.value,o=document.getElementById(t+"-preview-container"),l=document.getElementById(t+"-preview");i&&l&&o?(l.src=i,o.style.display="flex"):o&&(o.style.display="none")}document.addEventListener("DOMContentLoaded",()=>{Ie(),$e()});async function Ie(){if(window.location.protocol==="file:"){const e=document.getElementById("file-protocol-warning");e&&(e.style.display="block")}await Be()?(pe(),await ge(),fe()):R()}async function Be(){try{const e=await(await fetch("/api/check-session")).json();if(e.success)return document.getElementById("logged-username").textContent=e.username,!0}catch(t){console.error("Session check failed:",t)}return!1}function R(){document.getElementById("login-section").style.display="flex",document.getElementById("admin-container").style.display="none"}function pe(){document.getElementById("login-section").style.display="none",document.getElementById("admin-container").style.display="flex"}async function ge(){try{n=await(await fetch("/api/content")).json(),n&&(n.notices=n.notices||[],n.events=n.events||[],n.gallery=n.gallery||[],n.facilities=n.facilities||[],n.school_info=n.school_info||{},n.director_info=n.director_info||{},n.principal_info=n.principal_info||{},n.hero_section=n.hero_section||{},n.social_media=n.social_media||{},n.contact_settings=n.contact_settings||{},n.hostel_info=n.hostel_info||{}),p=await(await fetch("/api/submissions")).json(),p&&(p.enquiries=p.enquiries||[],p.messages=p.messages||[]),w=await(await fetch("/api/media")).json(),w=w||[],F()}catch(t){console.error("Error loading admin data:",t),g("Failed to load website database content. Please ensure the server is running.","error")}}function F(){if(!p)return;const t=p.enquiries.filter(o=>o.status==="new").length,e=p.messages.filter(o=>!o.is_read).length,a=document.getElementById("badge-new-enquiries"),i=document.getElementById("badge-new-messages");t>0?(a.textContent=t,a.style.display="inline-block"):a.style.display="none",e>0?(i.textContent=e,i.style.display="inline-block"):i.style.display="none"}function $e(){document.getElementById("login-form").addEventListener("submit",ke),document.getElementById("toggle-password-btn").addEventListener("click",_e),document.getElementById("btn-logout-sidebar").addEventListener("click",ue),document.getElementById("btn-logout-header").addEventListener("click",ue);const t=document.getElementById("admin-sidebar");document.getElementById("admin-hamburger").addEventListener("click",()=>{t.classList.add("open")}),document.getElementById("sidebar-close-btn").addEventListener("click",()=>{t.classList.remove("open")}),document.querySelectorAll(".sidebar-nav .nav-item").forEach(a=>{a.addEventListener("click",i=>{i.preventDefault();const o=a.getAttribute("data-tab");O(o),t.classList.remove("open")})}),document.addEventListener("click",a=>{if(a.target.classList.contains("btn-tab-trigger")){const i=a.target.getAttribute("data-target-tab");i&&O(i)}}),document.getElementById("form-homepage-settings").addEventListener("submit",Le),document.getElementById("form-school-info").addEventListener("submit",Se),document.getElementById("form-hostel-settings").addEventListener("submit",tt),document.getElementById("form-social-settings").addEventListener("submit",ct),document.getElementById("search-gallery").addEventListener("input",B),document.getElementById("filter-gallery-category").addEventListener("change",B),document.getElementById("search-notices").addEventListener("input",_),document.getElementById("filter-notices-category").addEventListener("change",_),document.getElementById("search-events").addEventListener("input",D),document.getElementById("search-enquiries").addEventListener("input",C),document.getElementById("filter-enquiries-class").addEventListener("change",C),document.getElementById("filter-enquiries-status").addEventListener("change",C),document.getElementById("search-messages").addEventListener("input",S),document.getElementById("filter-messages-state").addEventListener("change",S),document.getElementById("search-media").addEventListener("input",P),document.getElementById("search-media-select").addEventListener("input",Ee),document.addEventListener("click",a=>{if(a.target.classList.contains("btn-select-media")){const i=a.target.getAttribute("data-target-input");rt(i)}})}function _e(){const t=document.getElementById("login-password"),e=document.getElementById("toggle-password-btn");t.type==="password"?(t.type="text",e.innerHTML=`
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    `):(t.type="password",e.innerHTML=`
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `)}async function ke(t){t.preventDefault();const e=document.getElementById("login-username"),a=document.getElementById("login-password"),i=document.getElementById("login-error-alert");i.style.display="none";try{const l=await(await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e.value.trim(),password:a.value.trim()})})).json();l.success?(document.getElementById("logged-username").textContent=l.username,a.value="",pe(),await ge(),O("dashboard")):(i.textContent=l.message||"Invalid username or password.",i.style.display="block")}catch(o){console.error("Login error:",o),i.textContent="Network or server error during login.",i.style.display="block"}}async function ue(t){t.preventDefault(),$("Are you sure you want to securely log out?",async()=>{try{(await(await fetch("/api/logout",{method:"POST"})).json()).success&&R()}catch(e){console.error("Logout error:",e),R()}})}function N(){if(n)switch(H){case"homepage":const t=document.getElementById("hero-badge"),e=document.getElementById("hero-title"),a=document.getElementById("hero-tagline"),i=document.getElementById("hero-description"),o=document.getElementById("hero-btn1-text"),l=document.getElementById("hero-btn2-text"),c=document.getElementById("hero-image"),m=document.getElementById("homepage-show-leaders");t&&(n.hero_section.badge=t.value.trim()),e&&(n.hero_section.title=e.value.trim()),a&&(n.hero_section.tagline=a.value.trim()),i&&(n.hero_section.description=i.value.trim()),o&&(n.hero_section.button1_text=o.value.trim()),l&&(n.hero_section.button2_text=l.value.trim()),c&&(n.hero_section.image_url=c.value.trim()),m&&(n.school_info.show_leaders=m.checked);break;case"school-info":const u=document.getElementById("school-name"),s=document.getElementById("school-reg-number"),y=document.getElementById("school-logo"),r=document.getElementById("school-description"),E=document.getElementById("about-title"),M=document.getElementById("about-text"),L=document.getElementById("admission-info-text");u&&(n.school_info.name=u.value.trim()),s&&(n.school_info.reg_number=s.value.trim()),y&&(n.school_info.logo_url=y.value.trim()),r&&(n.school_info.description=r.value.trim()),E&&(n.school_info.about_title=E.value.trim()),M&&(n.school_info.about_text=M.value.trim()),L&&(n.school_info.admission_info=L.value.trim());const I=document.getElementById("director-name"),V=document.getElementById("director-phone"),Y=document.getElementById("director-photo"),J=document.getElementById("director-message");I&&(n.director_info.name=I.value.trim()),V&&(n.director_info.phone=V.value.trim()),Y&&(n.director_info.photo_url=Y.value.trim()),J&&(n.director_info.message=J.value.trim());const Q=document.getElementById("principal-name"),W=document.getElementById("principal-phone"),K=document.getElementById("principal-photo"),Z=document.getElementById("principal-message");Q&&(n.principal_info.name=Q.value.trim()),W&&(n.principal_info.phone=W.value.trim()),K&&(n.principal_info.photo_url=K.value.trim()),Z&&(n.principal_info.message=Z.value.trim());break;case"hostel-facilities":const X=document.getElementById("hostel-description"),ee=document.getElementById("hostel-boys"),te=document.getElementById("hostel-girls"),oe=document.getElementById("hostel-image"),ie=document.getElementById("hostel-bullets");X&&(n.hostel_info.description=X.value.trim()),ee&&(n.hostel_info.boys_hostel=ee.value.trim()),te&&(n.hostel_info.girls_hostel=te.value.trim()),oe&&(n.hostel_info.image_url=oe.value.trim()),ie&&(n.hostel_info.bullets=ie.value.split(`
`).map(z=>z.trim()).filter(z=>z!==""));break;case"social-settings":const ae=document.getElementById("social-instagram"),ne=document.getElementById("social-facebook"),le=document.getElementById("social-youtube"),G=document.getElementById("social-whatsapp"),se=document.getElementById("contact-address"),de=document.getElementById("contact-phone"),ce=document.getElementById("contact-email"),re=document.getElementById("contact-map");ae&&(n.social_media.instagram=ae.value.trim()),ne&&(n.social_media.facebook=ne.value.trim()),le&&(n.social_media.youtube=le.value.trim()),G&&(n.social_media.whatsapp=G.value.trim(),n.contact_settings.whatsapp=G.value.trim()),se&&(n.contact_settings.address=se.value.trim()),de&&(n.contact_settings.phone=de.value.trim()),ce&&(n.contact_settings.email=ce.value.trim()),re&&(n.contact_settings.google_maps_embed=re.value.trim());break}}function O(t){N(),H=t,document.querySelectorAll(".sidebar-nav .nav-item").forEach(o=>{o.classList.remove("active"),o.getAttribute("data-tab")===t&&o.classList.add("active")});const a={dashboard:"Dashboard Statistics",homepage:"Homepage Content Settings","school-info":"School & Leadership Info",gallery:"Gallery Content Management",notices:"School Notice Board Manager",events:"Events & Assemblies Scheduler","hostel-facilities":"Hostel & Facilities Settings",enquiries:"Online Admission Enquiries",messages:"General Contact Messages","media-library":"Media Library Assets","social-settings":"Social Links & Contact Channels"};document.getElementById("page-title").textContent=a[t]||"Admin Dashboard",document.querySelectorAll(".content-wrapper .tab-content").forEach(o=>o.classList.remove("active")),document.getElementById(`tab-${t}`).classList.add("active"),fe()}function fe(){if(n)switch(H){case"dashboard":T();break;case"homepage":Me();break;case"school-info":Ce();break;case"faculty":k();break;case"gallery":B();break;case"notices":_();break;case"events":D();break;case"hostel-facilities":U();break;case"enquiries":C();break;case"messages":S();break;case"media-library":P();break;case"social-settings":dt();break}}function T(){if(!n||!p)return;const t=n.gallery.filter(r=>r.type==="image").length,e=n.gallery.filter(r=>r.type==="video").length;document.getElementById("stat-gallery-count").textContent=t+e,document.getElementById("stat-notices-count").textContent=n.notices.length,document.getElementById("stat-events-count").textContent=n.events.length;const a=n.faculty_staff||[],i=document.getElementById("stat-faculty-count");i&&(i.textContent=a.length);const o=document.getElementById("stat-faculty-active");if(o){const r=a.filter(E=>E.is_active!==!1).length;o.textContent=`${r} active profiles`}const l=p.enquiries.length,c=p.enquiries.filter(r=>r.status==="new").length;document.getElementById("stat-enquiries-count").textContent=l,document.getElementById("stat-enquiries-new").textContent=`${c} new / follow-up`;const m=p.messages.length,u=p.messages.filter(r=>!r.is_read).length;document.getElementById("stat-messages-count").textContent=m,document.getElementById("stat-messages-unread").textContent=`${u} unread`;const s=document.getElementById("dashboard-recent-submissions");s.innerHTML="";const y=[...p.enquiries.map(r=>({...r,type:"enquiry",text:`Applied for ${r.class_apply.toUpperCase()}`})),...p.messages.map(r=>({...r,type:"message",text:r.subject||"General message"}))].sort((r,E)=>new Date(E.date)-new Date(r.date)).slice(0,5);if(y.length===0){s.innerHTML='<p class="empty-list-text">No recent enquiries or contact messages.</p>';return}y.forEach(r=>{const E=mt(r.date),M=r.type==="enquiry"?"enquiry":"message",L=r.type==="enquiry"?"Enquiry":"Message",I=document.createElement("div");I.className="submission-item",I.innerHTML=`
      <span class="sub-badge ${M}">${L}</span>
      <div class="sub-info">
        <div class="sub-name">${d(r.parent_name||r.name)}</div>
        <div class="sub-details">${d(r.text)}</div>
      </div>
      <div class="sub-date">${E}</div>
    `,I.style.cursor="pointer",I.addEventListener("click",()=>{r.type==="enquiry"?ve(r.id):be(r.id)}),s.appendChild(I)})}function Me(){const t=n.hero_section;document.getElementById("hero-badge").value=t.badge||"",document.getElementById("hero-title").value=t.title||"",document.getElementById("hero-tagline").value=t.tagline||"",document.getElementById("hero-description").value=t.description||"",document.getElementById("hero-btn1-text").value=t.button1_text||"Apply for Admission",document.getElementById("hero-btn2-text").value=t.button2_text||"Admission Enquiry",document.getElementById("hero-image").value=t.image_url||"",document.getElementById("homepage-show-leaders").checked=n.school_info.show_leaders!==!1,x("hero-image")}async function Le(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]');v(e,"Saving..."),N(),await f("Homepage content saved successfully!",()=>{A(e)})}function Ce(){const t=n.school_info,e=n.director_info,a=n.principal_info;document.getElementById("school-name").value=t.name||"",document.getElementById("school-reg-number").value=t.reg_number||"",document.getElementById("school-logo").value=t.logo_url||"",document.getElementById("school-description").value=t.description||"",document.getElementById("about-title").value=t.about_title||"",document.getElementById("about-text").value=t.about_text||"",document.getElementById("admission-info-text").value=t.admission_info||"",document.getElementById("director-name").value=e.name||"",document.getElementById("director-phone").value=e.phone||"",document.getElementById("director-photo").value=e.photo_url||"",document.getElementById("director-message").value=e.message||"",document.getElementById("principal-name").value=a.name||"",document.getElementById("principal-phone").value=a.phone||"",document.getElementById("principal-photo").value=a.photo_url||"",document.getElementById("principal-message").value=a.message||"",x("school-logo"),x("director-photo"),x("principal-photo")}async function Se(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]');v(e,"Saving..."),N(),await f("School metadata and leadership messages saved successfully!",()=>{A(e)})}function k(){const t=document.getElementById("admin-faculty-table-body");if(!t)return;t.innerHTML="",n.faculty_staff||(n.faculty_staff=[]);const e=[...n.faculty_staff].sort((s,y)=>(s.order||0)-(y.order||0)),a=document.getElementById("filter-faculty-category"),i=document.getElementById("search-faculty"),o=a?a.value:"all",l=i?i.value.toLowerCase().trim():"",c=e.filter(s=>{const y=o==="all"||s.category===o,r=!l||s.name&&s.name.toLowerCase().includes(l)||s.designation&&s.designation.toLowerCase().includes(l)||s.subject&&s.subject.toLowerCase().includes(l)||s.qualification&&s.qualification.toLowerCase().includes(l);return y&&r});if(c.length===0){t.innerHTML=`
      <tr>
        <td colspan="8" class="table-empty" style="text-align: center; padding: 30px; color: var(--text-light);">
          No faculty or staff profiles found matching criteria. Click "Add Staff Profile" to add one.
        </td>
      </tr>
    `;return}const m={leadership:"School Leadership",teaching:"Teaching Faculty",admin:"Administrative Staff",support:"Support Staff"},u={leadership:"background:#fef3c7; color:#92400e; border:1px solid #fde68a;",teaching:"background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;",admin:"background:#f3e8ff; color:#6b21a8; border:1px solid #e9d5ff;",support:"background:#dcfce7; color:#15803d; border:1px solid #bbf7d0;"};c.forEach((s,y)=>{const r=document.createElement("tr");r.className=s.is_active===!1?"row-inactive":"",s.is_active===!1&&(r.style.opacity="0.65");const E=u[s.category]||"background:#f1f5f9; color:#475569;",M=m[s.category]||s.category||"General",L=s.photo_url?`<img src="${s.photo_url}" alt="${d(s.name)}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 50%; border: 2px solid var(--border-color);">`:`<div style="width: 44px; height: 44px; border-radius: 50%; background: #e2e8f0; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px;">
        ${d((s.name||"S").charAt(0))}
      </div>`;r.innerHTML=`
      <td style="text-align: center;">
        <div style="display: flex; flex-direction: column; gap: 3px; align-items: center;">
          <button type="button" class="btn-icon-subtle" onclick="moveFacultyMember('${s.id}', -1)" title="Move Up" style="font-size: 11px; padding: 2px 5px; cursor: pointer; border-radius: 3px; background: #f1f5f9; border: 1px solid #cbd5e1;">▲</button>
          <span style="font-weight: 600; font-size: 12px; color: var(--text-dark);">${s.order||y+1}</span>
          <button type="button" class="btn-icon-subtle" onclick="moveFacultyMember('${s.id}', 1)" title="Move Down" style="font-size: 11px; padding: 2px 5px; cursor: pointer; border-radius: 3px; background: #f1f5f9; border: 1px solid #cbd5e1;">▼</button>
        </div>
      </td>
      <td style="text-align: center;">${L}</td>
      <td>
        <div style="font-weight: 600; color: var(--primary-navy); font-size: 14px;">${d(s.name)}</div>
        <div style="font-size: 12.5px; color: var(--text-light); margin-top: 2px;">${d(s.designation||"Staff")}</div>
      </td>
      <td>
        <span style="display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; ${E}">
          ${d(M)}
        </span>
      </td>
      <td>
        <span style="font-weight: 500; font-size: 13px; color: var(--text-dark);">${d(s.subject||"—")}</span>
      </td>
      <td>
        <div style="font-size: 12.5px; font-weight: 500; color: var(--text-dark);">${d(s.qualification||"—")}</div>
        ${s.experience?`<div style="font-size: 11px; color: #16a34a; font-weight: 600; margin-top: 2px;">★ ${d(s.experience)} Exp</div>`:""}
      </td>
      <td style="text-align: center;">
        <button type="button" onclick="toggleFacultyStatus('${s.id}')" style="cursor: pointer; border: none; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; transition: all 0.2s ease; ${s.is_active!==!1?"background: #dcfce7; color: #15803d;":"background: #fee2e2; color: #b91c1c;"}">
          ${s.is_active!==!1?"✓ Active":"✕ Inactive"}
        </button>
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 6px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="openEditFacultyModal('${s.id}')" style="padding: 4px 10px; font-size: 12px;">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteFacultyMember('${s.id}')" style="padding: 4px 10px; font-size: 12px;">Delete</button>
        </div>
      </td>
    `,t.appendChild(r)})}function Te(){k()}function De(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Faculty & Staff Profile";const e=(n.faculty_staff||[]).length+1;t.innerHTML=`
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
          <input type="number" id="modal-staff-order" value="${e}" min="1" step="1">
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
  `,bindModalMediaSelect(),document.getElementById("modal-faculty-form").addEventListener("submit",async a=>{a.preventDefault();const i=document.getElementById("btn-save-faculty");v(i,"Adding Profile..."),n.faculty_staff||(n.faculty_staff=[]);const o={id:"staff-"+Date.now(),name:document.getElementById("modal-staff-name").value.trim(),category:document.getElementById("modal-staff-category").value,designation:document.getElementById("modal-staff-designation").value.trim(),subject:document.getElementById("modal-staff-subject").value.trim(),qualification:document.getElementById("modal-staff-qualification").value.trim(),experience:document.getElementById("modal-staff-experience").value.trim(),bio:document.getElementById("modal-staff-bio").value.trim(),photo_url:document.getElementById("modal-staff-photo").value.trim(),order:parseInt(document.getElementById("modal-staff-order").value)||n.faculty_staff.length+1,is_active:document.getElementById("modal-staff-active").checked};n.faculty_staff.push(o),await f("Faculty profile added successfully!",()=>{h(),k(),T()})}),b()}function qe(t){if(!n.faculty_staff)return;const e=n.faculty_staff.find(i=>i.id===t);if(!e)return;const a=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Faculty & Staff Profile",a.innerHTML=`
    <form id="modal-faculty-edit-form">
      <input type="hidden" id="modal-staff-id" value="${e.id}">
      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-name">Full Name *</label>
          <input type="text" id="modal-staff-name" required value="${d(e.name)}">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-category">Staff Category *</label>
          <select id="modal-staff-category" required>
            <option value="teaching" ${e.category==="teaching"?"selected":""}>Teaching Faculty</option>
            <option value="leadership" ${e.category==="leadership"?"selected":""}>School Leadership</option>
            <option value="admin" ${e.category==="admin"?"selected":""}>Administrative Staff</option>
            <option value="support" ${e.category==="support"?"selected":""}>Support Staff</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-designation">Designation *</label>
          <input type="text" id="modal-staff-designation" required value="${d(e.designation||"")}">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-subject">Subject / Department *</label>
          <input type="text" id="modal-staff-subject" required value="${d(e.subject||"")}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-qualification">Educational Qualification *</label>
          <input type="text" id="modal-staff-qualification" required value="${d(e.qualification||"")}">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-experience">Teaching Experience (Optional)</label>
          <input type="text" id="modal-staff-experience" value="${d(e.experience||"")}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-12">
          <label for="modal-staff-bio">Short Introduction / Bio</label>
          <textarea id="modal-staff-bio" rows="3">${d(e.bio||"")}</textarea>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-8">
          <label for="modal-staff-photo">Profile Photo URL (Select from Library or Upload)</label>
          <div class="input-select-media-wrapper">
            <input type="text" id="modal-staff-photo" value="${d(e.photo_url||"")}">
            <button type="button" class="btn btn-secondary btn-select-media" data-target-input="modal-staff-photo">Choose Media</button>
          </div>
          <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
            <input type="file" id="modal-staff-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'modal-staff-photo', 'modal-staff-photo-preview')">
            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-staff-file').click()">📤 Upload Photo</button>
            <div id="modal-staff-photo-preview-container" style="display: ${e.photo_url?"flex":"none"}; align-items: center; gap: 8px;">
              <img id="modal-staff-photo-preview" src="${d(e.photo_url||"")}" style="max-height: 45px; border-radius: 50%; border: 1px solid var(--border-color);">
              <span style="font-size: 11px; color: var(--text-light);">Photo Loaded</span>
            </div>
          </div>
        </div>
        <div class="form-group col-4">
          <label for="modal-staff-order">Display Order</label>
          <input type="number" id="modal-staff-order" value="${e.order||1}" min="1" step="1">
        </div>
      </div>

      <div class="form-row" style="margin-top: 10px;">
        <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="modal-staff-active" ${e.is_active!==!1?"checked":""}>
          <span>Active Profile (Visible on public website)</span>
        </label>
      </div>

      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="btn-save-faculty">Save Changes</button>
      </div>
    </form>
  `,bindModalMediaSelect(),document.getElementById("modal-faculty-edit-form").addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("btn-save-faculty");v(o,"Saving Changes..."),e.name=document.getElementById("modal-staff-name").value.trim(),e.category=document.getElementById("modal-staff-category").value,e.designation=document.getElementById("modal-staff-designation").value.trim(),e.subject=document.getElementById("modal-staff-subject").value.trim(),e.qualification=document.getElementById("modal-staff-qualification").value.trim(),e.experience=document.getElementById("modal-staff-experience").value.trim(),e.bio=document.getElementById("modal-staff-bio").value.trim(),e.photo_url=document.getElementById("modal-staff-photo").value.trim(),e.order=parseInt(document.getElementById("modal-staff-order").value)||1,e.is_active=document.getElementById("modal-staff-active").checked,await f("Faculty profile updated successfully!",()=>{h(),k(),T()})}),b()}function Ae(t){const e=(n.faculty_staff||[]).find(a=>a.id===t);e&&$(`Are you sure you want to delete profile for "${e.name}" (${e.designation})?`,async()=>{n.faculty_staff=n.faculty_staff.filter(a=>a.id!==t),await f("Faculty profile deleted successfully!",()=>{k(),T()})})}function Fe(t){const e=(n.faculty_staff||[]).find(a=>a.id===t);e&&(e.is_active=e.is_active===!1,f(e.is_active?`Activated profile for ${e.name}`:`Deactivated profile for ${e.name}`,()=>{k(),T()}))}function Ne(t,e){const i=[...n.faculty_staff||[]].sort((y,r)=>(y.order||0)-(r.order||0)),o=i.findIndex(y=>y.id===t);if(o===-1)return;const l=o+e;if(l<0||l>=i.length)return;const c=i[o],m=i[l],u=c.order||o+1,s=m.order||l+1;c.order=s===u?e>0?u+1:u-1:s,m.order=u,i.sort((y,r)=>(y.order||0)-(r.order||0)),i.forEach((y,r)=>{y.order=r+1}),f("Faculty order updated successfully!",()=>{k()})}function B(){const t=document.getElementById("admin-gallery-grid");t.innerHTML="";const e=document.getElementById("filter-gallery-category").value,a=document.getElementById("search-gallery").value.toLowerCase().trim(),i=n.gallery.filter(o=>{const l=e==="all"||o.category===e,c=o.title.toLowerCase().includes(a)||(o.description||"").toLowerCase().includes(a);return l&&c}).sort((o,l)=>o.order-l.order);if(i.length===0){t.innerHTML='<p class="empty-list-text">No gallery items found matching filters.</p>';return}i.forEach(o=>{const l=document.createElement("div");l.className="admin-gallery-card",l.setAttribute("data-id",o.id);const c=o.is_published!==!1,m=c?"Published":"Draft",u=c?"published":"draft";let s="";o.type==="video"?o.thumbnail_url?s=`<img src="${o.thumbnail_url}" alt="${d(o.title)}">`:s=`
          <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none">
            <rect width="100%" height="100%" fill="#0d233a"/>
            <polygon points="175,110 235,140 175,170" fill="#c5a059"/>
            <circle cx="200" cy="140" r="45" stroke="#c5a059" stroke-width="2" />
          </svg>
        `:o.url?s=`<img src="${o.url}" alt="${d(o.title)}">`:s=`
          <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none">
            <rect width="100%" height="100%" fill="#1b3a57"/>
            <text x="200" y="150" font-family="'Outfit', sans-serif" font-weight="bold" font-size="14" fill="#ffffff" text-anchor="middle">No Image Chosen</text>
          </svg>
        `,l.innerHTML=`
      <div class="gallery-card-media">
        ${s}
        <div class="gallery-card-badges">
          <span class="gallery-card-badge">${o.category}</span>
          <span class="status-badge ${u}">${m}</span>
          ${o.is_featured?'<span class="gallery-card-badge featured">Featured</span>':""}
        </div>
      </div>
      <div class="gallery-card-info">
        <h3>${d(o.title)}</h3>
        <p>${d(o.description||"")}</p>
      </div>
      <div class="gallery-card-actions">
        <div class="reorder-btns">
          <button class="btn btn-secondary btn-sm" onclick="moveGalleryItem('${o.id}', -1)" title="Move Up">↑</button>
          <button class="btn btn-secondary btn-sm" onclick="moveGalleryItem('${o.id}', 1)" title="Move Down">↓</button>
        </div>
        <div class="edit-btns">
          <button class="btn btn-secondary btn-sm" onclick="openEditGalleryModal('${o.id}')" title="Edit">✏️</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleGalleryPublish('${o.id}')" title="${c?"Unpublish":"Publish"}">${c?"👁️":"🕶️"}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteGalleryItem('${o.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `,t.appendChild(l)})}function ye(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Gallery Item",t.innerHTML=`
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
  `,document.getElementById("modal-gallery-form").addEventListener("submit",async e=>{e.preventDefault();const a=document.getElementById("gal-type").value,i=a==="image"?document.getElementById("gal-image-url").value.trim():document.getElementById("gal-video-url").value.trim(),o=document.getElementById("modal-gallery-submit-btn");v(o,"Saving...");const l={id:"gal-"+Date.now(),type:a,category:document.getElementById("gal-category").value,url:i,thumbnail_url:a==="video"?document.getElementById("gal-video-thumbnail").value.trim():"",title:document.getElementById("gal-title").value.trim(),description:document.getElementById("gal-desc").value.trim(),is_featured:document.getElementById("gal-featured").checked,is_published:document.getElementById("gal-published").checked,order:n.gallery.length+1};n.gallery.push(l),await f("Gallery item added successfully!",()=>{h(),B()})}),b()}function Pe(t){const e=n.gallery.find(i=>i.id===t);if(!e)return;const a=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Gallery Item",a.innerHTML=`
    <form id="modal-gallery-form">
      <input type="hidden" id="gal-id" value="${e.id}">
      <div class="form-group">
        <label for="gal-type">Media Type</label>
        <select id="gal-type" onchange="toggleGalleryTypeForm(this.value)" required disabled>
          <option value="image" ${e.type==="image"?"selected":""}>Photo</option>
          <option value="video" ${e.type==="video"?"selected":""}>YouTube Video</option>
        </select>
      </div>
      <div class="form-group" id="group-gal-image" style="display: ${e.type==="image"?"block":"none"};">
        <label for="gal-image-url">Photo Image URL</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="gal-image-url" value="${e.type==="image"?e.url:""}">
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
      <div class="form-group" id="group-gal-video" style="display: ${e.type==="video"?"block":"none"};">
        <label for="gal-video-url">YouTube Embed URL</label>
        <input type="url" id="gal-video-url" value="${e.type==="video"?e.url:""}">
        <span class="text-muted" style="font-size: 11px; margin-top: 4px; display: block;">Tip: Copy the YouTube 'embed' iframe source url.</span>
      </div>
      <div class="form-group" id="group-gal-video-thumbnail" style="display: ${e.type==="video"?"block":"none"};">
        <label for="gal-video-thumbnail">Video Thumbnail Image (Optional)</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="gal-video-thumbnail" value="${e.thumbnail_url||""}">
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
          <option value="classroom" ${e.category==="classroom"?"selected":""}>Classroom & Learning</option>
          <option value="hostel" ${e.category==="hostel"?"selected":""}>Hostel Life</option>
          <option value="events" ${e.category==="events"?"selected":""}>School Events</option>
          <option value="videos" ${e.category==="videos"?"selected":""}>Videos & Reels</option>
        </select>
      </div>
      <div class="form-group">
        <label for="gal-title">Title / Caption</label>
        <input type="text" id="gal-title" value="${d(e.title)}" required>
      </div>
      <div class="form-group">
        <label for="gal-desc">Short Description</label>
        <textarea id="gal-desc" rows="3">${d(e.description||"")}</textarea>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="gal-featured" ${e.is_featured?"checked":""}> Featured Gallery Item (Visible in preview blocks)
        </label>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="gal-published" ${e.is_published!==!1?"checked":""}> Published status
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-gallery-edit-btn">Update Gallery Item</button>
      </div>
    </form>
  `,e.type==="image"?x("gal-image-url"):x("gal-video-thumbnail"),document.getElementById("modal-gallery-form").addEventListener("submit",async i=>{i.preventDefault();const o=e.type==="image"?document.getElementById("gal-image-url").value.trim():document.getElementById("gal-video-url").value.trim(),l=document.getElementById("modal-gallery-edit-btn");v(l,"Saving..."),e.url=o,e.thumbnail_url=e.type==="video"?document.getElementById("gal-video-thumbnail").value.trim():"",e.category=document.getElementById("gal-category").value,e.title=document.getElementById("gal-title").value.trim(),e.description=document.getElementById("gal-desc").value.trim(),e.is_featured=document.getElementById("gal-featured").checked,e.is_published=document.getElementById("gal-published").checked,await f("Gallery item updated successfully!",()=>{h(),B()})}),b()}function He(){g("Category management features are pre-configured. Use the category dropdowns to filter content.","info")}function Ue(){ye()}function je(t){const e=n.gallery.find(a=>a.id===t);e&&(e.is_published=e.is_published===!1,f(e.is_published?"Gallery item published!":"Gallery item set to draft.",()=>{B()}))}function Ge(t){$("Are you sure you want to delete this gallery item? This action is permanent.",async()=>{n.gallery=n.gallery.filter(e=>e.id!==t),n.gallery.forEach((e,a)=>{e.order=a+1}),await f("Gallery item deleted successfully!",()=>{B()})})}async function ze(t,e){const a=n.gallery.findIndex(m=>m.id===t);if(a===-1)return;const i=a+e;if(i<0||i>=n.gallery.length)return;const o=n.gallery[a],l=n.gallery[i],c=o.order;o.order=l.order,l.order=c,n.gallery[a]=l,n.gallery[i]=o,await f("Gallery order updated!",()=>{B()})}function _(){const t=document.getElementById("admin-notices-table-body");t.innerHTML="";const e=document.getElementById("search-notices").value.toLowerCase().trim(),a=document.getElementById("filter-notices-category").value,i=n.notices.filter(o=>{const l=o.title.toLowerCase().includes(e)||o.text.toLowerCase().includes(e),c=a==="all"||o.category===a;return l&&c});if(i.length===0){t.innerHTML='<tr><td colspan="6" class="table-empty">No notices match the filters.</td></tr>';return}i.forEach(o=>{const l=o.is_published?"Published":"Draft",c=o.is_published?"published":"draft",m=o.is_important?"Important":"Normal",u=o.is_important?"important":"read";let s="";if(o.expiry_date){const r=new Date(o.expiry_date)<new Date;s=`<div style="font-size: 11px; margin-top: 4px; font-weight: 600; color: ${r?"#f44336":"var(--accent-gold)"};">
        ${r?"⚠️ Expired":"⏰ Expires"}: ${o.expiry_date}
      </div>`}const y=document.createElement("tr");y.innerHTML=`
      <td><span class="status-badge ${c}">${l}</span></td>
      <td>
        <div class="text-bold">${d(o.title)}</div>
        <div class="text-muted" style="max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${d(o.text)}</div>
        ${s}
      </td>
      <td><span class="text-bold" style="text-transform: capitalize;">${o.category}</span></td>
      <td>${o.date}</td>
      <td><span class="status-badge ${u}">${m}</span></td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditNoticeModal('${o.id}')" title="Edit notice">✏️</button>
          <button class="btn-icon-only" onclick="toggleNoticePublish('${o.id}')" title="${o.is_published?"Unpublish":"Publish"}">${o.is_published?"👁️":"🕶️"}</button>
          <button class="btn-icon-only delete" onclick="deleteNotice('${o.id}')" title="Delete notice">🗑️</button>
        </div>
      </td>
    `,t.appendChild(y)})}function Re(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Notice",t.innerHTML=`
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
          <input type="text" id="not-date" value="${ut(new Date)}" required>
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
  `,document.getElementById("modal-notice-form").addEventListener("submit",async e=>{e.preventDefault();const a=document.getElementById("modal-notice-submit-btn");v(a,"Saving...");const i={id:"not-"+Date.now(),title:document.getElementById("not-title").value.trim(),text:document.getElementById("not-text").value.trim(),date:document.getElementById("not-date").value.trim(),expiry_date:document.getElementById("not-expiry-date").value,category:document.getElementById("not-category").value,is_important:document.getElementById("not-important").checked,is_published:document.getElementById("not-published").checked};n.notices.unshift(i),await f("Notice posted successfully!",()=>{h(),_()})}),b()}function Oe(t){const e=n.notices.find(i=>i.id===t);if(!e)return;const a=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Notice",a.innerHTML=`
    <form id="modal-notice-form">
      <div class="form-group">
        <label for="not-title">Notice Title</label>
        <input type="text" id="not-title" value="${d(e.title)}" required>
      </div>
      <div class="form-group">
        <label for="not-category">Category</label>
        <select id="not-category" required>
          <option value="admission" ${e.category==="admission"?"selected":""}>Admissions</option>
          <option value="events" ${e.category==="events"?"selected":""}>Events</option>
          <option value="general" ${e.category==="general"?"selected":""}>General Info</option>
        </select>
      </div>
      <div class="form-group">
        <label for="not-text">Announcement Details</label>
        <textarea id="not-text" rows="4" required>${d(e.text)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label for="not-date">Publish Date (Display Label)</label>
          <input type="text" id="not-date" value="${d(e.date)}" required>
        </div>
        <div class="form-group col-6">
          <label for="not-expiry-date">Expiry Date (Optional)</label>
          <input type="date" id="not-expiry-date" value="${e.expiry_date||""}">
        </div>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="not-important" ${e.is_important?"checked":""}> Mark Notice as Important / Important Badge
        </label>
      </div>
      <div class="form-group">
        <label class="toggle-switch-label">
          <input type="checkbox" id="not-published" ${e.is_published!==!1?"checked":""}> Published status
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-notice-edit-btn">Update Notice</button>
      </div>
    </form>
  `,document.getElementById("modal-notice-form").addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("modal-notice-edit-btn");v(o,"Saving..."),e.title=document.getElementById("not-title").value.trim(),e.text=document.getElementById("not-text").value.trim(),e.date=document.getElementById("not-date").value.trim(),e.expiry_date=document.getElementById("not-expiry-date").value,e.category=document.getElementById("not-category").value,e.is_important=document.getElementById("not-important").checked,e.is_published=document.getElementById("not-published").checked,await f("Notice updated successfully!",()=>{h(),_()})}),b()}function Ve(t){const e=n.notices.find(a=>a.id===t);e&&(e.is_published=e.is_published===!1,f(e.is_published?"Notice published!":"Notice set to draft.",()=>{_()}))}function Ye(t){$("Are you sure you want to delete this notice? This action is permanent.",async()=>{n.notices=n.notices.filter(e=>e.id!==t),await f("Notice deleted successfully!",()=>{_()})})}function D(){const t=document.getElementById("admin-events-table-body");t.innerHTML="";const e=document.getElementById("search-events").value.toLowerCase().trim(),a=n.events.filter(i=>i.title.toLowerCase().includes(e)||i.description.toLowerCase().includes(e));if(a.length===0){t.innerHTML='<tr><td colspan="6" class="table-empty">No events found.</td></tr>';return}a.forEach(i=>{const o=i.is_published?"Published":"Draft",l=i.is_published?"published":"draft",c=document.createElement("tr");c.innerHTML=`
      <td><span class="status-badge ${l}">${o}</span></td>
      <td>
        ${i.image_url?`<img src="${i.image_url}" class="event-table-img" alt="${d(i.title)}">`:'<div style="text-align: center; color: var(--text-light); font-size: 11px; padding: 12px; background: var(--bg-light); border-radius: 4px;">No Image</div>'}
      </td>
      <td>
        <div class="text-bold">${d(i.title)}</div>
        <div class="text-muted">${d(i.description||"")}</div>
      </td>
      <td>
        <div class="text-bold">${i.date}</div>
        <div>${i.time||""}</div>
      </td>
      <td>${d(i.location||"School Campus")}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditEventModal('${i.id}')" title="Edit event">✏️</button>
          <button class="btn-icon-only" onclick="toggleEventPublish('${i.id}')" title="${i.is_published?"Unpublish":"Publish"}">${i.is_published?"👁️":"🕶️"}</button>
          <button class="btn-icon-only delete" onclick="deleteEvent('${i.id}')" title="Delete event">🗑️</button>
        </div>
      </td>
    `,t.appendChild(c)})}function Je(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Upcoming Event",t.innerHTML=`
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
  `,document.getElementById("modal-event-form").addEventListener("submit",async e=>{e.preventDefault();const a=document.getElementById("modal-event-submit-btn");v(a,"Saving...");const i={id:"evt-"+Date.now(),title:document.getElementById("evt-title").value.trim(),description:document.getElementById("evt-desc").value.trim(),date:document.getElementById("evt-date").value,time:document.getElementById("evt-time").value.trim(),location:document.getElementById("evt-location").value.trim(),image_url:document.getElementById("evt-image").value.trim(),is_published:document.getElementById("evt-published").checked};n.events.unshift(i),await f("Event added successfully!",()=>{h(),D()})}),b()}function Qe(t){const e=n.events.find(i=>i.id===t);if(!e)return;const a=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Event",a.innerHTML=`
    <form id="modal-event-form">
      <div class="form-group">
        <label for="evt-title">Event Title</label>
        <input type="text" id="evt-title" value="${d(e.title)}" required>
      </div>
      <div class="form-group">
        <label for="evt-desc">Event Description</label>
        <textarea id="evt-desc" rows="3" required>${d(e.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label for="evt-date">Event Date (YYYY-MM-DD)</label>
          <input type="date" id="evt-date" value="${e.date}" required>
        </div>
        <div class="form-group col-6">
          <label for="evt-time">Event Time</label>
          <input type="text" id="evt-time" value="${d(e.time||"")}" required>
        </div>
      </div>
      <div class="form-group">
        <label for="evt-location">Location / Venue</label>
        <input type="text" id="evt-location" value="${d(e.location||"")}" required>
      </div>
      <div class="form-group">
        <label for="evt-image">Event Banner Image</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="evt-image" value="${d(e.image_url||"")}">
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
          <input type="checkbox" id="evt-published" ${e.is_published!==!1?"checked":""}> Publish Event Status
        </label>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-event-edit-btn">Update Event</button>
      </div>
    </form>
  `,x("evt-image"),document.getElementById("modal-event-form").addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("modal-event-edit-btn");v(o,"Saving..."),e.title=document.getElementById("evt-title").value.trim(),e.description=document.getElementById("evt-desc").value.trim(),e.date=document.getElementById("evt-date").value,e.time=document.getElementById("evt-time").value.trim(),e.location=document.getElementById("evt-location").value.trim(),e.image_url=document.getElementById("evt-image").value.trim(),e.is_published=document.getElementById("evt-published").checked,await f("Event updated successfully!",()=>{h(),D()})}),b()}function We(t){const e=n.events.find(a=>a.id===t);e&&(e.is_published=e.is_published===!1,f(e.is_published?"Event published!":"Event set to draft.",()=>{D()}))}function Ke(t){$("Are you sure you want to delete this event? This action is permanent.",async()=>{n.events=n.events.filter(e=>e.id!==t),await f("Event deleted successfully!",()=>{D()})})}function U(){const t=document.getElementById("admin-facilities-table-body");t.innerHTML="",n.facilities.forEach(a=>{const i=document.createElement("tr");i.innerHTML=`
      <td><code>${a.svg_id}</code></td>
      <td><span class="text-bold">${d(a.title)}</span></td>
      <td style="max-width: 450px;">${d(a.description)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditFacilityModal('${a.id}')" title="Edit facility">✏️</button>
          <button class="btn-icon-only delete" onclick="deleteFacility('${a.id}')" title="Delete facility">🗑️</button>
        </div>
      </td>
    `,t.appendChild(i)});const e=n.hostel_info;document.getElementById("hostel-description").value=e.description||"",document.getElementById("hostel-boys").value=e.boys_hostel||"",document.getElementById("hostel-girls").value=e.girls_hostel||"",document.getElementById("hostel-image").value=e.image_url||"",document.getElementById("hostel-bullets").value=(e.bullets||[]).join(`
`),x("hostel-image")}function Ze(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Facility Pillar",t.innerHTML=`
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
  `,document.getElementById("modal-fac-form").addEventListener("submit",async e=>{e.preventDefault();const a=document.getElementById("modal-fac-submit-btn");v(a,"Saving...");const i={id:"fac-"+Date.now(),title:document.getElementById("fac-title").value.trim(),description:document.getElementById("fac-desc").value.trim(),svg_id:document.getElementById("fac-svg").value};n.facilities.push(i),await f("New facility pillar added successfully!",()=>{h(),U()})}),b()}function Xe(t){const e=n.facilities.find(i=>i.id===t);if(!e)return;const a=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Facility Pillar",a.innerHTML=`
    <form id="modal-fac-form">
      <div class="form-group">
        <label for="fac-title">Facility Title / Heading</label>
        <input type="text" id="fac-title" value="${d(e.title)}" required>
      </div>
      <div class="form-group">
        <label for="fac-desc">Pillar Short Description</label>
        <textarea id="fac-desc" rows="3" required>${d(e.description)}</textarea>
      </div>
      <div class="form-group">
        <label for="fac-svg">SVG Icon Style ID</label>
        <select id="fac-svg" required>
          <option value="teachers" ${e.svg_id==="teachers"?"selected":""}>Teachers (People Icon)</option>
          <option value="heart" ${e.svg_id==="heart"?"selected":""}>Heart (Learning Environment Icon)</option>
          <option value="book" ${e.svg_id==="book"?"selected":""}>Book (Islamic studies Icon)</option>
          <option value="camera" ${e.svg_id==="camera"?"selected":""}>Camera (CCTV Icon)</option>
          <option value="lock" ${e.svg_id==="lock"?"selected":""}>Lock (Security Icon)</option>
          <option value="check-circle" ${e.svg_id==="check-circle"?"selected":""}>Check Circle (Progress tracking Icon)</option>
          <option value="shield" ${e.svg_id==="shield"?"selected":""}>Shield (Supervision Icon)</option>
          <option value="dollar-sign" ${e.svg_id==="dollar-sign"?"selected":""}>Utensils / Dollar (Nutritious meals Icon)</option>
        </select>
      </div>
      <div class="form-submit-row">
        <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="modal-fac-edit-btn">Update Facility</button>
      </div>
    </form>
  `,document.getElementById("modal-fac-form").addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("modal-fac-edit-btn");v(o,"Saving..."),e.title=document.getElementById("fac-title").value.trim(),e.description=document.getElementById("fac-desc").value.trim(),e.svg_id=document.getElementById("fac-svg").value,await f("Facility pillar updated successfully!",()=>{h(),U()})}),b()}function et(t){$("Are you sure you want to delete this facility pillar?",async()=>{n.facilities=n.facilities.filter(e=>e.id!==t),await f("Facility pillar removed!",()=>{U()})})}async function tt(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]');v(e,"Saving..."),N(),await f("Hostel details and features list saved successfully!",()=>{A(e)})}function C(){const t=document.getElementById("admin-enquiries-table-body");t.innerHTML="";const e=document.getElementById("search-enquiries").value.toLowerCase().trim(),a=document.getElementById("filter-enquiries-class").value,i=document.getElementById("filter-enquiries-status").value,o=p.enquiries.filter(l=>{const c=l.student_name.toLowerCase().includes(e)||l.parent_name.toLowerCase().includes(e)||l.phone.includes(e),m=a==="all"||l.class_apply===a,u=i==="all"||l.status===i;return c&&m&&u});if(o.length===0){t.innerHTML='<tr><td colspan="6" class="table-empty">No admission enquiries found matching the filters.</td></tr>';return}o.forEach(l=>{const c=j(l.date),m=l.status,u=l.status==="follow-up"?"Follow-up":l.status,s=document.createElement("tr");s.innerHTML=`
      <td><span class="status-badge ${m}">${u}</span></td>
      <td>
        <div class="text-bold">${d(l.student_name)}</div>
        <div class="text-muted">Parent: ${d(l.parent_name)}</div>
      </td>
      <td>
        <div class="text-bold">${l.phone}</div>
        <div class="text-muted" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${d(l.message||"")}</div>
      </td>
      <td><span class="text-bold" style="text-transform: uppercase;">${l.class_apply.replace("class-","Class ")}</span></td>
      <td>${c}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="openEnquiryDetailsModal('${l.id}')">👁️ View</button>
          <select class="filter-select" style="padding: 4px 8px; font-size: 11px;" onchange="updateSubmissionStatus('enquiry', '${l.id}', this.value)">
            <option value="new" ${l.status==="new"?"selected":""}>New</option>
            <option value="contacted" ${l.status==="contacted"?"selected":""}>Contacted</option>
            <option value="follow-up" ${l.status==="follow-up"?"selected":""}>Follow-up</option>
            <option value="completed" ${l.status==="completed"?"selected":""}>Completed</option>
          </select>
          <button class="btn-icon-only delete" onclick="deleteSubmission('enquiry', '${l.id}')">🗑️</button>
        </div>
      </td>
    `,t.appendChild(s)})}function ve(t){const e=p.enquiries.find(o=>o.id===t);if(!e)return;const a=j(e.date),i=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Admission Enquiry Details",i.innerHTML=`
    <div class="detail-view-row">
      <div class="detail-label">Status</div>
      <div class="detail-value">
        <select class="filter-select" id="detail-enquiry-status" onchange="updateSubmissionStatus('enquiry', '${e.id}', this.value)">
          <option value="new" ${e.status==="new"?"selected":""}>New</option>
          <option value="contacted" ${e.status==="contacted"?"selected":""}>Contacted</option>
          <option value="follow-up" ${e.status==="follow-up"?"selected":""}>Follow-up</option>
          <option value="completed" ${e.status==="completed"?"selected":""}>Completed</option>
        </select>
      </div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Student Name</div>
      <div class="detail-value text-bold">${d(e.student_name)}</div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Parent Name</div>
      <div class="detail-value">${d(e.parent_name)}</div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Applying Class</div>
      <div class="detail-value" style="text-transform: uppercase;">${e.class_apply.replace("class-","Class ")}</div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Phone Number</div>
      <div class="detail-value">
        <a href="tel:${e.phone}" class="text-bold" style="color: #2196f3;">${e.phone}</a>
        &nbsp;&nbsp;
        <a href="https://wa.me/91${e.phone}" target="_blank" class="btn btn-success btn-sm" style="padding: 2px 6px;">WhatsApp Parent</a>
      </div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Date Submitted</div>
      <div class="detail-value">${a}</div>
    </div>
    <div class="detail-view-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
      <div class="detail-label">Message / Notes</div>
      <div class="detail-value" style="width:100%; padding: 12px; background: var(--bg-light); border-radius: 4px; white-space: pre-wrap;">${d(e.message||"No additional message was submitted.")}</div>
    </div>
    <div class="form-submit-row">
      <button class="btn btn-danger" onclick="deleteSubmission('enquiry', '${e.id}'); closeAdminModal();" style="float: left;">🗑️ Delete Enquiry</button>
      <button class="btn btn-primary" onclick="closeAdminModal()">Close Window</button>
    </div>
  `,b()}function S(){const t=document.getElementById("admin-messages-table-body");t.innerHTML="";const e=document.getElementById("search-messages").value.toLowerCase().trim(),a=document.getElementById("filter-messages-state").value,i=p.messages.filter(o=>{const l=o.name.toLowerCase().includes(e)||o.subject.toLowerCase().includes(e)||o.message.toLowerCase().includes(e),c=a==="all"||a==="unread"&&!o.is_read||a==="read"&&o.is_read;return l&&c});if(i.length===0){t.innerHTML='<tr><td colspan="5" class="table-empty">No contact messages match the filters.</td></tr>';return}i.forEach(o=>{const l=j(o.date),c=o.is_read?"Read":"Unread",m=o.is_read?"read":"unread",u=document.createElement("tr");u.className=o.is_read?"":"unread-row-highlight",u.innerHTML=`
      <td><span class="status-badge ${m}">${c}</span></td>
      <td>
        <div class="text-bold">${d(o.name)}</div>
        <div class="text-muted">${d(o.email||"No Email")} | ${o.phone||"No Phone"}</div>
      </td>
      <td>
        <div class="text-bold">${d(o.subject)}</div>
        <div class="text-muted" style="max-width: 350px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${d(o.message)}</div>
      </td>
      <td>${l}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="openMessageDetailsModal('${o.id}')">📖 Read</button>
          <button class="btn-icon-only" onclick="toggleMessageReadState('${o.id}')" title="${o.is_read?"Mark unread":"Mark read"}">${o.is_read?"✉️":"📩"}</button>
          <button class="btn-icon-only delete" onclick="deleteSubmission('message', '${o.id}')">🗑</button>
        </div>
      </td>
    `,t.appendChild(u)})}async function be(t){const e=p.messages.find(o=>o.id===t);if(!e)return;const a=j(e.date),i=document.getElementById("modal-body");if(document.getElementById("modal-title").textContent="Read Message",i.innerHTML=`
    <div class="detail-view-row">
      <div class="detail-label">Sender Name</div>
      <div class="detail-value text-bold">${d(e.name)}</div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Email Address</div>
      <div class="detail-value"><a href="mailto:${e.email}" style="color: #2196f3;">${e.email||"N/A"}</a></div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Phone / Mobile</div>
      <div class="detail-value"><a href="tel:${e.phone}" style="color: #2196f3;">${e.phone||"N/A"}</a></div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Date Received</div>
      <div class="detail-value">${a}</div>
    </div>
    <div class="detail-view-row">
      <div class="detail-label">Subject</div>
      <div class="detail-value text-bold" style="color: var(--primary-navy);">${d(e.subject)}</div>
    </div>
    <div class="detail-view-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
      <div class="detail-label">Message Details</div>
      <div class="detail-value" style="width:100%; padding: 16px; background: var(--bg-light); border-radius: 4px; white-space: pre-wrap;">${d(e.message)}</div>
    </div>
    <div class="form-submit-row">
      <button class="btn btn-danger" onclick="deleteSubmission('message', '${e.id}'); closeAdminModal();" style="float: left;">🗑️ Delete Message</button>
      <button class="btn btn-primary" onclick="closeAdminModal()">Close Message</button>
    </div>
  `,b(),!e.is_read){e.is_read=!0,F(),S();try{await fetch("/api/update-submission",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"message",id:t,is_read:!0})})}catch(o){console.error("Failed to update read state on server:",o)}}}async function ot(t){const e=p.messages.find(a=>a.id===t);if(e){e.is_read=!e.is_read,F(),S();try{await fetch("/api/update-submission",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"message",id:t,is_read:e.is_read})})}catch(a){console.error("Failed to toggle read status:",a)}}}async function it(t,e,a){try{if((await(await fetch("/api/update-submission",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:t,id:e,status:a})})).json()).success){if(t==="enquiry"){const l=p.enquiries.find(c=>c.id===e);l&&(l.status=a),C()}F(),g("Submission status updated successfully!","success")}else g("Failed to update status.","error")}catch(i){console.error("Error updating status:",i),g("Network error during status update.","error")}}async function at(t,e){$(`Are you sure you want to permanently delete this ${t==="enquiry"?"admission enquiry":"contact message"}?`,async()=>{try{(await(await fetch("/api/submission",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:t,id:e})})).json()).success?(t==="enquiry"?(p.enquiries=p.enquiries.filter(o=>o.id!==e),C()):(p.messages=p.messages.filter(o=>o.id!==e),S()),F(),T(),g("Submission deleted successfully!","success")):g("Failed to delete submission.","error")}catch(a){console.error("Error deleting submission:",a),g("Network error during deletion.","error")}})}function P(){const t=document.getElementById("admin-media-library-grid");t.innerHTML="";const e=document.getElementById("search-media").value.toLowerCase().trim(),a=w.filter(i=>i.name.toLowerCase().includes(e));if(a.length===0){t.innerHTML='<p class="empty-list-text">No uploaded assets found matching search.</p>';return}a.forEach(i=>{const o=/\.(jpg|jpeg|png|webp|gif)$/i.test(i.name),l=document.createElement("div");l.className="media-item-card",l.setAttribute("data-name",i.name);let c="";o?c=`<img src="${i.url}" alt="${i.name}" loading="lazy">`:c='<span class="media-icon-placeholder">🎥</span>',l.innerHTML=`
      <div class="media-thumbnail-wrapper">
        ${c}
      </div>
      <div class="media-item-details">
        <div class="media-filename" title="${i.name}">${i.name}</div>
      </div>
      <div class="media-actions-overlay">
        <button class="btn-media-action" onclick="copyToClipboard('${i.url}'); event.stopPropagation();" title="Copy file URL">🔗</button>
        <button class="btn-media-action delete" onclick="deleteMediaFile('${i.name}'); event.stopPropagation();" title="Delete file">🗑️</button>
      </div>
    `,l.addEventListener("click",()=>{xe(i.url)}),t.appendChild(l)})}function nt(){document.getElementById("media-upload-input").click()}async function lt(t){const e=t.files;if(e.length===0)return;const a=document.querySelector(".btn-media-upload-trigger");v(a,"Uploading...");const i=new FormData;for(let o=0;o<e.length;o++)i.append("files",e[o]);g("Uploading files...","info");try{const l=await(await fetch("/api/upload",{method:"POST",body:i})).json();l.success?(w=await(await fetch("/api/media")).json(),P(),g(`Successfully uploaded ${l.files.length} file(s)!`,"success")):g(l.message||"File upload failed.","error")}catch(o){console.error("Upload failed:",o),g("Network error during file upload.","error")}finally{A(a),t.value=""}}async function st(t){$(`Are you sure you want to permanently delete '${t}'? This will break any page reference that displays it.`,async()=>{try{const a=await(await fetch(`/api/media/${t}`,{method:"DELETE"})).json();a.success?(w=w.filter(i=>i.name!==t),P(),g("File deleted successfully.","success")):g(a.message||"Delete failed.","error")}catch(e){console.error("Delete failed:",e),g("Network error during file deletion.","error")}})}function dt(){const t=n.social_media,e=n.contact_settings;document.getElementById("social-instagram").value=t.instagram||"",document.getElementById("social-facebook").value=t.facebook||"",document.getElementById("social-youtube").value=t.youtube||"",document.getElementById("social-whatsapp").value=t.whatsapp||"",document.getElementById("contact-address").value=e.address||"",document.getElementById("contact-phone").value=e.phone||"",document.getElementById("contact-email").value=e.email||"",document.getElementById("contact-map").value=e.google_maps_embed||""}async function ct(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]');v(e,"Saving..."),N(),await f("Social media and Google Map settings saved successfully!",()=>{A(e)})}function rt(t){q=t,Ee(),document.getElementById("media-select-modal").style.display="flex"}function he(){document.getElementById("media-select-modal").style.display="none",q=null}function Ee(){const t=document.getElementById("modal-media-grid");t.innerHTML="";const e=document.getElementById("search-media-select").value.toLowerCase().trim(),a=w.filter(i=>i.name.toLowerCase().includes(e));if(a.length===0){t.innerHTML='<p class="empty-list-text" style="grid-column: 1/-1;">No media matches.</p>';return}a.forEach(i=>{const o=/\.(jpg|jpeg|png|webp|gif)$/i.test(i.name),l=document.createElement("div");l.className="media-item-card";let c="";o?c=`<img src="${i.url}" alt="${i.name}" loading="lazy">`:c='<span class="media-icon-placeholder">🎥</span>',l.innerHTML=`
      <div class="media-thumbnail-wrapper">${c}</div>
      <div class="media-item-details">
        <div class="media-filename">${i.name}</div>
      </div>
    `,l.addEventListener("click",()=>{we(i.url)}),t.appendChild(l)})}function we(t){if(q){const e=document.getElementById(q);e&&(e.value=t,x(q))}he()}async function f(t,e){try{const i=await(await fetch("/api/save-content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json();i.success?(g(t||"Database updated successfully!","success"),e&&e()):g("Save operation failed: "+i.message,"error")}catch(a){console.error("Error saving content:",a),g("Failed to send content save request to server.","error")}}function b(){document.getElementById("admin-modal").style.display="flex"}function h(){document.getElementById("admin-modal").style.display="none",document.getElementById("modal-body").innerHTML=""}function ut(t){const e={day:"2-digit",month:"short",year:"numeric"};return t.toLocaleDateString("en-GB",e)}function j(t){return t?new Date(t).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"}):"N/A"}function mt(t){if(!t)return"";const e=new Date(t),i=new Date-e,o=Math.floor(i/1e3),l=Math.floor(o/60),c=Math.floor(l/60),m=Math.floor(c/24);return o<60?"Just now":l<60?`${l}m ago`:c<24?`${c}h ago`:`${m}d ago`}function xe(t){navigator.clipboard?navigator.clipboard.writeText(t).then(()=>{g("URL copied to clipboard! You can paste it into content forms.","success")}).catch(e=>{console.error("Failed to copy using clipboard API:",e),me(t)}):me(t)}function me(t){const e=document.createElement("textarea");e.value=t,e.style.position="fixed",document.body.appendChild(e),e.focus(),e.select();try{document.execCommand("copy"),g("URL copied to clipboard!","success")}catch{g("Failed to copy link. Please manually copy URL: "+t,"error")}document.body.removeChild(e)}function d(t){return t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}
