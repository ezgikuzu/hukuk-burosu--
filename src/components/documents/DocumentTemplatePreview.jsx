import React, { useState, useRef } from "react";
import { Printer, Download, Copy, RefreshCw, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDispatch } from "react-redux";
import { showToast } from "../../store";

export default function DocumentTemplatePreview({ draftContent, documentTitle, onReset }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState(draftContent);
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      // Create a clone to render purely for PDF without textarea scrollbars/borders
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.style.padding = "40px";
      tempDiv.style.backgroundColor = "white";
      tempDiv.style.fontFamily = "serif";
      tempDiv.style.fontSize = "14px";
      tempDiv.style.lineHeight = "1.6";
      tempDiv.style.whiteSpace = "pre-wrap";
      tempDiv.style.color = "black";
      tempDiv.innerText = content;
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${documentTitle.replace(/\s+/g, '_')}_Taslak.pdf`);
      
      document.body.removeChild(tempDiv);
      
      dispatch(showToast({
        message: "PDF olarak indirildi.",
        type: "success"
      }));
    } catch (err) {
      console.error("PDF generation error:", err);
      dispatch(showToast({
        message: "PDF oluşturulurken bir hata oluştu.",
        type: "error"
      }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    dispatch(showToast({
      message: "Metin panoya kopyalandı.",
      type: "success"
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* LEFT: Actions panel */}
      <div className="w-full lg:w-64 space-y-4 shrink-0 print:hidden">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-[#1a237e] text-sm border-b border-slate-100 pb-2">
            Taslak İşlemleri
          </h3>
          
          <button 
            onClick={handlePrint}
            className="w-full py-2.5 px-4 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır</span>
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-emerald-200"
          >
            <Download className="w-4 h-4" />
            <span>PDF İndir</span>
          </button>
          
          <button 
            onClick={handleCopy}
            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
          >
            <Copy className="w-4 h-4" />
            <span>Metni Kopyala</span>
          </button>
          
          <div className="pt-3 border-t border-slate-100">
            <button 
              onClick={onReset}
              className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Yeni Evrak Oluştur</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: A4 Preview Container */}
      <div className="flex-1 bg-slate-100/50 p-4 rounded-xl flex justify-center overflow-auto print:p-0 print:bg-transparent">
        <div className="w-full max-w-[210mm] space-y-4">
          
          {/* Warning Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex gap-3 print:hidden shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              <strong>Dikkat:</strong> Bu belge ön bilgilendirme ve taslak amacıyla oluşturulmuştur. 
              Nihai hukuki işlem öncesinde mutlaka bir avukat tarafından kontrol edilmelidir.
              <br/>
              Aşağıdaki metin üzerinde klavyenizle doğrudan değişiklik yapabilirsiniz.
            </p>
          </div>

          {/* A4 Paper */}
          <div 
            className="bg-white shadow-lg print:shadow-none w-full min-h-[297mm] p-[20mm] mx-auto print:m-0 print:p-0"
          >
            <div id="print-area" ref={printRef} className="h-full w-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full min-h-[250mm] resize-none outline-none font-serif text-sm leading-relaxed text-black bg-transparent print:border-none print:resize-none"
                style={{ 
                  fontFamily: '"Times New Roman", Times, serif',
                  whiteSpace: "pre-wrap"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
