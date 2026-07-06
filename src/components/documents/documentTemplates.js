export const documentCategories = [
  {
    id: "ceza",
    title: "Ceza Hukuku",
    templates: [
      { id: "sikayet", title: "Şikayet Dilekçesi", defaultAuthority: "Cumhuriyet Başsavcılığına" },
      { id: "savunma", title: "Savunma Taslağı", defaultAuthority: "İlgili Mahkemeye / Savcılığa" },
      { id: "suc_duyurusu", title: "Suç Duyurusu Dilekçesi", defaultAuthority: "Cumhuriyet Başsavcılığına" },
      { id: "ifade_notu", title: "İfade Ön Hazırlık Notu", defaultAuthority: "Kolluk Kuvvetleri / Savcılık" }
    ]
  },
  {
    id: "icra",
    title: "İcra Hukuku",
    templates: [
      { id: "itiraz", title: "İtiraz Dilekçesi", defaultAuthority: "İcra Müdürlüğüne" },
      { id: "borca_itiraz", title: "Borca İtiraz Taslağı", defaultAuthority: "İcra Müdürlüğüne / İcra Mahkemesine" },
      { id: "haciz_itiraz", title: "Haciz İtirazı", defaultAuthority: "İcra Müdürlüğüne" },
      { id: "odeme_emri", title: "Ödeme Emrine İtiraz", defaultAuthority: "İcra Müdürlüğüne" }
    ]
  },
  {
    id: "idare",
    title: "İdare Hukuku",
    templates: [
      { id: "idari_basvuru", title: "İdari Başvuru Dilekçesi", defaultAuthority: "İlgili İdare Kurumuna" },
      { id: "iptal_davasi", title: "İptal Davası Ön Taslağı", defaultAuthority: "İdare Mahkemesi Başkanlığına" },
      { id: "kurum_basvuru", title: "Kuruma Başvuru Dilekçesi", defaultAuthority: "İlgili Kamu Kurumuna" }
    ]
  },
  {
    id: "bireysel",
    title: "Bireysel Başvuru",
    templates: [
      { id: "aym_basvuru", title: "Anayasa Mahkemesi Bireysel Başvuru Ön Taslağı", defaultAuthority: "Anayasa Mahkemesi Başkanlığına" },
      { id: "hak_ihlali", title: "Hak İhlali Not Formu", defaultAuthority: "İlgili Makama" }
    ]
  },
  {
    id: "cmk",
    title: "CMK",
    templates: [
      { id: "mudafi_gorusme", title: "Müdafi Görüşme Notu", defaultAuthority: "İlgili Makama" },
      { id: "ifade_bilgi", title: "İfade Öncesi Bilgi Formu", defaultAuthority: "Kolluk / Savcılık" },
      { id: "gorevlendirme", title: "Görevlendirme Notu", defaultAuthority: "Baro Başkanlığı / İlgili Kurum" }
    ]
  },
  {
    id: "miras",
    title: "Miras Hukuku",
    templates: [
      { id: "veraset", title: "Veraset İlamı Başvuru Taslağı", defaultAuthority: "Sulh Hukuk Mahkemesine / Noterliğe" },
      { id: "miras_paylasim", title: "Miras Paylaşımı Ön Bilgi Formu", defaultAuthority: "İlgili Makama" },
      { id: "miras_reddi", title: "Miras Reddi Dilekçe Taslağı", defaultAuthority: "Sulh Hukuk Mahkemesine" }
    ]
  },
  {
    id: "aile",
    title: "Aile Hukuku",
    templates: [
      { id: "bosanma", title: "Boşanma Dilekçesi Ön Taslağı", defaultAuthority: "Aile Mahkemesi Başkanlığına" },
      { id: "nafaka", title: "Nafaka Talebi Taslağı", defaultAuthority: "Aile Mahkemesi Başkanlığına" },
      { id: "velayet", title: "Velayet Talebi Taslağı", defaultAuthority: "Aile Mahkemesi Başkanlığına" }
    ]
  },
  {
    id: "is",
    title: "İş Hukuku",
    templates: [
      { id: "iscilik_alacak", title: "İşçilik Alacakları Başvuru Taslağı", defaultAuthority: "İş Mahkemesi Başkanlığına / Arabuluculuk Bürosuna" },
      { id: "arabulucu", title: "Arabuluculuk Başvuru Ön Taslağı", defaultAuthority: "Arabuluculuk Bürosuna" },
      { id: "haksiz_fesih", title: "Haksız Fesih Dilekçe Taslağı", defaultAuthority: "İş Mahkemesi Başkanlığına" }
    ]
  },
  {
    id: "tuketici",
    title: "Tüketici Hukuku",
    templates: [
      { id: "ayipli_mal", title: "Ayıplı Mal Başvuru Dilekçesi", defaultAuthority: "Tüketici Hakem Heyetine / Tüketici Mahkemesine" },
      { id: "iade_degisim", title: "İade / Değişim Talep Dilekçesi", defaultAuthority: "İlgili Satıcı Firmaya" },
      { id: "hakem_heyeti", title: "Tüketici Hakem Heyeti Başvuru Taslağı", defaultAuthority: "İl/İlçe Tüketici Hakem Heyetine" }
    ]
  },
  {
    id: "kira",
    title: "Kira Hukuku",
    templates: [
      { id: "tahliye", title: "Tahliye Talebi Ön Taslağı", defaultAuthority: "İcra Müdürlüğüne / Sulh Hukuk Mahkemesine" },
      { id: "uyarlama", title: "Kira Uyarlama Dilekçesi", defaultAuthority: "Sulh Hukuk Mahkemesine" },
      { id: "alacak", title: "Kira Alacağı Talep Taslağı", defaultAuthority: "İcra Müdürlüğüne" }
    ]
  },
  {
    id: "genel",
    title: "Genel Dilekçe",
    templates: [
      { id: "kuruma", title: "Kuruma Başvuru Dilekçesi", defaultAuthority: "İlgili Kuruma" },
      { id: "genel_talep", title: "Genel Talep Dilekçesi", defaultAuthority: "İlgili Makama" },
      { id: "bilgi_edinme", title: "Bilgi Edinme Başvurusu", defaultAuthority: "İlgili İdareye" }
    ]
  }
];

