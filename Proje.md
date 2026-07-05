## 1. Projenin Amacı ve Vizyonu
**EDBM Hukuk Portalı**, bir hukuk bürosunun hem iç operasyonlarını (avukat, dava, finans yönetimi) hem de müvekkil iletişimini dijitalleştiren kapsamlı bir otomasyon sistemidir. 

**Temel Hedef:** Geleneksel hukuk bürosu süreçlerini hızlandırmak, evrak karmaşasını bitirmek, müvekkillere güvenli bir dijital portal sunarak iletişimi şeffaflaştırmak ve uzaktan hukuki danışmanlık hizmetini (online görüşmeler ve ödemeler) tek bir platformda toplamaktır.

---

## 2. Kullanıcı Rolleri ve Yetkileri
Sistemde birbirine entegre çalışan üç ana rol bulunmaktadır:

### 👨‍💼 Yönetici (Admin) Paneli
- **Genel Bakış:** Büronun tüm istatistiklerini (Toplam müvekkil, aktif davalar, finansal durum) tek ekranda görebilme.
- **Kullanıcı Yönetimi:** Yeni avukat ve müvekkil profilleri oluşturma.
- **Finans Yönetimi:** Büronun tüm finansal akışını (tahsilatlar, bekleyen alacaklar) takip etme, yeni ödeme ve fatura kayıtları oluşturma.
- **Evrak ve Blog Yönetimi:** Sisteme global şablonlar yükleme ve anasayfa için blog yazıları yayınlama.

### ⚖️ Avukat (Lawyer) Paneli
- **Kişiselleştirilmiş Çalışma Alanı:** Sadece kendi atandığı müvekkilleri, davaları ve evrakları görebilme.
- **Dava ve Evrak Takibi:** Müvekkillerin dava süreçlerini yönetme, ilgili dosyaları yükleme ve PDF olarak görüntüleme.
- **Takvim ve Randevular:** Duruşmaları, müvekkil randevularını ve teslim tarihlerini takip etme. 
- **Güvenli Mesajlaşma & Görüntülü Görüşme:** Müvekkillerle sistem içi güvenli mesajlaşma ve entegre **Jitsi Meet** altyapısıyla tek tıkla görüntülü (online) görüşme başlatabilme.
- **Dilekçe / Evrak Üretici:** Sisteme girilen hızlı notlarla saniyeler içinde taslak dilekçe ve hukuki evrak (PDF formatında) üretebilme.
- **Web Mesajları:** Websitesi anasayfasından giriş yapmadan (ziyaretçi olarak) form dolduran kişilerin mesajlarını görüntüleyip yanıtlayabilme.

### 👤 Müvekkil (Client) Paneli
- **Şeffaf Takip:** Kendi davasının hangi aşamada olduğunu anlık olarak görebilme.
- **Evrak Erişimi:** Avukatının kendisiyle paylaştığı dilekçe, karar ve sözleşmeleri görüntüleme ve bilgisayarına PDF olarak indirebilme.
- **Online Ödeme Sistemi:** Kendi finans sekmesi altından avukata olan borçlarını (vekalet ücreti, masraf avansı vb.) görebilme ve **Kredi Kartı ile anında ödeme** yapabilme.
- **Avukatla Kesintisiz İletişim:** Avukatıyla anlık mesajlaşabilme ve planlanmış görüntülü görüşmelere katılabilme.

---

## 3. Öne Çıkan Gelişmiş Özellikler (Demo Sırasında Vurgulanacaklar)

- **Çoklu Dil Desteği (TR/EN):** Uygulama arayüzü tek tuşla Türkçe ve İngilizce arasında geçiş yapabilir, çeviriler anlık gerçekleşir.
- **Dilekçe / Evrak Üretici Modülü (Document Generator):** Klasik süreçte saatler sürecek bir dilekçe hazırlığı (örn: İhtarname, Boşanma Protokolü), form üzerinden seçilen parametrelerle otomatik oluşturulur, düzenlenir ve PDF formatında yazdırılabilir/indirilebilir.
- **Online Görüntülü Danışmanlık:** Dışarıdan Zoom, Google Meet linki atmak yerine platform içinde Jitsi altyapısı kullanılarak özel şifreli odalarda görüntülü görüşme başlatılır. (Uygulamadan çıkış yapmadan!)
- **Entegre Kredi Kartı Ödeme Sistemi:** Müvekkilin hesabına tanımlanan bekleyen faturalar, müvekkil panelindeki "Ödeme Yap" butonu üzerinden simüle edilmiş sanal POS (kredi kartı arayüzü) ile tahsil edilebilir ve anında avukatın muhasebe kayıtlarına yansır.
- **PDF Önizleme ve İndirme:** Yüklenen evraklar ve oluşturulan taslaklar için ek bir yazılıma gerek kalmadan tarayıcı içinde A4 boyutunda izleme ve PDF çıkarma yeteneği (html2canvas & jspdf).
- **Ziyaretçi Yönetimi (Leads):** Anasayfadaki formlardan gelen talepler otomatik olarak bir "Aday Müvekkil (Lead)" kaydına dönüşür. Seçili avukatın "Web Mesajları" sekmesine düşer; eğer "Genel Danışmanlık" seçilmişse, tüm avukatlar ortak gelen kutusundan konuya yanıt verebilir.

