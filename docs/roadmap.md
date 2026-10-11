# Roadmap belajar Microfrontend

Tujuan: memahami arsitektur melalui kode yang dapat dijalankan. Mulai dari React web, lalu lanjut ke React Native. Roadmap ini belum menandakan implementasinya selesai.

| Tahap | Materi | Coding/eksperimen | Tanda sudah paham |
| --- | --- | --- | --- |
| 0 | Workspace dan entry point | Jalankan shell, Account, Wealth sendiri | Bisa membedakan app, package, dan repo |
| 1 | Modular monolith | Dashboard lokal, pisahkan view/container/hook | Pemisahan folder belum menjadi release independen |
| 2 | Remote loading | Expose widget dan import dari remote | Melihat request entry dan bundle di Network |
| 3 | Horizontal/vertical | Dua widget di dashboard, screen detail terpisah | Satu domain dapat menyediakan widget dan screen |
| 4 | Shared dependencies | Shared React; eksperimen mismatch versi | Membedakan install dependency dan instance runtime |
| 5 | Kontrak dan state | Props identitas, callback navigasi, filter lokal | Remote tidak mengimpor store internal shell |
| 6 | Loading/error | Matikan remote, simulasikan error data | Slot lain tetap dapat digunakan |
| 7 | UI konsisten | Package UI, tokens, CSS Modules | Style modul tidak bocor ke modul lain |
| 8 | Security | Telaah sumber remote dan trust model | Federation bukan security sandbox |
| 9 | Release/rollback | Ganti versi remote dengan shell yang sama | Membuktikan release independen dengan artifact |
| 10 | React Native | PoC lanjutan dengan renderer native | Memahami batas JS update versus native binary |

## Pola belajar setiap tahap

1. Baca konsep singkat.
2. Baca file yang disebut dalam lesson.
3. Jalankan contoh.
4. Lakukan satu perubahan kecil.
5. Periksa hasil di browser/Network.
6. Kembalikan konfigurasi yang sengaja dirusak pada latihan.

## Contoh bisnis

Shell mengatur layout dan navigasi. Account mengurus ringkasan saldo/detail rekening. Wealth mengurus ringkasan portofolio/detail investasi. Data dan sesi memakai simulasi.

Tidak membuat satu aplikasi tambahan hanya untuk menyediakan dependency. Shared dependencies dikonfigurasi di peserta Federation; package UI dan contracts dipakai untuk source bersama.

## Prinsip yang harus diuji

- Memuat kode remote berbeda dengan mengambil data.
- UI presentational tidak perlu memiliki logic pengambilan data.
- Shared library tidak otomatis menjadi shared state.
- Library khusus domain boleh berbeda.
- React bersama membutuhkan versi dan renderer yang kompatibel.
- Error boundary membantu menangani error, bukan membatasi akses kode.
- Modul langsung dalam runtime shell harus dipercaya seperti kode shell.
- Kontrak yang berubah secara tidak kompatibel tetap membutuhkan koordinasi.
- Release independen perlu dibuktikan tanpa rebuild shell.

## Checklist contoh web

- [ ] Ketiga aplikasi berjalan sendiri.
- [ ] Shell memuat remote sungguhan.
- [ ] Dashboard horizontal dan screen vertical tersedia.
- [ ] Shared React konsisten dan diperiksa CI.
- [ ] Pergantian identitas simulasi memperbarui data.
- [ ] Kegagalan Wealth tidak menghilangkan Account.
- [ ] Loading kode dan loading data dapat diamati terpisah.
- [ ] Typecheck dan build lolos.
- [ ] Uji browser untuk navigasi dan remote failure lolos.
- [ ] Upgrade/rollback remote tanpa rebuild shell terbukti.
- [ ] README memiliki perintah yang telah diuji.

## Referensi

- [Desain teknis repo](superpowers/specs/2026-10-12-microfrontend-learning-design.md)
- [Roadmap lengkap di Notion](https://app.notion.com/p/3f6a90568946819091fbfeca30e9e11f)
- [Webpack Module Federation](https://webpack.js.org/plugins/module-federation-plugin/)
- [Shared dependencies](https://module-federation.io/configure/shared)
