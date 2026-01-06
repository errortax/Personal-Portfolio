// Theme toggle and small UI helpers
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function setTheme(t){
  if(t === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', t);
  if(themeToggle) themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
}

// Initialize
const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(saved);

if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href === '#') return;
    const el = document.querySelector(href);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  })
});

// -------- Profile photo upload helper --------
const photoUpload = document.getElementById('photo-upload');
const profileImg = document.getElementById('profile-img');
const avatarFallback = document.getElementById('avatar-fallback');

if(photoUpload){
  photoUpload.addEventListener('change', (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      profileImg.src = reader.result;
      profileImg.style.display = 'block';
      if(avatarFallback) avatarFallback.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });
}

// -------- Activities cards / modal --------
const cards = document.querySelectorAll('.card');
const modal = document.getElementById('card-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');

function openModal(title, body){
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
}

cards.forEach(card=>{
  card.addEventListener('click', (e)=>{
    // If the user clicked a real link inside the card, let the anchor handle navigation.
    if(e.target.closest('a')) return;

    const page = card.getAttribute('data-page');
    if(page){
      // navigate to full activity/expertise page
      window.location.href = page;
      return;
    }
    const title = card.getAttribute('data-title') || 'Activity';
    const story = card.getAttribute('data-story') || '';
    openModal(title, story);
  });
});

modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);
document.addEventListener('keydown',(e)=>{ if(e.key === 'Escape') closeModal(); });

// -------- Graceful card image loader --------
function loadCardImages(){
  // look for any element with a data-img attribute (both .project and .card)
  document.querySelectorAll('[data-img]').forEach(el=>{
    const src = el.getAttribute('data-img');
    if(!src) return;
    const media = el.querySelector('.card-media');
    if(!media) return;

    const img = new Image();
    img.className = 'card-img';
    img.alt = el.getAttribute('data-title') || (el.querySelector('h4') && el.querySelector('h4').textContent) || '';
    img.onload = ()=>{
      // append only after successful load to avoid broken-image icons
      media.appendChild(img);
      el.classList.add('has-image');
    };
    img.onerror = ()=>{
      // leave existing gradient fallback in place
    };
    img.src = src;
  });
}

// run after DOM ready; if script executes after DOM is parsed this runs immediately
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadCardImages);
else loadCardImages();

// -------- Expertise slider behavior (news-plate mode) --------
const expertiseStage = document.getElementById('expertise-stage');
// Defensive: ensure the expertise stage is interactive on initial load so links are clickable
if(expertiseStage) expertiseStage.classList.add('active');
const sliderTrack = document.querySelector('.slider-track');
const sliderViewport = document.querySelector('.slider-viewport');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let slides = [];
let currentIndex = 0;
if(sliderTrack && sliderViewport){
  slides = Array.from(sliderTrack.querySelectorAll('.project'));

  const computeWidth = () => {
    // width available inside viewport container
    return sliderViewport.getBoundingClientRect().width;
  };

  function scrollToIndex(idx, smooth = true){
    idx = Math.max(0, Math.min(slides.length - 1, idx));
    currentIndex = idx;
    const w = computeWidth();
    const gap = parseInt(getComputedStyle(sliderTrack).gap || 24, 10) || 24;
    const x = idx * (w + gap);
    sliderViewport.scrollTo({left: x, behavior: smooth ? 'smooth' : 'auto'});
  }

  prevBtn?.addEventListener('click', ()=>{ scrollToIndex(currentIndex - 1); });
  nextBtn?.addEventListener('click', ()=>{ scrollToIndex(currentIndex + 1); });

  // drag to scroll for touch/mouse (free dragging but snap back on release)
  let isDown = false, startX = 0, scrollLeft = 0;
  sliderViewport.addEventListener('pointerdown', (e)=>{
    isDown = true; sliderTrack.classList.add('is-dragging'); startX = e.clientX; scrollLeft = sliderViewport.scrollLeft; sliderViewport.setPointerCapture(e.pointerId);
  });
  sliderViewport.addEventListener('pointermove', (e)=>{
    if(!isDown) return; const x = e.clientX; const walk = startX - x; sliderViewport.scrollLeft = scrollLeft + walk;
  });
  sliderViewport.addEventListener('pointerup', (e)=>{ 
    isDown = false; sliderTrack.classList.remove('is-dragging'); 
    sliderViewport.releasePointerCapture(e.pointerId);
    // snap to nearest
    const w = computeWidth(); const gap = parseInt(getComputedStyle(sliderTrack).gap || 24, 10) || 24;
    const idx = Math.round(sliderViewport.scrollLeft / (w + gap));
    scrollToIndex(idx);
  });
  sliderViewport.addEventListener('pointercancel', ()=>{ isDown = false; sliderTrack.classList.remove('is-dragging'); });

  // respond to resize to keep index aligned
  window.addEventListener('resize', ()=>{ scrollToIndex(currentIndex, false); });

  // wheel-based navigation when the stage is active: one plate per wheel action
  let wheelLocked = false;
  function onWheel(e){
    if(!expertiseStage?.classList.contains('active')) return;
    if(Math.abs(e.deltaY) < 6) return; // treat small moves as scroll
    e.preventDefault();
    if(wheelLocked) return;
    wheelLocked = true;
    if(e.deltaY > 0) scrollToIndex(currentIndex + 1); else scrollToIndex(currentIndex - 1);
    setTimeout(()=>{ wheelLocked = false; }, 450);
  }
  // attach a passive false listener on the slider's parent to intercept wheel
  sliderViewport.closest('.expertise-pin')?.addEventListener('wheel', onWheel, {passive: false});
}

// Show/hide the expertise-stage when user scrolls to it (appear while in view)
if(expertiseStage && 'IntersectionObserver' in window){
  const stageObserver = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting && en.intersectionRatio > 0.35){
        expertiseStage.classList.add('active');
      } else {
        expertiseStage.classList.remove('active');
      }
    });
  }, {threshold: [0, 0.15, 0.35, 0.6]});
  stageObserver.observe(expertiseStage);
}

// Defensive click handler for expertise project cards: ensure clicking the tile navigates
document.querySelectorAll('.project.card').forEach(card => {
  try { card.style.cursor = 'pointer'; } catch(e) {}
  card.addEventListener('click', (e) => {
    // if the click started on an anchor, let the anchor handle navigation
    if(e.target.closest && e.target.closest('a')) return;
    const page = card.dataset.page || card.getAttribute('data-page');
    if(!page) return;
    // normalize leading slash so file:// tests still work
    const target = page.startsWith('/') ? page.slice(1) : page;
    window.location.href = target;
  });
});

