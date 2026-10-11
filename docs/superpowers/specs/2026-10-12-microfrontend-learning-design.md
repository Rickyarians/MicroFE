# Desain MicroFE Learning Lab

Status: desain awal untuk ditinjau sebelum implementasi.

## Tujuan dan konteks

Pengguna ingin belajar microfrontend melalui roadmap dan kode dalam repo Rickyarians/MicroFE. Pembahasan sebelumnya mencakup horizontal composition, screen versus widget, pemisahan UI dan logic, shared dependencies, singleton, perbedaan versi/library, dan keamanan.

Repo masih kosong ketika diperiksa. Ini proyek belajar baru, bukan perubahan terhadap aplikasi bank yang sudah berjalan.

Keberhasilan berarti pengguna dapat menjalankan contoh, melihat remote JavaScript di Network, mengubah satu fitur secara mandiri, serta membuktikan kegagalan dan pembaruan remote tanpa membangun ulang shell.

## Pendekatan

Gunakan satu monorepo dengan npm workspaces, React, TypeScript, dan Module Federation bawaan Webpack. Pilihan ini mempertahankan konfigurasi shared yang telah dipelajari dan menghindari pengaturan banyak repository.

Alternatif multirepo menambah beban pengelolaan dependency. Memulai dari React Native menambah persoalan binary/native sebelum konsep runtime web dikuasai. Keduanya menjadi materi lanjutan, bukan prasyarat contoh web.

Versi konkret dependency dipilih saat implementasi berdasarkan kompatibilitas yang diverifikasi, dipin di package.json dan lockfile. React dan React DOM disamakan di seluruh aplikasi. Tidak menggunakan tag latest sebagai spesifikasi versi.

## Struktur yang akan dibuat

| Lokasi | Tanggung jawab |
| --- | --- |
| apps/shell | Layout, navigasi, pengguna simulasi, lazy remote loading, fallback |
| apps/account | Widget saldo, detail rekening, data simulasi rekening |
| apps/wealth | Widget portofolio, detail investasi, filter dan data simulasi |
| examples/local-dashboard | Pembanding modular monolith sebelum Federation |
| packages/contracts | Tipe props, route tujuan dan kontrak layanan |
| packages/ui | Button, Card dan token sederhana |
| docs/lessons | Petunjuk, eksperimen, hasil yang diharapkan, troubleshooting |
| scripts | Pemeriksaan versi dependency inti dan demo release |
| tests | Uji integrasi yang penting untuk kontrak dan remote loading |

Setiap aplikasi memiliki entry, package.json, dev server, output build, dan nama runtime unik. Shell menggunakan port 3000; Account 3001; Wealth 3002. Source remote tidak diimpor langsung oleh shell.

Package bersama adalah package source/build, bukan aplikasi keempat yang menyediakan seluruh dependency. UI dibagikan saat build sebagai package workspace pada tahap awal; React dibagikan saat runtime melalui Federation.

## Alur pengguna

1. Membuka shell dan melihat dashboard dengan dua slot.
2. Shell memuat AccountSummary dan WealthSummary melalui remote entry.
3. Setiap container menampilkan skeleton ketika mengambil data simulasi.
4. Pengguna memilih identitas simulasi; kedua widget menyesuaikan datanya.
5. Tombol detail meminta shell menjalankan navigasi melalui callback.
6. Shell memasang screen detail yang diekspor domain terkait.
7. Pengguna kembali ke dashboard dan dapat mengubah filter internal Wealth.

Account dan Wealth juga menyediakan halaman standalone dengan mock kontrak agar dapat dikembangkan tanpa shell.

## Kontrak dan kepemilikan state

Widget menerima customerId dan callback navigasi yang bertipe. customerId hanya konteks, bukan kredensial atau otorisasi.

Shell memiliki route dan pengguna simulasi. Remote memiliki state fitur, container, hooks, service simulasi, dan view. Remote tidak mengakses store atau router internal shell. View menerima data dan callbacks; hook/service menangani operasi async.

Filter Wealth tidak masuk shared global store. Shared Zustand, bila dibahas dalam latihan, tidak otomatis berarti dua aplikasi menggunakan store instance yang sama.

Kontrak layanan simulasi mencakup operasi membaca saldo dan portofolio. Implementasinya memakai fixture deterministik dengan latensi dan kegagalan yang dapat diatur, sehingga loading data berbeda dari loading kode dapat diamati tanpa backend produksi.

## Konfigurasi Federation

Account mengekspos AccountSummary dan AccountDetailScreen. Wealth mengekspos WealthSummary dan PortfolioScreen. Nama container dan output.uniqueName berbeda untuk setiap aplikasi.

