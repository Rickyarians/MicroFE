# MicroFE

Repo belajar microfrontend melalui contoh dashboard bank, menggunakan React web dan TypeScript.

## Status

Roadmap dan desain awal tersedia. Kode aplikasi belum diimplementasikan; perintah install, build, dan dev akan ditambahkan setelah implementasi dan verifikasi.

## Mulai membaca

- [Roadmap belajar](docs/roadmap.md)
- [Desain teknis](docs/superpowers/specs/2026-10-12-microfrontend-learning-design.md)
- [Panduan konsep di Notion](https://app.notion.com/p/3f6a905689468165bdb8d8714bb21cdd)
- [Roadmap di Notion](https://app.notion.com/p/3f6a90568946819091fbfeca30e9e11f)

## Target contoh

Shell menyusun dashboard dari widget Account dan Wealth. Setiap remote bisa berjalan sendiri, memiliki build sendiri, dan berkomunikasi melalui kontrak props/callback. Data serta sesi merupakan simulasi untuk belajar, bukan integrasi perbankan produksi.

Materi awal memakai React web. React Native menjadi PoC lanjutan setelah mekanisme Federation di web dipahami.
