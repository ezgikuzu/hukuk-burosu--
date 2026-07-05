import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addHearing, deleteHearing, showConfirm } from "../../store";
import { DICTIONARY, autoTranslate } from "../../data/initialData";
import {
  Plus, Trash2, Calendar, MapPin, Clock, X, AlertCircle, Check,
  ChevronLeft, ChevronRight, User, Scale, Video
} from "lucide-react";
import VideoMeeting from "./VideoMeeting";

export default function CalendarTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const rawHearings = useSelector((state) => state.hearings.list);
  const rawCases = useSelector((state) => state.cases.list);
  const lawyers = useSelector((state) => state.lawyers.list);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const isLawyer = currentUser?.role === "lawyer";

  // Filter cases and hearings for active lawyer
  const cases = isLawyer
    ? rawCases.filter((c) => c.lawyerId === currentUser.id)
    : rawCases;

  const hearings = rawHearings; // Allow all lawyers to view the global calendar pool

  // Filter
  const [selectedLawyerId, setSelectedLawyerId] = useState(isLawyer ? currentUser.id : "all");

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [lawyerId, setLawyerId] = useState(currentUser?.id || "lawyer_1");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [videoRoom, setVideoRoom] = useState(null);

  // Navigation of mock calendar months
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // July 2026
  const [selectedDate, setSelectedDate] = useState(null);

  // Yeni Duruşma penceresini temiz bir şekilde açmak ve tüm alanları başlangıç değerlerine döndürmektir.
  const openAddModal = () => {
    setCaseId(cases[0]?.id || "");
    setTitle("");
    setDateTime("2026-07-01T10:00");
    setLocation("");
    setNotes("");
    setLawyerId(currentUser?.id || "lawyer_1");
    setIsVideoCall(false);
    setValidationError(null); // bir önceki formdan kalan hata silinir. 
    setIsModalOpen(true);
  };

  // form kaydet 
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!caseId) {
      setValidationError(
        language === "TR"
          ? "Duruşmayı ilişkilendirmek için bir dava dosyası seçmelisiniz."
          : "You must select a case to associate this hearing with."
      );
      return;
    }

    //yeni duruşma oluştur. 
    const newHr = {
      id: `hearing_${Date.now()}`,
      caseId,
      title,
      dateTime,
      location: isVideoCall ? "Online (Jitsi Meet)" : location,
      notes,
      lawyerId: isLawyer ? currentUser.id : lawyerId,
      isVideoCall
    };

    dispatch(addHearing(newHr)); // sisteme yeni duruşma eklendi. 
    setIsModalOpen(false); // kayıt oluştu form kapandı. 
  };

  // silme

  const handleDelete = (id) => {
    dispatch(showConfirm({
      message: language === "TR" ? "Bu duruşma kaydını silmek istediğinize emin misiniz?" : "Are you sure you want to delete this hearing?",
      actionToDispatch: deleteHearing(id)
    }));
  };

  // takvim oluşturulması 
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayIndex = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Format Month Title
  const monthNamesTR = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const monthNamesEN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = language === "TR"
    ? monthNamesTR[currentDate.getMonth()]
    : monthNamesEN[currentDate.getMonth()];


  // sol oka tıklanınca bir önceki aya geçer.
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  // sağ oka tıklanınca bir sonraki aya geçer.
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Hangi Duruşmaların Listelenmesi Gerektiğini Bulma
  const filteredHearings = hearings
    .filter((h) => selectedLawyerId === "all" || h.lawyerId === selectedLawyerId)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Belirli bir takvim gününde duruşma olup olmadığını kontrol etme
  const getDayHearings = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const datePrefix = `${year}-${month}-${dayStr}`;

    return filteredHearings.filter(h => h.dateTime.startsWith(datePrefix));
  };

  const displayedAgendaHearings = selectedDate 
    ? getDayHearings(selectedDate) 
    : filteredHearings;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#1a237e]">{t.calendarTitle}</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {language === "TR"
              ? "Duruşma günlerini, keşifleri ve müvekkil görüşmelerini takvim üzerinden renk kodlu olarak yönetin."
              : "Manage hearing days, discoveries, and client appointments on the calendar via color-coded blocks."}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-[#d4af37] font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm border border-[#d4af37]/30 transition-all cursor-pointer shrink-0 animate-fade-in"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>{t.newHearing}</span>
        </button>
      </div>

      {/* Main Grid: Mock Calendar Grid (Left 7 cols) & Scheduled List (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Mock Interactive Grid */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <h3 className="font-serif text-base font-bold text-[#1a237e] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>{monthName} {currentDate.getFullYear()}</span>
            </h3>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 text-center gap-1">
            {/* Weekdays */}
            {["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"].map((d, idx) => (
              <span key={idx} className="text-[10px] font-bold text-slate-400 uppercase py-1.5">
                {language === "TR" ? d : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][idx]}
              </span>
            ))}

            {/* Empty cells before month start */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-14 bg-slate-50/50 rounded-lg" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayHearings = getDayHearings(day);
              const isToday = day === 30 && currentDate.getMonth() === 5; // June 30, 2026
              const isSelected = selectedDate === day;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(day)}
                  className={`h-14 cursor-pointer rounded-lg border flex flex-col justify-between p-1.5 transition-all relative group hover:border-[#1a237e]/30 hover:bg-slate-50/40 
                    ${isSelected ? "border-[#1a237e] bg-indigo-50/50 ring-1 ring-[#1a237e]/50 shadow-sm" : "border-slate-100"}
                    ${isToday && !isSelected ? "bg-amber-50/50 border-amber-300 ring-1 ring-amber-200" : ""}
                  `}
                >
                  <span className={`text-[10px] font-bold ${isToday ? "text-amber-800 font-bold" : "text-slate-600"}`}>
                    {day}
                  </span>

                  {dayHearings.length > 0 && (
                    <div className="flex gap-1 flex-wrap justify-center mt-1">
                      {dayHearings.slice(0, 3).map((h) => {
                        const law = lawyers.find(l => l.id === h.lawyerId);
                        return (
                          <span
                            key={h.id}
                            className="w-2.5 h-2.5 rounded-full inline-block animate-pulse"
                            style={{ backgroundColor: law?.color || "#1a237e" }}
                            title={h.title}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-[10px] text-slate-500 font-bold justify-center">
            {lawyers.map((l) => (
              <div key={l.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: l.color }} />
                <span>{l.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Agenda List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-sm font-bold text-[#1a237e]">
                  {language === "TR" ? "Günlük Ajanda Akışı" : "Agenda Flow"}
                  {selectedDate && <span className="ml-1 text-xs font-sans text-indigo-500">({selectedDate} {monthName})</span>}
                </h3>
                {selectedDate && (
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer font-semibold"
                  >
                    {language === "TR" ? "Tümünü Gör" : "See All"}
                  </button>
                )}
              </div>

              {/* Lawyer Filter Selector */}
              <select
                value={selectedLawyerId}
                onChange={(e) => setSelectedLawyerId(e.target.value)}
                className="px-2 py-1 text-[10px] border border-slate-200 rounded focus:outline-none font-semibold bg-slate-50"
              >
                <option value="all">
                  {language === "TR" ? "Herkesin Ajandası" : "All Calendars"}
                </option>
                {lawyers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name.split(" ")[0]}
                  </option>
                ))}
              </select>
            </div>

            {displayedAgendaHearings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">
                {language === "TR" ? "Planlanmış duruşma veya randevu bulunmuyor." : "No hearings or meetings scheduled."}
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {displayedAgendaHearings.map((h) => {
                  const rCase = cases.find((c) => c.id === h.caseId);
                  const lawyerObj = lawyers.find((l) => l.id === h.lawyerId);
                  const dt = new Date(h.dateTime);
                  const formattedDate = dt.toLocaleDateString(language === "TR" ? "tr-TR" : "en-US", {
                    day: "numeric",
                    month: "long",
                  });
                  const formattedTime = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                  return (
                    <div
                      key={h.id}
                      className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-200 hover:bg-slate-100/60 transition-all flex justify-between items-start"
                      style={{ borderLeftColor: lawyerObj?.color || "#1a237e" }}
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {rCase?.fileNo || at("Genel Randevu")}
                        </p>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{h.title}</h4>

                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                          {h.isVideoCall ? <Video className="w-3 h-3 text-indigo-500" /> : <MapPin className="w-3 h-3 text-[#d4af37]" />}
                          <span className="line-clamp-1">{h.location}</span>
                        </div>

                        <p className="text-[9px] text-slate-400 font-bold italic">
                          {language === "TR" ? "Sorumlu: " : "In Charge: "} {lawyerObj?.name}
                        </p>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-slate-800 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                          {formattedTime}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold">
                          {formattedDate}
                        </span>
                        {h.isVideoCall && (
                          <button
                            onClick={() => setVideoRoom(`EDBM-${h.id}`)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-2 py-1 rounded text-[10px] font-bold transition-colors mt-1 flex items-center gap-1 cursor-pointer border border-indigo-200"
                          >
                            <Video className="w-3 h-3" />
                            {t.joinVideoCall || "Katıl"}
                          </button>
                        )}

                        {/* Delete button only if the lawyer is authorized */}
                        <button
                          onClick={() => handleDelete(h.id)}
                          className="text-slate-300 hover:text-red-600 p-0.5 rounded transition-colors cursor-pointer mt-1"
                          title={t.delete}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Hearing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white flex justify-between items-center border-b border-[#d4af37]/20">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                {t.newHearing}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {validationError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === "TR" ? "İlişkili Dava Dosyası" : "Associated Case"} *
                  </label>
                  <select
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] font-semibold"
                  >
                    <option value="" disabled>
                      {language === "TR" ? "Dava Seçiniz" : "Select Case"}
                    </option>
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fileNo} - {c.court.split(" ")[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.hearingTitle} *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Bilirkişi Raporu İncelemesi"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.hearingDateTime} *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between items-center">
                    <span>{t.hearingLocation} *</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVideoCall}
                        onChange={(e) => setIsVideoCall(e.target.checked)}
                        className="w-3 h-3 rounded text-[#1a237e] focus:ring-[#1a237e]"
                      />
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">
                        {t.videoCallTitle || "Görüntülü Görüşme"}
                      </span>
                    </label>
                  </label>
                  <div className="relative">
                    {isVideoCall ? <Video className="absolute left-3 top-2.5 h-4 w-4 text-indigo-400" /> : <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />}
                    <input
                      type="text"
                      required
                      disabled={isVideoCall}
                      value={isVideoCall ? "Online (Jitsi Meet)" : location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Kartal Adliyesi, Salon 4"
                      className={`w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] ${isVideoCall ? "bg-slate-100 text-slate-500 font-bold" : ""}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.clientLawyer} ({at("Sorumlu Avukat")}) *
                  </label>
                  <select
                    disabled={isLawyer}
                    value={isLawyer ? currentUser.id : lawyerId}
                    onChange={(e) => setLawyerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] bg-slate-50 disabled:text-slate-500 font-semibold"
                  >
                    {lawyers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.hearingNotes}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Duruşma öncesi teslim edilecek dilekçeler..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-xs font-bold cursor-pointer border-b-2 border-indigo-950"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Meeting Fullscreen View */}
      {videoRoom && (
        <VideoMeeting
          roomName={videoRoom}
          onClose={() => setVideoRoom(null)}
          subject={t.videoCallTitle}
        />
      )}
    </div>
  );
}
