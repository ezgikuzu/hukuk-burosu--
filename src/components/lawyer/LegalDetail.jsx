import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, Gavel, ShieldCheck, FileText, Lock } from "lucide-react";

export default function LegalDetail({ legalId, onBack }) {
  const language = useSelector((state) => state.ui.language) || "TR";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [legalId]); // Yeni bir hukuki metin açıldığında sayfayı en üste götürmektir.

  const tx = (tr, en) => (language === "TR" ? tr : en);

  const legalContent = {
    privacy: {
      titleTR: "Gizlilik Politikası",
      titleEN: "Privacy Policy",
      icon: Lock,
      contentTR: `Son Güncelleme: 1 Ocak 2026\n\nEDBM Hukuk Bürosu ("Büro") olarak, web sitemizi ziyaret eden ve hizmetlerimizden yararlanan kullanıcılarımızın ("Kullanıcı") gizliliğine ve kişisel verilerinin korunmasına büyük önem veriyoruz. İşbu Gizlilik Politikası, Büromuz tarafından toplanan bilgilerin nasıl kullanıldığını, saklandığını ve korunduğunu açıklamaktadır.\n\n1. Toplanan Bilgiler\nWeb sitemiz üzerinden doldurduğunuz iletişim formları, bülten üyelikleri ve danışmanlık talepleri aracılığıyla adınız, soyadınız, e-posta adresiniz ve telefon numaranız gibi temel iletişim bilgilerinizi toplamaktayız.\n\n2. Bilgilerin Kullanımı\nToplanan bu bilgiler yalnızca taleplerinize yanıt vermek, hukuki danışmanlık hizmetlerimizi sunmak ve önemli yasal güncellemeler hakkında sizi bilgilendirmek amacıyla kullanılmaktadır. Kişisel bilgileriniz hiçbir şekilde ticari amaçla üçüncü şahıslara satılamaz veya paylaşılamaz.\n\n3. Veri Güvenliği\nBüromuz, kişisel verilerinizi yetkisiz erişime, değiştirilmeye veya yok edilmeye karşı korumak için gerekli tüm teknik ve idari güvenlik önlemlerini almaktadır. Sitemiz SSL sertifikası ile korunmaktadır.\n\n4. İletişim\nGizlilik politikamız veya kişisel verilerinizin işlenmesiyle ilgili herhangi bir sorunuz olması halinde, info@edbm.com adresi üzerinden bizimle iletişime geçebilirsiniz.`,
      contentEN: `Last Updated: January 1, 2026\n\nAs EDBM Law Firm ("Firm"), we attach great importance to the privacy and protection of personal data of users ("User") who visit our website and benefit from our services. This Privacy Policy explains how the information collected by our Firm is used, stored, and protected.\n\n1. Collected Information\nWe collect your basic contact information such as your name, surname, email address, and phone number through contact forms, newsletter subscriptions, and consultancy requests you fill out on our website.\n\n2. Use of Information\nThis collected information is used only to respond to your requests, provide our legal consultancy services, and inform you about important legal updates. Your personal information cannot be sold or shared with third parties for commercial purposes under any circumstances.\n\n3. Data Security\nOur Firm takes all necessary technical and administrative security measures to protect your personal data against unauthorized access, modification, or destruction. Our site is protected by an SSL certificate.\n\n4. Contact\nIf you have any questions regarding our privacy policy or the processing of your personal data, you can contact us via info@edbm.com.`
    },
    terms: {
      titleTR: "Kullanım Koşulları",
      titleEN: "Terms of Use",
      icon: FileText,
      contentTR: `Son Güncelleme: 1 Ocak 2026\n\n1. Giriş\nBu web sitesine erişerek veya kullanarak, bu Kullanım Koşulları'nı, tüm geçerli yasa ve yönetmelikleri kabul etmiş olursunuz. Bu şartlardan herhangi birine katılmıyorsanız, bu siteyi kullanmanız yasaktır.\n\n2. Hukuki Danışmanlık Değildir\nBu web sitesinde yer alan bilgiler ve yayınlar (makaleler, blog yazıları vb.) genel bilgi sağlama amacı taşımaktadır ve hiçbir şekilde hukuki mütalaa veya avukatlık hizmeti yerine geçmez. Sitedeki bilgilere dayanarak hareket etmeden önce mutlaka uzman bir avukattan profesyonel danışmanlık alınmalıdır. EDBM Hukuk Bürosu, sitedeki bilgilere dayanılarak yapılan işlemlerden doğabilecek zararlardan sorumlu tutulamaz.\n\n3. Avukat-Müvekkil İlişkisi\nSitemiz üzerinden bize mesaj göndermeniz, form doldurmanız veya e-posta atmanız, büromuz ile aranızda bir avukat-müvekkil ilişkisi kurduğu anlamına gelmez. Resmi bir vekaletname veya danışmanlık sözleşmesi imzalanmadıkça bu ilişki kurulmuş sayılmaz.\n\n4. Fikri Mülkiyet Hakları\nBu web sitesinde yer alan tüm içerik, tasarım, metin, grafik ve logolar EDBM Hukuk Bürosu'na aittir ve telif hakları ile korunmaktadır. Önceden yazılı izin alınmaksızın kopyalanamaz, çoğaltılamaz veya başka bir platformda yayınlanamaz.`,
      contentEN: `Last Updated: January 1, 2026\n\n1. Introduction\nBy accessing or using this website, you agree to be bound by these Terms of Use, all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.\n\n2. Not Legal Advice\nThe information and publications (articles, blog posts, etc.) on this website are intended for general information purposes and in no way replace a legal opinion or attorney services. Professional advice must be obtained from an expert attorney before acting on the information on the site. EDBM Law Firm cannot be held responsible for damages that may arise from actions taken based on the information on the site.\n\n3. Attorney-Client Relationship\nSending us a message, filling out a form, or sending an email through our site does not mean that an attorney-client relationship is established between you and our firm. This relationship is not considered established unless a formal power of attorney or consultancy agreement is signed.\n\n4. Intellectual Property Rights\nAll content, design, text, graphics, and logos on this website belong to EDBM Law Firm and are protected by copyrights. It cannot be copied, reproduced, or published on another platform without prior written permission.`
    },
    kvkk: {
      titleTR: "KVKK Aydınlatma Metni",
      titleEN: "PDPL Disclosure Text",
      icon: ShieldCheck,
      contentTR: `EDBM Hukuk Bürosu Kişisel Verilerin Korunması Aydınlatma Metni\n\n6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla EDBM Hukuk Bürosu tarafından aşağıda açıklanan kapsamda işlenebilecektir.\n\n1. Kişisel Verilerin İşlenme Amacı\nToplanan kişisel verileriniz; hukuki danışmanlık ve dava takip hizmetlerimizin yürütülmesi, tarafınızla iletişim kurulması, mevzuattan kaynaklanan yükümlülüklerimizin yerine getirilmesi, yasal bildirimlerin yapılması amaçlarıyla işlenmektedir.\n\n2. İşlenen Kişisel Verileriniz\nKimlik bilgileriniz (Ad, soyad, T.C. Kimlik numarası), iletişim bilgileriniz (Telefon, adres, e-posta), hukuki süreçlere ilişkin tarafınızca sunulan evrak ve bilgiler, hukuki destek kapsamındaki özel nitelikli kişisel verileriniz.\n\n3. Kişisel Verilerin Aktarılması\nKişisel verileriniz; hukuki ihtilafların çözümü amacıyla mahkemeler, icra daireleri, savcılıklar ve ilgili kamu kurum ve kuruluşları ile paylaşılabilmektedir.\n\n4. KVKK 11. Madde Uyarınca Haklarınız\nKişisel veri sahibi olarak Kanun'un 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, amacına uygun kullanılıp kullanılmadığını bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve kanunda öngörülen şartlar çerçevesinde silinmesini talep etme hakkına sahipsiniz.`,
      contentEN: `EDBM Law Firm Personal Data Protection Disclosure Text\n\nIn accordance with the Personal Data Protection Law No. 6698 ("PDPL"), your personal data may be processed by EDBM Law Firm, in its capacity as data controller, within the scope described below.\n\n1. Purpose of Processing Personal Data\nYour collected personal data are processed for the purposes of carrying out our legal consultancy and litigation services, communicating with you, fulfilling our obligations arising from the legislation, and making legal notifications.\n\n2. Your Processed Personal Data\nYour identity information (Name, surname, TR Identity number), contact information (Phone, address, email), documents and information provided by you regarding legal processes, your sensitive personal data within the scope of legal support.\n\n3. Transfer of Personal Data\nYour personal data may be shared with courts, enforcement offices, prosecutor's offices, and relevant public institutions and organizations for the purpose of resolving legal disputes.\n\n4. Your Rights Pursuant to Article 11 of PDPL\nAs a personal data owner, pursuant to Article 11 of the Law, you have the right to; learn whether your data is processed, know whether it is used in accordance with its purpose, request correction if it is processed incompletely or incorrectly, and request deletion within the framework of the conditions stipulated in the law.`
    }
  };

  const data = legalContent[legalId]; //legalContent içindeki ilgili metni seçer.
  if (!data) return null; // metin yoksa hiçbir şey döndürmez.

  const IconComp = data.icon; // ikon componentini seçer. 

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 h-20 shadow-sm flex items-center">
        <div className="max-w-4xl mx-auto px-6 w-full flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1a237e] font-semibold hover:bg-[#1a237e]/5 px-3 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{tx("Geri Dön", "Go Back")}</span>
          </button>
          <div className="flex items-center gap-2 text-[#1a237e]">
            <Gavel className="w-5 h-5 text-[#d4af37]" />
            <span className="font-serif font-bold">EDBM Legal</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-6 bg-white border border-slate-100 p-8 sm:p-12 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-16 h-16 bg-[#1a237e]/5 rounded-2xl flex items-center justify-center border border-[#1a237e]/10">
              <IconComp className="w-8 h-8 text-[#1a237e]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1a237e] tracking-tight">
                {tx(data.titleTR, data.titleEN)}
              </h1>
              <p className="text-xs text-[#d4af37] font-bold uppercase tracking-wider mt-1">
                {tx("Yasal Bilgilendirme Metni", "Legal Disclosure Document")}
              </p>
            </div>
          </div>

          <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-600 leading-relaxed">
            {tx(data.contentTR, data.contentEN).split('\n').map((paragraph, idx) => (
              paragraph.trim() !== '' ? (
                <p key={idx} className={
                  paragraph.match(/^[0-9]+\./) || paragraph.includes("Son Güncelleme:")
                    ? "font-bold text-slate-800 mt-8 mb-3"
                    : "mb-4"
                }>
                  {paragraph}
                </p>
              ) : null
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-xs">
        <p>© 2026 EDBM {tx("Hukuk Bürosu", "Law Firm")}. {tx("Tüm Hakları Saklıdır.", "All Rights Reserved.")}</p>
      </footer>
    </div>
  );
}
