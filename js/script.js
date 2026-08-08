/* ============================================
   EJC COCAIA - 9º Encontro de Jovens com Cristo
   JavaScript Principal - Vanilla JS
   ============================================ */

// ============================================
// CONFIGURAÇÃO CENTRAL
// Altere apenas os valores abaixo conforme necessário
// ============================================
const CONFIG = {
    // Nome do evento (usado em meta tags e fallback)
    eventName: "9º Encontro de Jovens com Cristo da Paróquia Nossa Senhora Aparecida do Cocaia",

    // Data e horário do evento (Horário de Brasília, UTC-3)
    // Formato ISO 8601 com offset: AAAA-MM-DDTHH:MM:SS-03:00
    targetDate: "2026-08-30T20:00:00-03:00",

    // Caminho da logo (PNG com transparência recomendado)
    logo: "./assets/logo.png",

    // Configuração da música
    music: {
        file: "./assets/music.mp3",    // Caminho do arquivo MP3
        title: "NOME DA MÚSICA",        // Nome da música (exibido no player)
        artist: "NOME DO CANTOR"        // Nome do artista (exibido no player)
    }
};

// ============================================
// STORAGE - LocalStorage seguro
// ============================================
const Storage = {
    prefix: 'ejc_cocaia_',

    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch {
            // Silenciosamente ignora erros de storage
        }
    }
};

// ============================================
// REFERÊNCIAS DOM
// ============================================
const DOM = {
    loadingScreen: document.getElementById('loading-screen'),
    loadingLogo: document.getElementById('loading-logo'),
    loadingText: document.querySelector('.loading-text'),
    enterBtn: document.getElementById('enter-btn'),
    mainContent: document.getElementById('main-content'),
    mainLogo: document.getElementById('main-logo'),
    logoContainer: document.querySelector('.logo-container'),
    countdown: document.getElementById('countdown'),
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    eventMessage: document.getElementById('event-message'),
    musicTitle: document.getElementById('music-title'),
    musicArtist: document.getElementById('music-artist'),
    playBtn: document.getElementById('play-btn'),
    iconPlay: document.querySelector('.icon-play'),
    iconPause: document.querySelector('.icon-pause'),
    progressBarContainer: document.querySelector('.progress-bar-container'),
    progressBar: document.getElementById('progress-bar'),
    progressHandle: document.getElementById('progress-handle'),
    currentTime: document.getElementById('current-time'),
    duration: document.getElementById('duration'),
    volumeBtn: document.getElementById('volume-btn'),
    volumeSlider: document.getElementById('volume-slider'),
    volumeLevel: document.getElementById('volume-level'),
    player: document.getElementById('player'),
    audio: document.getElementById('audio-element')
};

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
const State = {
    isLoading: true,
    audioReady: false,
    audioPlaying: false,
    audioError: false,
    countdownFinished: false,
    volume: 0.7,
    fadeInterval: null,
    countdownInterval: null,
    progressFrame: null,
    targetTimestamp: 0
};

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Formata segundos em MM:SS
 */
function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formata número com zero à esquerda
 */
function pad(num) {
    return num.toString().padStart(2, '0');
}

/**
 * Calcula o timestamp alvo a partir da string ISO com offset
 */
function parseTargetDate(dateString) {
    return new Date(dateString).getTime();
}

// ============================================
// LOADING
// ============================================

function initLoading() {
    // Configura a logo no loading
    DOM.loadingLogo.src = CONFIG.logo;
    DOM.loadingLogo.alt = `Logo do ${CONFIG.eventName}`;

    // Fallback se a logo falhar
    DOM.loadingLogo.onerror = () => {
        DOM.loadingLogo.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'loading-logo-fallback';
        fallback.textContent = 'EJC';
        fallback.style.cssText = 'font-size: 3rem; font-weight: 200; letter-spacing: 0.3em; color: var(--color-text-secondary);';
        DOM.loadingLogo.parentNode.insertBefore(fallback, DOM.loadingLogo);
    };

    // Pré-carrega a logo
    const img = new Image();
    img.src = CONFIG.logo;
    img.onload = () => {
        // Logo carregada, prossegue
        onResourcesLoaded();
    };
    img.onerror = () => {
        // Mesmo com erro, prossegue
        onResourcesLoaded();
    };

    // Timeout de segurança: nunca bloquear por mais de 3s
    setTimeout(onResourcesLoaded, 3000);
}

