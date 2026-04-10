/**
 * script.js  —  Ayush Vishwakarma Portfolio
 *
 * Sections:
 *  1. Live Clock
 *  2. Rotating Title
 *  3. Dark Mode Toggle
 *  4. Resources Panel Toggle
 *  5. Download Notification
 *  6. Typewriter Effect (Coming Soon)
 *  7. AI Chat Box
 *  8. AI Chat Bot Logic (keyword replies)
 */

/* ============================================================
   1. LIVE CLOCK
   Updates every second in the top-right corner.
============================================================ */
(function initClock() {
  const el = document.getElementById('time-display');
  if (!el) return;

  function tick() {
    el.textContent = new Date().toLocaleTimeString();
  }

  tick();
  setInterval(tick, 1000);
})();


/* ============================================================
   2. ROTATING TITLE
   Cycles through role labels every 2 seconds.
============================================================ */
(function initRotatingTitle() {
  const titles  = ['Web Developer', 'App Developer', 'UI/UX Designer'];
  const titleEl = document.getElementById('loop-title');
  if (!titleEl) return;

  let index = 0;
  titleEl.textContent = titles[0];

  setInterval(() => {
    index = (index + 1) % titles.length;
    titleEl.textContent = titles[index];
  }, 2000);
})();


/* ============================================================
   3. DARK MODE TOGGLE
   Persists preference to localStorage so it survives refresh.
============================================================ */
function toggleDarkMode() {
  const body      = document.body;
  const isDark    = body.classList.toggle('dark-mode');
  const nameSpans = document.querySelectorAll('.rgb-name span');

  // Stop/restart the RGB animation depending on mode
  nameSpans.forEach(span => {
    if (isDark) {
      span.style.animation = 'none';
      span.style.color     = '#ffffff';
    } else {
      span.style.animation = '';
      span.style.color     = '';
    }
  });

  // Persist preference
  localStorage.setItem('darkMode', isDark ? 'on' : 'off');
}

// Restore dark mode on page load
(function restoreDarkMode() {
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
    // Apply white colour to name letters immediately
    document.querySelectorAll('.rgb-name span').forEach(span => {
      span.style.animation = 'none';
      span.style.color     = '#ffffff';
    });
  }
})();


/* ============================================================
   4. RESOURCES PANEL TOGGLE
   Shows/hides the PDF download section with ARIA updates.
============================================================ */
function togglePDFs() {
  const panel  = document.getElementById('pdf-section');
  const btn    = document.getElementById('toggle-resources-btn');
  if (!panel || !btn) return;

  const isOpen = panel.style.display === 'block';

  panel.style.display = isOpen ? 'none' : 'block';
  panel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
  btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
}


/* ============================================================
   5. DOWNLOAD NOTIFICATION
   Shows a brief "wait…" then "done!" toast on each download.
   Called via onclick="notifyDownload(this)" on anchor tags.
============================================================ */
function notifyDownload(linkEl) {
  const toast = document.getElementById('notify-toast');
  if (!toast) return;

  toast.textContent    = '⏳ Thoda wait kr bhai…';
  toast.style.display  = 'block';

  // Small delay so the toast is visible before the download begins
  setTimeout(() => {
    // Programmatically trigger the download
    const a       = document.createElement('a');
    a.href        = linkEl.href;
    a.download    = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.textContent = '✅ Ho gaya bhai!';

    // Auto-hide after 2 s
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
  }, 1000);
}


/* ============================================================
   6. TYPEWRITER EFFECT  (Coming Soon notice in Short Notes)
   Loops through messages with a typing + erasing animation.
============================================================ */
(function initTypewriter() {
  const messages   = ['Coming Soon…', '10 October', 'Wait a few days'];
  const speed      = 150;   // ms per character (typing)
  const eraseSpeed = 90;    // ms per character (erasing)
  const holdDelay  = 1500;  // ms to hold full text before erasing
  const loopDelay  = 900;   // ms before starting next message

  let msgIndex  = 0;
  let charIndex = 0;
  let erasing   = false;

  const target = document.getElementById('typewriter-el');
  if (!target) return;

  function type() {
    const current = messages[msgIndex];

    if (erasing) {
      // Remove last character
      target.textContent = current.substring(0, --charIndex);

      if (charIndex < 0) {
        erasing   = false;
        charIndex = 0;
        msgIndex  = (msgIndex + 1) % messages.length;
        setTimeout(type, loopDelay);
      } else {
        setTimeout(type, eraseSpeed);
      }

    } else {
      // Add next character
      target.textContent = current.substring(0, ++charIndex);

      if (charIndex <= current.length) {
        setTimeout(type, speed);
      } else {
        // Hold, then start erasing
        erasing = true;
        setTimeout(type, holdDelay);
      }
    }
  }

  // Start after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', type);
  } else {
    type();
  }
})();


