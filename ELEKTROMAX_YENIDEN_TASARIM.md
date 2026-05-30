# Elektromax Web Sitesi – Yeniden Tasarım ve Deploy Özeti

## Yapılanlar

### 1. Çok Dilli Sistem (NL / EN / TR)
- **Flemenkçe (NL)** → birincil dil
- **İngilizce (EN)** → ikincil dil  
- **Türkçe (TR)** → üçüncü dil
- Tarayıcı dili otomatik algılanır, seçim kaydedilir
- Header'da `NL | EN | TR` butonları

### 2. Yeni / Güncellenen Dosyalar

```
src/
├── content/
│   └── i18n.ts                  ← Tüm çeviriler (NL/EN/TR) + hizmet/proje içerikleri
├── context/
│   └── LanguageContext.tsx      ← Dil state'i ve useLanguage() hook'u
├── components/
│   ├── LanguageSwitcher.tsx     ← NL/EN/TR toggle butonu
│   ├── WhatsAppButton.tsx       ← Floating WA butonu (numara korumalı)
│   ├── SiteHeader.tsx           ← Yeni header (dil seçici + numara koruması)
│   ├── SiteFooter.tsx           ← Güncellendi
│   ├── Layout.tsx               ← WhatsApp butonu eklendi
│   └── Button.tsx               ← Değişmedi
├── pages/
│   ├── Home.tsx                 ← Çevrildi
│   ├── Services.tsx             ← Çevrildi
│   ├── ServiceDetail.tsx        ← Yeniden yazıldı
│   ├── Contact.tsx              ← Formspree entegrasyonu + WA
│   ├── About.tsx                ← Çevrildi
│   ├── Projects.tsx             ← Çevrildi
│   └── NotFound.tsx             ← Güncellendi
└── App.tsx                      ← BrowserRouter + 3 dil rotası

public/
├── 404.html                     ← GitHub Pages SPA routing hilesi
├── CNAME                        ← maxelektro.be
└── .htaccess                    ← (OVHcloud için, GitHub'da kullanılmaz)

.github/
└── workflows/
    └── deploy.yml               ← Otomatik build + GitHub Pages deploy

index.html                       ← SPA redirect handler eklendi
vite.config.ts                   ← base: "/" (custom domain)
```

### 3. Telefon Numarası Koruması
Numara kaynak kodda düz metin olarak **asla** yer almıyor.  
Runtime'da parçalardan birleştiriliyor:
```ts
const PHONE_PARTS = ["+32", "485", "77", "26", "30"]
// → "+32 485 77 26 30" (sadece JS çalıştığında görünür)
```

### 4. WhatsApp Butonu
- Sağ alt köşede sabit yeşil buton
- Numara yine parçalı: `["32","4857","72630"]`
- Tıklanınca dile göre hazır mesajla WA açılıyor

### 5. Formspree (İletişim Formu)
Gerçek `fetch()` entegrasyonu — form verisi gerçekten gidiyor.

**Yapılacak tek şey:**
```
src/pages/Contact.tsx → satır 10:
const FORMSPREE_ID = "YOUR_FORM_ID";  // ← buraya Formspree ID'sini yaz
```

Formspree kurulumu:
1. [formspree.io](https://formspree.io) → giriş yap (mbilalc33@gmail.com)
2. New Form → email: `info@maxelektro.be`
3. Form ID'yi kopyala → `Contact.tsx`'e yapıştır

### 6. Routing
- `HashRouter` → `BrowserRouter` geçişi (SEO için)
- `public/404.html` GitHub Pages'te tüm route'ları `index.html`'e yönlendiriyor
- Her dil için ayrı URL'ler:
  - NL: `/diensten`, `/projecten`, `/over-ons`, `/contact`
  - EN: `/services`, `/projects`, `/about`, `/contact`
  - TR: `/hizmetler`, `/projeler`, `/hakkimizda`, `/iletisim`

---

## GitHub Pages Deploy

### Repo: `hakofis/elektromax`

#### Adım 1 – Custom domain ekle
GitHub → repo Settings → Pages → Custom domain → `maxelektro.be` → Save

#### Adım 2 – Dosyaları projeye kopyala
`C:\Users\mehme\Documents\Claude\Projects\Elektromax\` klasöründeki yeni dosyaları  
`C:\Users\mehme\Documents\Elektromax-web\` klasörüne kopyala:

```
Kopyalanacaklar:
src/content/i18n.ts
src/context/LanguageContext.tsx
src/components/LanguageSwitcher.tsx
src/components/WhatsAppButton.tsx
src/components/SiteHeader.tsx      (üzerine yaz)
src/components/SiteFooter.tsx      (üzerine yaz)
src/components/Layout.tsx          (üzerine yaz)
src/pages/Home.tsx                 (üzerine yaz)
src/pages/Services.tsx             (üzerine yaz)
src/pages/ServiceDetail.tsx        (üzerine yaz)
src/pages/Contact.tsx              (üzerine yaz)
src/pages/About.tsx                (üzerine yaz)
src/pages/Projects.tsx             (üzerine yaz)
src/pages/NotFound.tsx             (üzerine yaz)
src/App.tsx                        (üzerine yaz)
public/404.html                    (yeni)
public/CNAME                       (yeni)
index.html                         (üzerine yaz)
vite.config.ts                     (üzerine yaz)
.github/workflows/deploy.yml       (yeni — klasörü oluştur)
```

#### Adım 3 – Formspree ID'yi ekle
```ts
// src/pages/Contact.tsx
const FORMSPREE_ID = "buraya_id_yaz";
```

#### Adım 4 – Commit & Push
GitHub Desktop ile ya da terminal:
```bash
cd C:\Users\mehme\Documents\Elektromax-web
git add .
git commit -m "feat: multilingual redesign NL/EN/TR + Formspree + WhatsApp"
git push origin main
```

Push sonrası GitHub Actions ~2 dakikada build edip yayınlar.

---

## DNS Ayarları (maxelektro.be → GitHub Pages)

OVHcloud DNS yöneticisinde:

| Tip   | İsim | Değer                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | hakofis.github.io.     |

DNS propagasyonu: 1–24 saat

---

## Deploy Sonrası Kontrol Listesi

- [ ] `https://maxelektro.be` açılıyor
- [ ] `/diensten` route'u çalışıyor (404 yok)
- [ ] Dil seçici (NL / EN / TR) çalışıyor
- [ ] WhatsApp butonu açılıyor
- [ ] İletişim formu mesaj gönderiyor (info@maxelektro.be'ye geliyor)
- [ ] HTTPS aktif (yeşil kilit)
- [ ] Mobil görünüm düzgün

---

## İletişim Bilgileri (Sitede Kullanılan)

- **Telefon:** +32 485 77 26 30 *(korumalı — parçalı saklıyor)*
- **E-posta:** a.maxelektro@gmail.com
- **Form hedefi:** info@maxelektro.be
- **Instagram/X:** @amax5522
- **WhatsApp:** +32 485 77 26 30
