document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------
  // 1. ELEMEN GATE & EDIT MODAL
  // ------------------------------------------
  const unlockBtn = document.getElementById('unlockBtn');
  const dateGateOverlay = document.getElementById('dateGateOverlay');
  
  const moodInput = document.getElementById('moodInput');
  const topicInput = document.getElementById('topicInput');
  const noteInput = document.getElementById('noteInput');

  const savedMoodText = document.getElementById('savedMoodText');
  const savedTopicText = document.getElementById('savedTopicText');
  const savedNoteText = document.getElementById('savedNoteText');

  const openDateModal = document.getElementById('openDateModal');
  const editDateModal = document.getElementById('editDateModal');
  const closeDateModal = document.getElementById('closeDateModal');
  const editMoodInput = document.getElementById('editMoodInput');
  const editTopicInput = document.getElementById('editTopicInput');
  const editNoteInput = document.getElementById('editNoteInput');
  const updateDateBtn = document.getElementById('updateDateBtn');

  const myPhoneNumber = '6285168821267'; 
  const forbiddenWords = ['gatau', 'gak tau', 'gtw', 'gtau', 'gk tau', 'ga tau', 'terserah', 'bebas', 'ngikut', 'mls', 'males', 'mboh'];

  function containsForbiddenWord(text) {
    const lowerText = text.toLowerCase();
    return forbiddenWords.some(word => lowerText.includes(word));
  }

  function triggerError(inputs, alertMessage) {
    const gateCard = document.querySelector('.gate-card') || document.querySelector('#editDateModal .journal-paper');
    if (gateCard) {
      gateCard.classList.add('shake-error');
      setTimeout(() => gateCard.classList.remove('shake-error'), 400);
    }
    inputs.forEach(item => {
      if (item.isInvalid) {
        item.input.style.borderColor = '#ff4757';
      } else {
        item.input.style.borderColor = '';
      }
    });
    alert(alertMessage);
  }

  function updateWidget(moodVal, topicVal, noteVal) {
    if (savedMoodText) savedMoodText.textContent = moodVal || 'Belum diisi';
    if (savedTopicText) savedTopicText.textContent = topicVal || 'Topik chat';
    if (savedNoteText) savedNoteText.textContent = noteVal ? `"${noteVal}"` : '-';
  }

  const savedMood = localStorage.getItem('userMood');
  const savedTopic = localStorage.getItem('userTopic');
  const savedNote = localStorage.getItem('userNote');

  if (savedMood) {
    if (moodInput) moodInput.value = savedMood;
    if (topicInput && savedTopic) topicInput.value = savedTopic;
    if (noteInput && savedNote) noteInput.value = savedNote;
    updateWidget(savedMood, savedTopic, savedNote);
  }

  const isSessionUnlocked = sessionStorage.getItem('sessionUnlocked');
  if (isSessionUnlocked === 'true' && dateGateOverlay) {
    dateGateOverlay.style.display = 'none';
  } else if (dateGateOverlay) {
    dateGateOverlay.style.display = 'flex';
  }

  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      const selectedMood = moodInput.value.trim();
      const selectedTopic = topicInput.value.trim();
      const selectedNote = noteInput.value.trim();

      if (!selectedMood || !selectedTopic || !selectedNote) {
        triggerError([
          { input: moodInput, isInvalid: !selectedMood },
          { input: topicInput, isInvalid: !selectedTopic },
          { input: noteInput, isInvalid: !selectedNote }
        ], 'Isi semua kolom dulu ya.');
        return;
      }

      const moodForbidden = containsForbiddenWord(selectedMood);
      const topicForbidden = containsForbiddenWord(selectedTopic);
      const noteForbidden = containsForbiddenWord(selectedNote);

      if (moodForbidden || topicForbidden || noteForbidden) {
        triggerError([
          { input: moodInput, isInvalid: moodForbidden },
          { input: topicInput, isInvalid: topicForbidden },
          { input: noteInput, isInvalid: noteForbidden }
        ], 'Eits, ga bisa jawab "gatau" atau "terserah" ya! Isinya yang bener');
        return;
      }

      moodInput.style.borderColor = '';
      topicInput.style.borderColor = '';
      noteInput.style.borderColor = '';

      localStorage.setItem('userMood', selectedMood);
      localStorage.setItem('userTopic', selectedTopic);
      localStorage.setItem('userNote', selectedNote);
      sessionStorage.setItem('sessionUnlocked', 'true');

      updateWidget(selectedMood, selectedTopic, selectedNote);

      if (dateGateOverlay) {
        dateGateOverlay.style.opacity = '0';
        dateGateOverlay.style.visibility = 'hidden';
        setTimeout(() => { dateGateOverlay.style.display = 'none'; }, 400);
      }

      const message = `kakkk, aku udah buka web-nya.\n\nMoodku: ${selectedMood}\nTopik Chat: ${selectedTopic}\nPesan buat kak daw: "${selectedNote}"`; 
      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=${myPhoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
      }, 300);
    });
  }

  // Edit Modal
  if (openDateModal && editDateModal && closeDateModal) {
    openDateModal.addEventListener('click', () => {
      if (localStorage.getItem('userMood')) editMoodInput.value = localStorage.getItem('userMood');
      if (localStorage.getItem('userTopic')) editTopicInput.value = localStorage.getItem('userTopic');
      if (localStorage.getItem('userNote')) editNoteInput.value = localStorage.getItem('userNote');
      editDateModal.style.display = 'flex';
    });
    closeDateModal.addEventListener('click', () => { editDateModal.style.display = 'none'; });

    if (updateDateBtn) {
      updateDateBtn.addEventListener('click', () => {
        const newMood = editMoodInput.value.trim();
        const newTopic = editTopicInput.value.trim();
        const newNote = editNoteInput.value.trim();

        if (!newMood || !newTopic || !newNote) {
          triggerError([
            { input: editMoodInput, isInvalid: !newMood },
            { input: editTopicInput, isInvalid: !newTopic },
            { input: editNoteInput, isInvalid: !newNote }
          ], 'Isi semua kolom dulu ya.');
          return;
        }

        const moodForbidden = containsForbiddenWord(newMood);
        const topicForbidden = containsForbiddenWord(newTopic);
        const noteForbidden = containsForbiddenWord(newNote);

        if (moodForbidden || topicForbidden || noteForbidden) {
          triggerError([
            { input: editMoodInput, isInvalid: moodForbidden },
            { input: editTopicInput, isInvalid: topicForbidden },
            { input: editNoteInput, isInvalid: noteForbidden }
          ], 'Gak boleh jawab "gatau" atau "terserah" ya!');
          return;
        }

        localStorage.setItem('userMood', newMood);
        localStorage.setItem('userTopic', newTopic);
        localStorage.setItem('userNote', newNote);
        updateWidget(newMood, newTopic, newNote);
        editDateModal.style.display = 'none';

        const updateMessage = `Sekarang:\n\nMood: ${newMood}\nTopik: ${newTopic}\nPesan: "${newNote}"`;
        window.open(`https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(updateMessage)}`, '_blank');
      });
    }
  }

  // ------------------------------------------
  // 2. TOGGLE SAKLAR LAMPU
  // ------------------------------------------
  const lampToggle = document.getElementById('lampToggle');
  const body = document.body;
  const lampIcon = document.querySelector('.lamp-icon');
  const lampText = document.querySelector('.lamp-text');

  if (lampToggle) {
    lampToggle.addEventListener('click', () => {
      if (body.classList.contains('night-mode')) {
        body.classList.remove('night-mode');
        body.classList.add('day-mode');
        if (lampIcon) lampIcon.textContent = '☀️';
        if (lampText) lampText.textContent = 'Mode Siang';
      } else {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
        if (lampIcon) lampIcon.textContent = '🌙';
        if (lampText) lampText.textContent = 'Mode Malam';
      }
    });
  }

  // ------------------------------------------
  // 3. POPUP JOURNAL & JAM
  // ------------------------------------------
  const openNotebook = document.getElementById('openNotebook');
  const journalModal = document.getElementById('journalModal');
  const closeJournal = document.getElementById('closeJournal');

  if (openNotebook && journalModal && closeJournal) {
    openNotebook.addEventListener('click', () => { journalModal.style.display = 'flex'; });
    closeJournal.addEventListener('click', () => { journalModal.style.display = 'none'; });
  }

  function updateClock() {
    const clockTime = document.getElementById('clockTime');
    const clockDate = document.getElementById('clockDate');
    if (!clockTime || !clockDate) return;

    const now = new Date();
    clockTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    clockDate.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ------------------------------------------
  // 4. SPOTIFY MUSIC PLAYER (FIXED ID MATCHING)
  // ------------------------------------------
  const playlist = [
    { title: "18", artist: "One Direction", src: "./assets/audio/lagu1.mp3", cover: "./lagu1.jpg" },
    { title: "Shape Of My Heart", artist: "Backstreet Boys", src: "./assets/audio/lagu2.mp3", cover: "./lagu2.jpg" },
    { title: "About You", artist: "The 1975", src: "./assets/audio/lagu3.mp3", cover: "./lagu3.jpg" },
    { title: "Rahasia Hati", artist: "Nidji", src: "./assets/audio/lagu4.mp3", cover: "./lagu4.jpeg" },
    { title: "Monokrom", artist: "Tulus", src: "./assets/audio/lagu5.mp3", cover: "./lagu5.jpg" },
    { title: "Jatuh Suka", artist: "Tulus", src: "./assets/audio/lagu6.mp3", cover: "./lagu6.png" },
    { title: "Dunia Yang Nanti", artist: "Raim Laode", src: "./assets/audio/lagu7.mp3", cover: "./lagu7.jpeg" }
  ];
  let currentTrackIndex = 0;

  // Elemen Audio & Kontrol
  const audioPlayer = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  
  // Elemen Teks & Cover
  const songTitle = document.getElementById('songTitle');
  const artistName = document.getElementById('artistName');
  const albumCover = document.getElementById('albumCover');

  // Elemen Progress Bar (Disesuaikan dengan HTML)
  const progressBarBg = document.getElementById('progressBarBg');
  const progressBarFill = document.getElementById('progressBarFill');
  const currentTimeElem = document.getElementById('currentTime');
  const durationTimeElem = document.getElementById('durationTime');

  // Elemen Visualizer & Playlist Dropdown
  const musicWave = document.getElementById('musicWave');
  const playlistToggleBtn = document.getElementById('playlistToggleBtn');
  const playlistDropdown = document.getElementById('playlistDropdown');
  const playlistItems = document.getElementById('playlistItems');

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  if (audioPlayer) {
    function loadTrack(index) {
      const track = playlist[index];
      audioPlayer.src = track.src;
      if (songTitle) songTitle.textContent = track.title;
      if (artistName) artistName.textContent = track.artist;
      if (albumCover) albumCover.src = track.cover;
      
      if (currentTimeElem) currentTimeElem.textContent = "0:00";
      if (durationTimeElem) durationTimeElem.textContent = "0:00";
      if (progressBarFill) progressBarFill.style.width = '0%';

      renderPlaylistItems();
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
          audioPlayer.play().then(() => {
            playBtn.textContent = '❚❚';
            if (musicWave) musicWave.classList.add('playing');
          }).catch(err => {
            alert("File audio gagal diputar! Pastikan path audio sudah benar.");
            console.error(err);
          });
        } else {
          audioPlayer.pause();
          playBtn.textContent = '▶';
          if (musicWave) musicWave.classList.remove('playing');
        }
      });
    }

    audioPlayer.addEventListener('timeupdate', () => {
      if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        if (progressBarFill) progressBarFill.style.width = `${progressPercent}%`;
        if (currentTimeElem) currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
        if (durationTimeElem) durationTimeElem.textContent = formatTime(audioPlayer.duration);
      }
    });

    if (progressBarBg) {
      progressBarBg.addEventListener('click', (e) => {
        if (audioPlayer.duration) {
          const rect = progressBarBg.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const width = rect.width;
          const seekTime = (clickX / width) * audioPlayer.duration;
          audioPlayer.currentTime = seekTime;
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        if (playBtn) playBtn.textContent = '❚❚';
        if (musicWave) musicWave.classList.add('playing');
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        if (playBtn) playBtn.textContent = '❚❚';
        if (musicWave) musicWave.classList.add('playing');
      });
    }

    audioPlayer.addEventListener('ended', () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      loadTrack(currentTrackIndex);
      audioPlayer.play();
    });

    if (playlistToggleBtn && playlistDropdown) {
      playlistToggleBtn.addEventListener('click', () => {
        playlistDropdown.classList.toggle('show');
      });
    }

    function renderPlaylistItems() {
      if (!playlistItems) return;
      playlistItems.innerHTML = '';

      playlist.forEach((track, idx) => {
        const li = document.createElement('li');
        li.className = idx === currentTrackIndex ? 'active' : '';
        li.innerHTML = `
          <span>${idx + 1}. ${track.title}</span>
          <small>${track.artist}</small>
        `;
        li.addEventListener('click', () => {
          currentTrackIndex = idx;
          loadTrack(currentTrackIndex);
          audioPlayer.play();
          if (playBtn) playBtn.textContent = '❚❚';
          if (musicWave) musicWave.classList.add('playing');
          if (playlistDropdown) playlistDropdown.classList.remove('show');
        });
        playlistItems.appendChild(li);
      });
    }

    loadTrack(currentTrackIndex);
  }
  
  // ------------------------------------------
  // 5. KUNCI RAHASIA & ANIMASI BURST + HUJAN EMOJI
  // ------------------------------------------
  const SECRET_PASSWORD = "kamuistimewa"; 
  const MY_PHONE_NUMBER = "6285168821267"; 
  let flowerAnimationFrame = null;

  const secretKeyBtn = document.getElementById('secretKeyBtn');
  const surpriseModal = document.getElementById('surpriseModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const finishSurpriseBtn = document.getElementById('finishSurpriseBtn');

  const passInput = document.getElementById('passInput');
  const unlockSecretBtn = document.getElementById('unlockSecretBtn');
  const errorMsg = document.getElementById('errorMsg');
  const waRequestBtn = document.getElementById('waRequestBtn');

  const modalStep1 = document.getElementById('modalStep1');
  const modalStep2 = document.getElementById('modalStep2');

  const flowerSources = [
    './assets/img/flower1.png',
    './assets/img/flower2.png',
    './assets/img/flower3.png',
    './assets/img/flower4.png',
    './assets/img/flower5.png',
    './assets/img/flower6.png'
  ];
  const flowerImages = flowerSources.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  if (secretKeyBtn && surpriseModal) {
    secretKeyBtn.addEventListener('click', () => {
      surpriseModal.classList.add('show');
      modalStep1.classList.add('active');
      modalStep2.classList.remove('active');
      if (errorMsg) errorMsg.textContent = '';
      if (passInput) passInput.value = '';
    });
  }

  function checkPassword() {
    if (!passInput) return;
    if (passInput.value.trim().toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
      modalStep1.classList.remove('active');
      modalStep2.classList.add('active');
      if (errorMsg) errorMsg.textContent = '';

      const flowerImg = document.getElementById('bloomingFlower');
      if (flowerImg) {
        flowerImg.src = flowerSources[Math.floor(Math.random() * flowerSources.length)];
        flowerImg.classList.remove('bloom-open');
        setTimeout(() => flowerImg.classList.add('bloom-open'), 50);
      }
      triggerFlowerShower();
    } else {
      if (errorMsg) errorMsg.textContent = "Ups! Password salah nih, minta ke aku dulu ya 😜";
    }
  }

  if (unlockSecretBtn) unlockSecretBtn.addEventListener('click', checkPassword);
  if (waRequestBtn) {
    waRequestBtn.addEventListener('click', () => {
      window.open(`https://api.whatsapp.com/send?phone=${MY_PHONE_NUMBER}&text=${encodeURIComponent("kakkk, aku nemu kunci rahasia di web kamu nih 🔑✨ Password-nya apa yaa?")}`, '_blank');
    });
  }

  function stopFlowerShower() {
    if (flowerAnimationFrame) {
      cancelAnimationFrame(flowerAnimationFrame);
      flowerAnimationFrame = null;
    }
    const canvas = document.getElementById('surpriseCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }

  function closeSurpriseModal() {
    if (surpriseModal) surpriseModal.classList.remove('show');
    stopFlowerShower();
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeSurpriseModal);

  function triggerFlowerShower() {
    stopFlowerShower();

    let canvas = document.createElement('canvas');
    canvas.id = 'surpriseCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    const flowerParticles = [];
    const TOTAL_FLOWERS = 45;
    for (let i = 0; i < TOTAL_FLOWERS; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      flowerParticles.push({
        img: flowerImages[i % flowerSources.length],
        x: centerX, y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 80 + Math.random() * 40,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 4,
        delay: Math.floor(i / 10) * 2,
        opacity: 1
      });
    }

    const emojiParticles = [];
    const emojiList = ['🌸', '✨', '💖', '🎉'];
    for (let i = 0; i < 15; i++) {
      emojiParticles.push({
        text: emojiList[i % emojiList.length],
        x: Math.random() * width,
        y: -30 - Math.random() * 150,
        vy: 3 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 1,
        opacity: 1
      });
    }

    let frameCounter = 0;
    function render() {
      ctx.clearRect(0, 0, width, height);
      frameCounter++;
      let activeParticles = 0;

      flowerParticles.forEach(p => {
        if (frameCounter > p.delay) {
          p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed;
          if (Math.hypot(p.x - centerX, p.y - centerY) > Math.min(width, height) * 0.35) p.opacity -= 0.02;
          if (p.opacity > 0 && p.img.complete) {
            activeParticles++;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          }
        } else activeParticles++;
      });

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      emojiParticles.forEach(e => {
        e.y += e.vy; e.x += e.vx;
        if (e.y > height * 0.75) e.opacity -= 0.02;
        if (e.opacity > 0 && e.y < height) {
          activeParticles++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, e.opacity);
          ctx.fillText(e.text, e.x, e.y);
          ctx.restore();
        }
      });

      if (activeParticles > 0) flowerAnimationFrame = requestAnimationFrame(render);
      else stopFlowerShower();
    }
    flowerAnimationFrame = requestAnimationFrame(render);
  }

 // ------------------------------------------
// 6. LOGIKA POPUP SURAT DALAM AMPLOP
// ------------------------------------------
const letterModal = document.getElementById('thankYouLetterModal');   
const envelope = document.getElementById('envelope');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const letterTextElem = document.getElementById('letterText');

// Teks surat yang diputar dengan efek ketik
const messageText = `Jadi gini yaa... sebenernya aku tuh banyak banget yang pengen aku sampein ke kamu, banyak banget yang pengen aku ceritain, tapi yaa kita sama-sama tau keadaan kita sekarang kayak gimana. Ada batasan yang bikin aku harus nahan banyak kata. Aku ngerti kok, aku paham kenapa kamu milih hati-hati. Aku tau kamu gamau ada hal-hal yang bikin kamu ga nyaman atau malah jadi masalah nantinya. Makanya yaudah, anggep aja ini cuma sebagian kecil dari semua yang selama ini aku simpen.

Jangan nangis ege ya... wkwkwk.

Aku pernah bilang di awal, kan... kalau setelah sekian lama aku ngerasa mati rasa, aku bener-bener yakin aku udah ga bakal bisa jatuh cinta lagi sama siapa-siapa. Aku pikir semua rasa itu udah selesai. Aku pikir setelah apa yang pernah aku lewatin, aku bakal biasa aja ketemu siapa pun.

Tapi ternyata aku salah.

Entah sejak kapan, tanpa sadar semuanya berubah. Aku mulai nungguin hal-hal kecil yang berhubungan sama kamu. Mulai seneng cuma gara-gara chat sederhana, senyum sendiri karena hal yang mungkin buat orang lain biasa aja. Sampai akhirnya aku sadar... ternyata aku masih bisa ngerasain itu semua.

Dan lucunya, rasa itu datang ke orang yang mungkin memang ga bisa aku miliki.

Dulu aku selalu mikir kalau memiliki seseorang itu cuma soal waktu. Tinggal nunggu momen yang pas, saling kenal lebih lama, nanti juga bisa. Tapi ternyata kenyataannya ga sesederhana itu. Ada keadaan yang ga bisa dipaksa. Ada jarak yang bukan soal kilometer. Ada batas yang bahkan perasaan aja ga cukup buat ngelewatinya.

Aku juga pernah berharap banyak. Mungkin terlalu banyak. Sampai akhirnya aku capek sendiri karena ekspektasi yang aku bikin. Sekarang? Sekarang aku udah belajar buat nurunin harapan itu. Bukan karena rasanya udah hilang, tapi karena aku mulai sadar kalau ga semua hal harus dipaksa sesuai sama apa yang kita mau.

Tapi satu hal yang belum berubah...

Perasaanku.

Mungkin aku udah ga seberisik dulu. Udah ga seantusias dulu. Udah ga sesering dulu nunjukin semuanya. Bukan karena aku udah ga peduli, tapi karena aku lagi belajar menghargai keadaan. Belajar nerima kalau ga semua rasa harus selalu diperjuangin dengan cara yang sama.

Aku cuma pengen kamu tau, di balik semua candaan, obrolan receh, sama sikapku yang sekarang kelihatan lebih santai... masih ada seseorang yang diam-diam nyimpen rasa yang sama seperti kemarin.

Aku ga minta kamu buat ngebales perasaan itu. Aku juga ga minta kamu ngasih jawaban sekarang. Aku cuma pengen jujur sama diriku sendiri kalau semua yang pernah aku rasain itu nyata. Dan kalau suatu hari nanti semuanya memang harus selesai, setidaknya aku ga pernah bohong kalau aku pernah benar-benar menyayangi seseorang.

Mungkin ini cuma setengah dari cerita yang pengen aku sampein. Sisanya... biar tetap jadi rahasia yang cuma aku sama Tuhan yang tau. Karena ada beberapa perasaan yang memang lebih baik disimpan daripada dipaksa untuk dimiliki.`;

if (finishSurpriseBtn) {
  finishSurpriseBtn.addEventListener('click', function() {
    closeSurpriseModal();
    if (letterModal) letterModal.style.display = 'flex';
  });
}

// Event listener saat amplop diklik
if (envelope) {
  envelope.addEventListener('click', function() {
    if (!envelope.classList.contains('open')) {
      envelope.classList.add('open'); // Memicu animasi CSS kertas meluncur naik
      if (letterTextElem) letterTextElem.innerHTML = "";
      
      // Menunggu 0.8 detik (sampai kertas meluncur naik penuh), baru mulai ngetik
      setTimeout(() => {
        typeWriterEffect(messageText, letterTextElem, 40);
      }, 800);

      // Menampilkan tombol tutup setelah beberapa saat
      setTimeout(() => {
        if (closeLetterBtn) closeLetterBtn.style.display = 'block';
      }, 2200);
    }
  });
}

// Fungsi Efek Ngetik (Typewriter)
function typeWriterEffect(text, element, speed) {
  let index = 0;
  function type() {
    if (element && index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Tombol Tutup Surat
if (closeLetterBtn) {
  closeLetterBtn.addEventListener('click', function() {
    if (letterModal) letterModal.style.display = 'none';
    if (envelope) envelope.classList.remove('open');
    closeLetterBtn.style.display = 'none';
    if (letterTextElem) letterTextElem.innerHTML = "";
  });
}

  function typeWriterEffect(text, element, speed) {
    let index = 0;
    function type() {
      if (element && index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', function() {
      if (letterModal) letterModal.style.display = 'none';
      if (envelope) envelope.classList.remove('open');
      closeLetterBtn.style.display = 'none';
      if (letterTextElem) letterTextElem.innerHTML = "";
    });
  }
});

// --- EFEK BUKU BALIK FOTO ---
const pages = document.querySelectorAll('.book-page');
let currentPageIndex = 0;

function flipNextPage() {
  if (pages.length === 0) return;

  const currentPage = pages[currentPageIndex];
  currentPage.classList.add('flipping');
  currentPage.classList.remove('active');

  // Lanjut ke indeks berikutnya
  currentPageIndex = (currentPageIndex + 1) % pages.length;
  const nextPage = pages[currentPageIndex];

  setTimeout(() => {
    currentPage.classList.remove('flipping');
  }, 800);

  nextPage.classList.add('active');
}

// Opsi A: Ganti foto otomatis setiap 3.5 detik
setInterval(flipNextPage, 3500);

// Opsi B: Bisa juga diklik fotonya buat balik ke halaman berikutnya
const photoBook = document.getElementById('photoBook');
if (photoBook) {
  photoBook.addEventListener('click', flipNextPage);
}