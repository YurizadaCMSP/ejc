# 9º Encontro de Jovens com Cristo — Paróquia Nossa Senhora Aparecida do Cocaia

Site estático elegante e minimalista para o evento **9º Encontro de Jovens com Cristo**.

---

## 📁 Estrutura do Projeto

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── logo.png
│   └── music.mp3
└── README.md
```

---

## ⚙️ Como Personalizar

Todas as configurações estão concentradas no **início** do arquivo `js/script.js`.

Abra o arquivo e localize o objeto `CONFIG` (aproximadamente na linha 10):

```javascript
const CONFIG = {
    eventName: "9º Encontro de Jovens com Cristo da Paróquia Nossa Senhora Aparecida do Cocaia",
    targetDate: "2026-08-30T20:00:00-03:00",
    logo: "./assets/logo.png",
    music: {
        file: "./assets/music.mp3",
        title: "NOME DA MÚSICA",
        artist: "NOME DO CANTOR"
    }
};
```

### 1. Colocar a Logo

1. Salve sua imagem como **`logo.png`** (recomendado: PNG com fundo transparente).
2. Coloque o arquivo dentro da pasta **`assets/`**.
3. **Não precisa alterar nada no código** se usar o nome `logo.png`.

> Se quiser usar outro nome ou caminho, altere a linha:
> ```javascript
> logo: "./assets/logo.png"
> ```

### 2. Colocar a Música

1. Salve seu arquivo MP3 como **`music.mp3`**.
2. Coloque o arquivo dentro da pasta **`assets/`**.
3. **Não precisa alterar nada no código** se usar o nome `music.mp3`.

> Se quiser usar outro nome ou caminho, altere a linha:
> ```javascript
> file: "./assets/music.mp3"
> ```

### 3. Alterar o Nome da Música

No objeto `CONFIG`, altere:
```javascript
title: "NOME DA MÚSICA"
```

### 4. Alterar o Nome do Cantor/Artista

No objeto `CONFIG`, altere:
```javascript
artist: "NOME DO CANTOR"
```

### 5. Alterar a Data do Evento

No objeto `CONFIG`, altere:
```javascript
targetDate: "2026-08-30T20:00:00-03:00"
```

**Formato:** `AAAA-MM-DDTHH:MM:SS-03:00`

- `AAAA` = ano (ex: 2026)
- `MM` = mês (ex: 08)
- `DD` = dia (ex: 30)
- `HH` = hora (ex: 20)
- `MM` = minutos (ex: 00)
- `SS` = segundos (ex: 00)
- `-03:00` = fuso horário de Brasília (não altere se o evento for no Brasil)

**Exemplo para 15 de setembro de 2026 às 19:30:**
```javascript
targetDate: "2026-09-15T19:30:00-03:00"
```

---

## 🧪 Como Testar Localmente

### Opção 1: Abrir diretamente

1. Baixe todos os arquivos do projeto.
2. Coloque sua `logo.png` e `music.mp3` na pasta `assets/`.
3. Dê um duplo clique no arquivo `index.html`.

> ⚠️ **Atenção:** Alguns navegadores bloqueiam funcionalidades (como áudio) ao abrir arquivos diretamente do computador. Para testar o autoplay e o player corretamente, use a Opção 2.

### Opção 2: Servidor local (recomendado)

Se você tiver o **Python** instalado:

```bash
# Navegue até a pasta do projeto
cd ejc-cocaia

# Python 3
python -m http.server 8080

# Ou Python 2
python -m SimpleHTTPServer 8080
```

Depois abra no navegador: `http://localhost:8080`

### Opção 3: VS Code com Live Server

1. Instale a extensão **Live Server** no VS Code.
2. Clique com o botão direito no `index.html`.
3. Selecione **"Open with Live Server"**.

---

## 🚀 Como Publicar na Vercel

### Método 1: Deploy via GitHub (recomendado)

1. Crie um repositório no **GitHub**.
2. Envie todos os arquivos do projeto para o repositório.
3. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
4. Clique em **"Add New Project"**.
5. Selecione o repositório do projeto.
6. Clique em **"Deploy"**.

A Vercel detectará automaticamente que é um site estático e fará o deploy em segundos.

### Método 2: Deploy via CLI

1. Instale a Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. No terminal, navegue até a pasta do projeto:
   ```bash
   cd ejc-cocaia
   ```

3. Execute:
   ```bash
   vercel
   ```

4. Siga as instruções na tela.

### Método 3: Upload direto (drag and drop)

1. Acesse [vercel.com](https://vercel.com) e faça login.
2. Na dashboard, clique em **"Add New..."** → **"Project"**.
3. Selecione a opção **"Import Git Repository"** ou use a Vercel CLI.

> **Nota:** A Vercel não suporta upload direto de pasta via interface web. Use o GitHub ou a CLI.

---

## 🎨 Personalizações Avançadas (Opcional)

### Cores

As cores estão definidas no início do arquivo `css/style.css`, dentro de `:root`:

```css
:root {
    --color-bg: #000000;           /* Fundo principal */
    --color-text-primary: #ffffff;  /* Texto principal */
    --color-text-secondary: #a0a0a0;/* Texto secundário */
    --color-accent: #c9a96e;        /* Dourado sutil (destaques) */
    /* ... */
}
```

### Tamanho da Logo

A logo se adapta automaticamente, mas você pode ajustar os limites no CSS:

```css
.main-logo {
    width: clamp(160px, 32vw, 320px);
}
```

Altere os valores `160px` (mínimo), `32vw` (preferido) e `320px` (máximo).

---

## 📋 Checklist antes de Publicar

- [ ] Coloquei a `logo.png` na pasta `assets/`
- [ ] Coloquei a `music.mp3` na pasta `assets/`
- [ ] Alterei o nome da música em `js/script.js`
- [ ] Alterei o nome do cantor em `js/script.js`
- [ ] Verifiquei a data do evento em `js/script.js`
- [ ] Testei o site localmente
- [ ] Testei no celular (responsivo)
- [ ] Verifiquei se o áudio toca corretamente

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico
- **CSS3** puro (variáveis, flexbox, clamp, animações GPU-aceleradas)
- **JavaScript Vanilla** (ES6+)
- Nenhum framework, biblioteca ou dependência externa

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para o **9º Encontro de Jovens com Cristo da Paróquia Nossa Senhora Aparecida do Cocaia**.

---

**Dúvidas?** Verifique se as configurações no `js/script.js` estão corretas e se os arquivos `logo.png` e `music.mp3` estão na pasta `assets/`.
