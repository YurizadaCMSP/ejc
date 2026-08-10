/* ============================================================
   9º ENCONTRO DE JOVENS COM CRISTO
   Paróquia Nossa Senhora Aparecida do Cocaia
   ============================================================
   Arquitetura:
   CONFIG → LOADING → COUNTDOWN → AUDIO → PLAYER → UI → STORAGE
   ============================================================ */

// ==================== CONFIGURAÇÃO CENTRAL ====================
// ALTERE APENAS ESTA SEÇÃO PARA PERSONALIZAR O SITE
const CONFIG = {
    // Nome do evento
    eventName: "9º Encontro de Jovens com Cristo da Paróquia Nossa Senhora Aparecida do Cocaia",

    // Data alvo: 30 de agosto de 2026, 20:00, Horário de Brasília (UTC-3)
    // Formato ISO 8601 com offset de timezone
    targetDate: "2026-08-30T20:00:00-03:00",

    // Caminho da logo (com fundo transparente)
    logo: "./assets/logo.png",

    // Configuração da música
    music: {
        file: "./assets/music.mp3",
        title: "Nome da Música",
        artist: "Nome do Cantor"
    },

    // Volume inicial (0.0 a 1.0)
    initialVolume: 0.7,

    // Duração do fade-in do áudio (em milissegundos)
    audioFadeInDuration: 2000,

    // Chave do localStorage
    storageKey: "ejc_experience_started"
};

// ==================== ESTADO GLOBAL ====================
const state = {
    audioLoaded: false,
    logoLoaded: false,
    autoplayBlocked: false,
    userInteracted: false,
    countdownFinished: false,
    countdownInterval: null,
    audioContext: null,
    fadeInInterval: null,
    lastSecond: -1
};

// ==================== REFERÊNCIAS DO DOM ====================
const elements = {};

function cacheElements() {
    elements.loadingScreen = document.getElementById("loading-screen");
    elements.loadingLogo = document.getElementById("loading-logo");
    elements.loadingText = document.getElementById("loading-text");
    elements.enterBtn = document.getElementById("enter-btn");
    elements.mainContent = document.getElementById("main-content");
    elements.mainLogo = document.getElementById("main-logo");
    elements.eventTitle = document.getElementById("event-title");
    elements.countdownContainer = document.getElementById("countdown-container");
    elements.countdownDays = document.getElementById("countdown-days");
    elements.countdownHours = document.getElementById("countdown-hours");
    elements.countdownMinutes = document.getElementById("countdown-minutes");
    elements.countdownSeconds = document.getElementById("countdown-seconds");
    elements.eventMessage = document.getElementById("event-message");
    elements.musicPlayer = document.getElementById("music-player");
    elements.audio = document.getElementById("audio-element");
    elements.playerTitle = document.getElementById("player-title");
    elements.playerArtist = document.getElementById("player-artist");
    elements.playerPlayBtn = document.getElementById("player-play-btn");
    elements.playIcon = elements.playerPlayBtn.querySelector(".play-icon");
    elements.pauseIcon = elements.playerPlayBtn.querySelector(".pause-icon");
    elements.playerCurrentTime = document.getElementById("player-current-time");
    elements.playerDuration = document.getElementById("player-duration");
    elements.playerProgressBar = document.getElementById("player-progress-bar");
    elements.playerProgressFill = document.getElementById("player-progress-fill");
    elements.playerVolumeBtn = document.getElementById("player-volume-btn");
    elements.volumeHighIcon = elements.playerVolumeBtn.querySelector(".volume-high-icon");
    elements.volumeMuteIcon = elements.playerVolumeBtn.querySelector(".volume-mute-icon");
    elements.playerVolumeBar = document.getElementById("player-volume-bar");
    elements.playerVolumeFill = document.getElementById("player-volume-fill");
}

// ==================== INICIALIZAÇÃO ====================
function init() {
    cacheElements();
    setupConfig();
    initLoading();
    initCountdown();
    initAudio();
    initPlayer();
    setupEvents();
    setupKeyboardAccessibility();
}

// Aplica configurações ao DOM
function setupConfig() {
    document.title = CONFIG.eventName;
    elements.loadingLogo.src = CONFIG.logo;
    elements.mainLogo.src = CONFIG.logo;
    elements.playerTitle.textContent = CONFIG.music.title;
    elements.playerArtist.textContent = CONFIG.music.artist;
    elements.audio.src = CONFIG.music.file;
    elements.audio.volume = 0; // Começa em 0 para fade-in
    elements.audio.preload = "metadata";
}