React dan React DOM memakai singleton, requiredVersion dari dependency aplikasi, serta strictVersion pada plugin Webpack. Library khusus fitur tidak wajib masuk shared.

Bootstrap async memberi waktu inisialisasi shared sebelum aplikasi mengonsumsi dependency. Detail subpath React/React DOM yang benar-benar diimpor diperiksa saat build dan pengujian runtime agar tidak ada salinan tidak sengaja.

Latihan ketidakcocokan versi dijalankan sebagai fixture terpisah; konfigurasi default tetap bekerja. Contoh tidak menyatakan bahwa singleton dapat membuat versi yang tidak kompatibel menjadi kompatibel.

## Loading, error dan isolasi

Setiap slot mempunyai Suspense fallback dan error boundary. Error API ditangani remote, bukan diasumsikan tertangkap error boundary.

Saat remote server mati sebelum halaman dimuat, slot tersebut menampilkan unavailable dan reload action yang jelas; slot lain tetap tampil. Retry pemuatan kode pada contoh awal melalui reload halaman untuk menghindari janji bahwa React.lazy yang sudah menolak selalu dapat dicoba ulang hanya dengan reset boundary.

Error render dan error data mempunyai latihan terpisah. CSS Modules menjaga class lokal; aturan global dibatasi pada shell/reset yang disengaja.

## Keamanan contoh

Semua data dan sesi bersifat simulasi. Tidak ada token, rekening atau transaksi nyata.

Remote yang dipasang langsung dipercaya setara dengan kode shell; Federation dan error boundary bukan security sandbox. Remote URL berasal dari konfigurasi proyek, bukan input pengguna/query string.

Dokumentasi membahas pipeline terpercaya, artifact immutable, sumber remote, otorisasi backend, dan perbedaan iframe sandbox. Demo tidak mengklaim memiliki autentikasi/otorisasi produksi.

## Release dan rollback lokal

Bangun shell satu kali. Fixture release menyediakan dua artifact Wealth dengan versi berbeda. Shell membaca konfigurasi lokasi remote yang dapat diubah tanpa mengubah bundle shell.

Server fixture melayani artifact versi A dan B pada path terpisah. Pengguna mengganti pilihan konfigurasi, membuka sesi halaman baru, dan melihat versi yang aktif. Rollback mengarahkan konfigurasi ke A kembali. Kode yang sudah berjalan tidak diganti di tengah sesi.

Pemeriksaan membuktikan hash artifact shell tidak berubah ketika versi remote diganti. Ini menunjukkan independensi release; hosting publik dan rollout produksi belum menjadi bagian demo lokal.

## Roadmap penyampaian

Tahap 0–1: workspace dan pembanding lokal.
Tahap 2–3: remote loading dan horizontal/vertical composition.
Tahap 4–5: shared dependencies dan kontrak komunikasi.
Tahap 6: loading, error dan failure isolation.
Tahap 7–8: UI konsisten dan trust model.
Tahap 9: build terpisah, konfigurasi runtime dan rollback lokal.
Tahap 10: PoC React Native terpisah setelah web selesai.

Contoh web lengkap meliputi tahap 0–9. Setiap tahap memiliki lesson berbahasa Indonesia, eksperimen dan hasil yang dapat diperiksa. Riwayat commit/milestone digunakan sebagai checkpoint; tidak membuat branch permanen per pelajaran.

## Verifikasi

- Typecheck dan production build untuk seluruh aplikasi.
- Pemeriksaan CI versi React/React DOM yang disepakati.
- Browser integration: dashboard berisi dua widget dan request remote terlihat.
- Navigation: callback membuka screen yang benar dan dapat kembali.
- Identity: pergantian customer simulasi tidak menampilkan data customer sebelumnya.
- Failure: Wealth tidak tersedia; Account tetap dapat dipakai.
- Data failure: error API simulasi berbeda dari kegagalan bundle.
- Release fixture: versi Wealth berubah dan rollback berhasil tanpa perubahan artifact shell.
- README: perintah install, dev, build dan verifikasi dijalankan sebelum dinyatakan bekerja.

Pengujian memeriksa perilaku arsitektur penting, bukan hanya mengulang implementasi komponen presentational.

## Di luar cakupan web awal

Backend bank, SSO produksi, transaksi nyata, banyak framework dalam satu halaman, app khusus dependency, hosting publik otomatis, dan implementasi React Native. Materi native tetap ada dalam roadmap tetapi mempunyai desain dan verifikasi binary tersendiri.
