import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBlog } from "../../store";
import { PlusCircle, Image as ImageIcon, AlignLeft, CheckCircle } from "lucide-react";
import { DICTIONARY } from "../../data/initialData";

export default function BlogsTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const t = DICTIONARY[language];

  const [titleTR, setTitleTR] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [excerptTR, setExcerptTR] = useState("");
  const [excerptEN, setExcerptEN] = useState("");
  const [contentTR, setContentTR] = useState("");
  const [contentEN, setContentEN] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleTR || !contentTR) return;

    const newBlog = {
      id: `blog_${Date.now()}`,
      titleTR,
      titleEN: titleEN || titleTR,
      excerptTR: excerptTR || contentTR.substring(0, 100) + "...",
      excerptEN: excerptEN || contentEN.substring(0, 100) + "...",
      contentTR,
      contentEN: contentEN || contentTR,
      image: image || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200",
      author: currentUser.name,
      authorImg: "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.name) + "&background=1a237e&color=fff",
    };

    dispatch(addBlog(newBlog));
    setSuccess(true);

    setTitleTR(""); setTitleEN(""); setExcerptTR(""); setExcerptEN("");
    setContentTR(""); setContentEN(""); setImage("");

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1a237e]">
            {language === "TR" ? "Blog Yazısı Ekle" : "Add Blog Post"}
          </h2>
          <p className="text-sm text-slate-500">
            {language === "TR" ? "Büro web sitesinde yayınlanacak yeni bir makale veya blog yazısı oluşturun." : "Create a new article or blog post to be published on the firm's website."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">
              {language === "TR" ? "Blog yazısı başarıyla eklendi ve yayına alındı!" : "Blog post successfully added and published!"}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="font-bold text-[#1a237e] border-b pb-2">Türkçe İçerik</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Başlık (Zorunlu)</label>
                <input
                  type="text"
                  required
                  value={titleTR}
                  onChange={(e) => setTitleTR(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-[#1a237e] focus:border-[#1a237e]"
                  placeholder="Makale başlığı..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Özet (Ana sayfada görünür)</label>
                <textarea
                  value={excerptTR}
                  onChange={(e) => setExcerptTR(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-[#1a237e] focus:border-[#1a237e]"
                  placeholder="Kısa özet..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">İçerik (Zorunlu)</label>
                <textarea
                  required
                  value={contentTR}
                  onChange={(e) => setContentTR(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-[#1a237e] focus:border-[#1a237e]"
                  placeholder="Makale içeriği..."
                />
              </div>
            </div>

            
            <div className="space-y-4">
              <h3 className="font-bold text-[#1a237e] border-b pb-2">English Content</h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={titleEN}
                  onChange={(e) => setTitleEN(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-[#1a237e] focus:border-[#1a237e]"
                  placeholder="Article title..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Excerpt (Visible on home)</label>
                <textarea
                  value={excerptEN}
                  onChange={(e) => setExcerptEN(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-[#1a237e] focus:border-[#1a237e]"
                  placeholder="Short excerpt..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Content</label>
                <textarea
                  value={contentEN}
                  onChange={(e) => setContentEN(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-[#1a237e] focus:border-[#1a237e]"
                  placeholder="Article content..."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <label className="block text-xs font-bold text-slate-700 mb-1">Kapak Görseli (İsteğe Bağlı)</label>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full pl-10 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-[#1a237e] focus:border-[#1a237e] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1a237e]/10 file:text-[#1a237e] hover:file:bg-[#1a237e]/20 cursor-pointer"
                />
              </div>
              {image && (
                <div className="w-12 h-12 shrink-0 rounded-lg border overflow-hidden bg-slate-100">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1a237e] text-white rounded-lg font-bold text-sm hover:bg-[#12185c] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#d4af37]" />
              {language === "TR" ? "Yayına Al" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