---

## 4. Kullanılan Teknolojiler (Tech Stack)

- **Frontend Core:** React.js (Fonksiyonel component yapısı), Vite (Hızlı build ve dev server)
- **Styling & UI:** Tailwind CSS (Modern, cam efekti - glassmorphism, karanlık mod destekli premium estetik)
- **State Management (Durum Yönetimi):** Redux Toolkit & LocalStorage. Veriler (avukatlar, müvekkiller, davalar, mesajlar) Redux store'da tutulur ve LocalStorage'a yazılır. Tarayıcı yenilendiğinde hiçbir veri kaybolmaz.
- **İkonlar ve Grafikler:** Lucide React (Minimalist vektör ikonlar) & Recharts (Finans/Dava istatistik grafikleri)
- **PDF ve Çıktı:** jsPDF, html2canvas (DOM üzerindeki React elementlerini okuyup resme çevirerek PDF basar)
- **Görüntülü İletişim:** `@jitsi/react-sdk` (Jitsi Meet Entegrasyonu, şifreli p2p bağlantı sağlar)
- **Responsive Tasarım:** Mobil, tablet ve masaüstü cihazlar için tamamen duyarlı (responsive) grid ve flexbox mimarisi.

---

## 5. Proje Mimarisi ve Dosya Yapısı

Proje, bakımı kolay ve ölçeklenebilir (scalable) olması adına modüler bir React klasör yapısına (Feature-Based Structure) göre tasarlanmıştır:

- **`src/store.js`**: Uygulamanın beyni. Redux slice'ları (auth, cases, clients, documents, finances, vb.) burada tanımlanır. Tüm state güncellemeleri buradan yönetilir.
- **`src/data/initialData.js`**: Projenin ilk açılışında LocalStorage'ı dolduran "mock" veritabanı. Dil sözlükleri (TR/EN çevirileri), örnek avukatlar, davalar ve geçmiş ödeme bilgileri burada yer alır.

**Component Hiyerarşisi (`src/components/`)**
Uygulama bileşenleri roller bazında klasörlenmiştir:
- **`auth/`**: Giriş (Login) ekranı. Rol tabanlı yönlendirme mantığı burada çalışır.
- **`landing/`**: Sisteme giriş yapmamış ziyaretçilerin gördüğü Landing Page (Anasayfa), Hakkımızda, Hizmetler ve Blog sayfaları.
- **`common/`**: Dil seçici (`LanguageSelector`), Global UI elemanları gibi her rolde kullanılan ortak bileşenler.
- **`admin/`**: Büronun yöneticisine özel genel özet (Overview), finans (FinancesTab) ve global belge yönetimi (DocumentsTab).
- **`lawyer/`**: Avukata özel; ajanda (CalendarTab), dava detay (CasesTab), anlık mesaj (MessagesTab), Jitsi görüntülü görüşme (`VideoMeeting.jsx`) ve dilekçe üretici (`DocumentGenerator`).
- **`client/`**: Müvekkilin yalnızca kendi davalarını ve finansal yükümlülüklerini gördüğü kısıtlı ama güvenli izleme ekranı (`ClientDashboard`).

---

## 6. Sunum Akışı ve Ekip Görev Dağılımı

Projenin kapsamlı yapısını en iyi şekilde aktarabilmek için sunum dört ana bölüme ayrılmış ve takım üyelerine paylaştırılmıştır. Aşağıdaki akış, projenin hem teknik altyapısını hem de kullanıcı deneyimini mantıksal bir sırayla izleyicilere sunmayı hedefler.

### 👤 1. Kısım: Proje Tanıtımı, Giriş Sistemi ve Genel Arayüz – **Dilek**
**Odak Noktası:** Projenin genel vizyonunun aktarılması, dışarıya dönük yüzünün (Landing Page) ve ziyaretçi iletişiminin tanıtılması.

