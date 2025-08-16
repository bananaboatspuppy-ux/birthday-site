// Personalize
const RECIPIENT_NAME = "My Love";   // change name
const CUSTOM_NOTE = "";             // optional message

// Set name (safe to do immediately)
const nameEl = document.getElementById("nameTarget");
if (nameEl) nameEl.textContent = RECIPIENT_NAME;
const noteEl = document.getElementById("note");
if (noteEl && CUSTOM_NOTE) noteEl.textContent = CUSTOM_NOTE;

/* ---------------------------
   Typewriter (starts after intro)
---------------------------- */
function startTypewriter() {
  const typeTarget = document.getElementById("typeTarget");
  if (!typeTarget) return;

  const fullText = typeTarget.getAttribute('data-fulltext') || typeTarget.textContent;
  typeTarget.setAttribute('data-fulltext', fullText); // cache once
  typeTarget.textContent = "";

  let i = 0;
  (function type() {
    if (i <= fullText.length) {
      typeTarget.textContent = fullText.slice(0, i++);
      setTimeout(type, 50);
    }
  })();
}

function revealHeader() {
  const header = document.querySelector('header');
  if (header) {
    header.classList.add('revealed');      // for fade-in if you added CSS
    header.classList.remove('hidden-at-start');
  }
}

/* ---------------------------
   Confetti button
---------------------------- */
function confettiBurst() {
  try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch {}
}
const celebrateBtn = document.getElementById("celebrateBtn");
if (celebrateBtn) celebrateBtn.addEventListener("click", confettiBurst);

/* ---------------------------
   Flip cards on click/tap/keyboard
---------------------------- */
document.querySelectorAll('.flip').forEach(flip => {
  flip.setAttribute('tabindex', '0'); // focusable
  flip.addEventListener('click', () => flip.classList.toggle('is-flipped'));
  flip.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flip.classList.toggle('is-flipped');
    }
  });
});

/* ---------------------------
   Floating hearts
---------------------------- */
const hearts = document.getElementById('hearts');

function spawnHeart() {
  if (!hearts) return; // guard if container missing
  const h = document.createElement('div');
  h.className = 'heart';

  // random size
  const size = 12 + Math.random() * 18;
  h.style.width = h.style.height = size + 'px';

  // random horizontal position
  h.style.left = Math.random() * 100 + 'vw';
  h.style.bottom = '-20px';

  // random speed
  h.style.animationDuration = (6 + Math.random() * 6) + 's';

  // random color (purple or black)
  const colors = ['#a855f7', '#000000']; // purple & black
  h.style.background = colors[Math.floor(Math.random() * colors.length)];

  hearts.appendChild(h);

  // cleanup
  setTimeout(() => h.remove(), 12000);
}
// spawn every 400ms if container exists
if (hearts) setInterval(spawnHeart, 400);

/* ---------------------------
   Intro / Countdown messages
---------------------------- */
const intro = document.getElementById('intro');
const introText = document.getElementById('introText');

// Customize your messages here:
const INTRO_MESSAGES = [
  "Just a second… 🎁",
  "I made this for you 💖",
  "Because you deserve the cutest surprises ✨",
  "Ready?"
];

// Duration per message (in ms)
const INTRO_DURATION = 1400;

// If you want to disable intro for subsequent visits, flip this to true
const INTRO_ONCE_PER_SESSION = false;

function runIntro(){
  // If intro markup is missing, just reveal & start typewriter
  if (!intro || !introText) {
    revealHeader();
    startTypewriter();
    return;
  }

  // Prevent scroll while intro shows
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  let idx = 0, timer;

  const next = () => {
    if (idx >= INTRO_MESSAGES.length) return finish();
    introText.textContent = INTRO_MESSAGES[idx++];
    introText.classList.remove('animating');
    // reflow to restart animation
    void introText.offsetWidth;
    introText.classList.add('animating');
    timer = setTimeout(next, INTRO_DURATION);
  };

  const finish = () => {
    clearTimeout(timer);
    intro.classList.add('hide');
    // allow scroll again
    document.body.style.overflow = prevOverflow || '';

    // reveal header and start typewriter
    revealHeader();
    startTypewriter();

    // little confetti pop at the end
    try { confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } }); } catch {}
  };

  next();
}

// Optionally skip on repeat visits within the same tab
if (INTRO_ONCE_PER_SESSION) {
  if (sessionStorage.getItem('introShown')) {
    if (intro) intro.classList.add('hide');
    revealHeader();
    startTypewriter();
  } else {
    runIntro();
    sessionStorage.setItem('introShown', '1');
  }
} else {
  runIntro();
}
