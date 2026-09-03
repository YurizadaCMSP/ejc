/* ============================================================
   CONFIGURAÇÕES DO LIVRÃO - EJC
   Edite apenas este arquivo para personalizar tudo
   ============================================================ */

const CONFIG = {
    // ========================================================
    // EVENTO
    // ========================================================
    eventName: "9º Encontro de Jovens com Cristo",
    subtitle: "Paróquia Nossa Senhora Aparecida do Cocaia",

    // ========================================================
    // LOGO (caminho da imagem)
    // ========================================================
    logo: "./assets/Design sem nome_20260810_142421_0000.png",

    // ========================================================
    // MÚSICA DE FUNDO
    // ========================================================
    music: {
        file: "./assets/music.mp3",
        title: "Perfume",
        artist: "Fraternidade São João Paulo II",
        volume: 0.5,
        fadeInDuration: 2000
    },

    // ========================================================
    // PDF DO LIVRÃO
    // ========================================================
    pdf: {
        url: "https://pub-6a54358c807845db8f1e3d0863fff2a0.r2.dev/Livr%C3%A3o%20EJC_20260902_220151_0000.pdf",           // URL do PDF (local ou externo)
        driveUrl: "https://drive.google.com/drive/folders/1Vjb2BQRYBAiDgKCLd5MaYRozV3zVU0uz", // Google Drive
        downloadFilename: "Livrao-9-EJC.pdf"   // Nome no download
    },

    // ========================================================
    // MÚSICA TEMA (links externos)
    // ========================================================
    themeMusic: {
        youtube: "https://youtu.be/bPNr8Wr3qkk?is=67x3_vD0PPJI__Y2",
        spotify: "https://open.spotify.com/track/5T4jd2BhpNRenNNKvHof2Y?si=k-e6nndMTkym_3e7LIymYA&utm_source=copy-link&sci=spotify%3Acard-config%3A6F568Zn43NxPVezy3lbHRj"
    },

    // ========================================================
    // POPUP DE SIGILO
    // ========================================================
    sigilo: {
        title: "Sigilo no EJC",
        message: `<p>Queridos encontreios e encontristas, o <strong>EJC precisa do sigilo</strong>, não vamos acabar com o segredo e a magia do encontro.</p>
        <p class="sigilo-warning">Cuidado ao postar em redes sociais!</p>
        <ul class="sigilo-list">
            <li>Não mostre o QR Code</li>
            <li>Não mostre o nome dos círculos/equipes</li>
            <li>Não mostre os momentos</li>
        </ul>
        <p class="sigilo-footer"><em>Sejamos sigilosos!</em></p>`,
        alwaysShow: true,  // true = aparece sempre que recarrega
        dismissForSession: false  // se true, lembra que fechou (sessionStorage)
    }
};
