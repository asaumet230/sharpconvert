# 🖼️ SharpConvert

**SharpConvert** is a fast and intuitive web application that allows users to convert multiple images into different formats using the power of the [Sharp](https://sharp.pixelplumbing.com/) image processing library. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, it's optimized for performance and responsive design across all devices.

---

## 🌟 Features

- Drag-and-drop or manual file upload (up to 20 images at once).
- Supported output formats: **WEBP, PNG, JPG, JPEG, AVIF**.
- Real-time image previews with original size.
- Conversion progress bar with visual feedback.
- Download converted images individually or as a ZIP file.
- Option to reset and start over.
- Daily conversion limit control (e.g., max 100 images per IP).
- Fully responsive: optimized for mobile, tablets, and desktop.

---

## 🧪 Tech Stack

- **Frontend**: Next.js App Router, React, Tailwind CSS, animate.css, SweetAlert2.
- **Backend**: Node.js (via Next.js API Routes), [Sharp](https://sharp.pixelplumbing.com/) for image conversion, Archiver for ZIP generation.
- **Helpers & Services**: Organized logic for validation, ZIP building, API calls.
- **TypeScript**: Strongly typed interfaces and props.

---

## 🚀 Getting Started

```bash
git clone https://github.com/asaumet230/sharpconvert
cd sharpconvert
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Folder Structure

```plaintext
├── app/
│   └── api/
│       ├── convert-images/         # Converts uploaded images to target format using Sharp
│       └── convert-images-zip/     # Converts and packages images into ZIP file
├── components/                     # Reusable UI components
├── interfaces/                     # TypeScript interfaces
├── services/                       # API calls and logic separation
├── helpers/                        # Image/file validation and utilities
├── public/                         # Static files (logo, screenshots)
└── styles/                         # Global styles (Tailwind config)
```

---

## ✨ About Sharp

[Sharp](https://sharp.pixelplumbing.com/) is a high-performance Node.js library for image resizing, conversion, and transformation. It's widely used for server-side image processing due to its speed and efficiency.

SharpConvert uses Sharp under the hood to handle all image format conversions with quality compression and support for modern formats like AVIF and WEBP.

---

## 👨‍💻 Author

Developed by **Andrés Felipe Saumet**  
GitHub: [@asaumet230](https://github.com/asaumet230/)

---

## 🌐 Versión en Español

**SharpConvert** es una aplicación web para convertir imágenes fácilmente entre formatos como **WEBP, PNG, JPG, JPEG y AVIF** usando la poderosa librería [Sharp](https://sharp.pixelplumbing.com/).

### 🔧 Características

- Carga de hasta 20 imágenes con vista previa.
- Conversión rápida y visual con barra de progreso.
- Descarga individual o en archivo ZIP.
- Límite de conversión diaria (100 imágenes por IP).
- Diseño responsive para todos los dispositivos.

### ⚙️ Tecnologías

- **Next.js**, **Tailwind CSS**, **TypeScript**.
- **Sharp** como motor de conversión en el backend.
- **Archiver** para generar archivos `.zip`.
- SweetAlert2 y animate.css para una mejor experiencia.

---

## 📦 Instalación rápida

```bash
git clone https://github.com/asaumet230/sharpconvert
cd sharpconvert
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📄 License

MIT © 2025 — Libre para uso personal o comercial.