export function generateDraftContent(formData, categoryTitle, templateTitle, authority) {
  const dateStr = formData.date ? new Date(formData.date).toLocaleDateString("tr-TR") : "";
  const today = new Date().toLocaleDateString("tr-TR");
  
  return `
${authority ? `${authority.toUpperCase()}` : "İLGİLİ MAKAMA"}

KONU: ${formData.subject || templateTitle} hakkında bilgilendirme ve taleplerimizden ibarettir.

${formData.clientName ? `BAŞVURUCU: ${formData.clientName}` : ""}
${formData.clientId ? `T.C. KİMLİK NO: ${formData.clientId}` : ""}
${formData.phone ? `TELEFON: ${formData.phone}` : ""}
${formData.address ? `ADRES: ${formData.address}` : ""}

${formData.opposingParty ? `KARŞI TARAF / İLGİLİ: ${formData.opposingParty}` : ""}
${formData.location ? `OLAY / İŞLEM YERİ: ${formData.location}` : ""}
${dateStr ? `OLAY / İŞLEM TARİHİ: ${dateStr}` : ""}

AÇIKLAMALAR:
${formData.summary || "Bu bölüme olay özeti veya açıklamalar gelecektir."}

${formData.notes ? `EK NOTLAR:\n${formData.notes}` : ""}

TALEP VE SONUÇ:
${formData.request || "Bu bölüme hukuki talepler veya sonuç beyanı gelecektir."}

Tarih: ${today}
${formData.clientName ? `İmza: .......................................` : "İmza:"}
`.trim();
}