// ==================== LOADING ====================
function initLoading() {
    // Carrega a logo
    const logoImg = new Image();
    logoImg.onload = () => {
        state.logoLoaded = true;
        elements.loadingLogo.classList.add("loaded");
        elements.mainLogo.classList.add("loaded");
        checkResourcesReady();
    };
    logoImg.onerror = () => {
        // Logo falhou, mas o site continua
        state.logoLoaded = true;
        console.warn("Logo não pôde ser carregada.");
        checkResourcesReady();
    };
    logoImg.src = CONFIG.logo;

    // Carrega metadados do áudio
    elements.audio.addEventListener("loadedmetadata", () => {
        state.audioLoaded = true;
        updatePlayerDuration();
        checkResourcesReady();
    }, { once: true });

    elements.audio.addEventListener("error", () => {
        state.audioLoaded = true; // Marca como "pronto" mesmo com erro
        console.warn("Áudio não pôde ser carregado.");
        checkResourcesReady();
    }, { once: true });

    // Timeout de segurança (nunca bloqueia indefinidamente)
    setTimeout(() => {
        if (!state.logoLoaded) {
            state.logoLoaded = true;
            checkResourcesReady();
        }
    }, 5000);

    setTimeout(() => {
        if (!state.audioLoaded) {
            state.audioLoaded = true;
            checkResourcesReady();
        }
    }, 5000);
}

// Verifica se recursos essenciais estão prontos
function checkResourcesReady() {
    if (!state.logoLoaded || !state.audioLoaded) return;

    // Verifica se o usuário já interagiu antes (localStorage)
    const hasInteracted = localStorage.getItem(CONFIG.storageKey) === "true";

    if (hasInteracted) {
        // Usuário já entrou antes — tenta autoplay direto
        attemptAutoplay();
    } else {
        // Primeira visita — tenta autoplay, mas mostra botão se bloquear
        attemptAutoplay();
    }
}

// Tenta reproduzir automaticamente
function attemptAutoplay() {
    const playPromise = elements.audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Autoplay permitido
                state.autoplayBlocked = false;
                state.userInteracted = true;
                fadeInAudio();
                enterSite();
            })
            .catch((err) => {
                // Autoplay bloqueado pelo navegador
                state.autoplayBlocked = true;
                console.info("Autoplay bloqueado pelo navegador. Aguardando interação do usuário.");
                showEnterButton();
            });
    } else {
        // Navegador antigo — assume bloqueado
        showEnterButton();
    }
}

// Mostra botão de entrada
function showEnterButton() {
    elements.loadingText.classList.add("hidden");
    elements.enterBtn.classList.remove("hidden");
}

// Entra no site (chamado após interação ou autoplay permitido)
function enterSite() {
    // Marca no localStorage que a experiência começou
    if (state.userInteracted) {
        localStorage.setItem(CONFIG.storageKey, "true");
    }

    // Esconde loading
    elements.loadingScreen.classList.add("fade-out");

    // Mostra conteúdo principal
    setTimeout(() => {
        elements.loadingScreen.classList.add("hidden");
        elements.mainContent.classList.remove("hidden");
        elements.mainContent.setAttribute("aria-hidden", "false");
        elements.musicPlayer.classList.remove("hidden");

        // Trigger reflow para animação
        void elements.mainContent.offsetWidth;
        elements.mainContent.classList.add("visible");

        updatePlayButtonState();
    }, 800);
}

// ==================== CONTAGEM REGRESSIVA ====================
function initCountdown() {
    updateCountdown();
    state.countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    if (state.countdownFinished) return;

    const now = new Date();
    const target = new Date(CONFIG.targetDate);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
        finishCountdown();
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    updateCountdownNumber(elements.countdownDays, days);
    updateCountdownNumber(elements.countdownHours, hours);
    updateCountdownNumber(elements.countdownMinutes, minutes);
    updateCountdownNumber(elements.countdownSeconds, seconds);
}

