import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{let g=null;function q(){function e(o){document.documentElement.setAttribute("data-theme",o);try{localStorage.setItem("aps_theme",o)}catch{}}document.querySelectorAll(".theme-toggle-btn").forEach(o=>{o.addEventListener("click",a=>{a.preventDefault();const t=(document.documentElement.getAttribute("data-theme")||"light")==="dark"?"light":"dark";e(t)})}),window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",o=>{localStorage.getItem("aps_theme")||e(o.matches?"dark":"light")})}q();const y=document.getElementById("hamburger-toggle"),V=document.getElementById("mobile-drawer"),Be=document.getElementById("drawer-close"),R=document.getElementById("drawer-overlay"),ke=document.querySelectorAll(".drawer-link, .drawer-cta");function Ce(){V.classList.add("open"),R.classList.add("visible"),y.setAttribute("aria-expanded","true"),document.body.style.overflow="hidden"}function T(){V.classList.remove("open"),R.classList.remove("visible"),y.setAttribute("aria-expanded","false"),document.body.style.overflow=""}y.addEventListener("click",Ce),Be.addEventListener("click",T),R.addEventListener("click",T),ke.forEach(e=>{e.addEventListener("click",()=>{T()})}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(T(),F(),O())});const X=document.querySelector(".site-header"),_e=document.querySelectorAll(".nav-link"),Ae=document.querySelectorAll("section.scroll-offset-section, section#home");window.addEventListener("scroll",()=>{window.scrollY>50?X.classList.add("scrolled"):X.classList.remove("scrolled");let e="";const s=window.scrollY+120;Ae.forEach(o=>{const a=o.offsetTop,n=o.offsetHeight;s>=a&&s<a+n&&(e=o.getAttribute("id"))}),e&&_e.forEach(o=>{o.classList.remove("active"),o.getAttribute("href")===`#${e}`&&o.classList.add("active")})});const L=document.getElementById("lightbox-modal"),qe=document.getElementById("lightbox-close"),Z=document.getElementById("lightbox-image-container"),K=document.getElementById("lightbox-video-container"),B=document.getElementById("lightbox-img"),ee=document.getElementById("lightbox-iframe"),Te=document.getElementById("lightbox-title"),Me=document.getElementById("lightbox-desc");function z(e,s,o,a,n=null){if(Te.textContent=e,Me.textContent=s,o)Z.style.display="none",K.style.display="block",ee.src=a;else if(K.style.display="none",Z.style.display="block",n){const t=new XMLSerializer().serializeToString(n),r=new Blob([t],{type:"image/svg+xml;charset=utf-8"}),d=(window.URL||window.webkitURL||window).createObjectURL(r);B.src=d,B.alt=e}else B.src=a,B.alt=e;L.style.display="flex",setTimeout(()=>{L.classList.add("open")},10),document.body.style.overflow="hidden"}function F(){L.classList.remove("open"),setTimeout(()=>{L.style.display="none",ee.src="",B.src=""},300),document.body.style.overflow=""}qe.addEventListener("click",F),L.addEventListener("click",e=>{e.target===L&&F()});async function He(){try{let e=await fetch("/data/content.json?t="+new Date().getTime());if(e.ok||(e=await fetch("/api/content?t="+new Date().getTime())),!e.ok)throw new Error("Failed to load JSON");g=await e.json(),De(g)}catch(e){console.warn("Could not load dynamic website database. Falling back to static HTML elements.",e),Ve()}}function De(e){var Le,Se,$e,Ie;const s=e.school_info;document.title=`${s.name} | Nursery to Class 8 School in Purnia, Bihar`;const o=document.getElementById("editable-reg-number");o&&(o.textContent=s.reg_number);const a=document.getElementById("footer-reg-number");a&&(a.textContent=s.reg_number),document.querySelectorAll(".school-logo").forEach(i=>{if(s.logo_url)if(i.tagName.toLowerCase()==="svg"){const p=document.createElement("img");p.className="school-logo custom-logo-img",p.src=s.logo_url,p.alt=s.name+" Logo",p.style.width="50px",p.style.height="50px",p.style.objectFit="contain",i.parentNode.replaceChild(p,i)}else i.src=s.logo_url}),document.querySelectorAll(".logo-text .school-title, .drawer-logo .school-title, .branding-col .footer-title").forEach(i=>i.textContent=s.name),document.querySelectorAll(".logo-text .school-subtitle").forEach(i=>i.textContent=s.tagline);const c=e.hero_section,d=document.getElementById("hero-badge-container");d&&(d.innerHTML=`<span class="badge-dot"></span> ${c.badge}`);const f=document.getElementById("hero-title-container");f&&(f.textContent=c.title);const u=document.getElementById("hero-tagline-container");u&&(u.textContent=c.tagline);const v=document.getElementById("hero-desc-container");v&&(v.textContent=c.description);const de=document.getElementById("hero-btn1");de&&c.button1_text&&(de.textContent=c.button1_text);const pe=document.getElementById("hero-btn2");pe&&c.button2_text&&(pe.textContent=c.button2_text);const ue=document.getElementById("home");ue&&c.image_url&&(ue.style.backgroundImage=`url('${c.image_url}')`);const ge=document.getElementById("about-title-container");ge&&(ge.textContent=s.about_title);const fe=document.getElementById("about-text-container");fe&&s.about_text&&(fe.innerHTML=s.about_text.split(`

`).map(i=>`<p class="about-text">${i.replace(/AMRID PUBLIC SCHOOL/g,"<strong>AMRID PUBLIC SCHOOL</strong>").replace(/Nursery to Class 8/g,"<strong>Nursery to Class 8</strong>")}</p>`).join(""));const me=document.querySelector(".admission-text");me&&s.admission_info&&(me.textContent=s.admission_info);const he=document.getElementById("messages-grid-container"),G=document.getElementById("leadership")||document.getElementById("messages");if(he&&G)if(s.show_leaders===!1)G.style.display="none";else{G.style.display="block";const i=e.director_info.message||"",p=i.length>220?i.slice(0,215)+"...":i,b=i.length>220?i.slice(215):"",w=e.principal_info.message||"",A=w.length>220?w.slice(0,215)+"...":w,Q=w.length>220?w.slice(215):"";he.innerHTML=`
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
                ${b?`
                  <div class="leader-message-full" style="display: none;">
                    <p>${l(b)}</p>
                  </div>
                `:""}
              </blockquote>
              ${b?`
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
                <p class="leader-message-preview">${l(A)}</p>
                ${Q?`
                  <div class="leader-message-full" style="display: none;">
                    <p>${l(Q)}</p>
                  </div>
                `:""}
              </blockquote>
              ${Q?`
                <div class="leader-card-footer">
                  <button type="button" class="btn-read-more" onclick="window.toggleLeaderMessage(this)">Read More</button>
                </div>
              `:""}
            </div>
          </div>
        `}if(le(e.faculty_staff||[]),e.why_choose&&Array.isArray(e.why_choose)){const i=document.getElementById("why-choose-grid-container");i&&(i.innerHTML="",e.why_choose.forEach(p=>{const b=document.createElement("div");b.className="why-card",b.innerHTML=`
            <div class="why-icon">${p.icon||"🌟"}</div>
            <h3 class="why-title">${l(p.title)}</h3>
            <p class="why-text">${l(p.description)}</p>
          `,i.appendChild(b)}))}if((Le=e.contact_settings)!=null&&Le.school_timings||(Se=e.school_info)!=null&&Se.school_timings){const i=(($e=e.contact_settings)==null?void 0:$e.school_timings)||((Ie=e.school_info)==null?void 0:Ie.school_timings),p=document.getElementById("footer-timings-val");p&&i&&(p.innerHTML=l(i).replace(/\n/g,"<br>"))}const C=e.hostel_info,ye=document.getElementById("hostel-desc-container");ye&&(ye.textContent=C.description);const ve=document.querySelector(".hostel-graphic");ve&&C.image_url&&(ve.innerHTML=`<img src="${C.image_url}" alt="Hostel Facility" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">`);const J=document.getElementById("hostel-bullets-container");J&&C.bullets&&(J.innerHTML="",C.bullets.forEach(i=>{const p=i.split(":"),b=p[0]||"",w=p.slice(1).join(":")||"",A=document.createElement("div");A.className="bullet-item",A.innerHTML=`
          <svg class="bullet-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span><strong>${l(b)}</strong>${l(w?":"+w:"")}</span>
        `,J.appendChild(A)})),Pe(e.notices),se(e.events),Ne(e.gallery);const I=e.contact_settings,_=e.social_media;document.querySelectorAll("#contact-address-val, .branding-col .footer-address").forEach(i=>i.innerHTML=I.address.replace(/,/g,",<br>")),document.querySelectorAll('#contact-director-phone, .contact-col a[href^="tel:9905430742"]').forEach(i=>{i.textContent=I.phone,i.href=`tel:${I.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll('#contact-principal-phone, .contact-col a[href^="tel:9693264161"]').forEach(i=>{i.textContent=e.principal_info.phone,i.href=`tel:${e.principal_info.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll("#contact-director-name").forEach(i=>i.textContent=e.director_info.name),document.querySelectorAll("#contact-principal-name").forEach(i=>i.textContent=e.principal_info.name);const be=document.querySelector(".floating-whatsapp-widget");be&&(be.href=`https://wa.me/${_.whatsapp.replace(/[^0-9]/g,"")}`),document.querySelectorAll('.link-whatsapp-btn, .cta-buttons-wrapper a[href^="https://wa.me/"]').forEach(i=>{i.href=`https://wa.me/${_.whatsapp.replace(/[^0-9]/g,"")}`}),document.querySelectorAll(".link-whatsapp-btn-principal").forEach(i=>{i.href=`https://wa.me/${e.principal_info.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll('.link-call-btn, .hero-ctas a[href^="tel:"]').forEach(i=>{i.href=`tel:${I.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll(".link-call-btn-principal").forEach(i=>{i.href=`tel:${e.principal_info.phone.replace(/[^0-9]/g,"")}`}),document.querySelectorAll('a[href^="https://instagram.com/"], .socials-col a[aria-label^="Follow us on Instagram"]').forEach(i=>{i.href=_.instagram});const we=document.querySelector(".facebook-social-link");we&&(we.href=_.facebook);const Ee=document.querySelector(".youtube-social-link");Ee&&(Ee.href=_.youtube);const xe=document.querySelector(".google-map-iframe");xe&&(xe.src=I.google_maps_embed),document.querySelectorAll('.link-map-directions, .location-ctas a[href^="https://www.google.com/maps/"]').forEach(i=>{i.href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(I.address)}`})}function Pe(e){const s=document.getElementById("notices-wrapper");if(!s)return;s.innerHTML="";const o=new Date;o.setHours(0,0,0,0);const a=e.filter(n=>{const t=n.is_published!==!1;let r=!0;if(n.expiry_date){const c=new Date(n.expiry_date);c.setHours(0,0,0,0),r=c>=o}return t&&r});if(a.length===0){s.innerHTML='<p style="text-align:center; color:rgba(255,255,255,0.4); padding:40px 0;">No notices published currently.</p>';return}a.forEach(n=>{const t=n.date.split(" "),r=t[0]||"",c=t.slice(1).join(" ")||"",d=document.createElement("div");d.className="notice-item",d.setAttribute("data-category",n.category);let f="badge-general",u="General";n.category==="admission"?(f="badge-admission",u="Admission Announcement"):n.category==="events"&&(f="badge-events",u="Important Event"),d.innerHTML=`
        <div class="notice-date">
          <span class="date-day">${l(r)}</span>
          <span class="date-month">${l(c)}</span>
        </div>
        <div class="notice-details">
          <span class="notice-badge ${f}">${l(u)}</span>
          ${n.is_important?'<span class="notice-badge badge-admission" style="background-color:var(--danger-red); margin-left:8px;">Urgent</span>':""}
          <h3 class="notice-title">${l(n.title)}</h3>
          <p class="notice-text">${l(n.text)}</p>
        </div>
      `,s.appendChild(d)}),ae()}let k="upcoming",te=[];function se(e){e&&(te=e);const s=document.getElementById("events-grid-container");if(!s)return;s.innerHTML="";const o=(te||[]).filter(t=>t.is_published!==!1),a=new Date;a.setHours(0,0,0,0);const n=o.filter(t=>{const r=new Date(t.date);r.setHours(0,0,0,0);const c=t.status==="past"||t.status!=="upcoming"&&r<a;return k==="upcoming"?!c:k==="past"?c:!0});if(n.length===0){const t=k==="upcoming"?"No upcoming events scheduled at this time. Check back soon or view our Past Events archive!":k==="past"?"No archived past events to show.":"No events published at this time.";s.innerHTML=`<p class="empty-list-text" style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px 0;">${t}</p>`,ne();return}n.forEach(t=>{const r=document.createElement("div");r.className="event-card";const c=new Date(t.date);c.setHours(0,0,0,0);const d=t.status==="past"||t.status!=="upcoming"&&c<a,f=new Date(t.date).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"});r.innerHTML=`
        <div class="event-card-img-wrapper">
          ${t.image_url?`<img src="${t.image_url}" alt="${l(t.title)}" loading="lazy">`:`<svg viewBox="0 0 400 250" width="100%" height="100%" fill="none">
              <rect width="100%" height="100%" fill="#1b3a57"/>
              <polygon points="200,60 215,100 260,100 225,125 238,165 200,140 162,165 175,125 140,100 185,100" fill="#c5a059" opacity="0.3"/>
            </svg>`}
          <div class="event-date-badge">${f}</div>
        </div>
        <div class="event-card-content">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
            <h3 class="event-card-title" style="margin-bottom: 0;">${l(t.title)}</h3>
            <span class="event-status-tag ${d?"event-status-past":"event-status-upcoming"}">
              ${d?"Past Event":"Upcoming"}
            </span>
          </div>
          <p class="event-card-desc">${l(t.description)}</p>
          <div class="event-card-meta">
            <div class="meta-item">
              <span class="meta-icon">⏰</span>
              <span>${l(t.time)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <span>${l(t.location)}</span>
            </div>
          </div>
        </div>
      `,s.appendChild(r)}),ne()}function ne(){const e=document.querySelectorAll(".event-tab");e.forEach(s=>{s.onclick=()=>{e.forEach(o=>o.classList.remove("active")),s.classList.add("active"),k=s.getAttribute("data-event-type")||"all",se()}})}function Ne(e){const s=document.getElementById("gallery-items-container");if(!s)return;s.innerHTML="",e.filter(a=>a.is_published!==!1).forEach(a=>{const n=document.createElement("div");n.className=`gallery-item-card ${a.type==="video"?"video-card":""}`,n.setAttribute("data-category",a.type==="video"?"videos":a.category),a.type==="video"&&n.setAttribute("data-video-url",a.url);let t="";if(a.type==="video")a.thumbnail_url?t=`
            <img src="${a.thumbnail_url}" alt="${l(a.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
            <div class="gallery-item-overlay">
              <div class="play-btn-circle">
                <span class="play-triangle"></span>
              </div>
              <span class="gallery-item-tag">Reels / Video</span>
            </div>
          `:t=`
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
          `;else if(a.url)t=`
            <img src="${a.url}" alt="${l(a.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
            <div class="gallery-item-overlay">
              <span class="zoom-icon">+</span>
              <span class="gallery-item-tag" style="text-transform: capitalize;">${a.category}</span>
            </div>
          `;else{let r='<rect width="100%" height="100%" fill="#1b3a57"/><circle cx="200" cy="130" r="45" stroke="#c5a059" stroke-width="2" />';a.category==="hostel"?r='<rect width="100%" height="100%" fill="#0d233a"/><path d="M 100 210 L 200 130 L 300 210 Z" fill="#c5a059" opacity="0.8"/><rect x="150" y="210" width="100" height="50" fill="#1b3a57" />':a.category==="events"&&(r='<rect width="100%" height="100%" fill="#1b3a57"/><polygon points="200,60 215,100 260,100 225,125 238,165 200,140 162,165 175,125 140,100 185,100" fill="#c5a059"/>'),t=`
            <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" class="gallery-svg-placeholder">
              ${r}
              <text x="200" y="245" font-family="'Outfit', sans-serif" font-weight="bold" font-size="16" fill="#ffffff" text-anchor="middle">${l(a.title)}</text>
            </svg>
            <div class="gallery-item-overlay">
              <span class="zoom-icon">+</span>
              <span class="gallery-item-tag" style="text-transform: capitalize;">${a.category}</span>
            </div>
          `}n.innerHTML=`
        <div class="gallery-media-wrapper">
          ${t}
        </div>
        <div class="gallery-item-info">
          <h3>${l(a.title)}</h3>
          <p>${l(a.description||"")}</p>
        </div>
      `,s.appendChild(n)}),oe()}function ae(){const e=document.querySelectorAll(".filter-btn"),s=document.querySelectorAll(".notice-item");e.forEach(o=>{o.addEventListener("click",()=>{e.forEach(n=>n.classList.remove("active")),o.classList.add("active");const a=o.getAttribute("data-filter");s.forEach(n=>{const t=n.getAttribute("data-category");a==="all"||t===a?(n.style.display="flex",setTimeout(()=>{n.style.opacity="1",n.style.transform="translateY(0)"},50)):(n.style.opacity="0",n.style.transform="translateY(10px)",setTimeout(()=>{n.style.display="none"},300))})})})}function oe(){const e=document.querySelectorAll(".gallery-tab"),s=document.querySelectorAll(".gallery-item-card");e.forEach(o=>{o.addEventListener("click",()=>{e.forEach(n=>{n.classList.remove("active"),n.setAttribute("aria-selected","false")}),o.classList.add("active"),o.setAttribute("aria-selected","true");const a=o.getAttribute("data-tab");s.forEach(n=>{const t=n.getAttribute("data-category");a==="all"||t===a?(n.style.display="block",setTimeout(()=>{n.style.opacity="1",n.style.transform="scale(1)"},50)):(n.style.opacity="0",n.style.transform="scale(0.95)",setTimeout(()=>{n.style.display="none"},300))})})}),s.forEach(o=>{const a=o.querySelector(".gallery-media-wrapper");a&&a.addEventListener("click",()=>{const n=o.querySelector(".gallery-item-info h3").textContent,t=o.querySelector(".gallery-item-info p").textContent;if(o.classList.contains("video-card")){const c=o.getAttribute("data-video-url");z(n,t,!0,c)}else{const c=a.querySelector("img");if(c)z(n,t,!1,c.src);else{const d=a.querySelector(".gallery-svg-placeholder");z(n,t,!1,"",d)}}})})}let U="all";function le(e){const s=document.getElementById("faculty-grid-container");if(!s)return;s.innerHTML="";const o=(e||[]).filter(t=>t.is_active!==!1).sort((t,r)=>(Number(t.order)||99)-(Number(r.order)||99)),a=U==="all"?o:o.filter(t=>t.category===U);if(a.length===0){s.innerHTML=`
        <div class="empty-faculty-notice">
          <p>No faculty profiles currently listed under this category.</p>
        </div>
      `;return}const n={leadership:"School Leadership",teaching:"Teaching Faculty",admin:"Administrative Staff",support:"Support Staff"};a.forEach(t=>{const r=document.createElement("div");r.className="staff-card",r.setAttribute("data-id",t.id),r.setAttribute("data-category",t.category||"teaching");const c=t.category||"teaching",d=n[t.category]||"Faculty Member",f=t.photo_url?`<img src="${l(t.photo_url)}" alt="${l(t.name)}" class="staff-avatar-img" loading="lazy">`:`<div class="staff-avatar-placeholder">
          <span>${l((t.name||"APS").split(" ").map(u=>u[0]).slice(0,2).join("").toUpperCase())}</span>
        </div>`;r.innerHTML=`
        <div class="staff-card-header">
          <div class="staff-avatar-wrapper">
            ${f}
          </div>
          <span class="staff-category-pill pill-${c}">${l(d)}</span>
        </div>
        <div class="staff-card-body">
          <h3 class="staff-name">${l(t.name)}</h3>
          <p class="staff-designation">${l(t.designation||"Staff")}</p>
          
          <div class="staff-meta-badges">
            ${t.qualification?`<span class="staff-badge badge-qual" title="Qualification">🎓 ${l(t.qualification)}</span>`:""}
            ${t.subject?`<span class="staff-badge badge-subj" title="Subject / Focus">📚 ${l(t.subject)}</span>`:""}
            ${t.experience?`<span class="staff-badge badge-exp" title="Experience">⏳ ${l(t.experience)}</span>`:""}
          </div>

          ${t.bio?`
            <p class="staff-bio-excerpt">
              ${l(t.bio.length>105?t.bio.slice(0,102)+"...":t.bio)}
            </p>
          `:""}
        </div>
        <div class="staff-card-footer">
          <button type="button" class="btn-staff-detail" onclick="window.openStaffModal('${l(t.id)}')">
            <span>View Full Profile</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      `,s.appendChild(r)})}function je(){const e=document.querySelectorAll(".faculty-tab");e.forEach(s=>{s.addEventListener("click",()=>{e.forEach(o=>{o.classList.remove("active"),o.setAttribute("aria-selected","false")}),s.classList.add("active"),s.setAttribute("aria-selected","true"),U=s.getAttribute("data-category")||"all",g&&g.faculty_staff&&le(g.faculty_staff)})})}window.openStaffModal=function(e){if(!g||!g.faculty_staff)return;const s=g.faculty_staff.find(c=>String(c.id)===String(e));if(!s)return;const o=document.getElementById("staff-modal"),a=document.getElementById("staff-modal-body");if(!o||!a)return;const t={leadership:"School Leadership",teaching:"Teaching Faculty",admin:"Administrative Staff",support:"Support Staff"}[s.category]||"Faculty & Staff",r=s.photo_url?`<img src="${l(s.photo_url)}" alt="${l(s.name)}" class="staff-detail-photo">`:`<div class="staff-detail-placeholder">
        <span>${l((s.name||"APS").split(" ").map(c=>c[0]).slice(0,2).join("").toUpperCase())}</span>
      </div>`;a.innerHTML=`
      <div class="staff-detail-container">
        <div class="staff-detail-sidebar">
          <div class="staff-detail-photo-box">
            ${r}
          </div>
          <span class="staff-category-pill pill-${s.category||"teaching"}">${l(t)}</span>
          ${s.phone?`
            <div class="staff-detail-actions">
              <a href="tel:${s.phone.replace(/[^0-9]/g,"")}" class="btn btn-blue-solid btn-sm btn-full">
                📞 Call Staff
              </a>
              <a href="https://wa.me/${s.phone.replace(/[^0-9]/g,"")}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-solid btn-sm btn-full">
                WhatsApp
              </a>
            </div>
          `:""}
        </div>
        <div class="staff-detail-main">
          <h2 class="staff-detail-name">${l(s.name)}</h2>
          <p class="staff-detail-designation">${l(s.designation||"Staff")}</p>
          
          <div class="staff-detail-grid">
            <div class="detail-cell">
              <span class="detail-cell-label">Qualification</span>
              <span class="detail-cell-value">${l(s.qualification||"Standard Qualification")}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Subject / Area</span>
              <span class="detail-cell-value">${l(s.subject||"All Subjects")}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Experience</span>
              <span class="detail-cell-value">${l(s.experience||"Experienced")}</span>
            </div>
            <div class="detail-cell">
              <span class="detail-cell-label">Department</span>
              <span class="detail-cell-value">${l(t)}</span>
            </div>
          </div>

          <div class="staff-detail-bio-box">
            <h4 class="bio-heading">About / Background</h4>
            <p class="bio-text">${l(s.bio||"Dedicated educator at AMRID Public School committed to fostering student knowledge, moral discipline, and personal growth.")}</p>
          </div>
        </div>
      </div>
    `,o.style.display="flex",setTimeout(()=>{o.classList.add("open")},10),document.body.style.overflow="hidden"};function O(){const e=document.getElementById("staff-modal");e&&(e.classList.remove("open"),setTimeout(()=>{e.style.display="none"},250),document.body.style.overflow="")}const ie=document.getElementById("staff-modal-close"),ce=document.getElementById("staff-modal-backdrop");ie&&ie.addEventListener("click",O),ce&&ce.addEventListener("click",O);function Ve(){ae(),oe(),je()}function m(e,s,o){const a=e.value.trim(),n=o(a),t=document.getElementById(s);return n?(e.classList.remove("invalid"),t&&t.classList.remove("visible"),!0):(e.classList.add("invalid"),t&&t.classList.add("visible"),!1)}const h=e=>e!=="",re=e=>/^[0-9]{10}$/.test(e),E=document.getElementById("enquiry-form"),M=document.getElementById("parent-name"),H=document.getElementById("student-name"),D=document.getElementById("phone-number"),P=document.getElementById("class-apply"),W=document.getElementById("form-success-banner"),S=document.getElementById("form-error-banner");E&&(M.addEventListener("blur",()=>m(M,"parent-name-error",h)),H.addEventListener("blur",()=>m(H,"student-name-error",h)),D.addEventListener("blur",()=>m(D,"phone-number-error",re)),P.addEventListener("change",()=>m(P,"class-apply-error",h)),E.addEventListener("submit",async e=>{e.preventDefault();const s=m(M,"parent-name-error",h),o=m(H,"student-name-error",h),a=m(D,"phone-number-error",re),n=m(P,"class-apply-error",h);if(!(s&&o&&a&&n)){S.style.display="flex",W.style.display="none",S.scrollIntoView({behavior:"smooth",block:"nearest"});return}const t=document.getElementById("enquiry-email"),r={parentName:M.value.trim(),studentName:H.value.trim(),phoneNumber:D.value.trim(),email:t?t.value.trim():"",classApply:P.value,message:document.getElementById("message").value.trim()},c=E.querySelector('button[type="submit"]'),d=c?c.textContent:"Submit";c&&(c.textContent="Submitting Enquiry..."),S.style.display="none",E.style.opacity="0.4";const f=E.elements;for(let u=0;u<f.length;u++)f[u].disabled=!0;try{const v=await(await fetch("/api/enquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(v.success)E.style.display="none",W.style.display="flex",W.scrollIntoView({behavior:"smooth",block:"nearest"});else throw new Error(v.message||"Submission rejected by server.")}catch(u){console.error("Enquiry API submission error:",u),E.style.opacity="1",c&&(c.textContent=d);for(let v=0;v<f.length;v++)f[v].disabled=!1;S.querySelector("p").textContent=u.message||"There was a connection issue. Please try again.",S.style.display="flex",S.scrollIntoView({behavior:"smooth",block:"nearest"})}}));const x=document.getElementById("contact-form"),N=document.getElementById("contact-name-input"),Re=document.getElementById("contact-email-input"),ze=document.getElementById("contact-phone-input"),Fe=document.getElementById("contact-subject-input"),j=document.getElementById("contact-message-input"),Y=document.getElementById("contact-success-banner"),$=document.getElementById("contact-error-banner");x&&(N.addEventListener("blur",()=>m(N,"contact-name-error",h)),j.addEventListener("blur",()=>m(j,"contact-message-error",h)),x.addEventListener("submit",async e=>{e.preventDefault();const s=m(N,"contact-name-error",h),o=m(j,"contact-message-error",h);if(!(s&&o)){$.style.display="flex",Y.style.display="none",$.scrollIntoView({behavior:"smooth",block:"nearest"});return}const a={name:N.value.trim(),email:Re.value.trim(),phone:ze.value.trim(),subject:Fe.value.trim(),message:j.value.trim()},n=x.querySelector('button[type="submit"]'),t=n?n.textContent:"Send";n&&(n.textContent="Sending Message..."),$.style.display="none",x.style.opacity="0.4";const r=x.elements;for(let c=0;c<r.length;c++)r[c].disabled=!0;try{const d=await(await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json();if(d.success)x.style.display="none",Y.style.display="flex",Y.scrollIntoView({behavior:"smooth",block:"nearest"});else throw new Error(d.message||"Submission rejected by server.")}catch(c){console.error("Contact API submission error:",c),x.style.opacity="1",n&&(n.textContent=t);for(let d=0;d<r.length;d++)r[d].disabled=!1;$.querySelector("p").textContent=c.message||"There was a connection issue. Please try again.",$.style.display="flex",$.scrollIntoView({behavior:"smooth",block:"nearest"})}})),document.querySelectorAll(".faq-trigger").forEach(e=>{e.addEventListener("click",()=>{const s=e.parentElement,o=s.querySelector(".faq-content"),a=s.classList.contains("open");document.querySelectorAll(".faq-item").forEach(n=>{n.classList.remove("open"),n.querySelector(".faq-trigger").setAttribute("aria-expanded","false"),n.querySelector(".faq-content").style.maxHeight="0"}),a?(s.classList.remove("open"),e.setAttribute("aria-expanded","false"),o.style.maxHeight="0"):(s.classList.add("open"),e.setAttribute("aria-expanded","true"),o.style.maxHeight=o.scrollHeight+"px")})}),He()});function l(g){return g?g.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}window.toggleLeaderMessage=function(g){const q=g.closest(".leader-card");if(!q)return;const y=q.querySelector(".leader-message-full");if(!y)return;y.style.display==="none"||!y.style.display?(y.style.display="block",g.textContent="Read Less"):(y.style.display="none",g.textContent="Read More")};
