# EDBM Hukuk Bürosu Otomasyon Portalı

Bu repo, EDBM Hukuk Bürosu için geliştirilmiş modern, modüler ve güvenli bir dijital hukuk platformu projesini içerir. React.js tabanlı, Redux ile state yönetimi yapan ve Vite üzerinde çalışan bir Frontend uygulamasıdır.

Aşağıda projenin kurulum adımları, klasör yapısı (file map) ve kod mimarisine dair önemli detayları bulabilirsiniz. Projenin genel özelliklerini, amacını ve sunum detaylarını ise `Proje.md` dosyasından inceleyebilirsiniz.

---

## 🚀 Proje Kurulumu ve Çalıştırılması

Projeyi bilgisayarınızda çalıştırmak için sisteminizde **Node.js** (ve npm) kurulu olmalıdır.

1. **Bağımlılıkları Yükleme:**
   Terminali açıp proje kök dizinine gidin ve aşağıdaki komutla tüm paketleri yükleyin:
   ```bash
   npm install
   ```

2. **Projeyi Geliştirici Ortamında Başlatma (Dev Server):**
   Bağımlılıklar yüklendikten sonra geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   *Terminalde size projenin hangi adreste çalıştığı (genellikle `http://localhost:5173`) gösterilecektir.*

3. **Üretime (Production) Hazırlama:**
   Eğer projeyi yayına almak üzere derlemek isterseniz:
   ```bash
   npm run build
   ```

---

## 📂 Dosya Haritası (Folder Structure)

Proje, özellik tabanlı (Feature-Based) bir klasör yapısıyla ölçeklenebilir olarak tasarlanmıştır:

```text
hukuk-burosu-/
│
├── public/                 # Statik dosyalar
├── src/                    # Kaynak kodlar (Ana geliştirme dizini)
│   ├── components/         # React Bileşenleri (Rol ve işleve göre ayrılmıştır)
│   │   ├── admin/          # Yönetici (Admin) paneli bileşenleri
│   │   ├── auth/           # Giriş/Çıkış işlemleri (Login.jsx vb.)
│   │   ├── client/         # Müvekkil paneli bileşenleri
│   │   ├── common/         # Her yerde kullanılan ortak bileşenler (GlobalUI, LanguageSelector)
│   │   ├── documents/      # Evrak oluşturucu, PDF çıkarma ve şablon mekanizmaları
│   │   ├── landing/        # Ziyaretçi anasayfası, blog ve iletişim arayüzü
│   │   └── lawyer/         # Avukat paneli bileşenleri (Dava yönetimi, Takvim, Jitsi Meet)
│   │
│   ├── data/               # Sabit veri deposu
│   │   └── initialData.js  # Uygulama ilk kez açıldığında LocalStorage'a basılan Mock (Sahte) Veritabanı ve Çeviri Sözlükleri
│   │
│   ├── App.jsx             # Ana routing ve yetkilendirme yönlendirme merkezi
│   ├── index.css           # Tailwind CSS yapılandırması ve Global CSS ayarları
│   ├── main.jsx            # React uygulamasının DOM'a mount edildiği kök dosya
│   └── store.js            # Redux Toolkit merkez mağazası (Tüm state yönetimi burada gerçekleşir)
│
├── index.html              # Vite'in giriş noktası
├── package.json            # Proje bağımlılıkları ve scriptler
├── tailwind.config.js      # Tailwind tema ve renk yapılandırması
├── vite.config.ts          # Vite geliştirme ve derleme ayarları
├── Proje.md                # Proje hedefleri ve sunum notları
└── README.md               # Kurulum ve kod yapısı (Bu dosya)
```

---

## 🧠 Kodların ve Mimarinin Anlatımı

### 1. State Yönetimi ve Kalıcılık (Redux & LocalStorage)
Projede **Redux Toolkit** kullanılmaktadır. Uygulamanın tüm state (durum) yönetimi `store.js` dosyası içerisinde Slice'lara bölünmüştür (auth, cases, lawyers, clients, messages, documents vb.).
- Kullanıcı tarayıcıyı yenilese dahi verilerin kaybolmaması için **Redux middleware** yazılmış ve güncellenen durum anında `localStorage`'a kaydedilmiştir.
- İlk yüklemede, eğer tarayıcıda kayıtlı bir veri yoksa sistem `src/data/initialData.js` içindeki başlangıç verilerini çekip depoları doldurur.

### 2. Rol Tabanlı Erişim (Role-Based Access)
`App.jsx` dosyasında, Redux'taki `currentUser.role` durumuna bakılarak sayfa yönlendirmesi yapılır. 
Kullanıcı giriş yapmamışsa `LandingPage` veya `Login` ekranına yönlendirilir. Giriş yapmışsa rolüne göre `AdminDashboard`, `LawyerDashboard` veya `ClientDashboard` bileşenine aktarılır. Bu sayede hiçbir kullanıcı yetkisi olmayan panele erişemez.

### 3. Çoklu Dil Mekanizması (i18n Alternatifi)
Projede ek bir i18n kütüphanesi kullanılmadan, performanslı ve özelleştirilmiş bir dil sistemi (`initialData.js` içindeki `DICTIONARY` ve `autoTranslate` metodları) kurulmuştur. 
Mevcut dil durumu (TR/EN) Redux `ui` slice'ı içinde tutulur. `LanguageSelector.jsx` ile dil değiştirildiğinde, projeye entegre olan tüm componentler `useSelector` üzerinden anında re-render edilir.

### 4. PDF Çıktı ve Evrak Üretme (Document Generator)
Müvekkil ve Avukat kısımlarında yer alan **Evrak Oluşturma Sistemi** (`DocumentGenerator.jsx`), form üzerinden seçilen alanlara (Örn: Ceza Hukuku -> Ceza Savunma Dilekçesi) göre dinamik string birleştirme işlemi yapar. 
Çıktı almak istendiğinde **jsPDF** ve **html2canvas** kütüphaneleri devreye girerek, tarayıcıda gizli olarak oluşturulan DOM elementinin anlık bir resmini çeker ve bunu profesyonel bir A4 PDF formatına çevirip kullanıcıya indirttirir.

### 5. Görüntülü Görüşme (Jitsi Meet Entegrasyonu)
`VideoMeeting.jsx` dosyası içerisinde `@jitsi/react-sdk` kullanılmıştır. Avukat veya müvekkil sistemden "Toplantıya Katıl" dediğinde, sistem otomatik olarak projeye has, benzersiz bir toplantı odası ID'si üretir. Bu sayede kullanıcılar herhangi bir ek uygulamaya ihtiyaç duymadan, uygulama arayüzünü terk etmeden (iframe mantığıyla) şifreli P2P görüntülü görüşme gerçekleştirebilirler.

---

## 🛠 Kullanılan Temel Kütüphaneler

- **React.js (18.x):** Kullanıcı arayüzü
- **Redux Toolkit:** State yönetimi
- **Tailwind CSS:** Stil ve responsive grid altyapısı
- **Lucide React:** Modern ve hafif SVG ikon kütüphanesi
- **Recharts:** Dashboard finans ve istatistik veri görselleştirme grafikleri
- **jsPDF & html2canvas:** Tarayıcı tabanlı PDF üretimi
- **@jitsi/react-sdk:** Web tabanlı online video konferans altyapısı
