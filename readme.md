# Open Music API

## Gambaran Umum
Open Music API adalah layanan API RESTful untuk manajemen musik yang dikembangkan sebagai bagian dari kelas Belajar Membuat Aplikasi Back-End Fundamental di Dicoding. Aplikasi ini memungkinkan pengguna untuk mengelola lagu, playlist, dan autentikasi pengguna.

## Fitur
- Autentikasi dan otorisasi pengguna
- Manajemen musik (operasi CRUD)
- Manajemen playlist
- Kolaborasi lagu
- Validasi data
- Penanganan error
- Integrasi database

## Teknologi yang Digunakan
- Node.js
- Framework Hapi.js
- Database PostgreSQL
- JWT untuk autentikasi
- Validasi input menggunakan Joi
- Migrasi database menggunakan node-pg-migrate

## Dokumentasi API
### Endpoint Autentikasi
```
POST /authentications
PUT /authentications
DELETE /authentications
```

### Endpoint Lagu
```
POST /songs
GET /songs
GET /songs/{songId}
PUT /songs/{songId}
DELETE /songs/{songId}
```

### Endpoint Playlist
```
POST /playlists
GET /playlists
DELETE /playlists/{playlistId}
POST /playlists/{playlistId}/songs
GET /playlists/{playlistId}/songs
DELETE /playlists/{playlistId}/songs
```

## Cara Instalasi

1. Clone repositori ini
```bash
git clone https://github.com/namaanda/open-music-api.git
```

2. Install dependencies
```bash
npm install
```

3. Siapkan database PostgreSQL

4. Konfigurasi variabel lingkungan
```bash
cp .env.example .env
# Edit file .env sesuai konfigurasi Anda
```

5. Jalankan migrasi database
```bash
npm run migrate up
```

6. Jalankan server
```bash
# Development
npm run start-dev

# Production
npm run start
```

## Variabel Lingkungan
Pastikan untuk mengatur variabel lingkungan berikut di file `.env` Anda:
```
# Konfigurasi Server
HOST=localhost
PORT=5000

# Konfigurasi Database
PGUSER=user_database_anda
PGHOST=localhost
PGPASSWORD=password_database_anda
PGDATABASE=openmusicapi
PGPORT=5432

# JWT
ACCESS_TOKEN_KEY=kunci_token_akses_anda
REFRESH_TOKEN_KEY=kunci_token_refresh_anda
ACCESS_TOKEN_AGE=1800
```

## Pengujian
Jalankan suite pengujian:
```bash
npm run test
```

## Struktur Proyek
```
.
├── src/
│   ├── api/
│   ├── services/
│   ├── validator/
│   ├── utils/
│   └── server.js
├── migrations/
├── tests/
├── .env
└── package.json
```

## Cara Berkontribusi
1. Fork repositori
2. Buat branch fitur Anda (`git checkout -b fitur/FiturKeren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan FiturKeren'`)
4. Push ke branch (`git push origin fitur/FiturKeren`)
5. Buat Pull Request

## Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## Ucapan Terima Kasih
- [Dicoding Indonesia](https://www.dicoding.com/)
- [Dokumentasi Hapi.js](https://hapi.dev/)
- [Dokumentasi Node.js](https://nodejs.org/)