let resourcesLoaded = false;
function onResourcesLoaded() {
    if (resourcesLoaded) return;
    resourcesLoaded = true;

    // Tenta autoplay
    tryAutoplay();
}

function showEnterButton() {
    DOM.loadingText.textContent = 'Toque para continuar';
    DOM.enterBtn.style.display = 'inline-flex';
    DOM.enterBtn.style.opacity = '0';
    // Força reflow
    void DOM.enterBtn.offsetHeight;
    DOM.enterBtn.style.opacity = '1';
}

function hideLoading() {
    if (!State.isLoading) return;
    State.isLoading = false;

    DOM.loadingScreen.classList.add('hidden');
    DOM.mainContent.setAttribute('aria-hidden', 'false');
    DOM.mainContent.classList.add('visible');

    // Remove a tela de loading do DOM após a transição
    setTimeout(() => {
        if (DOM.loadingScreen.parentNode) {
            DOM.loadingScreen.style.display = 'none';
        }
    }, 1000);
}

// ============================================
// CONTAGEM REGRESSIVA
// ============================================

function initCountdown() {
    State.targetTimestamp = parseTargetDate(CONFIG.targetDate);

    // Atualiza imediatamente
    updateCountdown();

    // Atualiza a cada segundo
    State.countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    if (State.countdownFinished) return;

    const now = Date.now();
    const diff = State.targetTimestamp - now;

    if (diff <= 0) {
        finishCountdown();
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    updateCountdownValue(DOM.days, days);
    updateCountdownValue(DOM.hours, hours);
    updateCountdownValue(DOM.minutes, minutes);
    updateCountdownValue(DOM.seconds, seconds);
}

function updateCountdownValue(element, value) {
    const newValue = pad(value);
    if (element.textContent !== newValue) {
        element.textContent = newValue;
        // Animação sutil de mudança
        element.classList.remove('changed');
        void element.offsetHeight; // reflow
        element.classList.add('changed');
    }
}

function finishCountdown() {
    State.countdownFinished = true;
    clearInterval(State.countdownInterval);

    DOM.countdown.style.display = 'none';
    DOM.eventMessage.style.display = 'block';

    // Zera os valores
    DOM.days.textContent = '00';
    DOM.hours.textContent = '00';
    DOM.minutes.textContent = '00';
    DOM.seconds.textContent = '00';
}

// ============================================
// ÁUDIO
// ============================================

function initAudio() {
    const audio = DOM.audio;

    // Configurações do áudio
    audio.preload = 'metadata';
    audio.src = CONFIG.music.file;
    audio.volume = 0;

    // Eventos do áudio
    audio.addEventListener('loadedmetadata', onAudioMetadata);
    audio.addEventListener('canplay', onAudioCanPlay);
    audio.addEventListener('ended', onAudioEnded);
    audio.addEventListener('error', onAudioError);
    audio.addEventListener('timeupdate', onAudioTimeUpdate, { passive: true });

    // Configura informações no player
    DOM.musicTitle.textContent = CONFIG.music.title;
    DOM.musicArtist.textContent = CONFIG.music.artist;

    // Restaura volume salvo
    const savedVolume = Storage.get('volume');
    if (savedVolume !== null && savedVolume >= 0 && savedVolume <= 1) {
        State.volume = savedVolume;
    }
    audio.volume = State.volume;
    updateVolumeDisplay();
}

function onAudioMetadata() {
    State.audioReady = true;
    DOM.duration.textContent = formatTime(DOM.audio.duration);
}

function onAudioCanPlay() {
    State.audioReady = true;
}

function onAudioEnded() {
    State.audioPlaying = false;
    updatePlayButton();
    DOM.audio.currentTime = 0;
}

function onAudioError() {
    State.audioError = true;
    State.audioReady = false;
    console.warn('Áudio não disponível');
    disablePlayer();
    hideLoading();
}

function onAudioTimeUpdate() {
    // Atualiza progresso via requestAnimationFrame para suavidade
    if (State.progressFrame) return;
    State.progressFrame = requestAnimationFrame(() => {
        State.progressFrame = null;
        updateProgressUI();
    });
}

function tryAutoplay() {
    if (State.audioError || !DOM.audio.src) {
        hideLoading();
        return;
    }

    const playPromise = DOM.audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                // Autoplay permitido
                State.audioPlaying = true;
                updatePlayButton();
                fadeInAudio();
                hideLoading();
                Storage.set('experience_started', true);
            })
            .catch(() => {
                // Autoplay bloqueado - mostra botão de entrada
                DOM.audio.pause();
                State.audioPlaying = false;
                updatePlayButton();
                showEnterButton();
            });
    } else {
        // Navegadores antigos
        hideLoading();
    }
}

