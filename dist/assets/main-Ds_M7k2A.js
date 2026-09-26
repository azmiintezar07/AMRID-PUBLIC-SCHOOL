import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{let u=null;const w=document.getElementById("hamburger-toggle"),y=document.getElementById("mobile-drawer"),J=document.getElementById("drawer-close"),P=document.getElementById("drawer-overlay"),we=document.querySelectorAll(".drawer-link, .drawer-cta");function Ee(){y.classList.add("open"),P.classList.add("visible"),w.setAttribute("aria-expanded","true"),document.body.style.overflow="hidden"}function A(){y.classList.remove("open"),P.classList.remove("visible"),w.setAttribute("aria-expanded","false"),document.body.style.overflow=""}w.addEventListener("click",Ee),J.addEventListener("click",A),P.addEventListener("click",A),we.forEach(e=>{e.addEventListener("click",()=>{A()})}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(A(),j(),R())});const Q=document.querySelector(".site-header"),xe=document.querySelectorAll(".nav-link"),Le=document.querySelectorAll("section.scroll-offset-section, section#home");window.addEventListener("scroll",()=>{window.scrollY>50?Q.classList.add("scrolled"):Q.classList.remove("scrolled");let e="";const t=window.scrollY+120;Le.forEach(o=>{const a=o.offsetTop,s=o.offsetHeight;t>=a&&t<a+s&&(e=o.getAttribute("id"))}),e&&xe.forEach(o=>{o.classList.remove("active"),o.getAttribute("href")===`#${e}`&&o.classList.add("active")})});const E=document.getElementById("lightbox-modal"),$e=document.getElementById("lightbox-close"),X=document.getElementById("lightbox-image-container"),Z=document.getElementById("lightbox-video-container"),k=document.getElementById("lightbox-img"),K=document.getElementById("lightbox-iframe"),Se=document.getElementById("lightbox-title"),Ie=document.getElementById("lightbox-desc");function V(e,t,o,a,s=null){if(Se.textContent=e,Ie.textContent=t,o)X.style.display="none",Z.style.display="block",K.src=a;else if(Z.style.display="none",X.style.display="block",s){const n=new XMLSerializer().serializeToString(s),c=new Blob([n],{type:"image/svg+xml;charset=utf-8"}),d=(window.URL||window.webkitURL||window).createObjectURL(c);k.src=d,k.alt=e}else k.src=a,k.alt=e;E.style.display="flex",setTimeout(()=>{E.classList.add("open")},10),document.body.style.overflow="hidden"}function j(){E.classList.remove("open"),setTimeout(()=>{E.style.display="none",K.src="",k.src=""},300),document.body.style.overflow=""}$e.addEventListener("click",j),E.addEventListener("click",e=>{e.target===E&&j()});async function ke(){try{const e=await fetch("/data/content.json?t="+new Date().getTime());if(!e.ok)throw new Error("Failed to load JSON");u=await e.json(),Be(u)}catch(e){console.warn("Could not load dynamic website database. Falling back to static HTML elements.",e),qe()}}function Be(e){const t=e.school_info;document.title=`${t.name} | Nursery to Class 8 School in Purnia, Bihar`;const o=document.getElementById("editable-reg-number");o&&(o.textContent=t.reg_number);const a=document.getElementById("footer-reg-number");a&&(a.textContent=t.reg_number),document.querySelectorAll(".school-logo").forEach(i=>{if(t.logo_url)if(i.tagName.toLowerCase()==="svg"){const p=document.createElement("img");p.className="school-logo custom-logo-img",p.src=t.logo_url,p.alt=t.name+" Logo",p.style.width="50px",p.style.height="50px",p.style.objectFit="contain",i.parentNode.replaceChild(p,i)}else i.src=t.logo_url}),document.querySelectorAll(".logo-text .school-title, .drawer-logo .school-title, .branding-col .footer-title").forEach(i=>i.textContent=t.name),document.querySelectorAll(".logo-text .school-subtitle").forEach(i=>i.textContent=t.tagline);const r=e.hero_section,d=document.getElementById("hero-badge-container");d&&(d.innerHTML=`<span class="badge-dot"></span> ${r.badge}`);const v=document.getElementById("hero-title-container");v&&(v.textContent=r.title);const b=document.getElementById("hero-tagline-container");b&&(b.textContent=r.tagline);const oe=document.getElementById("hero-desc-container");oe&&(oe.textContent=r.description);const ie=document.getElementById("hero-btn1");ie&&r.button1_text&&(ie.textContent=r.button1_text);const ce=document.getElementById("hero-btn2");ce&&r.button2_text&&(ce.textContent=r.button2_text);const re=document.getElementById("home");re&&r.image_url&&(re.style.backgroundImage=`url('${r.image_url}')`);const de=document.getElementById("about-title-container");de&&(de.textContent=t.about_title);const pe=document.getElementById("about-text-container");pe&&t.about_text&&(pe.innerHTML=t.about_text.split(`

`).map(i=>`<p class="about-text">${i.replace(/AMRID PUBLIC SCHOOL/g,"<strong>AMRID PUBLIC SCHOOL</strong>").replace(/Nursery to Class 8/g,"<strong>Nursery to Class 8</strong>")}</p>`).join(""));const ue=document.querySelector(".admission-text");ue&&t.admission_info&&(ue.textContent=t.admission_info);const fe=document.getElementById("messages-grid-container"),O=document.getElementById("leadership")||document.getElementById("messages");if(fe&&O)if(t.show_leaders===!1)O.style.display="none";else{O.style.display="block";const i=e.director_info.message||"",p=i.length>220?i.slice(0,215)+"...":i,m=i.length>220?i.slice(215):"",g=e.principal_info.message||"",_=g.length>220?g.slice(0,215)+"...":g,G=g.length>220?g.slice(215):"";fe.innerHTML=`
          <!-- Director Card -->
          <div class="leader-card">
            <div class="leader-card-header">
              <div class="leader-avatar-wrapper">
                ${e.director_info.photo_url?`<img src="${l(e.director_info.photo_url)}" class="leader-avatar-img" alt="${l(e.director_info.name)} - Director">`:`<svg class="leader-svg-icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>`}
                <div class="leader-role-badge">Director</div>
              </div>
              <div class="leader-header-details">
                <h3 class="leader-name">${l(e.director_info.name)}</h3>
                <span class="leader-designation">${l(e.director_info.designation||"Director")}, AMRID Public School</span>
                <div class="leader-contact-row">
                  <a href="tel:${e.director_info.phone.replace(/[^0-9]/g,"")}" class="leader-contact-link link-call-btn">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    ${l(e.director_info.phone)}
                  </a>
                  <a href="https://wa.me/${e.director_info.phone.replace(/[^0-9]/g,"")}" target="_blank" rel="noopener noreferrer" class="leader-contact-link whatsapp">
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
                <p class="leader-message-preview">${l(p)}</p>
                ${m?`
                  <div class="leader-message-full" style="display: none;">
                    <p>${l(m)}</p>
                  </div>
                `:""}
              </blockquote>
              ${m?`
                <div class="leader-card-footer">
                  <button type="button" class="btn-read-more" onclick="window.toggleLeaderMessage(this)">Read More</button>
                </div>
              `:""}
            </div>
          </div>

          <!-- Principal Card -->
          <div class="leader-card">
            <div class="leader-card-header">
              <div class="leader-avatar-wrapper">
                ${e.principal_info.photo_url?`<img src="${l(e.principal_info.photo_url)}" class="leader-avatar-img" alt="${l(e.principal_info.name)} - Principal">`:`<svg class="leader-svg-icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>`}
                <div class="leader-role-badge">Principal</div>
              </div>
              <div class="leader-header-details">
                <h3 class="leader-name">${l(e.principal_info.name)}</h3>
                <span class="leader-designation">${l(e.principal_info.designation||"Principal")}, AMRID Public School</span>
                <div class="leader-contact-row">
                  <a href="tel:${e.principal_info.phone.replace(/[^0-9]/g,"")}" class="leader-contact-link link-call-btn-principal">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    ${l(e.principal_info.phone)}
                  </a>
                  <a href="https://wa.me/${e.principal_info.phone.replace(/[^0-9]/g,"")}" target="_blank" rel="noopener noreferrer" class="leader-contact-link whatsapp">
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
                <p class="leader-message-preview">${l(_)}</p>
                ${G?`
                  <div class="leader-message-full" style="display: none;">
                    <p>${l(G)}</p>
                  </div>
                `:""}
              </blockquote>
              ${G?`
                <div class="leader-card-footer">
                  <button type="button" class="btn-read-more" onclick="window.toggleLeaderMessage(this)">Read More</button>
                </div>
              `:""}
            </div>
          </div>
        `}ae(e.faculty_staff||[]);const W=document.getElementById("why-choose-grid-container");if(W&&e.facilities){W.innerHTML="";const i={teachers:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',lock:'<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',"check-circle":'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',"dollar-sign":'<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'};e.facilities.forEach(p=>{const m=document.createElement("div");m.className="why-card";const g=i[p.svg_id]||i["check-circle"];m.innerHTML=`
          <div class="why-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
              ${g}
            </svg>
          </div>
          <h3 class="why-title">${l(p.title)}</h3>
          <p class="why-text">${l(p.description)}</p>
        `,W.appendChild(m)})}const B=e.hostel_info,he=document.getElementById("hostel-desc-container");he&&(he.textContent=B.description);const ge=document.querySelector(".hostel-graphic");ge&&B.image_url&&(ge.innerHTML=`<img src="${B.image_url}" alt="Hostel Facility" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">`);const Y=document.getElementById("hostel-bullets-container");Y&&B.bullets&&(Y.innerHTML="",B.bullets.forEach(i=>{const p=i.split(":"),m=p[0]||"",g=p.slice(1).join(":")||"",_=document.createElement("div");_.className="bullet-item",_.innerHTML=`
          <svg class="bullet-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span><strong>${l(m)}</strong>${l(g?":"+g:"")}</span>
        `,Y.appendChild(_)})),Ce(e.notices),_e(e.events),Ae(e.gallery);const I=e.contact_settings,C=e.social_media;document.querySelectorAll("#contact-address-val, .branding-col .footer-address").forEach(i=>i.innerHTML=I.address.replace(/,/g,",<br>")),document.querySelectorAll('#contact-director-phone, .contact-col a[href^="tel:9905430742"]').forEach(i=>{i.textContent=I.phone,i.href=`tel:${I.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll('#contact-principal-phone, .contact-col a[href^="tel:9693264161"]').forEach(i=>{i.textContent=e.principal_info.phone,i.href=`tel:${e.principal_info.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll("#contact-director-name").forEach(i=>i.textContent=e.director_info.name),document.querySelectorAll("#contact-principal-name").forEach(i=>i.textContent=e.principal_info.name);const me=document.querySelector(".floating-whatsapp-widget");me&&(me.href=`https://wa.me/${C.whatsapp.replace(/[^0-9]/g,"")}`),document.querySelectorAll('.link-whatsapp-btn, .cta-buttons-wrapper a[href^="https://wa.me/"]').forEach(i=>{i.href=`https://wa.me/${C.whatsapp.replace(/[^0-9]/g,"")}`}),document.querySelectorAll(".link-whatsapp-btn-principal").forEach(i=>{i.href=`https://wa.me/${e.principal_info.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll('.link-call-btn, .hero-ctas a[href^="tel:"]').forEach(i=>{i.href=`tel:${I.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll(".link-call-btn-principal").forEach(i=>{i.href=`tel:${e.principal_info.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll('a[href^="https://instagram.com/"], .socials-col a[aria-label^="Follow us on Instagram"]').forEach(i=>{i.href=C.instagram});const ye=document.querySelector(".facebook-social-link");ye&&(ye.href=C.facebook);const ve=document.querySelector(".youtube-social-link");ve&&(ve.href=C.youtube);const be=document.querySelector(".google-map-iframe");be&&(be.src=I.google_maps_embed),document.querySelectorAll('.link-map-directions, .location-ctas a[href^="https://www.google.com/maps/"]').forEach(i=>{i.href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(I.address)}`})}function Ce(e){const t=document.getElementById("notices-wrapper");if(!t)return;t.innerHTML="";const o=new Date;o.setHours(0,0,0,0);const a=e.filter(s=>{const n=s.is_published!==!1;let c=!0;if(s.expiry_date){const r=new Date(s.expiry_date);r.setHours(0,0,0,0),c=r>=o}return n&&c});if(a.length===0){t.innerHTML='<p style="text-align:center; color:rgba(255,255,255,0.4); padding:40px 0;">No notices published currently.</p>';return}a.forEach(s=>{const n=s.date.split(" "),c=n[0]||"",r=n.slice(1).join(" ")||"",d=document.createElement("div");d.className="notice-item",d.setAttribute("data-category",s.category);let v="badge-general",b="General";s.category==="admission"?(v="badge-admission",b="Admission Announcement"):s.category==="events"&&(v="badge-events",b="Important Event"),d.innerHTML=`
        <div class="notice-date">
          <span class="date-day">${l(c)}</span>
          <span class="date-month">${l(r)}</span>
        </div>
        <div class="notice-details">
          <span class="notice-badge ${v}">${l(b)}</span>
          ${s.is_important?'<span class="notice-badge badge-admission" style="background-color:var(--danger-red); margin-left:8px;">Urgent</span>':""}
          <h3 class="notice-title">${l(s.title)}</h3>
          <p class="notice-text">${l(s.text)}</p>
        </div>
      `,t.appendChild(d)}),ee()}function _e(e){const t=document.getElementById("events-grid-container");if(!t)return;t.innerHTML="";const o=e.filter(a=>a.is_published!==!1);if(o.length===0){t.innerHTML='<p class="empty-list-text" style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px 0;">No upcoming events at this time.</p>';return}o.forEach(a=>{const s=document.createElement("div");s.className="event-card";const c=new Date(a.date).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"});s.innerHTML=`
        <div class="event-card-img-wrapper">
          ${a.image_url?`<img src="${a.image_url}" alt="${l(a.title)}" loading="lazy">`:`<svg viewBox="0 0 400 250" width="100%" height="100%" fill="none">
              <rect width="100%" height="100%" fill="#1b3a57"/>
              <polygon points="200,60 215,100 260,100 225,125 238,165 200,140 162,165 175,125 140,100 185,100" fill="#c5a059" opacity="0.3"/>
            </svg>`}
          <div class="event-date-badge">${c}</div>
        </div>
        <div class="event-card-content">
          <h3 class="event-card-title">${l(a.title)}</h3>
          <p class="event-card-desc">${l(a.description)}</p>
          <div class="event-card-meta">
            <div class="meta-item">
              <span class="meta-icon">⏰</span>
              <span>${l(a.time)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <span>${l(a.location)}</span>
            </div>
          </div>
        </div>
      `,t.appendChild(s)})}function Ae(e){const t=document.getElementById("gallery-items-container");if(!t)return;t.innerHTML="",e.filter(a=>a.is_published!==!1).forEach(a=>{const s=document.createElement("div");s.className=`gallery-item-card ${a.type==="video"?"video-card":""}`,s.setAttribute("data-category",a.type==="video"?"videos":a.category),a.type==="video"&&s.setAttribute("data-video-url",a.url);let n="";if(a.type==="video")a.thumbnail_url?n=`
            <img src="${a.thumbnail_url}" alt="${l(a.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
            <div class="gallery-item-overlay">
              <div class="play-btn-circle">
                <span class="play-triangle"></span>
              </div>
              <span class="gallery-item-tag">Reels / Video</span>
            </div>
          `:n=`
            <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" class="gallery-svg-placeholder">
              <rect width="100%" height="100%" fill="#0d233a"/>
              <polygon points="175,110 235,140 175,170" fill="#c5a059"/>
              <circle cx="200" cy="140" r="45" stroke="#c5a059" stroke-width="2" />
              <text x="200" y="235" font-family="'Outfit', sans-serif" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="middle">${l(a.title)}</text>
            </svg>
            <div class="gallery-item-overlay">
              <div class="play-btn-circle">
                <span class="play-triangle"></span>
              </div>
              <span class="gallery-item-tag">Reels / Video</span>
            </div>
          `;else if(a.url)n=`
            <img src="${a.url}" alt="${l(a.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
            <div class="gallery-item-overlay">
              <span class="zoom-icon">+</span>
              <span class="gallery-item-tag" style="text-transform: capitalize;">${a.category}</span>
            </div>
          `;else{let c='<rect width="100%" height="100%" fill="#1b3a57"/><circle cx="200" cy="130" r="45" stroke="#c5a059" stroke-width="2" />';a.category==="hostel"?c='<rect width="100%" height="100%" fill="#0d233a"/><path d="M 100 210 L 200 130 L 300 210 Z" fill="#c5a059" opacity="0.8"/><rect x="150" y="210" width="100" height="50" fill="#1b3a57" />':a.category==="events"&&(c='<rect width="100%" height="100%" fill="#1b3a57"/><polygon points="200,60 215,100 260,100 225,125 238,165 200,140 162,165 175,125 140,100 185,100" fill="#c5a059"/>'),n=`
            <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" class="gallery-svg-placeholder">
              ${c}
              <text x="200" y="245" font-family="'Outfit', sans-serif" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="middle">${l(a.title)}</text>
            </svg>
            <div class="gallery-item-overlay">
              <span class="zoom-icon">+</span>
              <span class="gallery-item-tag" style="text-transform: capitalize;">${a.category}</span>
            </div>
          `}s.innerHTML=`
        <div class="gallery-media-wrapper">
          ${n}
        </div>
        <div class="gallery-item-info">
          <h3>${l(a.title)}</h3>
          <p>${l(a.description||"")}</p>
        </div>
      `,t.appendChild(s)}),te()}function ee(){const e=document.querySelectorAll(".filter-btn"),t=document.querySelectorAll(".notice-item");e.forEach(o=>{o.addEventListener("click",()=>{e.forEach(s=>s.classList.remove("active")),o.classList.add("active");const a=o.getAttribute("data-filter");t.forEach(s=>{const n=s.getAttribute("data-category");a==="all"||n===a?(s.style.display="flex",setTimeout(()=>{s.style.opacity="1",s.style.transform="translateY(0)"},50)):(s.style.opacity="0",s.style.transform="translateY(10px)",setTimeout(()=>{s.style.display="none"},300))})})})}function te(){const e=document.querySelectorAll(".gallery-tab"),t=document.querySelectorAll(".gallery-item-card");e.forEach(o=>{o.addEventListener("click",()=>{e.forEach(s=>{s.classList.remove("active"),s.setAttribute("aria-selected","false")}),o.classList.add("active"),o.setAttribute("aria-selected","true");const a=o.getAttribute("data-tab");t.forEach(s=>{const n=s.getAttribute("data-category");a==="all"||n===a?(s.style.display="block",setTimeout(()=>{s.style.opacity="1",s.style.transform="scale(1)"},50)):(s.style.opacity="0",s.style.transform="scale(0.95)",setTimeout(()=>{s.style.display="none"},300))})})}),t.forEach(o=>{const a=o.querySelector(".gallery-media-wrapper");a&&a.addEventListener("click",()=>{const s=o.querySelector(".gallery-item-info h3").textContent,n=o.querySelector(".gallery-item-info p").textContent;if(o.classList.contains("video-card")){const r=o.getAttribute("data-video-url");V(s,n,!0,r)}else{const r=a.querySelector("img");if(r)V(s,n,!1,r.src);else{const d=a.querySelector(".gallery-svg-placeholder");V(s,n,!1,"",d)}}})})}let z="all";function ae(e){const t=document.getElementById("faculty-grid-container");if(!t)return;t.innerHTML="";const o=(e||[]).filter(n=>n.is_active!==!1).sort((n,c)=>(Number(n.order)||99)-(Number(c.order)||99)),a=z==="all"?o:o.filter(n=>n.category===z);if(a.length===0){t.innerHTML=`
        <div class="empty-faculty-notice">
          <p>No faculty profiles currently listed under this category.</p>
        </div>
      `;return}const s={leadership:"School Leadership",teaching:"Teaching Faculty",admin:"Administrative Staff",support:"Support Staff"};a.forEach(n=>{const c=document.createElement("div");c.className="staff-card",c.setAttribute("data-id",n.id),c.setAttribute("data-category",n.category||"teaching");const r=n.category||"teaching",d=s[n.category]||"Faculty Member",v=n.photo_url?`<img src="${l(n.photo_url)}" alt="${l(n.name)}" class="staff-avatar-img" loading="lazy">`:`<div class="staff-avatar-placeholder">
          <span>${l((n.name||"APS").split(" ").map(b=>b[0]).slice(0,2).join("").toUpperCase())}</span>
        </div>`;c.innerHTML=`
        <div class="staff-card-header">
          <div class="staff-avatar-wrapper">
            ${v}
          </div>
          <span class="staff-category-pill pill-${r}">${l(d)}</span>
        </div>
        <div class="staff-card-body">
          <h3 class="staff-name">${l(n.name)}</h3>
          <p class="staff-designation">${l(n.designation||"Staff")}</p>
          
          <div class="staff-meta-badges">
            ${n.qualification?`<span class="staff-badge badge-qual" title="Qualification">🎓 ${l(n.qualification)}</span>`:""}
            ${n.subject?`<span class="staff-badge badge-subj" title="Subject / Focus">📚 ${l(n.subject)}</span>`:""}
            ${n.experience?`<span class="staff-badge badge-exp" title="Experience">⏳ ${l(n.experience)}</span>`:""}
          </div>

          ${n.bio?`
            <p class="staff-bio-excerpt">
              ${l(n.bio.length>105?n.bio.slice(0,102)+"...":n.bio)}
            </p>
          `:""}
        </div>
        <div class="staff-card-footer">
          <button type="button" class="btn-staff-detail" onclick="window.openStaffModal('${l(n.id)}')">
            <span>View Full Profile</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      `,t.appendChild(c)})}function Me(){const e=document.querySelectorAll(".faculty-tab");e.forEach(t=>{t.addEventListener("click",()=>{e.forEach(o=>{o.classList.remove("active"),o.setAttribute("aria-selected","false")}),t.classList.add("active"),t.setAttribute("aria-selected","true"),z=t.getAttribute("data-category")||"all",u&&u.faculty_staff&&ae(u.faculty_staff)})})}window.openStaffModal=function(e){if(!u||!u.faculty_staff)return;const t=u.faculty_staff.find(r=>String(r.id)===String(e));if(!t)return;const o=document.getElementById("staff-modal"),a=document.getElementById("staff-modal-body");if(!o||!a)return;const n={leadership:"School Leadership",teaching:"Teaching Faculty",admin:"Administrative Staff",support:"Support Staff"}[t.category]||"Faculty & Staff",c=t.photo_url?`<img src="${l(t.photo_url)}" alt="${l(t.name)}" class="staff-detail-photo">`:`<div class="staff-detail-placeholder">
        <span>${l((t.name||"APS").split(" ").map(r=>r[0]).slice(0,2).join("").toUpperCase())}</span>
      </div>`;a.innerHTML=`
      <div class="staff-detail-container">
        <div class="staff-detail-sidebar">
          <div class="staff-detail-photo-box">
            ${c}
          </div>
          <span class="staff-category-pill pill-${t.category||"teaching"}">${l(n)}</span>
          ${t.phone?`
            <div class="staff-detail-actions">
              <a href="tel:${t.phone.replace(/[^0-9]/g,"")}" class="btn btn-blue-solid btn-sm btn-full">
                📞 Call Staff
              </a>
              <a href="https://wa.me/${t.phone.replace(/[^0-9]/g,"")}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-solid btn-sm btn-full">
                WhatsApp
              </a>
            </div>
          `:""}
        </div>
        <div class="staff-detail-main">
          <h2 class="staff-detail-name">${l(t.name)}</h2>
          <p class="staff-detail-designation">${l(t.designation||"Staff")}</p>
          
          <div class="staff-detail-grid">
            <div class="detail-cell">
              <span class="detail-cell-label">Qualification</span>
              <span class="detail-cell-value">${l(t.qualification||"Standard Qualification")}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Subject / Area</span>
              <span class="detail-cell-value">${l(t.subject||"All Subjects")}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Experience</span>
              <span class="detail-cell-value">${l(t.experience||"Experienced")}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Department</span>
              <span class="detail-cell-value">${l(n)}</span>
            </div>
          </div>

          <div class="staff-detail-bio-box">
            <h4 class="bio-heading">About / Background</h4>
            <p class="bio-text">${l(t.bio||"Dedicated educator at AMRID Public School committed to fostering student knowledge, moral discipline, and personal growth.")}</p>
          </div>
        </div>
      </div>
    `,o.style.display="flex",setTimeout(()=>{o.classList.add("open")},10),document.body.style.overflow="hidden"};function R(){const e=document.getElementById("staff-modal");e&&(e.classList.remove("open"),setTimeout(()=>{e.style.display="none"},250),document.body.style.overflow="")}const se=document.getElementById("staff-modal-close"),ne=document.getElementById("staff-modal-backdrop");se&&se.addEventListener("click",R),ne&&ne.addEventListener("click",R);function qe(){ee(),te(),Me()}function f(e,t,o){const a=e.value.trim(),s=o(a),n=document.getElementById(t);return s?(e.classList.remove("invalid"),n&&n.classList.remove("visible"),!0):(e.classList.add("invalid"),n&&n.classList.add("visible"),!1)}const h=e=>e!=="",le=e=>/^[0-9]{10}$/.test(e),x=document.getElementById("enquiry-form"),M=document.getElementById("parent-name"),q=document.getElementById("student-name"),T=document.getElementById("phone-number"),H=document.getElementById("class-apply"),F=document.getElementById("form-success-banner"),L=document.getElementById("form-error-banner");x&&(M.addEventListener("blur",()=>f(M,"parent-name-error",h)),q.addEventListener("blur",()=>f(q,"student-name-error",h)),T.addEventListener("blur",()=>f(T,"phone-number-error",le)),H.addEventListener("change",()=>f(H,"class-apply-error",h)),x.addEventListener("submit",async e=>{e.preventDefault();const t=f(M,"parent-name-error",h),o=f(q,"student-name-error",h),a=f(T,"phone-number-error",le),s=f(H,"class-apply-error",h);if(!(t&&o&&a&&s)){L.style.display="flex",F.style.display="none",L.scrollIntoView({behavior:"smooth",block:"nearest"});return}const n={parentName:M.value.trim(),studentName:q.value.trim(),phoneNumber:T.value.trim(),classApply:H.value,message:document.getElementById("message").value.trim()};L.style.display="none",x.style.opacity="0.3";const c=x.elements;for(let r=0;r<c.length;r++)c[r].disabled=!0;try{const d=await(await fetch("/api/enquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json();if(d.success)x.style.display="none",F.style.display="flex",F.scrollIntoView({behavior:"smooth",block:"nearest"});else throw new Error(d.message||"Submission rejected by server.")}catch(r){console.error("Enquiry API submission error:",r),x.style.opacity="1";for(let d=0;d<c.length;d++)c[d].disabled=!1;L.querySelector("p").textContent=r.message||"There was a connection issue. Please try again.",L.style.display="flex",L.scrollIntoView({behavior:"smooth",block:"nearest"})}}));const $=document.getElementById("contact-form"),D=document.getElementById("contact-name-input"),Te=document.getElementById("contact-email-input"),He=document.getElementById("contact-phone-input"),De=document.getElementById("contact-subject-input"),N=document.getElementById("contact-message-input"),U=document.getElementById("contact-success-banner"),S=document.getElementById("contact-error-banner");$&&(D.addEventListener("blur",()=>f(D,"contact-name-error",h)),N.addEventListener("blur",()=>f(N,"contact-message-error",h)),$.addEventListener("submit",async e=>{e.preventDefault();const t=f(D,"contact-name-error",h),o=f(N,"contact-message-error",h);if(!(t&&o)){S.style.display="flex",U.style.display="none",S.scrollIntoView({behavior:"smooth",block:"nearest"});return}const a={name:D.value.trim(),email:Te.value.trim(),phone:He.value.trim(),subject:De.value.trim(),message:N.value.trim()};S.style.display="none",$.style.opacity="0.3";const s=$.elements;for(let n=0;n<s.length;n++)s[n].disabled=!0;try{const c=await(await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json();if(c.success)$.style.display="none",U.style.display="flex",U.scrollIntoView({behavior:"smooth",block:"nearest"});else throw new Error(c.message||"Submission rejected by server.")}catch(n){console.error("Contact API submission error:",n),$.style.opacity="1";for(let c=0;c<s.length;c++)s[c].disabled=!1;S.querySelector("p").textContent=n.message||"There was a connection issue. Please try again.",S.style.display="flex",S.scrollIntoView({behavior:"smooth",block:"nearest"})}})),document.querySelectorAll(".faq-trigger").forEach(e=>{e.addEventListener("click",()=>{const t=e.parentElement,o=t.querySelector(".faq-content"),a=t.classList.contains("open");document.querySelectorAll(".faq-item").forEach(s=>{s.classList.remove("open"),s.querySelector(".faq-trigger").setAttribute("aria-expanded","false"),s.querySelector(".faq-content").style.maxHeight="0"}),a?(t.classList.remove("open"),e.setAttribute("aria-expanded","false"),o.style.maxHeight="0"):(t.classList.add("open"),e.setAttribute("aria-expanded","true"),o.style.maxHeight=o.scrollHeight+"px")})}),ke()});function l(u){return u?u.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}window.toggleLeaderMessage=function(u){const w=u.closest(".leader-card");if(!w)return;const y=w.querySelector(".leader-message-full");if(!y)return;y.style.display==="none"||!y.style.display?(y.style.display="block",u.textContent="Read Less"):(y.style.display="none",u.textContent="Read More")};
