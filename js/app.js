/* ============================================================
   LIVRÃO - APP
   9º Encontro de Jovens com Cristo
   ============================================================ */

(function() {
    "use strict";

    // ==================== ESTADO ====================
    const state = {
        pdfDoc: null,
        currentPage: 1,
        totalPages: 0,
        scale: 1.2,
        minScale: 0.5,
        maxScale: 3.0,
        isRendering: false,
        thumbnailsRendered: false,
        audioCtx: null,
        wasPlaying: false
    };

    // ==================== ELEMENTOS ====================
    const el = {};

    function cacheElements() {
        // Loading
        el.loading = document.getElementById("loading");
        el.loadingLogo = document.getElementById("loading-logo");
        el.loadingBar = document.getElementById("loading-bar-fill");

        // Modal
        el.modal = document.getElementById("sigilo-modal");
        el.modalTitle = document.getElementById("sigilo-title");
        el.modalBody = document.getElementById("sigilo-body");
        el.modalAccept = document.getElementById("sigilo-accept");

        // Header
        el.headerLogo = document.getElementById("header-logo");
        el.headerTitle = document.getElementById("header-title");
        el.headerSubtitle = document.getElementById("header-subtitle");

        // PDF
        el.pdfSection = document.getElementById("pdf-section");
        el.canvas = document.getElementById("pdf-canvas");
        el.ctx = el.canvas.getContext("2d");
        el.pageCurrent = document.getElementById("page-current");
        el.pageTotal = document.getElementById("page-total");
        el.btnPrev = document.getElementById("btn-prev");
        el.btnNext = document.getElementById("btn-next");
        el.btnZoomIn = document.getElementById("btn-zoom-in");
        el.btnZoomOut = document.getElementById("btn-zoom-out");
        el.zoomLevel = document.getElementById("zoom-level");
        el.btnFullscreen = document.getElementById("btn-fullscreen");
        el.pdfViewport = document.getElementById("pdf-viewport");
        el.pdfPlaceholder = document.getElementById("pdf-placeholder");
        el.thumbnailsTrack = document.getElementById("thumbnails-track");
        el.thumbScrollLeft = document.getElementById("thumb-scroll-left");
        el.thumbScrollRight = document.getElementById("thumb-scroll-right");
        el.progressFill = document.getElementById("pdf-progress-fill");

        // Actions
        el.btnDownload = document.getElementById("btn-download");
        el.btnDrive = document.getElementById("btn-drive");
        el.btnYoutube = document.getElementById("btn-youtube");
        el.btnSpotify = document.getElementById("btn-spotify");

        // Music player
        el.audio = document.getElementById("audio-el");
        el.mpPlay = document.getElementById("mp-play");
        el.mpIconPlay = document.getElementById("mp-icon-play");
        el.mpIconPause = document.getElementById("mp-icon-pause");
        el.mpTitle = document.getElementById("mp-title");
        el.mpArtist = document.getElementById("mp-artist");
        el.mpTime = document.getElementById("mp-time");
        el.mpDuration = document.getElementById("mp-duration");
        el.mpProgressBar = document.getElementById("mp-progress-bar");
        el.mpProgressFill = document.getElementById("mp-progress-fill");
        el.mpMute = document.getElementById("mp-mute");
        el.mpIconVol = document.getElementById("mp-icon-vol");
        el.mpIconMute = document.getElementById("mp-icon-mute");
        el.mpVolumeBar = document.getElementById("mp-volume-bar");
        el.mpVolumeFill = document.getElementById("mp-volume-fill");
        el.musicPlayer = document.getElementById("music-player");
    }

    // ==================== INIT ====================
    function init() {
        cacheElements();
        applyConfig();
        setupSigilo();
        setupMusicPlayer();
        loadPDF();
        setupEvents();
        setupKeyboard();
    }

    // ==================== CONFIG ====================
    function applyConfig() {
        if (!window.CONFIG) {
            console.error("CONFIG não encontrado!");
            return;
        }
        const C = window.CONFIG;

        // Header
        if (el.headerLogo && C.logo) el.headerLogo.src = C.logo;
        if (el.loadingLogo && C.logo) el.loadingLogo.src = C.logo;
        if (el.headerTitle && C.eventName) el.headerTitle.textContent = C.eventName;
        if (el.headerSubtitle && C.subtitle) el.headerSubtitle.textContent = C.subtitle;
        document.title = (C.eventName || "Livrão") + " | " + (C.subtitle || "");

        // Actions
        if (el.btnDownload && C.pdf) {
            el.btnDownload.href = C.pdf.url;
            if (C.pdf.downloadFilename) {
                el.btnDownload.setAttribute("download", C.pdf.downloadFilename);
            }
        }
        if (el.btnDrive && C.pdf && C.pdf.driveUrl) {
            el.btnDrive.href = C.pdf.driveUrl;
        }
        if (el.btnYoutube && C.themeMusic && C.themeMusic.youtube) {
            el.btnYoutube.href = C.themeMusic.youtube;
        }
        if (el.btnSpotify && C.themeMusic && C.themeMusic.spotify) {
            el.btnSpotify.href = C.themeMusic.spotify;
        }

        // Music
        if (C.music) {
            el.audio.src = C.music.file;
            el.mpTitle.textContent = C.music.title || "Música";
            el.mpArtist.textContent = C.music.artist || "";
            el.audio.volume = (C.music.volume !== undefined) ? C.music.volume : 0.5;
            updateVolumeUI();
        }
    }

    // ==================== SIGILO ====================
    function setupSigilo() {
        if (!window.CONFIG || !window.CONFIG.sigilo) return;
        const S = window.CONFIG.sigilo;

        if (el.modalTitle) el.modalTitle.textContent = S.title || "Sigilo";
        if (el.modalBody) el.modalBody.innerHTML = S.message || "";

        const shouldShow = S.alwaysShow || 
            (!S.dismissForSession || !sessionStorage.getItem("ejc_sigilo_dismissed"));

        if (shouldShow) {
            setTimeout(() => openModal(), 800);
        }

        if (el.modalAccept) {
            el.modalAccept.addEventListener("click", () => {
                sessionStorage.setItem("ejc_sigilo_dismissed", "true");
                closeModal();
            });
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && el.modal.classList.contains("open")) {
                closeModal();
            }
        });

        document.querySelector(".modal-backdrop")?.addEventListener("click", closeModal);
    }

    function openModal() {
        if (!el.modal) return;
        el.modal.classList.remove("hidden");
        void el.modal.offsetWidth;
        el.modal.classList.add("open");
        document.body.style.overflow = "hidden";
        setTimeout(() => el.modalAccept?.focus(), 100);
    }

    function closeModal() {
        if (!el.modal) return;
        el.modal.classList.remove("open");
        setTimeout(() => {
            el.modal.classList.add("hidden");
            document.body.style.overflow = "";
        }, 500);
    }

    // ==================== PDF ====================
    async function loadPDF() {
        if (!window.CONFIG || !window.CONFIG.pdf || !window.CONFIG.pdf.url) {
            showPDFError();
            finishLoading();
            return;
        }

        try {
            // Configura worker do PDF.js
            pdfjsLib.GlobalWorkerOptions.workerSrc = 
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

            updateLoadingBar(20);

            const loadingTask = pdfjsLib.getDocument({
                url: window.CONFIG.pdf.url,
                disableStream: false,
                disableAutoFetch: false
            });

            loadingTask.onProgress = (progress) => {
                if (progress.total > 0) {
                    const pct = Math.min(80, 20 + (progress.loaded / progress.total) * 60);
                    updateLoadingBar(pct);
                }
            };

            state.pdfDoc = await loadingTask.promise;
            state.totalPages = state.pdfDoc.numPages;

            updateLoadingBar(90);

            if (el.pageTotal) el.pageTotal.textContent = state.totalPages;

            await renderPage(1);
            updateLoadingBar(95);

            renderThumbnails();
            updateLoadingBar(100);

            updateControls();
            finishLoading();

        } catch (err) {
            console.error("Erro ao carregar PDF:", err);
            showPDFError();
            finishLoading();
        }
    }

    function updateLoadingBar(pct) {
        if (el.loadingBar) el.loadingBar.style.width = pct + "%";
    }

    function finishLoading() {
        setTimeout(() => {
            if (el.loading) el.loading.classList.add("done");
            setTimeout(() => {
                if (el.loading) el.loading.style.display = "none";
            }, 800);
        }, 400);
    }

    function showPDFError() {
        if (el.pdfPlaceholder) el.pdfPlaceholder.classList.remove("hidden");
        if (el.canvas) el.canvas.style.display = "none";
    }

    async function renderPage(num) {
        if (!state.pdfDoc || state.isRendering) return;
        state.isRendering = true;

        // Animação de saída
        el.canvas.classList.add("changing");

        await new Promise(r => setTimeout(r, 150));

        try {
            const page = await state.pdfDoc.getPage(num);
            const viewport = page.getViewport({ scale: state.scale });

            // Ajusta canvas para alta DPI
            const dpr = window.devicePixelRatio || 1;
            el.canvas.width = viewport.width * dpr;
            el.canvas.height = viewport.height * dpr;
            el.canvas.style.width = viewport.width + "px";
            el.canvas.style.height = viewport.height + "px";

            el.ctx.scale(dpr, dpr);

            await page.render({
                canvasContext: el.ctx,
                viewport: viewport
            }).promise;

            state.currentPage = num;
            if (el.pageCurrent) el.pageCurrent.textContent = num;

            // Progresso
            const progress = state.totalPages > 0 ? (num / state.totalPages) * 100 : 0;
            if (el.progressFill) el.progressFill.style.width = progress + "%";

            // Animação de entrada
            el.canvas.classList.remove("changing");

            updateControls();
            updateThumbnails();

        } catch (err) {
            console.error("Erro ao renderizar página:", err);
        } finally {
            state.isRendering = false;
        }
    }

    async function renderThumbnails() {
        if (!state.pdfDoc || state.thumbnailsRendered) return;
        state.thumbnailsRendered = true;

        const track = el.thumbnailsTrack;
        if (!track) return;
        track.innerHTML = "";

        const thumbScale = 0.2;

        for (let i = 1; i <= state.totalPages; i++) {
            try {
                const page = await state.pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: thumbScale });

                const thumbDiv = document.createElement("div");
                thumbDiv.className = "thumb-item" + (i === 1 ? " active" : "");
                thumbDiv.dataset.page = i;
                thumbDiv.title = "Página " + i;

                const thumbCanvas = document.createElement("canvas");
                thumbCanvas.width = viewport.width;
                thumbCanvas.height = viewport.height;
                thumbCanvas.style.width = "100%";
                thumbCanvas.style.height = "100%";

                thumbDiv.appendChild(thumbCanvas);

                const pageNum = document.createElement("span");
                pageNum.className = "thumb-page-num";
                pageNum.textContent = i;
                thumbDiv.appendChild(pageNum);

                thumbDiv.addEventListener("click", () => {
                    if (!state.isRendering) renderPage(i);
                });

                track.appendChild(thumbDiv);

                await page.render({
                    canvasContext: thumbCanvas.getContext("2d"),
                    viewport: viewport
                }).promise;

            } catch (err) {
                console.warn("Erro na miniatura " + i, err);
            }
        }
    }

    function updateThumbnails() {
        document.querySelectorAll(".thumb-item").forEach(thumb => {
            const page = parseInt(thumb.dataset.page);
            thumb.classList.toggle("active", page === state.currentPage);
        });

        // Scroll para a miniatura ativa
        const activeThumb = document.querySelector(".thumb-item.active");
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
    }

    function updateControls() {
        if (el.btnPrev) el.btnPrev.disabled = state.currentPage <= 1;
        if (el.btnNext) el.btnNext.disabled = state.currentPage >= state.totalPages;
        if (el.zoomLevel) el.zoomLevel.textContent = Math.round(state.scale * 100 / 1.2) + "%";
    }

    function prevPage() {
        if (state.currentPage > 1 && !state.isRendering) {
            renderPage(state.currentPage - 1);
        }
    }

    function nextPage() {
        if (state.currentPage < state.totalPages && !state.isRendering) {
            renderPage(state.currentPage + 1);
        }
    }

    function zoomIn() {
        if (state.scale < state.maxScale) {
            state.scale += 0.2;
            renderPage(state.currentPage);
        }
    }

    function zoomOut() {
        if (state.scale > state.minScale) {
            state.scale -= 0.2;
            renderPage(state.currentPage);
        }
    }

    function toggleFullscreen() {
        const elem = el.pdfSection;
        if (!document.fullscreenElement) {
            elem.requestFullscreen?.().catch(() => {});
        } else {
            document.exitFullscreen?.().catch(() => {});
        }
    }

    // ==================== MUSIC PLAYER ====================
    function setupMusicPlayer() {
        el.audio.loop = true;

        // Play/Pause
        el.mpPlay?.addEventListener("click", togglePlay);

        // Progress
        el.mpProgressBar?.addEventListener("click", (e) => {
            const rect = el.mpProgressBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            if (el.audio.duration) el.audio.currentTime = pct * el.audio.duration;
        });

        // Volume
        el.mpVolumeBar?.addEventListener("click", (e) => {
            const rect = el.mpVolumeBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            el.audio.volume = Math.max(0, Math.min(1, pct));
            el.audio.muted = false;
            updateVolumeUI();
        });

        el.mpMute?.addEventListener("click", () => {
            el.audio.muted = !el.audio.muted;
            updateVolumeUI();
        });

        // Time update
        el.audio.addEventListener("timeupdate", () => {
            if (!el.audio.duration) return;
            const pct = (el.audio.currentTime / el.audio.duration) * 100;
            if (el.mpProgressFill) el.mpProgressFill.style.width = pct + "%";
            if (el.mpTime) el.mpTime.textContent = fmtTime(el.audio.currentTime);
        });

        el.audio.addEventListener("loadedmetadata", () => {
            if (el.mpDuration) el.mpDuration.textContent = fmtTime(el.audio.duration);
        });

        el.audio.addEventListener("play", updatePlayIcon);
        el.audio.addEventListener("pause", updatePlayIcon);

        // Visibility
        document.addEventListener("visibilitychange", () => {
            if (document.hidden && !el.audio.paused) {
                el.audio.pause();
                state.wasPlaying = true;
            } else if (!document.hidden && state.wasPlaying) {
                el.audio.play().catch(() => {});
                state.wasPlaying = false;
            }
        });

        // Tentar autoplay
        attemptAutoplay();
    }

    async function attemptAutoplay() {
        try {
            await el.audio.play();
            fadeInAudio();
        } catch {
            // Autoplay bloqueado, aguarda interação
        }
    }

    function fadeInAudio() {
        const C = window.CONFIG?.music;
        const targetVol = C?.volume ?? 0.5;
        const duration = C?.fadeInDuration ?? 2000;
        const steps = 30;
        const stepVal = targetVol / steps;
        const stepMs = duration / steps;
        let step = 0;

        el.audio.volume = 0;
        const interval = setInterval(() => {
            step++;
            el.audio.volume = Math.min(step * stepVal, targetVol);
            updateVolumeUI();
            if (step >= steps) clearInterval(interval);
        }, stepMs);
    }

    function togglePlay() {
        if (el.audio.paused) {
            el.audio.play().catch(() => {});
        } else {
            el.audio.pause();
        }
    }

    function updatePlayIcon() {
        const isPlaying = !el.audio.paused;
        el.mpIconPlay?.classList.toggle("hidden", isPlaying);
        el.mpIconPause?.classList.toggle("hidden", !isPlaying);
    }

    function updateVolumeUI() {
        const vol = el.audio.muted ? 0 : el.audio.volume;
        if (el.mpVolumeFill) el.mpVolumeFill.style.width = (vol * 100) + "%";
        if (el.mpIconVol) el.mpIconVol.classList.toggle("hidden", vol === 0);
        if (el.mpIconMute) el.mpIconMute.classList.toggle("hidden", vol > 0);
    }

    function fmtTime(s) {
        if (!s || isNaN(s)) return "00:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    }

    // ==================== EVENTS ====================
    function setupEvents() {
        // PDF nav
        el.btnPrev?.addEventListener("click", prevPage);
        el.btnNext?.addEventListener("click", nextPage);
        el.btnZoomIn?.addEventListener("click", zoomIn);
        el.btnZoomOut?.addEventListener("click", zoomOut);
        el.btnFullscreen?.addEventListener("click", toggleFullscreen);

        // Thumbnail scroll
        el.thumbScrollLeft?.addEventListener("click", () => {
            el.thumbnailsTrack?.scrollBy({ left: -200, behavior: "smooth" });
        });
        el.thumbScrollRight?.addEventListener("click", () => {
            el.thumbnailsTrack?.scrollBy({ left: 200, behavior: "smooth" });
        });

        // Touch swipe no canvas
        let touchStartX = 0;
        el.canvas?.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        el.canvas?.addEventListener("touchend", (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextPage();
                else prevPage();
            }
        }, { passive: true });
    }

    // ==================== KEYBOARD ====================
    function setupKeyboard() {
        document.addEventListener("keydown", (e) => {
            if (el.modal?.classList.contains("open")) return;

            switch(e.key) {
                case "ArrowLeft":
                case "PageUp":
                    e.preventDefault();
                    prevPage();
                    break;
                case "ArrowRight":
                case "PageDown":
                case " ":
                    e.preventDefault();
                    nextPage();
                    break;
                case "Home":
                    e.preventDefault();
                    if (!state.isRendering) renderPage(1);
                    break;
                case "End":
                    e.preventDefault();
                    if (!state.isRendering) renderPage(state.totalPages);
                    break;
                case "+":
                case "=":
                    e.preventDefault();
                    zoomIn();
                    break;
                case "-":
                    e.preventDefault();
                    zoomOut();
                    break;
                case "f":
                case "F":
                    if (e.target.tagName !== "INPUT") {
                        e.preventDefault();
                        toggleFullscreen();
                    }
                    break;
            }
        });
    }

    // ==================== START ====================
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
