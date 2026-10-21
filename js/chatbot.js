/* =========================================================
   Dicky Afriza — AI Personal Assistant Chatbot
   Dual-Engine: Smart Offline Knowledge Base + Google Gemini AI
   ========================================================= */
(async () => {
  'use strict';

  /* ---------- load Google GenAI SDK from CDN (optional enhancement) ---------- */
  let GoogleGenAI = null;
  try {
    const genaiModule = await import('https://cdn.jsdelivr.net/npm/@google/genai/+esm');
    GoogleGenAI = genaiModule?.GoogleGenAI || null;
  } catch (e) {
    // Silent fail; REST fallback will be used if API key is provided
  }

  /* ---------- personal context & knowledge base ---------- */
  const DICKY_CONTEXT = `
You are Dicky's personal AI assistant on his portfolio website. Your name is "Dicky AI".
You answer questions about Dicky Afriza in a friendly, helpful, and concise manner.
Use a casual but professional tone. You may answer in Indonesian or English depending on the user's language.

PERSONAL INFO:
- Full name: Muhammad Dicky Afriza
- Location: Semarang, Central Java, Indonesia
- Education: Informatics Engineering (S1) at Dian Nuswantoro University (UDINUS), Semarang
- Focus: Web Development (Frontend & Full Stack)
- Personality: Detail-oriented, thoughtful, passionate about clean code and interactive UX

SKILLS & TECH STACK:
- Frontend: HTML5, CSS3/SCSS, JavaScript (ES6+), React, Tailwind CSS
- Backend: PHP, Laravel, Python
- Database: MySQL
- Tools: Git & GitHub, Figma, Postman, Vite
- Interests: Clean architecture, typography, micro-interactions, responsive design

KEY PROJECTS:
1. IBS MAN Demak — Comprehensive school website with clear info architecture and news portal
2. Hijau Semesta Maju — Modern corporate site emphasizing trust and professional branding
3. Aeroterra — Interactive tech platform presenting drone and environmental data clearly
4. Klasifikasi Anomali — Machine learning experiment for anomaly classification with web UI
5. E-Commerce & POS Systems — Full-stack web apps with Laravel backends, MySQL, and role-based access

WORK & FREELANCE:
- Open for freelance web development, redesigns, and custom web applications
- Prefers scoping out requirements via the website contact form before quoting rates
- Works remotely with clients worldwide

SOCIAL & CONTACT:
- GitHub: https://github.com/dickyafriza
- Instagram: https://instagram.com/dickyafrz
- YouTube: https://www.youtube.com/channel/UC7xRxaGHb1D309DKP31NS7w
- Direct contact: through the contact form on this website

RULES:
- Answer concisely (2-4 sentences usually)
- Be warm and welcoming
- Suggest checking the Projects or Contact section when appropriate
`;

  /* ---------- intelligent offline knowledge engine ---------- */
  function getOfflineResponse(query) {
    const q = query.toLowerCase().trim();

    // Salam / Greetings
    if (/^(halo|hai|hi|hey|hello|pagi|siang|sore|malam|assalam|permisi|oy|oi)/i.test(q)) {
      return 'Halo! 👋 Senang bertemu denganmu. Saya **Dicky AI**, asisten digital di portofolio Dicky Afriza.\n\nAda yang ingin kamu ketahui tentang keahlian, pengalaman, atau project yang pernah dibuat Dicky?';
    }

    // Profil / Siapa Dicky
    if (
      /(siapa|who|tentang|profil|biodata|latar belakang|background|about)/i.test(q) &&
      /(dicky|dia|kamu|author|creator|pemilik)/i.test(q) ||
      q === 'siapa dicky?' || q === 'siapa dicky'
    ) {
      return '**Muhammad Dicky Afriza** adalah seorang Web Developer & Creative Technologist asal Semarang, Indonesia. Saat ini sedang menempuh studi S1 Teknik Informatika di **Universitas Dian Nuswantoro (UDINUS)**.\n\nDicky fokus merancang dan membangun website yang cepat, estetik, dan memiliki pengalaman pengguna yang menyenangkan.';
    }

    // Skills & Teknologi
    if (/(skill|keahlian|kemampuan|stack|teknologi|bahasa|framework|tools|kuasai|frontend|backend|database)/i.test(q)) {
      return 'Berikut ringkasan keahlian utama Dicky:\n\n' +
        '• **Frontend**: HTML5, CSS3, JavaScript (ES6+), React, Tailwind CSS\n' +
        '• **Backend**: PHP, Laravel, Python, RESTful API\n' +
        '• **Database**: MySQL\n' +
        '• **Tools & Workflow**: Git/GitHub, Figma, VS Code\n\n' +
        'Dicky sangat memperhatikan *clean code*, aksesibilitas, serta detail micro-interaction!';
    }

    // Projects & Portofolio
    if (/(project|proyek|portofolio|portfolio|karya|hasil kerja|showcase|aplikasi|app|web apa)/i.test(q)) {
      return 'Dicky telah mengerjakan berbagai proyek web (9+ projects), beberapa di antaranya:\n\n' +
        '1. **IBS MAN Demak** — Website sekolah dengan struktur data rapi dan portal informasi publik.\n' +
        '2. **Hijau Semesta Maju** — Website profil korporat modern untuk membangun kepercayaan klien.\n' +
        '3. **Aeroterra** — Platform web teknologi dengan visual interaktif dan elegan.\n' +
        '4. **Klasifikasi Anomali** — Eksperimen AI/ML klasifikasi dengan antarmuka web interaktif.\n' +
        '5. **Sistem Web & POS** — Aplikasi berbasis Laravel dan MySQL.\n\n' +
        'Kamu bisa melihat tampilan dan detailnya langsung di bagian **Selected Works** di website ini!';
    }

    // Kontak & Media Sosial
    if (/(kontak|hubungi|contact|email|reach|sosmed|social|instagram|github|linkedin|youtube|whatsapp|wa|telepon|hp)/i.test(q)) {
      return 'Kamu bisa terhubung langsung dengan Dicky melalui:\n\n' +
        '• **GitHub**: [github.com/dickyafriza](https://github.com/dickyafriza)\n' +
        '• **Instagram**: [@dickyafrz](https://instagram.com/dickyafrz)\n' +
        '• **YouTube**: [Channel YouTube Dicky](https://www.youtube.com/channel/UC7xRxaGHb1D309DKP31NS7w)\n' +
        '• **Pesan Langsung**: Bisa langsung kirim pesan melalui **Formulir Kontak** di bagian bawah halaman ini!';
    }

    // Freelance / Tarif / Biaya / Kerja sama
    if (/(freelance|harga|rate|biaya|tarif|jasa|sewa|kerja sama|hire|bikin web|pesan web|project baru|tersedia|available)/i.test(q)) {
      return 'Dicky terbuka untuk peluang **freelance, kolaborasi, dan pembuatan website kustom**! ✨\n\nUntuk biaya atau rate ditentukan berdasarkan cakupan dan kebutuhan proyek. Dicky selalu mengutamakan diskusi awal agar estimasinya tepat sasaran. Silakan tinggalkan pesan melalui **Formulir Kontak** di website ini!';
    }

    // Pendidikan / Kuliah / Kampus
    if (/(kuliah|sekolah|kampus|udinus|pendidikan|universitas|jurusan|semester|belajar|mahasiswa)/i.test(q)) {
      return 'Dicky saat ini menempuh pendidikan S1 program studi **Teknik Informatika** di **Universitas Dian Nuswantoro (UDINUS)**, Semarang. Fokus studinya mencakup rekayasa perangkat lunak, sistem basis data, dan pengembangan web modern.';
    }

    // Lokasi / Domisili
    if (/(tinggal|lokasi|asal|dimana|semarang|kota|domisili|location)/i.test(q)) {
      return 'Dicky berdomisili di **Semarang, Jawa Tengah, Indonesia**. Namun untuk pekerjaan pengembangan website, Dicky terbiasa bekerja secara *remote* dengan klien dari berbagai tempat!';
    }

    // Terima kasih / Thanks
    if (/(makasih|terima kasih|thank|thanks|arigato|matur nuwun|sip|oke|mantap|keren)/i.test(q)) {
      return 'Sama-sama! Senang bisa membantu. Jika ada hal lain yang ingin kamu tanyakan atau butuh diskusi project web, jangan ragu untuk bertanya lagi ya! 😊';
    }

    // Fallback cerdas
    return 'Pertanyaan menarik! Sebagai asisten digital Dicky, saya siap membantu menjawab seputar profil, skill (Laravel, React, dsb), karya project, serta ketersediaan freelance Dicky.\n\nKamu juga bisa langsung berdiskusi dengan Dicky melalui **Formulir Kontak** di bagian bawah halaman ini 🚀';
  }

  /* ---------- state ---------- */
  const STORAGE_KEY = 'dicky_gemini_api_key';
  let chatHistory = [];
  let isOpen = false;
  let isTyping = false;

  function getSavedApiKey() {
    return (localStorage.getItem(STORAGE_KEY) || '').trim();
  }

  /* ---------- build DOM ---------- */
  const chatRoot = document.createElement('div');
  chatRoot.id = 'chatbot';
  chatRoot.innerHTML = `
    <button class="cb-fab" id="cbFab" aria-label="Buka asisten virtual Dicky">
      <svg class="cb-fab-icon cb-fab-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
      </svg>
      <svg class="cb-fab-icon cb-fab-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span class="cb-fab-pulse"></span>
    </button>

    <div class="cb-window" id="cbWindow">
      <div class="cb-header">
        <div class="cb-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <div class="cb-header-info">
          <span class="cb-header-name">Dicky AI</span>
          <span class="cb-header-status" id="cbHeaderStatus"><span class="cb-dot"></span>Portfolio Assistant</span>
        </div>
        <div class="cb-header-actions">
          <button class="cb-header-btn" id="cbHeaderKey" title="Atur Gemini API Key (Opsional)" aria-label="Pengaturan API Key">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 2l-2 2m-1.5 6.1L10 17.6V20h2.4l7.5-7.5M16 5l3 3"/>
              <circle cx="7.5" cy="16.5" r="5.5"/>
            </svg>
          </button>
          <button class="cb-header-close" id="cbHeaderClose" aria-label="Tutup obrolan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <div class="cb-body" id="cbBody">
        <div class="cb-messages" id="cbMessages"></div>
      </div>

      <div class="cb-footer" id="cbFooter">
        <div class="cb-suggestions" id="cbSuggestions">
          <button class="cb-sug" data-q="Siapa Dicky Afriza?">🧑‍💻 Siapa Dicky?</button>
          <button class="cb-sug" data-q="Apa saja skill dan teknologi yang dikuasai?">⚡ Skills</button>
          <button class="cb-sug" data-q="Tampilkan project yang pernah dikerjakan">📂 Projects</button>
          <button class="cb-sug" data-q="Bagaimana cara menghubungi Dicky?">📬 Contact</button>
        </div>
        <form class="cb-input-row" id="cbInputForm">
          <input type="text" id="cbInput" placeholder="Tanya tentang Dicky…" autocomplete="off" />
          <button type="submit" id="cbSendBtn" aria-label="Kirim pesan" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(chatRoot);

  /* ---------- element refs ---------- */
  const fab = document.getElementById('cbFab');
  const win = document.getElementById('cbWindow');
  const messagesEl = document.getElementById('cbMessages');
  const inputForm = document.getElementById('cbInputForm');
  const input = document.getElementById('cbInput');
  const sendBtn = document.getElementById('cbSendBtn');
  const suggestionsEl = document.getElementById('cbSuggestions');
  const headerClose = document.getElementById('cbHeaderClose');
  const headerKeyBtn = document.getElementById('cbHeaderKey');
  const headerStatus = document.getElementById('cbHeaderStatus');

  /* ---------- update header status ---------- */
  function refreshStatus() {
    const hasKey = Boolean(getSavedApiKey());
    if (hasKey) {
      headerStatus.innerHTML = '<span class="cb-dot"></span>Gemini AI Active';
      headerKeyBtn.title = 'Gemini API Key tersimpan (Klik untuk ubah/hapus)';
    } else {
      headerStatus.innerHTML = '<span class="cb-dot"></span>Portfolio Assistant';
      headerKeyBtn.title = 'Tambahkan Google Gemini API Key (Opsional)';
    }
  }
  refreshStatus();

  /* ---------- API key settings prompt ---------- */
  headerKeyBtn.addEventListener('click', () => {
    const current = getSavedApiKey();
    const promptText = current
      ? 'Gemini API Key saat ini sudah tersimpan.\n\nMasukkan API Key baru, atau kosongkan lalu klik OK untuk menghapusnya:'
      : 'Masukkan Google Gemini API Key Anda (opsional).\nKey disimpan aman di browser lokal (localStorage) Anda dan tidak dibagikan ke server:';

    const inputVal = window.prompt(promptText, current);
    if (inputVal === null) return; // User cancelled

    const trimmed = inputVal.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
      addMessage('ai', '✨ Google Gemini API Key berhasil disimpan! Chatbot kini terhubung langsung ke model AI.');
    } else {
      localStorage.removeItem(STORAGE_KEY);
      addMessage('ai', 'ℹ️ Gemini API Key dihapus. Chatbot kembali menggunakan basis pengetahuan lokal portofolio.');
    }
    refreshStatus();
  });

  /* ---------- toggle open / close ---------- */
  function toggle(force) {
    isOpen = typeof force === 'boolean' ? force : !isOpen;
    chatRoot.classList.toggle('cb-open', isOpen);
    fab.setAttribute('aria-label', isOpen ? 'Tutup asisten virtual' : 'Buka asisten virtual');
    if (isOpen) setTimeout(() => input.focus(), 350);
  }
  fab.addEventListener('click', () => toggle());
  headerClose.addEventListener('click', () => toggle(false));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggle(false);
  });

  /* ---------- suggestions ---------- */
  suggestionsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.cb-sug');
    if (!btn) return;
    sendMessage(btn.dataset.q);
  });

  /* ---------- input handling ---------- */
  function updateSendState() {
    sendBtn.disabled = !input.value.trim();
  }
  input.addEventListener('input', updateSendState);
  input.addEventListener('keyup', updateSendState);
  input.addEventListener('change', updateSendState);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = input.value.trim();
      if (text && !isTyping) {
        sendMessage(text);
      }
    }
  });

  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isTyping) return;
    sendMessage(text);
  });

  /* ---------- send message ---------- */
  async function sendMessage(text) {
    addMessage('user', text);
    input.value = '';
    sendBtn.disabled = true;
    suggestionsEl.style.display = 'none';
    isTyping = true;

    const typingEl = addTypingIndicator();

    try {
      const reply = await getBotResponse(text);
      typingEl.remove();
      addMessage('ai', reply);
    } catch (err) {
      typingEl.remove();
      console.warn('[Chatbot] Response error:', err);
      // Fallback cleanly to local knowledge
      const fallbackReply = getOfflineResponse(text);
      addMessage('ai', fallbackReply);
    } finally {
      isTyping = false;
    }
  }

  /* ---------- add message to DOM ---------- */
  function addMessage(role, text, isError) {
    const wrap = document.createElement('div');
    wrap.className = `cb-msg cb-msg-${role}${isError ? ' cb-msg-error' : ''}`;

    const bubble = document.createElement('div');
    bubble.className = 'cb-bubble';

    if (role === 'ai') {
      bubble.innerHTML = renderMarkdown(text);
    } else {
      bubble.textContent = text;
    }

    wrap.appendChild(bubble);

    const time = document.createElement('span');
    time.className = 'cb-time';
    time.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    wrap.appendChild(time);

    messagesEl.appendChild(wrap);
    requestAnimationFrame(() => {
      wrap.classList.add('cb-msg-in');
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });

    // store in chat history for Gemini context
    if (!isError) {
      chatHistory.push({
        role: role === 'user' ? 'user' : 'model',
        parts: [{ text }]
      });
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-16);
    }

    return wrap;
  }

  function addTypingIndicator() {
    const wrap = document.createElement('div');
    wrap.className = 'cb-msg cb-msg-ai cb-msg-in';
    wrap.innerHTML = `
      <div class="cb-bubble cb-typing">
        <span class="cb-typing-dot"></span>
        <span class="cb-typing-dot"></span>
        <span class="cb-typing-dot"></span>
      </div>
    `;
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return wrap;
  }

  /* ---------- simple markdown renderer ---------- */
  function renderMarkdown(text) {
    return text
      // code blocks
      .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // links
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // bullet points
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      // line breaks
      .replace(/\n/g, '<br>');
  }

  /* ---------- response resolution ---------- */
  async function getBotResponse(userMessage) {
    const apiKey = getSavedApiKey();

    if (apiKey) {
      try {
        const geminiReply = await callGemini(userMessage, apiKey);
        if (geminiReply) return geminiReply;
      } catch (geminiErr) {
        console.warn('[Chatbot] Gemini API request failed, falling back to local intelligence:', geminiErr);
      }
    }

    // Natural brief pause for conversational rhythm
    await new Promise((r) => setTimeout(r, 450));
    return getOfflineResponse(userMessage);
  }

  /* ---------- Gemini API call (SDK or direct REST) ---------- */
  async function callGemini(userMessage, apiKey) {
    // 1. Try official @google/genai SDK if loaded
    if (GoogleGenAI) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: chatHistory,
          config: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 512,
            systemInstruction: DICKY_CONTEXT,
          },
        });
        const reply = response?.text;
        if (reply) return reply.trim();
      } catch (sdkErr) {
        console.warn('[Chatbot] SDK error, trying REST endpoint:', sdkErr);
      }
    }

    // 2. Direct REST fallback
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: DICKY_CONTEXT }]
        },
        contents: chatHistory,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512,
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error('No response from Gemini API');
    return reply.trim();
  }

  /* ---------- initial welcome message ---------- */
  addMessage('ai', 'Halo! 👋 Saya **Dicky AI**, asisten digital portofolio Dicky Afriza. Mau tahu tentang keahlian, project yang pernah dikerjakan, atau cara menghubungi Dicky? Silakan tanya apa saja!');

})();
