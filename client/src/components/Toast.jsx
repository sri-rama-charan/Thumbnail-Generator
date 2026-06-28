/**
 * Purpose: Toast Alert Notification Component stub.
 */

import React, { useEffect } from "react";

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.message, onClose]);

  const styleClasses =
    toast.type === "error"
      ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md animate-fade-in transition-all">
      <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${styleClasses}`}>
        {toast.message}
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
        ✕
      </button>
    </div>
  );
};

export default Toast;
