// --- Dark/Light Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const themeRoot = document.documentElement;
function setTheme(theme) {
  themeRoot.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
function getTheme() {
  return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
themeToggle.addEventListener('click', () => {
  const current = getTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
  // Update icon if you wish
});
setTheme(getTheme());

// --- Intersection Observer for Sections ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: .25 });
document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

// --- Custom Cursor ---
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX-6}px,${e.clientY-6}px)`;
});

// --- Back-to-Top Button ---
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 300);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({top:0,behavior:'smooth'});
});

// --- Typewriter Animation ---
const roles = [
  "Web Developer",
  "Data Science Enthusiast",
  "Designer"
];
let twIndex = 0, twPos = 0, twReverse = false;
const twEl = document.getElementById('typewriter-roles');
function typewriter() {
  if (!twEl) return;
  let current = roles[twIndex];
  if (!twReverse) {
    twPos++;
    if (twPos > current.length + 6) twReverse = true;
  } else {
    twPos--;
    if (twPos === 0) {
      twReverse = false;
      twIndex = (twIndex+1)%roles.length;
    }
  }
  let show = current.substring(0, Math.min(twPos, current.length));
  twEl.textContent = show + (twPos % 2 === 0 ? '|' : '');
  setTimeout(typewriter, twReverse ? 30 : 90);
}
typewriter();

// --- Animated Hero Background (Canvas Particles/Stars) ---
const heroBg = document.getElementById('hero-bg');
let w = window.innerWidth, h = window.innerHeight;
function resizeCanvas() {
  heroBg.width = w = window.innerWidth;
  heroBg.height = h = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const stars = Array.from({length:80}, (_,i)=>({
  x: Math.random()*w,
  y: Math.random()*h,
  r: Math.random()*1.8+0.7,
  dx: (Math.random()-0.5)*0.25,
  dy: (Math.random()-0.5)*0.25
}));
function drawStars(ctx) {
  ctx.clearRect(0,0,w,h);
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(180,180,255,${0.7 + Math.random()*0.3})`;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 8;
    ctx.fill();
    star.x += star.dx; star.y += star.dy;
    if (star.x < 0 || star.x > w) star.dx *= -1;
    if (star.y < 0 || star.y > h) star.dy *= -1;
  }
}
function animateHeroBg() {
  const ctx = heroBg.getContext('2d');
  drawStars(ctx);
  requestAnimationFrame(animateHeroBg);
}
animateHeroBg();

// --- Skills Progress Bars Animation on Viewport ---
const skillLevels = {HTML:90,CSS:86,JavaScript:82,Python:78};
const skillBars = document.querySelectorAll('.bar');
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillBars.forEach(bar => {
        let skill = bar.dataset.skill;
        let fill = bar.querySelector('.bar-fill');
        fill.style.width = skillLevels[skill]+'%';
      });
      skillsObserver.disconnect();
    }
  });
}, {threshold: .5});
skillBars.forEach(bar => skillsObserver.observe(bar));

// --- Skill Card Flip ---
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') card.classList.toggle('flipped');
  });
  card.addEventListener('blur', () => card.classList.remove('flipped'));
});

// --- Radial Chart (Canvas API) ---
function drawRadialChart() {
  const canvas = document.getElementById('skills-radial-chart');
  const ctx = canvas.getContext('2d');
  const skills = ["HTML","CSS","JavaScript","Python"];
  const values = [90,86,82,78];
  const colors = ['#6c63ff','#4f45e4','#b8b5ff','#5142d8'];
  const center = 110, radius = 70;
  ctx.clearRect(0,0,220,220);

  // Draw axes
  for(let i=0;i<skills.length;i++) {
    let angle = (Math.PI*2*i)/skills.length - Math.PI/2;
    let x = center + Math.cos(angle)*radius;
    let y = center + Math.sin(angle)*radius;
    ctx.beginPath();
    ctx.moveTo(center,center);
    ctx.lineTo(x,y);
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.font = '1rem Inter';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText(skills[i],x,y-8);
  }

  // Draw chart
  ctx.beginPath();
  for(let i=0;i<values.length;i++) {
    let angle = (Math.PI*2*i)/values.length - Math.PI/2;
    let r = radius * (values[i]/100);
    let x = center + Math.cos(angle)*r;
    let y = center + Math.sin(angle)*r;
    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(108,99,255,0.18)';
  ctx.strokeStyle = '#6c63ff';
  ctx.lineWidth = 2.5;
  ctx.fill();
  ctx.stroke();
}
drawRadialChart();

// --- Projects Filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', ()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    let cat = btn.dataset.filter;
    projectCards.forEach(card => {
      card.style.display = (cat==='all' || card.dataset.category===cat) ? '' : 'none';
    });
  });
});

// --- Timeline Animation ---
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.15});
timelineItems.forEach(item=>timelineObserver.observe(item));

// --- Contact Form Validation & Submission ---
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e){
  e.preventDefault();
  let valid = true;
  let name = contactForm.name.value.trim();
  let email = contactForm.email.value.trim();
  let message = contactForm.message.value.trim();
  // Name
  const nameError = document.getElementById('name-error');
  if(name.length<2){
    valid=false; nameError.textContent='Enter your name.'; nameError.style.display='block';
  } else { nameError.textContent=''; nameError.style.display='none'; }
  // Email
  const emailError = document.getElementById('email-error');
  if(!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)){
    valid=false; emailError.textContent='Enter a valid email.'; emailError.style.display='block';
  } else { emailError.textContent=''; emailError.style.display='none'; }
  // Message
  const msgError = document.getElementById('message-error');
  if(message.length<5){
    valid=false; msgError.textContent='Message too short.'; msgError.style.display='block';
  } else { msgError.textContent=''; msgError.style.display='none'; }

  const status = document.getElementById('form-status');
  if(!valid){ status.textContent='Please fix errors.'; status.style.color='#e23a41'; return; }
  status.textContent='Sending...'; status.style.color='var(--primary)';
  setTimeout(()=>{
    if(Math.random()>0.15){
      status.textContent='Message sent! Thank you 🙌';
      status.style.color='#27ae60';
      contactForm.reset();
    } else {
      status.textContent='Oops, something went wrong.';
      status.style.color='#e23a41';
    }
  },1200);
});

// --- Lazy Load Images (Polyfill for older browsers) ---
if('loading' in HTMLImageElement.prototype){
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {});
} else {
  // Simple JS fallback (IntersectionObserver)
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    const imgObs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          img.src = img.dataset.src || img.src;
          imgObs.disconnect();
        }
      });
    });
    imgObs.observe(img);
  });
}