function startAudio() {
    if (State.audioError) return;

    const playPromise = DOM.audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                State.audioPlaying = true;
                updatePlayButton();
                fadeInAudio();
                hideLoading();
                Storage.set('experience_started', true);
            })
            .catch(() => {
                // Não foi possível tocar mesmo após interação
                hideLoading();
            });
    }
}

function fadeInAudio() {
    // Fade-in suave: 0 -> volume desejado em ~2s
    const targetVolume = State.volume;
    const steps = 20;
    const stepValue = targetVolume / steps;
    const stepDuration = 100; // ms
    let currentStep = 0;

    DOM.audio.volume = 0;

    if (State.fadeInterval) {
        clearInterval(State.fadeInterval);
    }

    State.fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.min(stepValue * currentStep, targetVolume);
        DOM.audio.volume = newVolume;

        if (currentStep >= steps) {
            clearInterval(State.fadeInterval);
            State.fadeInterval = null;
            DOM.audio.volume = targetVolume;
        }
    }, stepDuration);
}

function togglePlay() {
    if (State.audioError || !State.audioReady) return;

    if (State.audioPlaying) {
        DOM.audio.pause();
        State.audioPlaying = false;
    } else {
        const playPromise = DOM.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                State.audioPlaying = true;
            }).catch(() => {
                State.audioPlaying = false;
            });
        } else {
            State.audioPlaying = true;
        }
    }

    updatePlayButton();
}

function updatePlayButton() {
    if (State.audioPlaying) {
        DOM.iconPlay.style.display = 'none';
        DOM.iconPause.style.display = 'block';
        DOM.playBtn.setAttribute('aria-pressed', 'true');
        DOM.playBtn.setAttribute('aria-label', 'Pausar música');
    } else {
        DOM.iconPlay.style.display = 'block';
        DOM.iconPause.style.display = 'none';
        DOM.playBtn.setAttribute('aria-pressed', 'false');
        DOM.playBtn.setAttribute('aria-label', 'Tocar música');
    }
}

function disablePlayer() {
    DOM.player.classList.add('disabled');
    DOM.playBtn.disabled = true;
    DOM.progressBarContainer.style.pointerEvents = 'none';
}

// ============================================
// PLAYER UI
// ============================================

function initPlayer() {
    // Play/Pause
    DOM.playBtn.addEventListener('click', togglePlay);

    // Progress bar - click
    DOM.progressBarContainer.addEventListener('click', handleProgressClick);
    DOM.progressBarContainer.addEventListener('keydown', handleProgressKeydown);

    // Volume
    DOM.volumeBtn.addEventListener('click', toggleVolumeSlider);
    DOM.volumeSlider.addEventListener('click', handleVolumeClick);
    DOM.volumeSlider.addEventListener('keydown', handleVolumeKeydown);

    // Fecha volume ao clicar fora
    document.addEventListener('click', (e) => {
        if (!DOM.volumeBtn.contains(e.target) && !DOM.volumeSlider.contains(e.target)) {
            DOM.volumeSlider.style.display = 'none';
        }
    });
}

