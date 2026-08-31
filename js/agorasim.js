/* ============================================================
   CONFIGURAÇÕES CENTRALIZADAS - EJC
   Edite apenas este arquivo para personalizar links e mensagens
   ============================================================ */

const AGORASIM_CONFIG = {
    // ========================================================
    // DATA DO EVENTO
    // Quando chegar esta data, o botão "Abrir Livrão" aparece
    // Formato ISO 8601 com timezone de Brasília (UTC-3)
    // ========================================================
    targetDate: "2026-09-02T00:00:00-03:00",

    // ========================================================
    // LINKS DAS MÚSICAS TEMA
    // ========================================================
    music: {
        youtube: "https://www.youtube.com/watch?v=EXEMPLO",      // <-- Cole aqui o link do YouTube
        spotify: "https://open.spotify.com/track/EXEMPLO"         // <-- Cole aqui o link do Spotify
    },

    // ========================================================
    // LINKS DO LIVRÃO (PDF)
    // ========================================================
    livrao: {
        pdfUrl: "https://exemplo.com/livrao.pdf",                // <-- URL direto do PDF (para visualização e download)
        driveUrl: "https://drive.google.com/file/d/EXEMPLO/view", // <-- Link de visualização do Google Drive
        downloadFilename: "Livrao-9-EJC.pdf"                      // <-- Nome do arquivo no download
    },

    // ========================================================
    // CONFIGURAÇÕES DO POPUP DE SIGILO
    // ========================================================
    sigilo: {
        // Título do popup
        title: "Sigilo no EJC",

        // Mensagem do popup (pode usar HTML para quebras de linha)
        message: `Queridos encontreios e encontristas, o EJC precisa do sigilo, não vamos acabar com o segredo e a magia do encontro.<br><br>
        <strong>Cuidado ao postar em redes sociais!</strong><br><br>
        • Não mostre o QR Code<br>
        • Não mostre o nome dos círculos/equipes<br>
        • Não mostre os momentos<br><br>
        <em>Sejamos sigilosos!</em>`,

        // Se true, o popup aparece SEMPRE que a página é carregada
        // Se false, aparece apenas uma vez por sessão (usando sessionStorage)
        alwaysShow: true
    },

    // ========================================================
    // CONFIGURAÇÕES DO INDEX (página principal)
    // ========================================================
    index: {
        // Texto do botão que aparece quando a contagem termina
        buttonText: "Abrir Livrão",

        // Para onde o botão redireciona
        redirectUrl: "./agorasim.html"
    },

    // ========================================================
    // LOGO DO EVENTO
    // ========================================================
    logo: "./assets/Design sem nome_20260810_142421_0000.png"
};

// Exporta para uso em outros arquivos (se necessário)
if (typeof module !== "undefined" && module.exports) {
    module.exports = AGORASIM_CONFIG;
}
