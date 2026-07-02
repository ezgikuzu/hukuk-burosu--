import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast, hideConfirm } from "../store";
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from "lucide-react";

export default function GlobalUI() {
  const dispatch = useDispatch();
  const { toast, confirmDialog, language } = useSelector((state) => state.ui);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible, dispatch]);

  const handleConfirm = () => {
    if (confirmDialog.actionToDispatch) {
      dispatch(confirmDialog.actionToDispatch);
    }
    dispatch(hideConfirm());
  };

  const handleCancelConfirm = () => {
    dispatch(hideConfirm());
  };

  return (
    <>
      {/* Toast Notification */}
      <div 
        className={`fixed top-4 right-4 z-[9999] transition-all duration-300 transform ${
          toast.isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-slate-100 flex items-center gap-3 max-w-sm">
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
          {toast.type === "info" && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
          <p className="text-sm font-semibold text-slate-800">{toast.message}</p>
          <button 
            onClick={() => dispatch(hideToast())}
            className="ml-2 text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDialog.isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform scale-100 transition-transform">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
                {language === "TR" ? "Emin misiniz?" : "Are you sure?"}
              </h3>
              <p className="text-slate-500 text-center text-sm font-medium">
                {confirmDialog.message}
              </p>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {language === "TR" ? "İptal" : "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                {language === "TR" ? "Onayla" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
