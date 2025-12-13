# 🧠 Gemini Insight Docs (RAG System)

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![ElysiaJS](https://img.shields.io/badge/ElysiaJS-23C4F8?style=for-the-badge&logo=elysia&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

> **Sistem Retrieval-Augmented Generation (RAG)** cerdas yang memungkinkan interaksi real-time dengan dokumen Anda menggunakan kekuatan Google Gemini AI.

---

## 👨‍💻 Author

**Akmal Jamil Andhika**

---

## 📖 Deskripsi Project

Project ini adalah implementasi backend modern untuk sistem **RAG (Retrieval-Augmented Generation)**. Sistem ini dirancang untuk membaca, mengindeks, dan memahami konteks dari berbagai file dokumen yang diunggah, memungkinkan pengguna untuk melakukan tanya-jawab (chat) dengan AI mengenai isi dokumen tersebut secara akurat dan real-time.

Dibangun di atas runtime **Bun** yang super cepat dan framework **Elysia JS**, arsitektur ini menjamin performa tinggi dan latensi rendah, sangat cocok untuk aplikasi berbasis AI dan WebSocket.

### 🛠️ Tech Stack

*   **Runtime**: [Bun](https://bun.sh) - JavaScript runtime all-in-one yang cepat.
*   **Framework**: [Elysia JS](https://elysiajs.com) - Framework backend ergonomis untuk Bun.
*   **Language**: TypeScript - Type safety untuk pengembangan yang robust.
*   **Database**: Supabase (PostgreSQL) - Penyimpanan data relasional yang handal.
*   **Storage**: Supabase Storage - Manajemen file yang aman dan terintegrasi.
*   **ORM**: Drizzle ORM - Type-safe SQL ORM.
*   **AI Engine**: Google Gemini AI - Model generatif untuk pemahaman konteks dan chat.

---

## 🚀 Fitur Utama

*   **Document Ingestion**: Upload dan parsing dokumen otomatis ke Supabase Storage.
*   **RAG Engine**: Pengambilan konteks cerdas dari database untuk memperkaya prompt AI.
*   **Real-time Chat**: Komunikasi dua arah menggunakan WebSocket untuk pengalaman chat yang responsif.
*   **Secure Authentication**: Sistem autentikasi berbasis JWT (JSON Web Token).

---

## ⚙️ Panduan Instalasi & Setup

Ikuti langkah-langkah berikut untuk menjalankan project ini di lingkungan lokal Anda.

### 1. Prerequisites

Pastikan Anda telah menginstal:
*   [Bun](https://bun.sh/) (v1.0+)
*   Akses ke project Supabase (Database & Storage)
*   API Key dari [Google AI Studio](https://aistudio.google.com/)

### 2. Clone Repository

```bash
git clone <repository-url>
cd rest-api
```

### 3. Konfigurasi Environment

Salin file contoh konfigurasi dan sesuaikan dengan kredensial Anda.

```bash
cp .env.example .env
```

Isi variabel berikut di file `.env`:

```env
# Server
APP_PORT=3000
NODE_ENV="development"

# Database & Auth
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET_KEY="your-secret-key"
JWT_EXPIRES_IN=86400

# Google AI
GEMINI_API_KEY="your-gemini-api-key"

# Supabase Storage
STORAGE_URL="https://your-project.supabase.co/storage/v1"
STORAGE_BUCKET="your-bucket-name"
STORAGE_API_KEY="your-service-role-key"
```

### 4. Install Dependencies

```bash
bun install
```

### 5. Database Migration

Siapkan skema database menggunakan Drizzle Kit:

```bash
# Generate migrasi SQL
bun run db:generate

# Terapkan migrasi ke database
bun run db:migrate
```

### 6. Menjalankan Server

Jalankan server dalam mode development:

```bash
bun run dev
```

Server akan aktif di `http://localhost:3000`.

---

## 📡 API Documentation

### WebSocket Chat Endpoint

Endpoint utama untuk berinteraksi dengan asisten AI.

- **URL**: `ws://localhost:3000/api/v1/ws`
- **Protocol**: WebSocket
- **Auth**: Memerlukan header Autentikasi (jika dikonfigurasi pada middleware global/group).

#### Request Payload (Client to Server)

Kirimkan pesan dalam format JSON string:

```json
{
  "message": "Apa kesimpulan dari dokumen laporan keuangan yang saya upload?"
}
```

#### Response Payload (Server to Client)

Server akan membalas dengan objek JSON:

```json
{
  "message": "Berdasarkan dokumen laporan keuangan...",
  "time": 1702456789000
}
```

### Struktur Folder Chat

Modul chat terletak di: `src/modules/chat/`

*   `index.ts`: Definisi rute WebSocket (`/ws`) dan handler koneksi.
*   `model.ts`: Skema validasi data request menggunakan Elysia type system.
*   `service.ts`: Logika bisnis integrasi dengan Gemini AI dan pengambilan konteks RAG.

---

License &copy; 2025 Akmal Jamil Andhika.