function updateCountdownNumber(element, value) {
    const formatted = String(value).padStart(2, "0");
    const current = element.textContent;

    if (current !== formatted) {
        element.textContent = formatted;
        // Animação suave apenas no elemento que mudou
        element.classList.remove("tick");
        void element.offsetWidth; // Trigger reflow
        element.classList.add("tick");
    }
}

function finishCountdown() {
    state.countdownFinished = true;
    clearInterval(state.countdownInterval);

    elements.countdownDays.textContent = "00";
    elements.countdownHours.textContent = "00";
    elements.countdownMinutes.textContent = "00";
    elements.countdownSeconds.textContent = "00";

    elements.countdownContainer.classList.add("hidden");
    elements.eventMessage.classList.remove("hidden");
}

// ==================== ÁUDIO ====================
function initAudio() {
    elements.audio.loop = true;
    elements.audio.crossOrigin = "anonymous";

    // Eventos do áudio
    elements.audio.addEventListener("ended", () => {
        updatePlayButtonState();
    });

    elements.audio.addEventListener("pause", () => {
        updatePlayButtonState();
    });

    elements.audio.addEventListener("play", () => {
        updatePlayButtonState();
    });

    elements.audio.addEventListener("timeupdate", () => {
        updatePlayerProgress();
    });

    elements.audio.addEventListener("volumechange", () => {
        updateVolumeUI();
    });
}

// Fade-in suave do volume
function fadeInAudio() {
    const targetVolume = CONFIG.initialVolume;
    const steps = 40;
    const stepValue = targetVolume / steps;
    const stepDuration = CONFIG.audioFadeInDuration / steps;
    let currentStep = 0;

    if (state.fadeInInterval) {
        clearInterval(state.fadeInInterval);
    }

    state.fadeInInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.min(currentStep * stepValue, targetVolume);
        elements.audio.volume = newVolume;

        if (currentStep >= steps) {
            clearInterval(state.fadeInInterval);
            state.fadeInInterval = null;
        }
    }, stepDuration);
}

// ==================== PLAYER ====================
function initPlayer() {
    // Configura volume inicial
    elements.audio.volume = CONFIG.initialVolume;
    updateVolumeUI();
}

function togglePlay() {
    if (elements.audio.paused) {
        elements.audio.play().catch((err) => {
            console.warn("Não foi possível reproduzir:", err.message);
        });
    } else {
        elements.audio.pause();
    }
}

function updatePlayButtonState() {
    const isPlaying = !elements.audio.paused;

    if (isPlaying) {
        elements.playIcon.classList.add("hidden");
        elements.pauseIcon.classList.remove("hidden");
        elements.playerPlayBtn.setAttribute("aria-label", "Pausar música");
        elements.playerPlayBtn.setAttribute("aria-pressed", "true");
    } else {
        elements.playIcon.classList.remove("hidden");
        elements.pauseIcon.classList.add("hidden");
        elements.playerPlayBtn.setAttribute("aria-label", "Reproduzir música");
        elements.playerPlayBtn.setAttribute("aria-pressed", "false");
    }
}

function updatePlayerProgress() {
    if (!elements.audio.duration || isNaN(elements.audio.duration)) return;

    const current = elements.audio.currentTime;
    const duration = elements.audio.duration;
    const percent = (current / duration) * 100;

    elements.playerProgressFill.style.width = percent + "%";
    elements.playerProgressBar.setAttribute("aria-valuenow", Math.round(percent));
    elements.playerCurrentTime.textContent = formatTime(current);
}

function updatePlayerDuration() {
    if (elements.audio.duration && !isNaN(elements.audio.duration)) {
        elements.playerDuration.textContent = formatTime(elements.audio.duration);
    }
}

function seekAudio(percent) {
    if (!elements.audio.duration || isNaN(elements.audio.duration)) return;
    elements.audio.currentTime = (percent / 100) * elements.audio.duration;
}

function setVolume(percent) {
    const volume = Math.max(0, Math.min(1, percent / 100));
    elements.audio.volume = volume;
    elements.audio.muted = volume === 0;
}

function toggleMute() {
    elements.audio.muted = !elements.audio.muted;
    if (elements.audio.muted) {
        elements.playerVolumeFill.style.width = "0%";
        elements.volumeHighIcon.classList.add("hidden");
        elements.volumeMuteIcon.classList.remove("hidden");
        elements.playerVolumeBtn.setAttribute("aria-pressed", "true");
    } else {
        const volumePercent = elements.audio.volume * 100;
        elements.playerVolumeFill.style.width = volumePercent + "%";
        elements.volumeHighIcon.classList.remove("hidden");
        elements.volumeMuteIcon.classList.add("hidden");
        elements.playerVolumeBtn.setAttribute("aria-pressed", "false");
    }
}

