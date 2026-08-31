/* ============================================================
   PÁGINA AGORASIM - Lógica
   ============================================================ */

(function() {
    "use strict";

    // ==================== ELEMENTOS ====================
    const logo = document.getElementById("agorasim-logo");
    const btnYoutube = document.getElementById("btn-youtube");
    const btnSpotify = document.getElementById("btn-spotify");
    const pdfViewer = document.getElementById("pdf-viewer");
    const pdfFallback = document.getElementById("pdf-fallback");
    const btnDownload = document.getElementById("btn-download");
    const btnDrive = document.getElementById("btn-drive");

    // Popup de sigilo
    const popup = document.getElementById("sigilo-popup");
    const popupTitle = document.getElementById("sigilo-title");
    const popupMessage = document.getElementById("sigilo-message");
    const popupCloseBtn = document.getElementById("sigilo-close-btn");

    // ==================== INICIALIZAÇÃO ====================
    function init() {
        applyConfig();
        setupPopup();
        setupPdfViewer();
    }

    // Aplica configurações do AGORASIM_CONFIG
    function applyConfig() {
        if (!window.AGORASIM_CONFIG) {
            console.error("AGORASIM_CONFIG não encontrado! Verifique se agorasim.js está carregado.");
            return;
        }

        const cfg = window.AGORASIM_CONFIG;

        // Logo
        if (logo && cfg.logo) {
            logo.src = cfg.logo;
        }

        // Links das músicas
        if (btnYoutube && cfg.music && cfg.music.youtube) {
            btnYoutube.href = cfg.music.youtube;
        }
        if (btnSpotify && cfg.music && cfg.music.spotify) {
            btnSpotify.href = cfg.music.spotify;
        }

        // Links do Livrão
        if (btnDownload && cfg.livrao && cfg.livrao.pdfUrl) {
            btnDownload.href = cfg.livrao.pdfUrl;
            if (cfg.livrao.downloadFilename) {
                btnDownload.setAttribute("download", cfg.livrao.downloadFilename);
            }
        }
        if (btnDrive && cfg.livrao && cfg.livrao.driveUrl) {
            btnDrive.href = cfg.livrao.driveUrl;
        }

        // PDF Viewer
        if (pdfViewer && cfg.livrao && cfg.livrao.pdfUrl) {
            pdfViewer.src = cfg.livrao.pdfUrl;
        }
    }

    // ==================== POPUP DE SIGILO ====================
    function setupPopup() {
        if (!window.AGORASIM_CONFIG || !window.AGORASIM_CONFIG.sigilo) return;

        const sigilo = window.AGORASIM_CONFIG.sigilo;

        // Preenche conteúdo
        if (popupTitle) popupTitle.textContent = sigilo.title || "Sigilo no EJC";
        if (popupMessage) popupMessage.innerHTML = sigilo.message || "";

        // Decide se mostra o popup
        const shouldShow = sigilo.alwaysShow || !sessionStorage.getItem("ejc_sigilo_dismissed");

        if (shouldShow) {
            showPopup();
        } else {
            hidePopup();
        }

        // Botão de fechar
        if (popupCloseBtn) {
            popupCloseBtn.addEventListener("click", () => {
                sessionStorage.setItem("ejc_sigilo_dismissed", "true");
                hidePopup();
            });
        }

        // Fechar com ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && popup && !popup.classList.contains("hidden")) {
                sessionStorage.setItem("ejc_sigilo_dismissed", "true");
                hidePopup();
            }
        });

        // Fechar clicando no overlay
        const overlay = document.querySelector(".sigilo-popup-overlay");
        if (overlay) {
            overlay.addEventListener("click", () => {
                sessionStorage.setItem("ejc_sigilo_dismissed", "true");
                hidePopup();
            });
        }
    }

    function showPopup() {
        if (!popup) return;
        popup.classList.remove("hidden");
        // Força reflow para animação
        void popup.offsetWidth;
        popup.classList.add("visible");
        document.body.style.overflow = "hidden";

        // Foco no botão de fechar para acessibilidade
        if (popupCloseBtn) popupCloseBtn.focus();
    }

    function hidePopup() {
        if (!popup) return;
        popup.classList.remove("visible");
        setTimeout(() => {
            popup.classList.add("hidden");
            document.body.style.overflow = "";
        }, 400);
    }

    // ==================== PDF VIEWER ====================
    function setupPdfViewer() {
        if (!pdfViewer) return;

        // Detecta se o navegador suporta PDF em iframe
        pdfViewer.addEventListener("error", () => {
            pdfViewer.classList.add("hidden");
            pdfFallback.classList.remove("hidden");
        });

        // Timeout de segurança
        setTimeout(() => {
            if (pdfViewer.contentDocument && pdfViewer.contentDocument.body &&
                pdfViewer.contentDocument.body.innerHTML === "") {
                pdfViewer.classList.add("hidden");
                pdfFallback.classList.remove("hidden");
            }
        }, 3000);
    }

    // ==================== INICIA ====================
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