/* ============================================================
   7. AI CHAT BOX  — open / close
============================================================ */
function toggleAIChat() {
  const box = document.getElementById('ai-chat-box');
  const fab = document.getElementById('chat-fab');
  if (!box) return;

  const isOpen = box.style.display === 'flex';

  box.style.display          = isOpen ? 'none' : 'flex';
  box.style.flexDirection    = 'column';
  box.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
  if (fab) fab.setAttribute('aria-expanded', isOpen ? 'false' : 'true');

  // Auto-focus input when opening
  if (!isOpen) {
    const input = document.getElementById('chat-input');
    if (input) setTimeout(() => input.focus(), 100);
  }
}

/* Send a user message and get a bot reply */
function sendAIMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const userText = input.value.trim();
  if (!userText) return;

  appendChatMessage(userText, 'user');
  input.value = '';

  // Simulate a short thinking delay
  setTimeout(() => {
    const reply = getBotReply(userText);
    appendChatMessage(reply, 'bot');
  }, 800);
}

/* Append a message bubble to the chat window */
function appendChatMessage(text, type) {
  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return;

  const bubble = document.createElement('div');
  bubble.className  = `chat-msg chat-msg--${type}`;
  bubble.textContent = text;
  messagesEl.appendChild(bubble);

  // Auto-scroll to latest message
  messagesEl.scrollTop = messagesEl.scrollHeight;
}


/* ============================================================
   8. AI CHAT BOT LOGIC  — keyword-based replies
   Add or edit keywords/replies here without touching HTML/CSS.
============================================================ */
function getBotReply(input) {
  const msg = input.toLowerCase().trim();

  // ── Special admin greeting
  if (msg.includes('hello sir')) {
    return '🔐 Welcome Admin Sir — Access Granted.\nYou are logged in as Admin.';
  }

  // ── Emoji trigger
  if (msg.includes('😁')) {
    return '🎉 Welcome Sir!\nThis website is officially open only for you 🧚.';
  }

  // ── Telegram guide
  if (msg.includes('telegram')) {
    return [
      '📩 Telegram par message kaise bheje (step-by-step):',
      '1) Telegram app kholo (ya Play Store se install karo).',
      '2) Search bar me "@JoyAyush" type karo.',
      '3) Profile open karke "Message" par tap karo.',
      '4) Apna message likho aur Send kar do.',
      '',
      '🔗 Direct link: https://t.me/JoyAyush'
    ].join('\n');
  }

  // ── Live chat / Tawk guide
  if (
    msg.includes('tawk')      ||
    msg.includes('support')   ||
    msg.includes('live chat') ||
    msg.includes('contact admin') ||
    msg.includes('helpdesk')
  ) {
    return [
      '🟢 Live Support kaise use kare:',
      '',
      '1) Screen ke bottom-right me chat icon tap karo.',
      '2) Chat box open hote hi message type karo.',
      '3) Admin online ho → turant reply milega.',
      '4) Admin offline ho → message save ho jayega.',
      '',
      '💡 Tip: Apna naam + issue likho — fast reply milti hai.'
    ].join('\n');
  }

  // ── Online time / availability
  if (msg.includes('time') || msg.includes('online') || msg.includes('aao')) {
    return '⏰ Admin Online Time → 9:00 PM – 11:00 PM.';
  }

  // ── Default fallback
  return (
    'Dear User,\n\nOur website is currently temporarily closed for important updates.\n' +
    'It will reopen on 1 March 2026.\n\n— Team Web'
  );
}
