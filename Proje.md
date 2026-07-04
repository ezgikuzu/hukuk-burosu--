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

## 6. Sunum Akışı İçin Tavsiyeler (Senaryo Önerisi)

1. **Karşılama & Landing Page:** Uygulamanın anasayfasını gösterin. Güven veren renk tonlarını ve tasarım şıklığını vurgulayın. "Ücretsiz Danışmanlık Alın" formunu doldurarak mesajın arka plana nasıl düştüğünü anlatın.
2. **Avukat Girişi:** Bir avukat (Örn: Ezgi Kuzu) rolüyle giriş yapın. Atanmış olan "1 aktif davayı", "duruşmaları" ve "gelen mesajları" gösterin.
3. **Evrak Oluşturma:** Avukat panelinden "Evrak Üretici" kısmına girin ve saniyeler içinde yeni bir "İhtarname" üretip PDF olarak çıktı almanın ne kadar kolay olduğunu sergileyin.
4. **Müvekkil Girişi & Ödeme:** Avukat hesabından çıkıp Müvekkil hesabıyla girin. Müvekkilin, davasının durumunu gördüğünü, avukatıyla şifreli chat yapabildiğini gösterin. Ardından **Finans** sekmesine gelip bekleyen bir borcu "Kredi Kartı Modalı" ile ödeyin.
5. **Kapanış:** Bu ekosistemin, klasik bir avukatlık ofisini dijital, şeffaf, anında takip edilebilir ve kurumsal bir yapıya dönüştürdüğünü, React ve Redux tabanlı modern altyapısı sayesinde ileride istenilen her modülün kolayca eklenebileceğini vurgulayarak sunumu tamamlayın.
