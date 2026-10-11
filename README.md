# MicroFE boilerplate

Boilerplate React + TypeScript dengan Webpack Module Federation. Shell memuat widget dan screen dari satu remote contoh. Remote dapat dijalankan sendiri dan dibuild terpisah.

## Mulai

Gunakan Node.js 24 (`nvm use`), lalu:

```sh
npm ci
npm run dev
```

- Shell: http://localhost:3000
- Remote example: http://localhost:3001

Klik **Buka screen remote** untuk berpindah dari widget dashboard ke screen remote. Shell mengatur URL; remote menerima callback navigasi melalui contract.

## Struktur

```text
apps/shell       Layout, navigasi, runtime config, loading/error boundary
apps/example     Widget dan screen contoh, entry standalone
packages/ui      Komponen UI lokal untuk kedua aplikasi
packages/contracts  Tipe props untuk integrasi shell dan remote
scripts          Development, preview, validasi versi React
```

`packages/ui` dan `packages/contracts` adalah package workspace, bukan aplikasi atau server dependency tambahan. Keduanya disertakan pada build aplikasi yang menggunakannya.

## Shared dependencies

Konfigurasi ada di `webpack.common.cjs`. React dan React DOM memakai `singleton: true` agar runtime Federation menggunakan satu instance shared, `requiredVersion` dari manifest aplikasi, dan `strictVersion: true` agar versi yang tidak cocok ditolak. Setiap aplikasi tetap memiliki dependency dan fallback bundle sendiri untuk dapat berjalan standalone.

Gunakan versi React dan React DOM yang sama pada kedua manifest. `npm run check:dependencies` memeriksa kesesuaiannya. Library lain dapat menggunakan versi berbeda selama tidak bergantung pada identitas instance global yang sama.

## Konfigurasi remote

Shell membaca `apps/shell/public/runtime-config.js` sebelum menjalankan bundle. Ubah `exampleUrl` ke URL `remoteEntry.js` dari remote yang Anda deploy. Untuk mengubah deployment yang sudah dibuild, perbarui file `runtime-config.js` di hasil build shell; tidak perlu rebuild bundle shell.

Remote mengekspos `example/Widget` dan `example/Screen`. Untuk menambah remote, tambahkan app, nama container yang unik, konfigurasi `remotes`, deklarasi TypeScript, dan route atau area komposisinya.

Remote berjalan dengan hak akses JavaScript yang sama dengan shell. Gunakan hanya URL remote yang dipercaya, HTTPS di production, dan aturan CSP sesuai origin deployment. Authorization tetap harus ditegakkan di backend. Boilerplate ini belum menyediakan auth, API, atau konfigurasi production untuk hosting tertentu.

## Build dan verifikasi

```sh
npm run build
npm run preview
```

Build ada di masing-masing `apps/*/dist`. Deploy keduanya sebagai static assets; jangan menggabungkan direktori hasil build. Pertahankan chunk lama selama masih ada pengguna yang memuat versi sebelumnya. Hindari cache panjang untuk `remoteEntry.js` dan `runtime-config.js`; chunk dengan nama hash dapat dicache lebih lama.

```sh
npx playwright install chromium
npm run check
```

`check` menjalankan validasi dependency, TypeScript, production build, dan tes browser. Tes mencakup remote nyata, callback navigasi, deep link, standalone remote, error fallback, route tidak dikenal, runtime URL, dan deployment shell di subpath. `npm test` memerlukan hasil build sebelumnya. CI menjalankan proses yang sama.

Build aplikasi secara terpisah:

```sh
npm run build --workspace @microfe/shell
npm run build --workspace @microfe/example
```

Routing memakai hash sehingga static hosting tidak membutuhkan rewrite untuk deep link. Script preview hanya untuk verifikasi lokal.