**Anlatılacak Dosyalar:**
- **`components/auth/`**: `Login.jsx`
- **`components/common/`**: `GlobalUI.jsx`, `LanguageSelector.jsx`
- **`components/landing/`**: `LandingPage.jsx`, `AboutUs.jsx`, `ServiceDetail.jsx`, `BlogsTab.jsx`, `BlogDetail.jsx`

**Anlatılacak Konular:**
- Projenin amacı ve EDBM Hukuk Bürosu yönetim sisteminin genel vizyonu
- Sistemdeki kullanıcı rolleri (Admin, Avukat, Müvekkil)
- Giriş (Login) sistemi ve kimlik doğrulama
- Dinamik dil desteği (TR/EN)
- Landing Page (Anasayfa), Hakkımızda ve Hizmetler bölümleri
- Blog sistemi ve ziyaretçi arayüzü

---

### 👤 2. Kısım: Admin Paneli ve Büro Yönetimi – **Muhammed**
**Odak Noktası:** Hukuk bürosunun tepe yönetiminin (Admin) sistemi nasıl kontrol ettiğinin ve genel istatistiklerin nasıl işlediğinin gösterilmesi.

**Anlatılacak Dosyalar:**
- **`components/admin/`**: `AdminDashboard.jsx`, `OverviewTab.jsx`, `ClientsTab.jsx`, `DocumentsTab.jsx`, `FinancesTab.jsx`

**Anlatılacak Konular:**
- Admin Dashboard genel yapısı ve modüler sekmeler
- Dashboard kartları ve genel istatistiklerin okunması
- Müvekkil yönetimi (Yeni müvekkil/avukat ekleme işlemleri)
- Büronun genel evrak ve global şablon yönetimi
- Finans yönetimi (Gelir/gider dengesi, tahsilat ve alacak takibi)

---

### 👤 3. Kısım: Avukat Paneli, Dava Yönetimi ve İletişim – **Ezgi**
**Odak Noktası:** Projenin en teknik ve kapsamlı kısmıdır. Bir avukatın günlük operasyonlarını (dava, müvekkil iletişimi, duruşma takibi) dijitalde nasıl yürüttüğünün detaylı bir şekilde aktarılması.

**Anlatılacak Dosyalar:**
- **`components/lawyer/`**: `LawyerDashboard.jsx`, `LawyerDetail.jsx`, `CasesTab.jsx`, `CalendarTab.jsx`, `MessagesTab.jsx`, `WebMessagesTab.jsx`, `LegalDetail.jsx`, `VideoMeeting.jsx`
- **`components/client/`**: `ClientCaseDetail.jsx` *(Müvekkil gözünden dava detay ekranı ile entegrasyonu)*

**Anlatılacak Konular:**
- Avukat paneline genel bakış ve özelleştirilmiş çalışma alanı
- Dava yönetimi, dava detaylarının güncellenmesi ve aşamaların takibi
- Müvekkil dava detay ekranı
- Duruşma takvimi yönetimi
- Sistem içi güvenli mesajlaşma ve dışarıdan gelen web mesajlarının yanıtlanması
- **Jitsi Meet** altyapısı ile anlık görüntülü görüşme (Online Danışmanlık)

---

### 👤 4. Kısım: Müvekkil Paneli ve Evrak Oluşturma Sistemi (Kapanış) – **Beyza**
**Odak Noktası:** Projenin en inovatif özelliklerinden olan otomatik dilekçe üretiminin ve müvekkilin sisteme dahil olduğu interaktif kısımların (kredi kartı ödemesi vb.) vurgulanması. Sunumun akılda kalıcı, güçlü bir finalle bitirilmesi.

**Anlatılacak Dosyalar:**
- **`components/client/`**: `ClientDashboard.jsx`
- **`components/documents/`**: `DocumentGenerator.jsx`, `DocumentTemplatePreview.jsx`, `documentTemplates.js`

**Anlatılacak Konular:**
- Müvekkil panelinin kullanıcı dostu yapısı ve davasını şeffaf takip edebilmesi
- Avukatın paylaştığı belgeleri görüntüleme ve sistemin işleyişi
- **Entegre Ödeme Sistemi** ile müvekkilin avukata borçlarını ödemesi
- **Evrak / Dilekçe Oluşturma Sistemi:** Hukuk alanlarına (Ceza, İcra, vb.) göre şablonlar
- Girilen form verileriyle anında düzenlenebilir dilekçe taslağı oluşturma, avukat onayı mantığı
- PDF üretme ve yazdırma (Print) işlemleri
