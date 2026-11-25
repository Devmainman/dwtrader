import React, { useState, useRef, useEffect } from "react";
import { useLanguage, flagUrl } from "../../lib/i18n";
import { toast } from "../../lib/toast";

/**
 * Flag + language pill. Picking a language translates the whole app.
 * `variant="icon"` is the round flag button of the app top bar; `variant="compact"` the
 * flag + arrow + label pill; `variant="wide"` the same, wider (sign-in screens).
 */
function LanguageDropdown({ variant = "compact" }) {
  const { language, languages, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectLanguage = async (lang) => {
    setIsOpen(false);
    if (lang.code === language.code) return;
    setBusy(true);
    try {
      await setLanguage(lang.code);
    } catch {
      toast.error("Couldn't switch language", { description: "The translation service is unavailable right now." });
    } finally {
      setBusy(false);
    }
  };

  const list = isOpen && (
    <ul
      role="listbox"
      className={`absolute z-50 mt-1.5 ${variant === "icon" ? "right-0" : ""} min-w-full w-max max-h-72 overflow-y-auto bg-[var(--card)]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.5)] p-1 animate-[sheet-in_220ms_cubic-bezier(0.32,0.72,0,1)] [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]`}
    >
      {languages.map((lang) => (
        <li key={lang.code}>
          <button type="button" role="option" aria-selected={lang.code === language.code}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-zinc-100 hover:bg-white/5 ${lang.code === language.code ? "bg-white/5" : ""}`}
            onClick={() => selectLanguage(lang)}>
            <img src={flagUrl(lang.countryCode)} className="w-5 h-5 rounded-full object-cover" alt="" />
            <span className="text-xs flex-1">{lang.label}</span>
            {lang.code === language.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
          </button>
        </li>
      ))}
    </ul>
  );

  if (variant === "icon") {
    return (
      <div ref={dropdownRef} className="relative" translate="no">
        <button type="button" data-no-busy aria-haspopup="listbox" aria-expanded={isOpen} aria-label={`Language: ${language.label}`} title={language.label}
          className="topbar-btn" onClick={() => setIsOpen((o) => !o)}>
          <img src={flagUrl(language.countryCode)} className={`w-[22px] h-[22px] rounded-full object-cover ring-1 ring-white/15 ${busy ? "animate-pulse" : ""}`} alt="" />
        </button>
        {list}
      </div>
    );
  }

  return (
    // translate="no" keeps the language names themselves untranslated.
    <div ref={dropdownRef} className="relative text-white text-[10px]" translate="no">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex gap-2.5 items-center px-3.5 py-1.5 rounded-3xl border border-neutral-900 bg-neutral-800 cursor-pointer ${variant === "wide" ? "w-[165px]" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex gap-1.5 items-center">
          <img src={flagUrl(language.countryCode)} className={`w-6 h-6 rounded-full object-cover ${busy ? "animate-pulse" : ""}`} alt="" />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a24d63bf7d1d77ec78054ab89fe80507c3fb31068dba4a0c2ccfbdad9be634d?placeholderIfAbsent=true"
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            alt=""
          />
        </div>
        <p className="text-neutral-400">{language.label}</p>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 min-w-full w-max max-h-72 overflow-y-auto bg-[var(--card)]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.5)] p-1 animate-[sheet-in_220ms_cubic-bezier(0.32,0.72,0,1)] [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]"
        >
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === language.code}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-white/5 ${lang.code === language.code ? "bg-white/5" : ""}`}
                onClick={() => selectLanguage(lang)}
              >
                <img src={flagUrl(lang.countryCode)} className="w-5 h-5 rounded-full object-cover" alt="" />
                <span className="text-xs flex-1">{lang.label}</span>
                {lang.code === language.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageDropdown;
