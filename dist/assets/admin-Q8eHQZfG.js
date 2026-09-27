import"./modulepreload-polyfill-B5Qt9EMX.js";let n=null,h=null,N=[],ae="dashboard",X=null;window.openAddGalleryModal=Ee;window.openEditGalleryModal=Re;window.toggleGalleryPublish=Ye;window.deleteGalleryItem=Je;window.moveGalleryItem=We;window.openCategoryManagerModal=Oe;window.openUploadGalleryModal=Ve;window.openAddNoticeModal=Qe;window.openEditNoticeModal=Ke;window.toggleNoticePublish=Ze;window.toggleNoticeArchive=Xe;window.toggleNoticeImportant=et;window.deleteNotice=tt;window.openAddEventModal=ot;window.openEditEventModal=it;window.toggleEventPublish=at;window.deleteEvent=nt;window.openAddFacilityModal=lt;window.openEditFacilityModal=st;window.deleteFacility=dt;window.openAddFacultyModal=He;window.openEditFacultyModal=Ue;window.deleteFacultyMember=ze;window.toggleFacultyStatus=je;window.moveFacultyMember=Ge;window.filterFacultyTable=Pe;window.openEnquiryDetailsModal=re;window.saveEnquiryNoteAndStatus=ct;window.openMessageDetailsModal=Ie;window.toggleMessageReadState=ut;window.updateSubmissionStatus=mt;window.deleteSubmission=pt;window.triggerMediaUpload=gt;window.handleMediaUpload=ft;window.deleteMediaFile=yt;window.closeAdminModal=C;window.closeMediaSelectModal=Be;window.copyToClipboard=ke;window.selectMediaForInput=_e;function v(t,e="success"){let i=document.getElementById("toast-container");i||(i=document.createElement("div"),i.id="toast-container",document.body.appendChild(i));const o=document.createElement("div");o.className=`toast toast-${e}`;let a="✓";e==="error"?a="⚠":e==="info"&&(a="ℹ"),o.innerHTML=`
    <span class="toast-icon">${a}</span>
    <span class="toast-message">${c(t)}</span>
  `,i.appendChild(o),setTimeout(()=>o.classList.add("show"),10),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>o.remove(),300)},4e3)}function U(t,e){const i=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Confirm Action",i.innerHTML=`
    <div style="padding: 10px 0 20px; font-size: 15px; color: var(--text-dark); line-height: 1.5;">
      ${c(t)}
    </div>
    <div class="form-submit-row" style="margin-top: 0; justify-content: flex-end; gap: 10px;">
      <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancel</button>
      <button type="button" class="btn btn-danger" id="confirm-action-btn">Delete</button>
    </div>
  `,document.getElementById("confirm-action-btn").addEventListener("click",()=>{C(),e()}),k()}function Me(){const t=document.getElementById("admin-theme-toggle");if(!t)return;const e=document.documentElement.getAttribute("data-theme")||"light";ye(e),t.addEventListener("click",()=>{const o=(document.documentElement.getAttribute("data-theme")||"light")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",o);try{localStorage.setItem("aps_theme",o)}catch{}ye(o)})}function ye(t){const e=document.getElementById("admin-theme-label");e&&(e.textContent=t==="dark"?"Dark":"Light")}function E(t,e="Processing..."){t&&(t.disabled=!0,t.dataset.originalText=t.innerHTML,t.innerHTML=`<span class="loading-spinner"></span> ${e}`)}function G(t){t&&(t.disabled=!1,t.dataset.originalText&&(t.innerHTML=t.dataset.originalText))}window.uploadFileDirectly=async function(t,e,i){const o=t.files;if(o.length===0)return;const a=new FormData;a.append("files",o[0]);const s=document.getElementById(e+"-preview-container"),l=document.getElementById(e+"-preview");v("Uploading file...","info");try{const u=await(await fetch("/api/upload",{method:"POST",body:a})).json();if(u.success&&u.files.length>0){const d=u.files[0].url;document.getElementById(e).value=d,l&&(l.src=d),s&&(s.style.display="flex"),v("File uploaded successfully!","success"),N=await(await fetch("/api/media")).json(),ae==="media-library"&&te()}else v(u.message||"File upload failed.","error")}catch(m){console.error("File upload failed:",m),v("Network error during file upload.","error")}t.value=""};function F(t,e){const i=document.getElementById(t);if(!i)return;const o=i.value,a=document.getElementById(t+"-preview-container"),s=document.getElementById(t+"-preview");o&&s&&a?(s.src=o,a.style.display="flex"):a&&(a.style.display="none")}document.addEventListener("DOMContentLoaded",()=>{Ce(),Le()});async function Ce(){if(window.location.protocol==="file:"){const e=document.getElementById("file-protocol-warning");e&&(e.style.display="block")}await Se()?(he(),await xe(),we()):de()}async function Se(){try{const e=await(await fetch("/api/check-session")).json();if(e.success)return document.getElementById("logged-username").textContent=e.username,!0}catch(t){console.error("Session check failed:",t)}return!1}function de(){document.getElementById("login-section").style.display="flex",document.getElementById("admin-container").style.display="none"}function he(){document.getElementById("login-section").style.display="none",document.getElementById("admin-container").style.display="flex"}async function xe(){try{if(n=await(await fetch("/api/content")).json(),n&&(n.notices=n.notices||[],n.events=n.events||[],n.gallery=n.gallery||[],n.facilities=n.facilities||[],n.school_info=n.school_info||{},n.director_info=n.director_info||{},n.principal_info=n.principal_info||{},n.hero_section=n.hero_section||{},n.social_media=n.social_media||{},n.contact_settings=n.contact_settings||{},n.hostel_info=n.hostel_info||{},n.school_info&&n.school_info.logo_url)){const o=document.querySelector(".admin-sidebar-logo");o&&(o.src=n.school_info.logo_url);const a=document.querySelector(".admin-login-logo");a&&(a.src=n.school_info.logo_url)}h=await(await fetch("/api/submissions")).json(),h&&(h.enquiries=h.enquiries||[],h.messages=h.messages||[]),N=await(await fetch("/api/media")).json(),N=N||[],W()}catch(t){console.error("Error loading admin data:",t),v("Failed to load website database content. Please ensure the server is running.","error")}}function W(){if(!h)return;const t=h.enquiries.filter(a=>a.status==="new").length,e=h.messages.filter(a=>!a.is_read).length,i=document.getElementById("badge-new-enquiries"),o=document.getElementById("badge-new-messages");t>0?(i.textContent=t,i.style.display="inline-block"):i.style.display="none",e>0?(o.textContent=e,o.style.display="inline-block"):o.style.display="none"}function Le(){document.getElementById("login-form").addEventListener("submit",De),document.getElementById("toggle-password-btn").addEventListener("click",Te),document.getElementById("btn-logout-sidebar").addEventListener("click",ve),document.getElementById("btn-logout-header").addEventListener("click",ve);const t=document.getElementById("admin-sidebar");document.getElementById("admin-hamburger").addEventListener("click",()=>{t.classList.add("open")}),document.getElementById("sidebar-close-btn").addEventListener("click",()=>{t.classList.remove("open")}),document.querySelectorAll(".sidebar-nav .nav-item").forEach(l=>{l.addEventListener("click",m=>{m.preventDefault();const u=l.getAttribute("data-tab");oe(u),t.classList.remove("open")})}),document.addEventListener("click",l=>{if(l.target.classList.contains("btn-tab-trigger")){const m=l.target.getAttribute("data-target-tab");m&&oe(m)}}),document.getElementById("form-homepage-settings").addEventListener("submit",Ae),document.getElementById("form-school-info").addEventListener("submit",Fe),document.getElementById("form-hostel-settings").addEventListener("submit",rt),document.getElementById("form-social-settings").addEventListener("submit",bt),document.getElementById("search-gallery").addEventListener("input",H),document.getElementById("filter-gallery-category").addEventListener("change",H),document.getElementById("search-notices").addEventListener("input",T),document.getElementById("filter-notices-category").addEventListener("change",T);const i=document.getElementById("filter-notices-status");i&&i.addEventListener("change",T),document.getElementById("search-events").addEventListener("input",R);const o=document.getElementById("filter-events-status");o&&o.addEventListener("change",R),document.getElementById("search-enquiries").addEventListener("input",P),document.getElementById("filter-enquiries-class").addEventListener("change",P),document.getElementById("filter-enquiries-status").addEventListener("change",P);const a=document.getElementById("filter-enquiries-date");a&&a.addEventListener("change",P),document.getElementById("search-messages").addEventListener("input",O),document.getElementById("filter-messages-state").addEventListener("change",O);const s=document.getElementById("btn-alert-view-enquiries");s&&s.addEventListener("click",()=>oe("enquiries")),Me(),document.getElementById("search-media").addEventListener("input",te),document.getElementById("search-media-select").addEventListener("input",$e),document.addEventListener("click",l=>{if(l.target.classList.contains("btn-select-media")){const m=l.target.getAttribute("data-target-input");ht(m)}})}function Te(){const t=document.getElementById("login-password"),e=document.getElementById("toggle-password-btn");t.type==="password"?(t.type="text",e.innerHTML=`
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    `):(t.type="password",e.innerHTML=`
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `)}async function De(t){t.preventDefault();const e=document.getElementById("login-username"),i=document.getElementById("login-password"),o=document.getElementById("login-error-alert");o.style.display="none";try{const s=await(await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e.value.trim(),password:i.value.trim()})})).json();s.success?(document.getElementById("logged-username").textContent=s.username,i.value="",he(),await xe(),oe("dashboard")):(o.textContent=s.message||"Invalid username or password.",o.style.display="block")}catch(a){console.error("Login error:",a),o.textContent="Network or server error during login.",o.style.display="block"}}async function ve(t){t.preventDefault(),U("Are you sure you want to securely log out?",async()=>{try{(await(await fetch("/api/logout",{method:"POST"})).json()).success&&de()}catch(e){console.error("Logout error:",e),de()}})}function ee(){if(n)switch(ae){case"homepage":const t=document.getElementById("hero-badge"),e=document.getElementById("hero-title"),i=document.getElementById("hero-tagline"),o=document.getElementById("hero-description"),a=document.getElementById("hero-btn1-text"),s=document.getElementById("hero-btn2-text"),l=document.getElementById("hero-image"),m=document.getElementById("homepage-show-leaders");t&&(n.hero_section.badge=t.value.trim()),e&&(n.hero_section.title=e.value.trim()),i&&(n.hero_section.tagline=i.value.trim()),o&&(n.hero_section.description=o.value.trim()),a&&(n.hero_section.button1_text=a.value.trim()),s&&(n.hero_section.button2_text=s.value.trim()),l&&(n.hero_section.image_url=l.value.trim()),m&&(n.school_info.show_leaders=m.checked);break;case"school-info":const u=document.getElementById("school-name"),d=document.getElementById("school-reg-number"),p=document.getElementById("school-logo"),r=document.getElementById("school-description"),f=document.getElementById("school-timings"),x=document.getElementById("office-timings"),I=document.getElementById("about-title"),_=document.getElementById("about-text"),y=document.getElementById("admission-info-text");if(u&&(n.school_info.name=u.value.trim()),d&&(n.school_info.reg_number=d.value.trim()),p){n.school_info.logo_url=p.value.trim();const J=document.querySelector(".admin-sidebar-logo");J&&(J.src=n.school_info.logo_url||"/uploads/media-1786798848541-655607772.png");const fe=document.querySelector(".admin-login-logo");fe&&(fe.src=n.school_info.logo_url||"/uploads/media-1786798848541-655607772.png")}r&&(n.school_info.description=r.value.trim()),f&&(n.school_info.school_timings=f.value.trim()),x&&(n.school_info.office_timings=x.value.trim()),I&&(n.school_info.about_title=I.value.trim()),_&&(n.school_info.about_text=_.value.trim()),y&&(n.school_info.admission_info=y.value.trim());const q=document.getElementById("director-name"),S=document.getElementById("director-phone"),A=document.getElementById("director-photo"),B=document.getElementById("director-message");q&&(n.director_info.name=q.value.trim()),S&&(n.director_info.phone=S.value.trim()),A&&(n.director_info.photo_url=A.value.trim()),B&&(n.director_info.message=B.value.trim());const M=document.getElementById("principal-name"),Q=document.getElementById("principal-phone"),K=document.getElementById("principal-photo"),Y=document.getElementById("principal-message");M&&(n.principal_info.name=M.value.trim()),Q&&(n.principal_info.phone=Q.value.trim()),K&&(n.principal_info.photo_url=K.value.trim()),Y&&(n.principal_info.message=Y.value.trim());break;case"hostel-facilities":const Z=document.getElementById("hostel-description"),z=document.getElementById("hostel-boys"),j=document.getElementById("hostel-girls"),g=document.getElementById("hostel-image"),w=document.getElementById("hostel-bullets");Z&&(n.hostel_info.description=Z.value.trim()),z&&(n.hostel_info.boys_hostel=z.value.trim()),j&&(n.hostel_info.girls_hostel=j.value.trim()),g&&(n.hostel_info.image_url=g.value.trim()),w&&(n.hostel_info.bullets=w.value.split(`
`).map(J=>J.trim()).filter(J=>J!==""));break;case"social-settings":const L=document.getElementById("social-instagram"),$=document.getElementById("social-facebook"),ce=document.getElementById("social-youtube"),se=document.getElementById("social-whatsapp"),ue=document.getElementById("contact-address"),me=document.getElementById("contact-phone"),pe=document.getElementById("contact-email"),ge=document.getElementById("contact-map");L&&(n.social_media.instagram=L.value.trim()),$&&(n.social_media.facebook=$.value.trim()),ce&&(n.social_media.youtube=ce.value.trim()),se&&(n.social_media.whatsapp=se.value.trim(),n.contact_settings.whatsapp=se.value.trim()),ue&&(n.contact_settings.address=ue.value.trim()),me&&(n.contact_settings.phone=me.value.trim()),pe&&(n.contact_settings.email=pe.value.trim()),ge&&(n.contact_settings.google_maps_embed=ge.value.trim());break}}function oe(t){ee(),ae=t,document.querySelectorAll(".sidebar-nav .nav-item").forEach(a=>{a.classList.remove("active"),a.getAttribute("data-tab")===t&&a.classList.add("active")});const i={dashboard:"Dashboard Statistics",homepage:"Homepage Content Settings","school-info":"School & Leadership Info",gallery:"Gallery Content Management",notices:"School Notice Board Manager",events:"Events & Assemblies Scheduler","hostel-facilities":"Hostel & Facilities Settings",enquiries:"Online Admission Enquiries",messages:"General Contact Messages","media-library":"Media Library Assets","social-settings":"Social Links & Contact Channels"};document.getElementById("page-title").textContent=i[t]||"Admin Dashboard",document.querySelectorAll(".content-wrapper .tab-content").forEach(a=>a.classList.remove("active")),document.getElementById(`tab-${t}`).classList.add("active"),we()}function we(){if(n)switch(ae){case"dashboard":D();break;case"homepage":qe();break;case"school-info":Ne();break;case"faculty":V();break;case"gallery":H();break;case"notices":T();break;case"events":R();break;case"hostel-facilities":ne();break;case"enquiries":P();break;case"messages":O();break;case"media-library":te();break;case"social-settings":vt();break}}function D(){if(!n||!h)return;const t=h.enquiries||[],e=t.length,i=t.filter(g=>g.status==="new").length,o=t.filter(g=>g.status==="follow-up").length,a=t.filter(g=>g.status==="converted"||g.status==="completed").length,s=t.filter(g=>g.status==="closed").length,l=document.getElementById("stat-enquiries-count");l&&(l.textContent=e);const m=document.getElementById("stat-new-enquiries-count");m&&(m.textContent=i);const u=document.getElementById("stat-followup-count");u&&(u.textContent=o);const d=document.getElementById("stat-converted-count");d&&(d.textContent=a);const p=document.getElementById("stat-closed-count");p&&(p.textContent=s);const r=h.messages||[],f=r.filter(g=>!g.is_read||g.status==="new").length,x=document.getElementById("stat-messages-count");x&&(x.textContent=r.length);const I=document.getElementById("stat-messages-unread");I&&(I.textContent=`${f} unread`);const _=n.events||[],y=new Date;y.setHours(0,0,0,0);const q=_.filter(g=>{if(g.is_published===!1)return!1;const w=new Date(g.date);return w.setHours(0,0,0,0),isNaN(w.getTime())||w>=y}),S=document.getElementById("stat-events-count");S&&(S.textContent=_.length);const A=document.getElementById("stat-events-desc");A&&(A.textContent=`${q.length} upcoming`);const B=n.notices||[],M=B.filter(g=>g.is_published!==!1&&!g.is_archived),Q=document.getElementById("stat-notices-count");Q&&(Q.textContent=B.length);const K=document.getElementById("stat-notices-desc");K&&(K.textContent=`${M.length} published`);const Y=document.getElementById("admin-alert-banner"),Z=document.getElementById("admin-alert-text");if(Y)if(i>0||f>0){Y.style.display="flex";let g="Attention: ";i>0&&f>0?g+=`You have ${i} new admission ${i===1?"enquiry":"enquiries"} and ${f} unread ${f===1?"message":"messages"} waiting for review.`:i>0?g+=`You have ${i} new admission ${i===1?"enquiry":"enquiries"} waiting for review.`:g+=`You have ${f} unread contact ${f===1?"message":"messages"} waiting for review.`,Z&&(Z.textContent=g)}else Y.style.display="none";const z=document.getElementById("dashboard-recent-enquiries");if(z){z.innerHTML="";const g=[...t].sort((w,L)=>new Date(L.date)-new Date(w.date)).slice(0,5);g.length===0?z.innerHTML='<p class="empty-list-text">No admission enquiries received yet.</p>':g.forEach(w=>{const L=ie(w.date),$=document.createElement("div");$.className="submission-item",$.style.cursor="pointer",$.innerHTML=`
          <span class="status-badge ${w.status||"new"}">${w.status||"new"}</span>
          <div class="sub-info">
            <div class="sub-name">${c(w.student_name)} (Parent: ${c(w.parent_name)})</div>
            <div class="sub-details">Applying for ${w.class_apply.replace("class-","Class ").toUpperCase()} | Phone: ${w.phone}</div>
          </div>
          <div class="sub-date">${L}</div>
        `,$.addEventListener("click",()=>re(w.id)),z.appendChild($)})}const j=document.getElementById("dashboard-recent-submissions");if(j){j.innerHTML="";const g=[...r].sort((w,L)=>new Date(L.date)-new Date(w.date)).slice(0,5);g.length===0?j.innerHTML='<p class="empty-list-text">No recent contact messages.</p>':g.forEach(w=>{const L=ie(w.date),$=document.createElement("div");$.className="submission-item",$.style.cursor="pointer",$.innerHTML=`
          <span class="sub-badge message">${w.is_read?"Read":"New"}</span>
          <div class="sub-info">
            <div class="sub-name">${c(w.name)}</div>
            <div class="sub-details">${c(w.subject||"General message")}</div>
          </div>
          <div class="sub-date">${L}</div>
        `,$.addEventListener("click",()=>Ie(w.id)),j.appendChild($)})}}function qe(){const t=n.hero_section;document.getElementById("hero-badge").value=t.badge||"",document.getElementById("hero-title").value=t.title||"",document.getElementById("hero-tagline").value=t.tagline||"",document.getElementById("hero-description").value=t.description||"",document.getElementById("hero-btn1-text").value=t.button1_text||"Apply for Admission",document.getElementById("hero-btn2-text").value=t.button2_text||"Admission Enquiry",document.getElementById("hero-image").value=t.image_url||"",document.getElementById("homepage-show-leaders").checked=n.school_info.show_leaders!==!1,F("hero-image")}async function Ae(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]');E(e,"Saving..."),ee(),await b("Homepage content saved successfully!",()=>{G(e)})}function Ne(){const t=n.school_info,e=n.director_info,i=n.principal_info;document.getElementById("school-name").value=t.name||"",document.getElementById("school-reg-number").value=t.reg_number||"",document.getElementById("school-logo").value=t.logo_url||"",document.getElementById("school-description").value=t.description||"";const o=document.getElementById("school-timings");o&&(o.value=t.school_timings||"Mon – Sat: 8:00 AM – 2:00 PM");const a=document.getElementById("office-timings");a&&(a.value=t.office_timings||"Mon – Sat: 8:00 AM – 3:30 PM"),document.getElementById("about-title").value=t.about_title||"",document.getElementById("about-text").value=t.about_text||"",document.getElementById("admission-info-text").value=t.admission_info||"",document.getElementById("director-name").value=e.name||"",document.getElementById("director-phone").value=e.phone||"",document.getElementById("director-photo").value=e.photo_url||"",document.getElementById("director-message").value=e.message||"",document.getElementById("principal-name").value=i.name||"",document.getElementById("principal-phone").value=i.phone||"",document.getElementById("principal-photo").value=i.photo_url||"",document.getElementById("principal-message").value=i.message||"",F("school-logo"),F("director-photo"),F("principal-photo")}async function Fe(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]');E(e,"Saving..."),ee(),await b("School metadata and leadership messages saved successfully!",()=>{G(e)})}function V(){const t=document.getElementById("admin-faculty-table-body");if(!t)return;t.innerHTML="",n.faculty_staff||(n.faculty_staff=[]);const e=[...n.faculty_staff].sort((d,p)=>(d.order||0)-(p.order||0)),i=document.getElementById("filter-faculty-category"),o=document.getElementById("search-faculty"),a=i?i.value:"all",s=o?o.value.toLowerCase().trim():"",l=e.filter(d=>{const p=a==="all"||d.category===a,r=!s||d.name&&d.name.toLowerCase().includes(s)||d.designation&&d.designation.toLowerCase().includes(s)||d.subject&&d.subject.toLowerCase().includes(s)||d.qualification&&d.qualification.toLowerCase().includes(s);return p&&r});if(l.length===0){t.innerHTML=`
      <tr>
        <td colspan="8" class="table-empty" style="text-align: center; padding: 30px; color: var(--text-light);">
          No faculty or staff profiles found matching criteria. Click "Add Staff Profile" to add one.
        </td>
      </tr>
    `;return}const m={leadership:"School Leadership",teaching:"Teaching Faculty",admin:"Administrative Staff",support:"Support Staff"},u={leadership:"background:#fef3c7; color:#92400e; border:1px solid #fde68a;",teaching:"background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;",admin:"background:#f3e8ff; color:#6b21a8; border:1px solid #e9d5ff;",support:"background:#dcfce7; color:#15803d; border:1px solid #bbf7d0;"};l.forEach((d,p)=>{const r=document.createElement("tr");r.className=d.is_active===!1?"row-inactive":"",d.is_active===!1&&(r.style.opacity="0.65");const f=u[d.category]||"background:#f1f5f9; color:#475569;",x=m[d.category]||d.category||"General",I=d.photo_url?`<img src="${d.photo_url}" alt="${c(d.name)}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 50%; border: 2px solid var(--border-color);">`:`<div style="width: 44px; height: 44px; border-radius: 50%; background: #e2e8f0; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px;">
        ${c((d.name||"S").charAt(0))}
      </div>`;r.innerHTML=`
      <td style="text-align: center;">
        <div style="display: flex; flex-direction: column; gap: 3px; align-items: center;">
          <button type="button" class="btn-icon-subtle" onclick="moveFacultyMember('${d.id}', -1)" title="Move Up" style="font-size: 11px; padding: 2px 5px; cursor: pointer; border-radius: 3px; background: #f1f5f9; border: 1px solid #cbd5e1;">▲</button>
          <span style="font-weight: 600; font-size: 12px; color: var(--text-dark);">${d.order||p+1}</span>
          <button type="button" class="btn-icon-subtle" onclick="moveFacultyMember('${d.id}', 1)" title="Move Down" style="font-size: 11px; padding: 2px 5px; cursor: pointer; border-radius: 3px; background: #f1f5f9; border: 1px solid #cbd5e1;">▼</button>
        </div>
      </td>
      <td style="text-align: center;">${I}</td>
      <td>
        <div style="font-weight: 600; color: var(--text-dark); font-size: 14px;">${c(d.name)}</div>
        <div style="font-size: 12.5px; color: var(--text-light); margin-top: 2px;">${c(d.designation||"Staff")}</div>
      </td>
      <td>
        <span style="display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; ${f}">
          ${c(x)}
        </span>
      </td>
      <td>
        <span style="font-weight: 500; font-size: 13px; color: var(--text-dark);">${c(d.subject||"—")}</span>
      </td>
      <td>
        <div style="font-size: 12.5px; font-weight: 500; color: var(--text-dark);">${c(d.qualification||"—")}</div>
        ${d.experience?`<div style="font-size: 11px; color: #16a34a; font-weight: 600; margin-top: 2px;">★ ${c(d.experience)} Exp</div>`:""}
      </td>
      <td style="text-align: center;">
        <button type="button" onclick="toggleFacultyStatus('${d.id}')" style="cursor: pointer; border: none; padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; transition: all 0.2s ease; ${d.is_active!==!1?"background: #dcfce7; color: #15803d;":"background: #fee2e2; color: #b91c1c;"}">
          ${d.is_active!==!1?"✓ Active":"✕ Inactive"}
        </button>
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 6px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="openEditFacultyModal('${d.id}')" style="padding: 4px 10px; font-size: 12px;">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteFacultyMember('${d.id}')" style="padding: 4px 10px; font-size: 12px;">Delete</button>
        </div>
      </td>
    `,t.appendChild(r)})}function Pe(){V()}function He(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Faculty & Staff Profile";const e=(n.faculty_staff||[]).length+1;t.innerHTML=`
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
  `,bindModalMediaSelect(),document.getElementById("modal-faculty-form").addEventListener("submit",async i=>{i.preventDefault();const o=document.getElementById("btn-save-faculty");E(o,"Adding Profile..."),n.faculty_staff||(n.faculty_staff=[]);const a={id:"staff-"+Date.now(),name:document.getElementById("modal-staff-name").value.trim(),category:document.getElementById("modal-staff-category").value,designation:document.getElementById("modal-staff-designation").value.trim(),subject:document.getElementById("modal-staff-subject").value.trim(),qualification:document.getElementById("modal-staff-qualification").value.trim(),experience:document.getElementById("modal-staff-experience").value.trim(),bio:document.getElementById("modal-staff-bio").value.trim(),photo_url:document.getElementById("modal-staff-photo").value.trim(),order:parseInt(document.getElementById("modal-staff-order").value)||n.faculty_staff.length+1,is_active:document.getElementById("modal-staff-active").checked};n.faculty_staff.push(a),await b("Faculty profile added successfully!",()=>{C(),V(),D()})}),k()}function Ue(t){if(!n.faculty_staff)return;const e=n.faculty_staff.find(o=>o.id===t);if(!e)return;const i=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Faculty & Staff Profile",i.innerHTML=`
    <form id="modal-faculty-edit-form">
      <input type="hidden" id="modal-staff-id" value="${e.id}">
      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-name">Full Name *</label>
          <input type="text" id="modal-staff-name" required value="${c(e.name)}">
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
          <input type="text" id="modal-staff-designation" required value="${c(e.designation||"")}">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-subject">Subject / Department *</label>
          <input type="text" id="modal-staff-subject" required value="${c(e.subject||"")}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-6">
          <label for="modal-staff-qualification">Educational Qualification *</label>
          <input type="text" id="modal-staff-qualification" required value="${c(e.qualification||"")}">
        </div>
        <div class="form-group col-6">
          <label for="modal-staff-experience">Teaching Experience (Optional)</label>
          <input type="text" id="modal-staff-experience" value="${c(e.experience||"")}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-12">
          <label for="modal-staff-bio">Short Introduction / Bio</label>
          <textarea id="modal-staff-bio" rows="3">${c(e.bio||"")}</textarea>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-8">
          <label for="modal-staff-photo">Profile Photo URL (Select from Library or Upload)</label>
          <div class="input-select-media-wrapper">
            <input type="text" id="modal-staff-photo" value="${c(e.photo_url||"")}">
            <button type="button" class="btn btn-secondary btn-select-media" data-target-input="modal-staff-photo">Choose Media</button>
          </div>
          <div style="margin-top: 8px; display: flex; gap: 10px; align-items: center;">
            <input type="file" id="modal-staff-file" accept="image/*" style="display: none;" onchange="uploadFileDirectly(this, 'modal-staff-photo', 'modal-staff-photo-preview')">
            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-staff-file').click()">📤 Upload Photo</button>
            <div id="modal-staff-photo-preview-container" style="display: ${e.photo_url?"flex":"none"}; align-items: center; gap: 8px;">
              <img id="modal-staff-photo-preview" src="${c(e.photo_url||"")}" style="max-height: 45px; border-radius: 50%; border: 1px solid var(--border-color);">
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
  `,bindModalMediaSelect(),document.getElementById("modal-faculty-edit-form").addEventListener("submit",async o=>{o.preventDefault();const a=document.getElementById("btn-save-faculty");E(a,"Saving Changes..."),e.name=document.getElementById("modal-staff-name").value.trim(),e.category=document.getElementById("modal-staff-category").value,e.designation=document.getElementById("modal-staff-designation").value.trim(),e.subject=document.getElementById("modal-staff-subject").value.trim(),e.qualification=document.getElementById("modal-staff-qualification").value.trim(),e.experience=document.getElementById("modal-staff-experience").value.trim(),e.bio=document.getElementById("modal-staff-bio").value.trim(),e.photo_url=document.getElementById("modal-staff-photo").value.trim(),e.order=parseInt(document.getElementById("modal-staff-order").value)||1,e.is_active=document.getElementById("modal-staff-active").checked,await b("Faculty profile updated successfully!",()=>{C(),V(),D()})}),k()}function ze(t){const e=(n.faculty_staff||[]).find(i=>i.id===t);e&&U(`Are you sure you want to delete profile for "${e.name}" (${e.designation})?`,async()=>{n.faculty_staff=n.faculty_staff.filter(i=>i.id!==t),await b("Faculty profile deleted successfully!",()=>{V(),D()})})}function je(t){const e=(n.faculty_staff||[]).find(i=>i.id===t);e&&(e.is_active=e.is_active===!1,b(e.is_active?`Activated profile for ${e.name}`:`Deactivated profile for ${e.name}`,()=>{V(),D()}))}function Ge(t,e){const o=[...n.faculty_staff||[]].sort((p,r)=>(p.order||0)-(r.order||0)),a=o.findIndex(p=>p.id===t);if(a===-1)return;const s=a+e;if(s<0||s>=o.length)return;const l=o[a],m=o[s],u=l.order||a+1,d=m.order||s+1;l.order=d===u?e>0?u+1:u-1:d,m.order=u,o.sort((p,r)=>(p.order||0)-(r.order||0)),o.forEach((p,r)=>{p.order=r+1}),b("Faculty order updated successfully!",()=>{V()})}function H(){const t=document.getElementById("admin-gallery-grid");t.innerHTML="";const e=document.getElementById("filter-gallery-category").value,i=document.getElementById("search-gallery").value.toLowerCase().trim(),o=n.gallery.filter(a=>{const s=e==="all"||a.category===e,l=a.title.toLowerCase().includes(i)||(a.description||"").toLowerCase().includes(i);return s&&l}).sort((a,s)=>a.order-s.order);if(o.length===0){t.innerHTML='<p class="empty-list-text">No gallery items found matching filters.</p>';return}o.forEach(a=>{const s=document.createElement("div");s.className="admin-gallery-card",s.setAttribute("data-id",a.id);const l=a.is_published!==!1,m=l?"Published":"Draft",u=l?"published":"draft";let d="";a.type==="video"?a.thumbnail_url?d=`<img src="${a.thumbnail_url}" alt="${c(a.title)}">`:d=`
          <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none">
            <rect width="100%" height="100%" fill="#0d233a"/>
            <polygon points="175,110 235,140 175,170" fill="#c5a059"/>
            <circle cx="200" cy="140" r="45" stroke="#c5a059" stroke-width="2" />
          </svg>
        `:a.url?d=`<img src="${a.url}" alt="${c(a.title)}">`:d=`
          <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none">
            <rect width="100%" height="100%" fill="#1b3a57"/>
            <text x="200" y="150" font-family="'Outfit', sans-serif" font-weight="bold" font-size="14" fill="#ffffff" text-anchor="middle">No Image Chosen</text>
          </svg>
        `,s.innerHTML=`
      <div class="gallery-card-media">
        ${d}
        <div class="gallery-card-badges">
          <span class="gallery-card-badge">${a.category}</span>
          <span class="status-badge ${u}">${m}</span>
          ${a.is_featured?'<span class="gallery-card-badge featured">Featured</span>':""}
        </div>
      </div>
      <div class="gallery-card-info">
        <h3>${c(a.title)}</h3>
        <p>${c(a.description||"")}</p>
      </div>
      <div class="gallery-card-actions">
        <div class="reorder-btns">
          <button class="btn btn-secondary btn-sm" onclick="moveGalleryItem('${a.id}', -1)" title="Move Up">↑</button>
          <button class="btn btn-secondary btn-sm" onclick="moveGalleryItem('${a.id}', 1)" title="Move Down">↓</button>
        </div>
        <div class="edit-btns">
          <button class="btn btn-secondary btn-sm" onclick="openEditGalleryModal('${a.id}')" title="Edit">✏️</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleGalleryPublish('${a.id}')" title="${l?"Unpublish":"Publish"}">${l?"👁️":"🕶️"}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteGalleryItem('${a.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `,t.appendChild(s)})}function Ee(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Gallery Item",t.innerHTML=`
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
  `,document.getElementById("modal-gallery-form").addEventListener("submit",async e=>{e.preventDefault();const i=document.getElementById("gal-type").value,o=i==="image"?document.getElementById("gal-image-url").value.trim():document.getElementById("gal-video-url").value.trim(),a=document.getElementById("modal-gallery-submit-btn");E(a,"Saving...");const s={id:"gal-"+Date.now(),type:i,category:document.getElementById("gal-category").value,url:o,thumbnail_url:i==="video"?document.getElementById("gal-video-thumbnail").value.trim():"",title:document.getElementById("gal-title").value.trim(),description:document.getElementById("gal-desc").value.trim(),is_featured:document.getElementById("gal-featured").checked,is_published:document.getElementById("gal-published").checked,order:n.gallery.length+1};n.gallery.push(s),await b("Gallery item added successfully!",()=>{C(),H()})}),k()}function Re(t){const e=n.gallery.find(o=>o.id===t);if(!e)return;const i=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Gallery Item",i.innerHTML=`
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
        <input type="text" id="gal-title" value="${c(e.title)}" required>
      </div>
      <div class="form-group">
        <label for="gal-desc">Short Description</label>
        <textarea id="gal-desc" rows="3">${c(e.description||"")}</textarea>
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
  `,e.type==="image"?F("gal-image-url"):F("gal-video-thumbnail"),document.getElementById("modal-gallery-form").addEventListener("submit",async o=>{o.preventDefault();const a=e.type==="image"?document.getElementById("gal-image-url").value.trim():document.getElementById("gal-video-url").value.trim(),s=document.getElementById("modal-gallery-edit-btn");E(s,"Saving..."),e.url=a,e.thumbnail_url=e.type==="video"?document.getElementById("gal-video-thumbnail").value.trim():"",e.category=document.getElementById("gal-category").value,e.title=document.getElementById("gal-title").value.trim(),e.description=document.getElementById("gal-desc").value.trim(),e.is_featured=document.getElementById("gal-featured").checked,e.is_published=document.getElementById("gal-published").checked,await b("Gallery item updated successfully!",()=>{C(),H()})}),k()}function Oe(){v("Category management features are pre-configured. Use the category dropdowns to filter content.","info")}function Ve(){Ee()}function Ye(t){const e=n.gallery.find(i=>i.id===t);e&&(e.is_published=e.is_published===!1,b(e.is_published?"Gallery item published!":"Gallery item set to draft.",()=>{H()}))}function Je(t){U("Are you sure you want to delete this gallery item? This action is permanent.",async()=>{n.gallery=n.gallery.filter(e=>e.id!==t),n.gallery.forEach((e,i)=>{e.order=i+1}),await b("Gallery item deleted successfully!",()=>{H()})})}async function We(t,e){const i=n.gallery.findIndex(m=>m.id===t);if(i===-1)return;const o=i+e;if(o<0||o>=n.gallery.length)return;const a=n.gallery[i],s=n.gallery[o],l=a.order;a.order=s.order,s.order=l,n.gallery[i]=s,n.gallery[o]=a,await b("Gallery order updated!",()=>{H()})}function T(){const t=document.getElementById("admin-notices-table-body");t.innerHTML="";const e=document.getElementById("search-notices").value.toLowerCase().trim(),i=document.getElementById("filter-notices-category").value,o=document.getElementById("filter-notices-status"),a=o?o.value:"all",s=n.notices.filter(l=>{const m=l.title.toLowerCase().includes(e)||l.text.toLowerCase().includes(e),u=i==="all"||l.category===i;let d=!0;return a==="published"?d=l.is_published!==!1&&!l.is_archived:a==="unpublished"?d=l.is_published===!1&&!l.is_archived:a==="archived"&&(d=!!l.is_archived),m&&u&&d});if(s.length===0){t.innerHTML='<tr><td colspan="6" class="table-empty">No notices match the filters.</td></tr>';return}s.forEach(l=>{let m="Published",u="published";l.is_archived?(m="Archived",u="closed"):l.is_published===!1&&(m="Draft",u="draft");const d=l.is_important?"Important":"Normal",p=l.is_important?"important":"read";let r="";if(l.expiry_date){const x=new Date(l.expiry_date)<new Date;r=`<div style="font-size: 11px; margin-top: 4px; font-weight: 600; color: ${x?"#f44336":"var(--accent-gold)"};">
        ${x?"⚠️ Expired":"⏰ Expires"}: ${l.expiry_date}
      </div>`}const f=document.createElement("tr");f.innerHTML=`
      <td><span class="status-badge ${u}">${m}</span></td>
      <td>
        <div class="text-bold">${c(l.title)}</div>
        <div class="text-muted" style="max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c(l.text)}</div>
        ${r}
      </td>
      <td><span class="text-bold" style="text-transform: capitalize;">${l.category}</span></td>
      <td>${l.date}</td>
      <td><span class="status-badge ${p}">${d}</span></td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditNoticeModal('${l.id}')" title="Edit notice">✏️</button>
          <button class="btn-icon-only" onclick="toggleNoticeImportant('${l.id}')" title="${l.is_important?"Remove Star/Important":"Mark as Important"}">${l.is_important?"⭐":"☆"}</button>
          <button class="btn-icon-only" onclick="toggleNoticePublish('${l.id}')" title="${l.is_published?"Unpublish notice":"Publish notice"}">${l.is_published?"👁️":"🕶️"}</button>
          <button class="btn-icon-only" onclick="toggleNoticeArchive('${l.id}')" title="${l.is_archived?"Restore from Archive":"Archive notice"}">${l.is_archived?"📂":"📁"}</button>
          <button class="btn-icon-only delete" onclick="deleteNotice('${l.id}')" title="Delete notice">🗑️</button>
        </div>
      </td>
    `,t.appendChild(f)})}function Qe(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Notice",t.innerHTML=`
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
          <input type="text" id="not-date" value="${xt(new Date)}" required>
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
  `,document.getElementById("modal-notice-form").addEventListener("submit",async e=>{e.preventDefault();const i=document.getElementById("modal-notice-submit-btn");E(i,"Saving...");const o={id:"not-"+Date.now(),title:document.getElementById("not-title").value.trim(),text:document.getElementById("not-text").value.trim(),date:document.getElementById("not-date").value.trim(),expiry_date:document.getElementById("not-expiry-date").value,category:document.getElementById("not-category").value,is_important:document.getElementById("not-important").checked,is_published:document.getElementById("not-published").checked};n.notices.unshift(o),await b("Notice posted successfully!",()=>{C(),T()})}),k()}function Ke(t){const e=n.notices.find(o=>o.id===t);if(!e)return;const i=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Notice",i.innerHTML=`
    <form id="modal-notice-form">
      <div class="form-group">
        <label for="not-title">Notice Title</label>
        <input type="text" id="not-title" value="${c(e.title)}" required>
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
        <textarea id="not-text" rows="4" required>${c(e.text)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label for="not-date">Publish Date (Display Label)</label>
          <input type="text" id="not-date" value="${c(e.date)}" required>
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
  `,document.getElementById("modal-notice-form").addEventListener("submit",async o=>{o.preventDefault();const a=document.getElementById("modal-notice-edit-btn");E(a,"Saving..."),e.title=document.getElementById("not-title").value.trim(),e.text=document.getElementById("not-text").value.trim(),e.date=document.getElementById("not-date").value.trim(),e.expiry_date=document.getElementById("not-expiry-date").value,e.category=document.getElementById("not-category").value,e.is_important=document.getElementById("not-important").checked,e.is_published=document.getElementById("not-published").checked,await b("Notice updated successfully!",()=>{C(),T()})}),k()}function Ze(t){const e=n.notices.find(i=>i.id===t);e&&(e.is_published=e.is_published===!1,b(e.is_published?"Notice published!":"Notice set to draft.",()=>{T()}))}function Xe(t){const e=n.notices.find(i=>i.id===t);e&&(e.is_archived=!e.is_archived,b(e.is_archived?"Notice archived successfully.":"Notice restored from archive.",()=>{T()}))}function et(t){const e=n.notices.find(i=>i.id===t);e&&(e.is_important=!e.is_important,b(e.is_important?"Notice marked as important.":"Important badge removed from notice.",()=>{T()}))}function tt(t){U("Are you sure you want to delete this notice? This action is permanent.",async()=>{n.notices=n.notices.filter(e=>e.id!==t),await b("Notice deleted successfully!",()=>{T()})})}function R(){const t=document.getElementById("admin-events-table-body");t.innerHTML="";const e=document.getElementById("search-events").value.toLowerCase().trim(),i=document.getElementById("filter-events-status"),o=i?i.value:"all",a=new Date;a.setHours(0,0,0,0);const s=n.events.filter(l=>{const m=l.title.toLowerCase().includes(e)||l.description.toLowerCase().includes(e),u=new Date(l.date);u.setHours(0,0,0,0);const d=isNaN(u.getTime())||u>=a;let p=!0;return o==="upcoming"?p=d:o==="past"&&(p=!d),m&&p});if(s.length===0){t.innerHTML='<tr><td colspan="6" class="table-empty">No events found matching the filters.</td></tr>';return}s.forEach(l=>{const m=l.is_published?"Published":"Draft",u=l.is_published?"published":"draft",d=new Date(l.date);d.setHours(0,0,0,0);const p=isNaN(d.getTime())||d>=a,r=document.createElement("tr");r.innerHTML=`
      <td>
        <span class="status-badge ${u}">${m}</span>
        <div style="margin-top: 4px;"><span class="status-badge ${p?"published":"closed"}" style="font-size: 10px;">${p?"Upcoming":"Past"}</span></div>
      </td>
      <td>
        ${l.image_url?`<img src="${l.image_url}" class="event-table-img" alt="${c(l.title)}">`:'<div style="text-align: center; color: var(--text-light); font-size: 11px; padding: 12px; background: var(--bg-light); border-radius: 4px;">No Image</div>'}
      </td>
      <td>
        <div class="text-bold">${c(l.title)}</div>
        <div class="text-muted">${c(l.description||"")}</div>
      </td>
      <td>
        <div class="text-bold">${l.date}</div>
        <div>${l.time||""}</div>
      </td>
      <td>${c(l.location||"School Campus")}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditEventModal('${l.id}')" title="Edit event">✏️</button>
          <button class="btn-icon-only" onclick="toggleEventPublish('${l.id}')" title="${l.is_published?"Unpublish":"Publish"}">${l.is_published?"👁️":"🕶️"}</button>
          <button class="btn-icon-only delete" onclick="deleteEvent('${l.id}')" title="Delete event">🗑️</button>
        </div>
      </td>
    `,t.appendChild(r)})}function ot(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Upcoming Event",t.innerHTML=`
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
  `,document.getElementById("modal-event-form").addEventListener("submit",async e=>{e.preventDefault();const i=document.getElementById("modal-event-submit-btn");E(i,"Saving...");const o={id:"evt-"+Date.now(),title:document.getElementById("evt-title").value.trim(),description:document.getElementById("evt-desc").value.trim(),date:document.getElementById("evt-date").value,time:document.getElementById("evt-time").value.trim(),location:document.getElementById("evt-location").value.trim(),image_url:document.getElementById("evt-image").value.trim(),is_published:document.getElementById("evt-published").checked};n.events.unshift(o),await b("Event added successfully!",()=>{C(),R()})}),k()}function it(t){const e=n.events.find(o=>o.id===t);if(!e)return;const i=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Event",i.innerHTML=`
    <form id="modal-event-form">
      <div class="form-group">
        <label for="evt-title">Event Title</label>
        <input type="text" id="evt-title" value="${c(e.title)}" required>
      </div>
      <div class="form-group">
        <label for="evt-desc">Event Description</label>
        <textarea id="evt-desc" rows="3" required>${c(e.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group col-6">
          <label for="evt-date">Event Date (YYYY-MM-DD)</label>
          <input type="date" id="evt-date" value="${e.date}" required>
        </div>
        <div class="form-group col-6">
          <label for="evt-time">Event Time</label>
          <input type="text" id="evt-time" value="${c(e.time||"")}" required>
        </div>
      </div>
      <div class="form-group">
        <label for="evt-location">Location / Venue</label>
        <input type="text" id="evt-location" value="${c(e.location||"")}" required>
      </div>
      <div class="form-group">
        <label for="evt-image">Event Banner Image</label>
        <div class="input-select-media-wrapper">
          <input type="text" id="evt-image" value="${c(e.image_url||"")}">
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
  `,F("evt-image"),document.getElementById("modal-event-form").addEventListener("submit",async o=>{o.preventDefault();const a=document.getElementById("modal-event-edit-btn");E(a,"Saving..."),e.title=document.getElementById("evt-title").value.trim(),e.description=document.getElementById("evt-desc").value.trim(),e.date=document.getElementById("evt-date").value,e.time=document.getElementById("evt-time").value.trim(),e.location=document.getElementById("evt-location").value.trim(),e.image_url=document.getElementById("evt-image").value.trim(),e.is_published=document.getElementById("evt-published").checked,await b("Event updated successfully!",()=>{C(),R()})}),k()}function at(t){const e=n.events.find(i=>i.id===t);e&&(e.is_published=e.is_published===!1,b(e.is_published?"Event published!":"Event set to draft.",()=>{R()}))}function nt(t){U("Are you sure you want to delete this event? This action is permanent.",async()=>{n.events=n.events.filter(e=>e.id!==t),await b("Event deleted successfully!",()=>{R()})})}function ne(){const t=document.getElementById("admin-facilities-table-body");t.innerHTML="",n.facilities.forEach(i=>{const o=document.createElement("tr");o.innerHTML=`
      <td><code>${i.svg_id}</code></td>
      <td><span class="text-bold">${c(i.title)}</span></td>
      <td style="max-width: 450px;">${c(i.description)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn-icon-only edit" onclick="openEditFacilityModal('${i.id}')" title="Edit facility">✏️</button>
          <button class="btn-icon-only delete" onclick="deleteFacility('${i.id}')" title="Delete facility">🗑️</button>
        </div>
      </td>
    `,t.appendChild(o)});const e=n.hostel_info;document.getElementById("hostel-description").value=e.description||"",document.getElementById("hostel-boys").value=e.boys_hostel||"",document.getElementById("hostel-girls").value=e.girls_hostel||"",document.getElementById("hostel-image").value=e.image_url||"",document.getElementById("hostel-bullets").value=(e.bullets||[]).join(`
`),F("hostel-image")}function lt(){const t=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Add Facility Pillar",t.innerHTML=`
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
  `,document.getElementById("modal-fac-form").addEventListener("submit",async e=>{e.preventDefault();const i=document.getElementById("modal-fac-submit-btn");E(i,"Saving...");const o={id:"fac-"+Date.now(),title:document.getElementById("fac-title").value.trim(),description:document.getElementById("fac-desc").value.trim(),svg_id:document.getElementById("fac-svg").value};n.facilities.push(o),await b("New facility pillar added successfully!",()=>{C(),ne()})}),k()}function st(t){const e=n.facilities.find(o=>o.id===t);if(!e)return;const i=document.getElementById("modal-body");document.getElementById("modal-title").textContent="Edit Facility Pillar",i.innerHTML=`
    <form id="modal-fac-form">
      <div class="form-group">
        <label for="fac-title">Facility Title / Heading</label>
        <input type="text" id="fac-title" value="${c(e.title)}" required>
      </div>
      <div class="form-group">
        <label for="fac-desc">Pillar Short Description</label>
        <textarea id="fac-desc" rows="3" required>${c(e.description)}</textarea>
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
  `,document.getElementById("modal-fac-form").addEventListener("submit",async o=>{o.preventDefault();const a=document.getElementById("modal-fac-edit-btn");E(a,"Saving..."),e.title=document.getElementById("fac-title").value.trim(),e.description=document.getElementById("fac-desc").value.trim(),e.svg_id=document.getElementById("fac-svg").value,await b("Facility pillar updated successfully!",()=>{C(),ne()})}),k()}function dt(t){U("Are you sure you want to delete this facility pillar?",async()=>{n.facilities=n.facilities.filter(e=>e.id!==t),await b("Facility pillar removed!",()=>{ne()})})}async function rt(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]');E(e,"Saving..."),ee(),await b("Hostel details and features list saved successfully!",()=>{G(e)})}function P(){var m,u,d,p;const t=document.getElementById("admin-enquiries-table-body");t.innerHTML="";const e=(((m=document.getElementById("search-enquiries"))==null?void 0:m.value)||"").toLowerCase().trim(),i=((u=document.getElementById("filter-enquiries-class"))==null?void 0:u.value)||"all",o=((d=document.getElementById("filter-enquiries-status"))==null?void 0:d.value)||"all",a=((p=document.getElementById("filter-enquiries-date"))==null?void 0:p.value)||"all",s=new Date,l=(h.enquiries||[]).filter(r=>{const f=(r.student_name||"").toLowerCase(),x=(r.parent_name||"").toLowerCase(),I=r.phone||"",_=(r.email||"").toLowerCase(),y=!e||f.includes(e)||x.includes(e)||I.includes(e)||_.includes(e),q=i==="all"||r.class_apply===i,S=r.status==="completed"?"converted":r.status||"new",A=o==="all"||S===o;let B=!0;if(a!=="all"){const M=new Date(r.date);a==="today"?B=M.toDateString()===s.toDateString():a==="7days"?B=s-M<=7*24*60*60*1e3:a==="30days"&&(B=s-M<=30*24*60*60*1e3)}return y&&q&&A&&B});if(l.length===0){t.innerHTML='<tr><td colspan="7" class="table-empty">No admission enquiries found matching the filters.</td></tr>';return}l.forEach(r=>{const f=le(r.date),x=r.status==="completed"?"converted":r.status||"new";let I=x.charAt(0).toUpperCase()+x.slice(1);x==="follow-up"&&(I="Follow-up");let _='<span class="text-muted" style="font-size: 11px;">None set</span>';r.follow_up_date&&(_=`<span class="text-bold" style="color: ${new Date(r.follow_up_date)<new Date?"#f44336":"var(--accent-gold)"}; font-size: 12px;">📅 ${r.follow_up_date}</span>`);const y=document.createElement("tr");y.innerHTML=`
      <td><span class="status-badge ${x}">${I}</span></td>
      <td>
        <div class="text-bold">${c(r.student_name)}</div>
        <div class="text-muted" style="font-size: 12px;">Parent: ${c(r.parent_name)}</div>
      </td>
      <td>
        <div class="text-bold"><a href="tel:${r.phone}" style="color: #2196f3;">${r.phone}</a></div>
        ${r.email?`<div class="text-muted" style="font-size: 11px; max-width: 170px; overflow: hidden; text-overflow: ellipsis;">${c(r.email)}</div>`:""}
      </td>
      <td><span class="text-bold" style="text-transform: uppercase;">${(r.class_apply||"").replace("class-","Class ")}</span></td>
      <td>${_}</td>
      <td style="font-size: 12px;">${f}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="openEnquiryDetailsModal('${r.id}')">👁️ View</button>
          <select class="filter-select" style="padding: 4px 6px; font-size: 11px;" onchange="updateSubmissionStatus('enquiry', '${r.id}', this.value)">
            <option value="new" ${x==="new"?"selected":""}>New</option>
            <option value="contacted" ${x==="contacted"?"selected":""}>Contacted</option>
            <option value="follow-up" ${x==="follow-up"?"selected":""}>Follow-up</option>
            <option value="converted" ${x==="converted"?"selected":""}>Converted</option>
            <option value="closed" ${x==="closed"?"selected":""}>Closed</option>
          </select>
          <button class="btn-icon-only delete" onclick="deleteSubmission('enquiry', '${r.id}')" title="Delete enquiry">🗑️</button>
        </div>
      </td>
    `,t.appendChild(y)})}function re(t){var u,d,p,r,f,x,I,_;const e=(h.enquiries||[]).find(y=>y.id===t);if(!e)return;const i=le(e.date),o=e.status==="completed"?"converted":e.status||"new",a=document.getElementById("modal-body");document.getElementById("modal-title").textContent=`Enquiry: ${e.student_name} (${(e.class_apply||"").replace("class-","Class ").toUpperCase()})`;let s="";if(e.notification_status){const y=((d=(u=e.notification_status.whatsapp)==null?void 0:u.director)==null?void 0:d.status)||"unconfigured",q=((r=(p=e.notification_status.whatsapp)==null?void 0:p.principal)==null?void 0:r.status)||"unconfigured",S=((x=(f=e.notification_status.sms)==null?void 0:f.director)==null?void 0:x.status)||"unconfigured",A=((_=(I=e.notification_status.sms)==null?void 0:I.principal)==null?void 0:_.status)||"unconfigured",B=M=>M==="sent"||M==="delivered"?'<span style="color:#4caf50; font-weight:600;">✓ Dispatched</span>':M==="queued"?'<span style="color:#ff9800; font-weight:600;">⏳ Queued</span>':'<span style="color:var(--text-light); font-size:11px;">(Ready - configure API key)</span>';s=`
      <div style="background: var(--bg-light); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; margin-bottom: 15px; font-size: 12px;">
        <div style="font-weight: 700; margin-bottom: 6px; color: var(--text-dark);">📢 School Admin Notification Dispatch Report:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div><strong>Director WhatsApp:</strong> ${B(y)}</div>
          <div><strong>Principal WhatsApp:</strong> ${B(q)}</div>
          <div><strong>Director SMS:</strong> ${B(S)}</div>
          <div><strong>Principal SMS:</strong> ${B(A)}</div>
        </div>
      </div>
    `}let l="";e.notes&&e.notes.length>0&&(l=`
      <div style="margin-top: 15px;">
        <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--text-dark);">Previous Follow-up Notes (${e.notes.length})</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
          ${e.notes.slice().reverse().map(y=>`
            <div style="background: var(--bg-light); border-left: 3px solid var(--accent-gold); padding: 8px 12px; border-radius: 4px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between; color: var(--text-light); font-size: 11px; margin-bottom: 3px;">
                <span class="text-bold">${c(y.author||"Admin")}</span>
                <span>${ie(y.date)}</span>
              </div>
              <div style="color: var(--text-dark); white-space: pre-wrap;">${c(y.text)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `);let m="";e.history&&e.history.length>0&&(m=`
      <div style="margin-top: 15px;">
        <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: var(--text-dark);">Activity & Status Timeline</h4>
        <div style="font-size: 11px; color: var(--text-light); display: flex; flex-direction: column; gap: 4px; max-height: 120px; overflow-y: auto;">
          ${e.history.slice().reverse().map(y=>`
            <div style="padding: 4px 0; border-bottom: 1px dashed var(--border-color);">
              <span class="text-bold" style="color: var(--text-dark);">${c(y.action.replace("_"," ").toUpperCase())}:</span>
              ${y.note?c(y.note):""}
              ${y.from&&y.to?`Changed from <em>${y.from}</em> to <strong>${y.to}</strong>`:""}
              ${y.date_set?`Follow-up set to <strong>${y.date_set}</strong>`:""}
              <span style="float: right;">${ie(y.date)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `),a.innerHTML=`
    ${s}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Student Name</div>
        <div class="detail-value text-bold">${c(e.student_name)}</div>
      </div>
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Parent Name</div>
        <div class="detail-value text-bold">${c(e.parent_name)}</div>
      </div>
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Applying Class</div>
        <div class="detail-value" style="text-transform: uppercase;">${(e.class_apply||"").replace("class-","Class ")}</div>
      </div>
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Date Submitted</div>
        <div class="detail-value">${i}</div>
      </div>
    </div>

    <div class="detail-view-row" style="margin-bottom: 12px;">
      <div class="detail-label">Phone & Contact</div>
      <div class="detail-value" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <a href="tel:${e.phone}" class="text-bold" style="color: #2196f3; font-size: 14px;">${e.phone}</a>
        <a href="https://wa.me/91${e.phone}" target="_blank" class="btn btn-success btn-sm" style="padding: 3px 8px; font-size: 11px;">💬 WhatsApp Parent</a>
        <a href="tel:${e.phone}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">📞 Call</a>
        ${e.email?`<a href="mailto:${e.email}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">✉️ ${c(e.email)}</a>`:""}
      </div>
    </div>

    <div class="detail-view-row" style="flex-direction: column; align-items: flex-start; gap: 6px; margin-bottom: 15px;">
      <div class="detail-label">Applicant Enquiry Message</div>
      <div class="detail-value" style="width:100%; padding: 10px; background: var(--bg-light); border-radius: 4px; white-space: pre-wrap; font-size: 13px;">${c(e.message||"No additional message was submitted.")}</div>
    </div>

    <!-- Enquiry Pipeline Follow-up Card -->
    <div style="background: var(--bg-card); border: 2px solid var(--border-color); border-radius: 6px; padding: 14px; margin-bottom: 15px;">
      <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 10px; color: var(--text-dark);">📌 Update Admission Pipeline & Follow-up</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Enquiry Status</label>
          <select class="filter-select" id="detail-enquiry-status" style="width: 100%;">
            <option value="new" ${o==="new"?"selected":""}>New (Uncontacted)</option>
            <option value="contacted" ${o==="contacted"?"selected":""}>Contacted</option>
            <option value="follow-up" ${o==="follow-up"?"selected":""}>Follow-up Needed</option>
            <option value="converted" ${o==="converted"?"selected":""}>Converted (Admitted)</option>
            <option value="closed" ${o==="closed"?"selected":""}>Closed / Declined</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Next Follow-up Date</label>
          <input type="date" id="modal-follow-up-date" value="${e.follow_up_date||""}" style="width: 100%; padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-dark);">
        </div>
      </div>
      <div>
        <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Add Follow-up Conversation Note</label>
        <textarea id="modal-new-note" rows="2" placeholder="Record discussion details with parent, fee queries, campus visit date, etc." style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-dark); font-size: 13px; resize: vertical;"></textarea>
      </div>
      <div style="margin-top: 10px; text-align: right;">
        <button type="button" class="btn btn-primary btn-sm" id="btn-save-enquiry-note" onclick="saveEnquiryNoteAndStatus('${e.id}')">💾 Save Note & Update Status</button>
      </div>
    </div>

    ${l}
    ${m}

    <div class="form-submit-row" style="margin-top: 20px;">
      <button class="btn btn-danger" onclick="deleteSubmission('enquiry', '${e.id}'); closeAdminModal();" style="float: left;">🗑️ Delete Enquiry</button>
      <button class="btn btn-primary" onclick="closeAdminModal()">Close Window</button>
    </div>
  `,k()}async function ct(t){const e=(h.enquiries||[]).find(d=>d.id===t);if(!e)return;const i=document.getElementById("detail-enquiry-status"),o=document.getElementById("modal-follow-up-date"),a=document.getElementById("modal-new-note"),s=document.getElementById("btn-save-enquiry-note"),l=i?i.value:e.status,m=o?o.value:e.follow_up_date,u=a?a.value.trim():"";s&&E(s,"Saving...");try{const p=await(await fetch("/api/enquiry-note",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t,status:l,followUpDate:m||null,noteText:u})})).json();if(p.success&&p.enquiry){const r=h.enquiries.findIndex(f=>f.id===t);r!==-1&&(h.enquiries[r]=p.enquiry),v("Enquiry pipeline & note updated successfully!","success"),P(),W(),D(),re(t)}else v(p.message||"Failed to save note.","error"),s&&G(s)}catch(d){console.error("Error saving enquiry note:",d),v("Network error while saving note.","error"),s&&G(s)}}function O(){var a,s;const t=document.getElementById("admin-messages-table-body");t.innerHTML="";const e=(((a=document.getElementById("search-messages"))==null?void 0:a.value)||"").toLowerCase().trim(),i=((s=document.getElementById("filter-messages-state"))==null?void 0:s.value)||"all",o=(h.messages||[]).filter(l=>{const m=(l.name||"").toLowerCase(),u=(l.subject||"").toLowerCase(),d=(l.message||"").toLowerCase(),p=!e||m.includes(e)||u.includes(e)||d.includes(e),r=l.status||(l.is_read?"read":"new");let f=!0;return i==="new"?f=r==="new":i==="read"?f=r==="read":i==="replied"?f=r==="replied":i==="closed"&&(f=r==="closed"),p&&f});if(o.length===0){t.innerHTML='<tr><td colspan="5" class="table-empty">No contact messages match the filters.</td></tr>';return}o.forEach(l=>{const m=le(l.date),u=l.status||(l.is_read?"read":"new");let d=u,p=u.charAt(0).toUpperCase()+u.slice(1);const r=document.createElement("tr");r.className=u==="new"?"unread-row-highlight":"",r.innerHTML=`
      <td><span class="status-badge ${d}">${p}</span></td>
      <td>
        <div class="text-bold">${c(l.name)}</div>
        <div class="text-muted" style="font-size: 12px;">${c(l.email||"No Email")} | ${l.phone||"No Phone"}</div>
      </td>
      <td>
        <div class="text-bold">${c(l.subject)}</div>
        <div class="text-muted" style="max-width: 350px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c(l.message)}</div>
      </td>
      <td style="font-size: 12px;">${m}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="openMessageDetailsModal('${l.id}')">📖 Read</button>
          <select class="filter-select" style="padding: 4px 6px; font-size: 11px;" onchange="updateSubmissionStatus('message', '${l.id}', this.value)">
            <option value="new" ${u==="new"?"selected":""}>New</option>
            <option value="read" ${u==="read"?"selected":""}>Read</option>
            <option value="replied" ${u==="replied"?"selected":""}>Replied</option>
            <option value="closed" ${u==="closed"?"selected":""}>Closed</option>
          </select>
          <button class="btn-icon-only delete" onclick="deleteSubmission('message', '${l.id}')" title="Delete message">🗑</button>
        </div>
      </td>
    `,t.appendChild(r)})}async function Ie(t){const e=(h.messages||[]).find(s=>s.id===t);if(!e)return;const i=le(e.date),o=e.status||(e.is_read?"read":"new"),a=document.getElementById("modal-body");if(document.getElementById("modal-title").textContent="Contact Message Details",a.innerHTML=`
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Sender Name</div>
        <div class="detail-value text-bold">${c(e.name)}</div>
      </div>
      <div class="detail-view-row" style="margin: 0;">
        <div class="detail-label">Date Received</div>
        <div class="detail-value">${i}</div>
      </div>
    </div>

    <div class="detail-view-row" style="margin-bottom: 12px;">
      <div class="detail-label">Direct Communication</div>
      <div class="detail-value" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        ${e.phone?`
          <a href="tel:${e.phone}" class="text-bold" style="color: #2196f3; font-size: 14px;">${e.phone}</a>
          <a href="https://wa.me/91${e.phone}" target="_blank" class="btn btn-success btn-sm" style="padding: 3px 8px; font-size: 11px;">💬 WhatsApp</a>
          <a href="tel:${e.phone}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">📞 Call</a>
        `:'<span class="text-muted" style="font-size: 12px;">No phone number provided</span>'}
        ${e.email?`<a href="mailto:${e.email}?subject=RE: ${encodeURIComponent(e.subject||"School Enquiry")}" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;">✉️ Email (${c(e.email)})</a>`:""}
      </div>
    </div>

    <div class="detail-view-row" style="margin-bottom: 12px;">
      <div class="detail-label">Subject</div>
      <div class="detail-value text-bold">${c(e.subject)}</div>
    </div>

    <div class="detail-view-row" style="flex-direction: column; align-items: flex-start; gap: 6px; margin-bottom: 15px;">
      <div class="detail-label">Message Content</div>
      <div class="detail-value" style="width:100%; padding: 14px; background: var(--bg-light); border-radius: 4px; white-space: pre-wrap; font-size: 13px;">${c(e.message)}</div>
    </div>

    <div class="detail-view-row" style="align-items: center; gap: 10px; margin-bottom: 20px;">
      <div class="detail-label">Message Status</div>
      <div class="detail-value">
        <select class="filter-select" id="detail-msg-status" onchange="updateSubmissionStatus('message', '${e.id}', this.value); closeAdminModal();">
          <option value="new" ${o==="new"?"selected":""}>New (Unread)</option>
          <option value="read" ${o==="read"?"selected":""}>Read</option>
          <option value="replied" ${o==="replied"?"selected":""}>Replied</option>
          <option value="closed" ${o==="closed"?"selected":""}>Closed</option>
        </select>
      </div>
    </div>

    <div class="form-submit-row">
      <button class="btn btn-danger" onclick="deleteSubmission('message', '${e.id}'); closeAdminModal();" style="float: left;">🗑️ Delete Message</button>
      <button class="btn btn-primary" onclick="closeAdminModal()">Close Window</button>
    </div>
  `,k(),!e.is_read||e.status==="new"){e.is_read=!0,e.status==="new"&&(e.status="read"),W(),O(),D();try{await fetch("/api/update-submission",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"message",id:t,status:"read",is_read:!0})})}catch(s){console.error("Failed to update read state on server:",s)}}}async function ut(t){const e=(h.messages||[]).find(i=>i.id===t);if(e){e.is_read=!e.is_read,e.status=e.is_read?"read":"new",W(),O(),D();try{await fetch("/api/update-submission",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"message",id:t,status:e.status,is_read:e.is_read})})}catch(i){console.error("Failed to toggle read status:",i)}}}async function mt(t,e,i){try{if((await(await fetch("/api/update-submission",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:t,id:e,status:i})})).json()).success){if(t==="enquiry"){const s=(h.enquiries||[]).find(l=>l.id===e);s&&(s.status=i),P()}else{const s=(h.messages||[]).find(l=>l.id===e);s&&(s.status=i,s.is_read=i!=="new"),O()}W(),D(),v("Status updated successfully!","success")}else v("Failed to update status.","error")}catch(o){console.error("Error updating status:",o),v("Network error during status update.","error")}}async function pt(t,e){U(`Are you sure you want to permanently delete this ${t==="enquiry"?"admission enquiry":"contact message"}?`,async()=>{try{(await(await fetch("/api/submission",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:t,id:e})})).json()).success?(t==="enquiry"?(h.enquiries=h.enquiries.filter(a=>a.id!==e),P()):(h.messages=h.messages.filter(a=>a.id!==e),O()),W(),D(),v("Submission deleted successfully!","success")):v("Failed to delete submission.","error")}catch(i){console.error("Error deleting submission:",i),v("Network error during deletion.","error")}})}function te(){const t=document.getElementById("admin-media-library-grid");t.innerHTML="";const e=document.getElementById("search-media").value.toLowerCase().trim(),i=N.filter(o=>o.name.toLowerCase().includes(e));if(i.length===0){t.innerHTML='<p class="empty-list-text">No uploaded assets found matching search.</p>';return}i.forEach(o=>{const a=/\.(jpg|jpeg|png|webp|gif)$/i.test(o.name),s=document.createElement("div");s.className="media-item-card",s.setAttribute("data-name",o.name);let l="";a?l=`<img src="${o.url}" alt="${o.name}" loading="lazy">`:l='<span class="media-icon-placeholder">🎥</span>',s.innerHTML=`
      <div class="media-thumbnail-wrapper">
        ${l}
      </div>
      <div class="media-item-details">
        <div class="media-filename" title="${o.name}">${o.name}</div>
      </div>
      <div class="media-actions-overlay">
        <button class="btn-media-action" onclick="copyToClipboard('${o.url}'); event.stopPropagation();" title="Copy file URL">🔗</button>
        <button class="btn-media-action delete" onclick="deleteMediaFile('${o.name}'); event.stopPropagation();" title="Delete file">🗑️</button>
      </div>
    `,s.addEventListener("click",()=>{ke(o.url)}),t.appendChild(s)})}function gt(){document.getElementById("media-upload-input").click()}async function ft(t){const e=t.files;if(e.length===0)return;const i=document.querySelector(".btn-media-upload-trigger");E(i,"Uploading...");const o=new FormData;for(let a=0;a<e.length;a++)o.append("files",e[a]);v("Uploading files...","info");try{const s=await(await fetch("/api/upload",{method:"POST",body:o})).json();s.success?(N=await(await fetch("/api/media")).json(),te(),v(`Successfully uploaded ${s.files.length} file(s)!`,"success")):v(s.message||"File upload failed.","error")}catch(a){console.error("Upload failed:",a),v("Network error during file upload.","error")}finally{G(i),t.value=""}}async function yt(t){U(`Are you sure you want to permanently delete '${t}'? This will break any page reference that displays it.`,async()=>{try{const i=await(await fetch(`/api/media/${t}`,{method:"DELETE"})).json();i.success?(N=N.filter(o=>o.name!==t),te(),v("File deleted successfully.","success")):v(i.message||"Delete failed.","error")}catch(e){console.error("Delete failed:",e),v("Network error during file deletion.","error")}})}function vt(){const t=n.social_media,e=n.contact_settings;document.getElementById("social-instagram").value=t.instagram||"",document.getElementById("social-facebook").value=t.facebook||"",document.getElementById("social-youtube").value=t.youtube||"",document.getElementById("social-whatsapp").value=t.whatsapp||"",document.getElementById("contact-address").value=e.address||"",document.getElementById("contact-phone").value=e.phone||"",document.getElementById("contact-email").value=e.email||"",document.getElementById("contact-map").value=e.google_maps_embed||""}async function bt(t){t.preventDefault();const e=t.target.querySelector('button[type="submit"]');E(e,"Saving..."),ee(),await b("Social media and Google Map settings saved successfully!",()=>{G(e)})}function ht(t){X=t,$e(),document.getElementById("media-select-modal").style.display="flex"}function Be(){document.getElementById("media-select-modal").style.display="none",X=null}function $e(){const t=document.getElementById("modal-media-grid");t.innerHTML="";const e=document.getElementById("search-media-select").value.toLowerCase().trim(),i=N.filter(o=>o.name.toLowerCase().includes(e));if(i.length===0){t.innerHTML='<p class="empty-list-text" style="grid-column: 1/-1;">No media matches.</p>';return}i.forEach(o=>{const a=/\.(jpg|jpeg|png|webp|gif)$/i.test(o.name),s=document.createElement("div");s.className="media-item-card";let l="";a?l=`<img src="${o.url}" alt="${o.name}" loading="lazy">`:l='<span class="media-icon-placeholder">🎥</span>',s.innerHTML=`
      <div class="media-thumbnail-wrapper">${l}</div>
      <div class="media-item-details">
        <div class="media-filename">${o.name}</div>
      </div>
    `,s.addEventListener("click",()=>{_e(o.url)}),t.appendChild(s)})}function _e(t){if(X){const e=document.getElementById(X);e&&(e.value=t,F(X))}Be()}async function b(t,e){try{const o=await(await fetch("/api/save-content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json();o.success?(v(t||"Database updated successfully!","success"),e&&e()):v("Save operation failed: "+o.message,"error")}catch(i){console.error("Error saving content:",i),v("Failed to send content save request to server.","error")}}function k(){document.getElementById("admin-modal").style.display="flex"}function C(){document.getElementById("admin-modal").style.display="none",document.getElementById("modal-body").innerHTML=""}function xt(t){const e={day:"2-digit",month:"short",year:"numeric"};return t.toLocaleDateString("en-GB",e)}function le(t){return t?new Date(t).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"}):"N/A"}function ie(t){if(!t)return"";const e=new Date(t),o=new Date-e,a=Math.floor(o/1e3),s=Math.floor(a/60),l=Math.floor(s/60),m=Math.floor(l/24);return a<60?"Just now":s<60?`${s}m ago`:l<24?`${l}h ago`:`${m}d ago`}function ke(t){navigator.clipboard?navigator.clipboard.writeText(t).then(()=>{v("URL copied to clipboard! You can paste it into content forms.","success")}).catch(e=>{console.error("Failed to copy using clipboard API:",e),be(t)}):be(t)}function be(t){const e=document.createElement("textarea");e.value=t,e.style.position="fixed",document.body.appendChild(e),e.focus(),e.select();try{document.execCommand("copy"),v("URL copied to clipboard!","success")}catch{v("Failed to copy link. Please manually copy URL: "+t,"error")}document.body.removeChild(e)}function c(t){return t?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}
