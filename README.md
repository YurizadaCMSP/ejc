# 9º Encontro de Jovens com Cristo

**Paróquia Nossa Senhora Aparecida do Cocaia**

Um site elegante, minimalista e otimizado para o 9º Encontro de Jovens com Cristo. Desenvolvido com HTML5, CSS3 e JavaScript puro — sem frameworks, sem dependências.

---

## 📁 Estrutura do Projeto

```
/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos completos
├── js/
│   └── script.js       # Lógica do site
├── assets/
│   ├── logo.png        # Logo do evento (com fundo transparente)
│   └── music.mp3       # Música de fundo
└── README.md           # Este arquivo
```

---

## 🚀 Como Personalizar

Todas as configurações estão concentradas no **início do arquivo `js/script.js`**.

Abra o arquivo `js/script.js` e localize a seção `CONFIG` (linhas 12-35 aproximadamente):

```javascript
const CONFIG = {
    eventName: "9º Encontro de Jovens com Cristo da Paróquia Nossa Senhora Aparecida do Cocaia",
    targetDate: "2026-08-30T20:00:00-03:00",
    logo: "./assets/logo.png",
    music: {
        file: "./assets/music.mp3",
        title: "Nome da Música",
        artist: "Nome do Cantor"
    },
    initialVolume: 0.7,
    audioFadeInDuration: 2000,
    storageKey: "ejc_experience_started"
};
```

### 1. Como colocar a logo

1. Salve sua imagem de logo com **fundo transparente** (PNG recomendado).
2. Coloque o arquivo na pasta `assets/`.
3. No `js/script.js`, altere a linha:
   ```javascript
   logo: "./assets/logo.png"
   ```
   para o caminho correto, por exemplo:
   ```javascript
   logo: "./assets/minha-logo.png"
   ```

> **Importante:** A logo deve ter fundo transparente. Não altere a proporção original da imagem.

### 2. Como colocar a música

1. Converta sua música para formato **MP3**.
2. Coloque o arquivo na pasta `assets/`.
3. No `js/script.js`, altere a linha:
   ```javascript
   file: "./assets/music.mp3"
   ```
   para o caminho correto, por exemplo:
   ```javascript
   file: "./assets/minha-musica.mp3"
   ```

> **Dica:** Prefira arquivos MP3 de tamanho reduzido (até 5MB) para carregamento rápido.

### 3. Como alterar o nome da música

No `js/script.js`, altere:
```javascript
title: "Nome da Música"
```
para o nome real da música, por exemplo:
```javascript
title: "Ave Maria"
```

### 4. Como alterar o nome do cantor

No `js/script.js`, altere:
```javascript
artist: "Nome do Cantor"
```
para o nome do artista, por exemplo:
```javascript
artist: "Padre Marcelo Rossi"
```

### 5. Como alterar a data do evento

No `js/script.js`, altere:
```javascript
targetDate: "2026-08-30T20:00:00-03:00"
```

O formato é **ISO 8601** com timezone:
- `AAAA-MM-DD` = data
- `T` = separador
- `HH:MM:SS` = hora, minuto, segundo
- `-03:00` = timezone de Brasília (UTC-3)

**Exemplos:**
- 30 de agosto de 2026 às 20:00 (Brasília): `"2026-08-30T20:00:00-03:00"`
- 15 de setembro de 2026 às 19:30 (Brasília): `"2026-09-15T19:30:00-03:00"`

> **Atenção:** Não remova o `-03:00` no final. Isso garante que a contagem seja exata para o horário de Brasília, independente do fuso horário do dispositivo do usuário.

### 6. Como alterar o volume inicial

No `js/script.js`, altere:
```javascript
initialVolume: 0.7
```
Valores de `0.0` (mudo) a `1.0` (volume máximo).

---

## 🧪 Como Testar Localmente

### Opção 1: Abrir diretamente no navegador

1. Baixe todos os arquivos do projeto.
2. Coloque sua `logo.png` e `music.mp3` na pasta `assets/`.
3. Abra o arquivo `index.html` no navegador (Chrome, Firefox, Safari, Edge).

