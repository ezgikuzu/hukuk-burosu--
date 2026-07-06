import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

export default function VideoMeeting({ roomName, onClose, subject }) {
  const currentUser = useSelector((state) => state.auth.currentUser); // redux'tan giriş yapan kullanıcıyı alır. bu bilgiler daha sonra jitsiye gönderilir. 

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in"> // tam ekran bir pencere oluşturur.
      {/* Header */}
      <div className="px-6 py-4 bg-[#1a237e] text-white flex justify-between items-center shadow-md">
        <div>
          <h3 className="font-serif text-lg font-bold">EDBM Görüntülü Görüşme Sistemi</h3>
          {subject && <p className="text-xs text-slate-300 font-semibold">{subject}</p>} // görüşme konusu
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer flex items-center gap-2 font-bold text-sm border border-transparent hover:border-white/20"
        >
          <span>Görüşmeden Ayrıl</span>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Jitsi Meeting Container */}
      <div className="flex-1 bg-black"> // görüşmenin yapılacağı yer --------------------
        <JitsiMeeting
          roomName={roomName} // görüşme odası // bu componenet jitsi sunucusuna baplanır. 
          configOverwrite={{ //jitsinin çalışma ayarlarını değiştirir. 
            startWithAudioMuted: false, // görüşme başladığında ses açık olsun 
            startWithVideoMuted: false, // görüşme başladığında video açık olsun 
            disableModeratorIndicator: true, // moderatör göstergesini kapatır 
            prejoinPageEnabled: false, // görüşmeye katılmadan önceki sayfayı kapatır 
          }}
          interfaceConfigOverwrite={{ //jitsinin arayüz ayarlarını değiştirir. 
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true, // giriş çıkış bildirimlerini kapatır   
            SHOW_JITSI_WATERMARK: false, // jitsi logosunu kapatır 
            SHOW_WATERMARK_FOR_GUESTS: false, // misafir logosunu kapatır 
          }}
          userInfo={{
            displayName: currentUser?.name || "Kullanıcı", // jitside görünecek isim 
            email: currentUser?.email || "", // jitside görünecek e-posta 
          }}
          onApiReady={(externalApi) => {  // jitsinin api ready olduğunda çalışacak fonksiyon  ----------------
            // Gerekirse buraya dinleyiciler (listeners) ekleyebilirsiniz --------------------------------------------------------------
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%"; // iframe yüksekliğini ayarlar
            iframeRef.style.width = "100%"; // iframe genişliğini ayarlar
          }}
        />
      </div>
    </div>
  );
}
//getIframeRef -> görüntülü görüşme pencersini tam ekran olacak şekilde ayarlar. ----------------------------
//onApiReady -> jitsinin api ready olduğunda çalışacak fonksiyon  ----------------------------------------------
//userInfo -> jitside görünecek isim ve e-posta  ----------------------------------------------------------
//interfaceConfigOverwrite -> jitsinin arayüz ayarlarını değiştirir.   ----------------------------------------
//configOverwrite -> jitsinin çalışma ayarlarını değiştirir.  ------------------------------------------------
//roomName -> görüşme odası // bu componenet jitsi sunucusuna baplanır. --------------------------------------
//flex-1 bg-black -> görüşmenin yapılacağı yer ------------------------------------------------------------
//header -> görüşme başlığı ve kapatma butonu  --------------------------------------------------------------