function updateVolumeUI() {
    const volume = elements.audio.muted ? 0 : elements.audio.volume;
    const percent = volume * 100;
    elements.playerVolumeFill.style.width = percent + "%";
    elements.playerVolumeBar.setAttribute("aria-valuenow", Math.round(percent));

    if (volume === 0) {
        elements.volumeHighIcon.classList.add("hidden");
        elements.volumeMuteIcon.classList.remove("hidden");
    } else {
        elements.volumeHighIcon.classList.remove("hidden");
        elements.volumeMuteIcon.classList.add("hidden");
    }
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

// ==================== EVENTOS ====================
function setupEvents() {
    // Botão de entrada (quando autoplay é bloqueado)
    elements.enterBtn.addEventListener("click", () => {
        state.userInteracted = true;
        elements.audio.play()
            .then(() => {
                fadeInAudio();
                enterSite();
            })
            .catch((err) => {
                console.warn("Áudio ainda bloqueado:", err.message);
                enterSite(); // Entra mesmo sem áudio
            });
    });

    // Play/Pause
    elements.playerPlayBtn.addEventListener("click", togglePlay);

    // Progress bar click
    elements.playerProgressBar.addEventListener("click", (e) => {
        const rect = elements.playerProgressBar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        seekAudio(percent);
    });

    // Volume bar click
    elements.playerVolumeBar.addEventListener("click", (e) => {
        const rect = elements.playerVolumeBar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        setVolume(percent);
    });

    // Mute toggle
    elements.playerVolumeBtn.addEventListener("click", toggleMute);

    // Recupera volume do localStorage
    const savedVolume = localStorage.getItem("ejc_volume");
    if (savedVolume !== null) {
        const vol = parseFloat(savedVolume);
        if (!isNaN(vol)) {
            elements.audio.volume = vol;
            updateVolumeUI();
        }
    }

    // Salva volume no localStorage
    elements.audio.addEventListener("volumechange", () => {
        if (!elements.audio.muted) {
            localStorage.setItem("ejc_volume", String(elements.audio.volume));
        }
    });

    // Pausa áudio quando a aba fica invisível (economia de bateria)
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && !elements.audio.paused) {
            elements.audio.pause();
            state.wasPlayingBeforeHide = true;
        } else if (!document.hidden && state.wasPlayingBeforeHide) {
            elements.audio.play().catch(() => {});
            state.wasPlayingBeforeHide = false;
        }
    });
}

// ==================== ACESSIBILIDADE VIA TECLADO ====================
function setupKeyboardAccessibility() {
    // Progress bar via teclado
    elements.playerProgressBar.addEventListener("keydown", (e) => {
        const step = 5;
        let currentPercent = 0;
        if (elements.audio.duration) {
            currentPercent = (elements.audio.currentTime / elements.audio.duration) * 100;
        }

        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            seekAudio(Math.min(100, currentPercent + step));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            seekAudio(Math.max(0, currentPercent - step));
        } else if (e.key === "Home") {
            e.preventDefault();
            seekAudio(0);
        } else if (e.key === "End") {
            e.preventDefault();
            seekAudio(100);
        }
    });

    // Volume bar via teclado
    elements.playerVolumeBar.addEventListener("keydown", (e) => {
        const step = 5;
        let currentPercent = elements.audio.volume * 100;

        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            setVolume(Math.min(100, currentPercent + step));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            setVolume(Math.max(0, currentPercent - step));
        } else if (e.key === "Home") {
            e.preventDefault();
            setVolume(0);
        } else if (e.key === "End") {
            e.preventDefault();
            setVolume(100);
        }
    });

    // Tecla Espaço para play/pause (quando não estiver em um controle)
    document.addEventListener("keydown", (e) => {
        if (e.key === " " && e.target.tagName !== "BUTTON" && e.target.getAttribute("role") !== "slider") {
            e.preventDefault();
            togglePlay();
        }
    });
}

// ==================== INICIALIZAÇÃO ====================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
