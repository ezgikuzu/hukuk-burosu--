import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { X } from "lucide-react";
import { useSelector } from "react-redux";

export default function VideoMeeting({ roomName, onClose, subject }) {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in">
      
      <div className="px-6 py-4 bg-[#1a237e] text-white flex justify-between items-center shadow-md">
        <div>
          <h3 className="font-serif text-lg font-bold">EDBM Görüntülü Görüşme Sistemi</h3>
          {subject && <p className="text-xs text-slate-300 font-semibold">{subject}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer flex items-center gap-2 font-bold text-sm border border-transparent hover:border-white/20"
        >
          <span>Görüşmeden Ayrıl</span>
          <X className="w-5 h-5" />
        </button>
      </div>

      
      <div className="flex-1 bg-black">
        <JitsiMeeting
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableModeratorIndicator: true,
            prejoinPageEnabled: false,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          }}
          userInfo={{
            displayName: currentUser?.name || "Kullanıcı",
            email: currentUser?.email || "",
          }}
          onApiReady={(externalApi) => {
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
          }}
        />
      </div>
    </div>
  );
}