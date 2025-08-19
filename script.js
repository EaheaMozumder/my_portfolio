// ========== Dark/Light Mode ========== //
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const THEME_KEY = 'portfolio-theme';

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  themeIcon.textContent = theme === 'light' ? '🌞' : '🌙';
}
function toggleTheme() {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
}
themeToggle.addEventListener('click', toggleTheme);

(function () {
  const saved = localStorage.getItem(THEME_KEY);
  setTheme(saved === 'light' ? 'light' : 'dark');
})();

// ========== Typewriter Animation ========== //
const typewriter = document.getElementById('typewriter');
const roles = [
  'Web Developer',
  'Data Science Enthusiast',
  'Designer',
  'UI/UX Lover'
];
let twRole = 0, twIdx = 0, twDel = false;
function typeWriterAnim() {
  const current = roles[twRole];
  if (!twDel) {
    twIdx++;
    typewriter.textContent = current.slice(0, twIdx) + (twIdx % 2 ? '|' : '');
    if (twIdx === current.length) setTimeout(() => twDel = true, 900);
  } else {
    twIdx--;
    typewriter.textContent = current.slice(0, twIdx) + (twIdx % 2 ? '|' : '');
    if (twIdx === 0) {
      twDel = false;
      twRole = (twRole + 1) % roles.length;
      setTimeout(typeWriterAnim, 400);
      return;
    }
  }
  setTimeout(typeWriterAnim, twDel ? 45 : 80);
}
typeWriterAnim();

// ========== Hero Canvas Background (Particles/Stars) ========== //
const heroCanvas = document.getElementById('hero-bg');
function resizeCanvas() {
  heroCanvas.width = window.innerWidth;
  heroCanvas.height = heroCanvas.parentElement.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const ctx = heroCanvas.getContext('2d');
const PARTICLES = 90;
let particles = [];
function randomColor() {
  const colors = ['#7f5af0', '#2cb67d', '#fff', '#22223b'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLES; i++) {
    particles.push({
      x: Math.random() * heroCanvas.width,
      y: Math.random() * heroCanvas.height,
      r: Math.random() * 1.6 + 1.2,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
      color: randomColor()
    });
  }
}
function drawParticles() {
  ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.7;
    ctx.fill();
  }
  connectParticles();
}
function connectParticles() {
  for (let i = 0; i < PARTICLES; i++) {
    for (let j = i + 1; j < PARTICLES; j++) {
      let a = particles[i], b = particles[j];
      let dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 90) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(127,90,240,0.13)';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
      }
    }
  }
}
function updateParticles() {
  for (let p of particles) {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > heroCanvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > heroCanvas.height) p.dy *= -1;
  }
}
function animateParticles() {
  drawParticles();
  updateParticles();
  requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// ========== Custom Cursor Effect ========== //
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// ========== CTA Button Scroll ========== //
document.getElementById('view-work-btn').addEventListener('click', () => {
  document.getElementById('projects').scrollIntoView({behavior: 'smooth'});
});

// ========== Skills Progress Animation ========== //
function animateSkillBars() {
  document.querySelectorAll('.progress').forEach(bar => {
    const val = bar.getAttribute('data-progress');
    bar.style.width = val + '%';
  });
}
function skillsInView(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBars();
      observer.disconnect();
    }
  });
}
const skillsSection = document.querySelector('.skills-section');
const skillsObs = new IntersectionObserver(skillsInView, { threshold: 0.4 });
skillsObs.observe(skillsSection);

// ========== Skill Card Flip ========== //
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keypress', e => {
    if (e.key === 'Enter' || e.key === ' ') card.classList.toggle('flipped');
  });
});

// ========== Radial Chart with Canvas API ========== //
function drawRadialChart() {
  const canvas = document.getElementById('skills-radial');
  const ctx = canvas.getContext('2d');
  let size = Math.min(canvas.width, canvas.height);
  let skills = [
    {name:'HTML', val:95, color:'#7f5af0'},
    {name:'CSS', val:90, color:'#2cb67d'},
    {name:'JS', val:85, color:'#e4572e'},
    {name:'Python', val:80, color:'#f4d35e'}
  ];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(size/2, size/2);
  let start = -Math.PI/2;
  let radius = size/2 - 22;
  skills.forEach(skill => {
    let end = start + skill.val/100 * 2*Math.PI;
    ctx.beginPath();
    ctx.arc(0,0,radius,start,end,false);
    ctx.strokeStyle = skill.color;
    ctx.lineWidth = 18;
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    start = end;
  });
  skills.forEach((skill, i) => {
    let angle = (-Math.PI/2) + (skills.slice(0,i).reduce((a,b)=>a+b.val,0)+skill.val/2)/skills.reduce((a,b)=>a+b.val,0)*2*Math.PI;
    let x = Math.cos(angle)*radius*0.74, y = Math.sin(angle)*radius*0.74;
    ctx.fillStyle = skill.color;
    ctx.font = "bold 1.1em Inter";
    ctx.fillText(skill.name, x-24, y+4);
  });
  ctx.restore();
}
function resizeRadialChart() {
  let c = document.getElementById('skills-radial');
  c.width = c.parentElement.offsetWidth;
  c.height = c.parentElement.offsetHeight;
  drawRadialChart();
}
window.addEventListener('resize', resizeRadialChart);
resizeRadialChart();

// ========== Projects Filter ========== //
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    let cat = btn.getAttribute('data-category');
    projectCards.forEach(card => {
      card.style.display = (cat === 'all' || card.getAttribute('data-category') === cat) ? 'flex' : 'none';
    });
  });
});

// ========== Lazy Load Images ========== //
if ('IntersectionObserver' in window) {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: "100px" });
  imgs.forEach(img => imgObs.observe(img));
}

// ========== Intersection Observer for Fade-in Animations ========== //
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObs = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
fadeEls.forEach(el => fadeObs.observe(el));

// ========== Timeline Smooth Scroll Animation ========== //
// Already handled by fade-in observer

// ========== Contact Form Validation & Simulation ========== //
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  let name = contactForm.name.value.trim();
  let email = contactForm.email.value.trim();
  let msg = contactForm.message.value.trim();
  let valid = true;

  // Name
  if (name.length < 2) {
    setError('name', 'Enter your name');
    valid = false;
  } else {
    setError('name', '');
  }
  // Email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'Invalid email');
    valid = false;
  } else {
    setError('email', '');
  }
  // Message
  if (msg.length < 5) {
    setError('message', 'Message too short');
    valid = false;
  } else {
    setError('message', '');
  }

  if (!valid) return;
  // Simulate async send
  setStatus('Sending...');
  setTimeout(() => {
    if (Math.random() > 0.18) {
      setStatus('Message sent! I’ll get back soon. 😊');
      contactForm.reset();
    } else {
      setStatus('Failed to send, please try again!', true);
    }
  }, 1400);
});
function setError(field, msg) {
  document.getElementById(field + '-error').textContent = msg;
}
function setStatus(msg, fail) {
  let s = document.getElementById('form-status');
  s.textContent = msg;
  s.style.color = fail ? '#e4572e' : 'var(--accent)';
}

// ========== Back to Top Button ========== //
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backBtn.style.display = 'block';
  } else {
    backBtn.style.display = 'none';
  }
});
backBtn.addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});

// ========== Footer Year ========== //
document.getElementById('year').textContent = new Date().getFullYear();
