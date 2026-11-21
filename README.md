# Tugas Praktikum 2

## Implementasi Tampilan Web Interaktif Menggunakan Komponen WebView pada Arsitektur Baru (Fabric) React Native

### Tujuan
Membuat aplikasi React Native yang menggunakan komponen WebView dengan mengaktifkan New Architecture (Fabric) serta mendukung interaksi dua arah antara React Native dan konten web.

### Teknologi
- React Native
- JavaScript
- React Native WebView (`react-native-webview`)
- Android Studio
- Visual Studio Code

### Fitur
- Menampilkan halaman web interaktif dengan counter dan tombol aksi.
- Mengirim pesan dari React Native ke halaman web menggunakan `injectJavaScript`.
- Menerima data/event dari halaman web ke React Native menggunakan `window.ReactNativeWebView.postMessage` dan `onMessage`.
- Indikator loading saat halaman web dimuat.

### Cara Menjalankan
1. Install dependensi:
   ```bash
   npm install
   ```
2. Pastikan `newArchEnabled=true` pada `android/gradle.properties`.
3. Jalankan aplikasi:
   ```bash
   npx react-native run-android
   ```
