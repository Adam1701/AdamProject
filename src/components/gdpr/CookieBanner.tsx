"use client";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const v = sessionStorage.getItem('cookie-consent');
    if (!v) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-5xl m-4 p-4 rounded-xl bg-white border border-slate-200 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-700">
          Nous utilisons des cookies pour améliorer votre expérience. Consultez notre{' '}
          <a href="/privacy" className="underline">politique de confidentialité</a>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => { sessionStorage.setItem('cookie-consent', 'declined'); setVisible(false); }}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
          >Refuser</button>
          <button
            onClick={() => { sessionStorage.setItem('cookie-consent', 'accepted'); setVisible(false); }}
            className="px-3 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >Accepter</button>
        </div>
      </div>
    </div>
  )
}