> **Nota:** Alguns navegadores podem bloquear o autoplay de áudio ao abrir localmente. Isso é normal e o site mostrará o botão "Viver Essa Experiência" para o usuário clicar.

### Opção 2: Servidor local (recomendado para testes mais precisos)

**Com Python:**
```bash
# Navegue até a pasta do projeto
cd caminho/do/projeto

# Python 3
python -m http.server 8000

# Acesse: http://localhost:8000
```

**Com Node.js (npx):**
```bash
# Navegue até a pasta do projeto
cd caminho/do/projeto

npx serve .

# Acesse: http://localhost:3000
```

**Com VS Code:**
Instale a extensão **"Live Server"** e clique em "Go Live".

---

## 🌐 Como Publicar na Vercel

### Método 1: Via Interface Web (mais simples)

1. Acesse [https://vercel.com](https://vercel.com) e faça login (pode usar GitHub, GitLab ou Bitbucket).
2. Clique em **"Add New..."** → **"Project"**.
3. Importe seu repositório Git ou faça upload dos arquivos.
4. A Vercel detectará automaticamente que é um site estático.
5. Clique em **"Deploy"**.
6. Pronto! Seu site estará online em segundos.

### Método 2: Via CLI (para quem usa Git)

1. Instale a Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. No terminal, navegue até a pasta do projeto:
   ```bash
   cd caminho/do/projeto
   ```

3. Execute:
   ```bash
   vercel
   ```

4. Siga as instruções (login, confirmação do projeto, etc.).
5. Ao final, receberá um link como `https://seu-projeto.vercel.app`.

### Método 3: Arrastar e Soltar (sem Git)

1. Compacte todos os arquivos do projeto em um `.zip`.
2. Acesse [https://vercel.com/new](https://vercel.com/new).
3. Arraste o arquivo `.zip` para a área indicada.
4. A Vercel fará o deploy automaticamente.

> **Importante:** Não é necessário configurar nada. O projeto é 100% estático e a Vercel já reconhece isso automaticamente.

---

## ⚡ Performance

- **Zero dependências** — apenas HTML, CSS e JavaScript puro
- **Zero frameworks** — React, Vue, Angular, jQuery, Bootstrap, Tailwind, GSAP, Three.js: **nenhum**
- **Animações GPU-accelerated** — apenas `transform` e `opacity`
- **Áudio otimizado** — `preload="metadata"`, fade-in suave, pausa automática em aba inativa
- **Mobile First** — responsivo de 320px a 1920px+
- **Acessibilidade** — ARIA labels, teclado, contraste, `prefers-reduced-motion`
- **Safe areas** — suporte a notch e áreas seguras (`env(safe-area-inset-bottom)`)

---

## 🎨 Paleta de Cores

| Cor | Uso |
|-----|-----|
| `#000000` | Fundo principal |
| `#ffffff` | Texto principal |
| `#e5e5e5` | Texto secundário |
| `#888888` | Labels e detalhes |
| `#1a1a1a` | Elementos escuros |
| `#f5c518` | **Contagem regressiva** (amarelo) |

---

## 📋 Checklist antes do Deploy

- [ ] Logo colocada em `assets/logo.png` (fundo transparente)
- [ ] Música colocada em `assets/music.mp3`
- [ ] Nome da música atualizado no `CONFIG.music.title`
- [ ] Nome do cantor atualizado no `CONFIG.music.artist`
- [ ] Data do evento atualizada no `CONFIG.targetDate`
- [ ] Caminho da logo verificado no `CONFIG.logo`
- [ ] Caminho da música verificado no `CONFIG.music.file`
- [ ] Testado no celular (Chrome/Safari)
- [ ] Testado no computador (Chrome/Firefox/Edge)

---

## 🙏 Sobre o Projeto

Site desenvolvido especialmente para o **9º Encontro de Jovens com Cristo** da **Paróquia Nossa Senhora Aparecida do Cocaia**.

Uma experiência digital minimalista, elegante e emocional para anunciar um grande momento de fé e encontro.

---

**Feito com ❤️ para o encontro.**