function updateProgressUI() {
    const audio = DOM.audio;
    if (!audio.duration || !isFinite(audio.duration)) return;

    const current = audio.currentTime || 0;
    const duration = audio.duration;
    const percent = (current / duration) * 100;

    DOM.progressBar.style.width = `${percent}%`;
    DOM.progressHandle.style.left = `${percent}%`;
    DOM.currentTime.textContent = formatTime(current);
    DOM.duration.textContent = formatTime(duration);

    // Atualiza ARIA
    DOM.progressBarContainer.setAttribute('aria-valuenow', Math.round(percent));
    DOM.progressBarContainer.setAttribute('aria-valuetext', `${formatTime(current)} de ${formatTime(duration)}`);
}

function handleProgressClick(e) {
    if (State.audioError || !State.audioReady) return;

    const rect = DOM.progressBarContainer.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (DOM.audio.duration && isFinite(DOM.audio.duration)) {
        DOM.audio.currentTime = percent * DOM.audio.duration;
        updateProgressUI();
    }
}

function handleProgressKeydown(e) {
    if (State.audioError || !State.audioReady) return;

    const step = 5; // 5% por tecla
    let percent = (DOM.audio.currentTime / DOM.audio.duration) * 100;

    if (e.key === 'ArrowLeft') {
        percent = Math.max(0, percent - step);
    } else if (e.key === 'ArrowRight') {
        percent = Math.min(100, percent + step);
    } else {
        return;
    }

    e.preventDefault();
    DOM.audio.currentTime = (percent / 100) * DOM.audio.duration;
    updateProgressUI();
}

function toggleVolumeSlider() {
    const isVisible = DOM.volumeSlider.style.display === 'block';
    DOM.volumeSlider.style.display = isVisible ? 'none' : 'block';
}

function handleVolumeClick(e) {
    const rect = DOM.volumeSlider.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    State.volume = percent;
    DOM.audio.volume = percent;
    updateVolumeDisplay();
    Storage.set('volume', percent);
}

function handleVolumeKeydown(e) {
    let percent = State.volume;

    if (e.key === 'ArrowLeft') {
        percent = Math.max(0, percent - 0.05);
    } else if (e.key === 'ArrowRight') {
        percent = Math.min(1, percent + 0.05);
    } else {
        return;
    }

    e.preventDefault();
    State.volume = percent;
    DOM.audio.volume = percent;
    updateVolumeDisplay();
    Storage.set('volume', percent);
}

function updateVolumeDisplay() {
    const percent = State.volume * 100;
    DOM.volumeLevel.style.width = `${percent}%`;
    DOM.volumeSlider.setAttribute('aria-valuenow', Math.round(percent));

    // Ícone de volume (simples: mudo ou não)
    const iconPath = percent === 0
        ? 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z'
        : percent < 0.5
        ? 'M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z'
        : 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';

    DOM.volumeBtn.querySelector('path').setAttribute('d', iconPath);
}

// ============================================
// EVENTOS GLOBAIS
// ============================================

function setupEvents() {
    // Botão de entrada (quando autoplay bloqueado)
    DOM.enterBtn.addEventListener('click', () => {
        startAudio();
    });

    // Fallback da logo principal
    DOM.mainLogo.onerror = () => {
        DOM.mainLogo.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'main-logo-fallback';
        fallback.textContent = 'EJC';
        fallback.style.cssText = 'font-size: clamp(3rem, 10vw, 6rem); font-weight: 200; letter-spacing: 0.4em; color: var(--color-text-primary); text-align: center;';
        DOM.logoContainer.appendChild(fallback);
    };

    // Pausa animações quando aba não está visível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && State.audioPlaying) {
            // Opcional: pausar quando sair da aba
            // DOM.audio.pause();
            // State.audioPlaying = false;
            // updatePlayButton();
        }
    });

    // Tecla espaço para play/pause
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            togglePlay();
        }
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    initAudio();
    initCountdown();
    initPlayer();
    setupEvents();
    initLoading();
}

// Inicia quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
