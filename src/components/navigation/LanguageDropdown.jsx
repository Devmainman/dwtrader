import React, { useState, useRef, useEffect } from "react";

const languages = [
  { label: "English", code: "en", countryCode: "gb" },
  { label: "French", code: "fr", countryCode: "fr" },
  { label: "German", code: "de", countryCode: "de" },
  { label: "Spanish", code: "es", countryCode: "es" },
];

function LanguageDropdown() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  const getFlagUrl = (countryCode) =>
    `https://flagcdn.com/w40/${countryCode}.png`;

  return (
    <div ref={dropdownRef} className="relative text-white text-[10px]">
      {/* Toggle */}
      <div
        className="flex gap-2.5 items-center px-3.5 py-1.5 rounded-3xl border border-neutral-900 bg-neutral-800 cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex gap-1.5 items-center">
          <img
            src={getFlagUrl(selectedLanguage.countryCode)}
            className="w-6 h-6 rounded-full"
            alt="Lang"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9a24d63bf7d1d77ec78054ab89fe80507c3fb31068dba4a0c2ccfbdad9be634d?placeholderIfAbsent=true"
            className="w-4 h-4"
            alt="Dropdown arrow"
          />
        </div>
        <p className="text-neutral-400">{selectedLanguage.label}</p>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-xl shadow-md">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-700 cursor-pointer rounded-xl"
              onClick={() => selectLanguage(lang)}
            >
              <img
                src={getFlagUrl(lang.countryCode)}
                className="w-5 h-5 rounded-full"
                alt={lang.label}
              />
              <span className="text-xs">{lang.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageDropdown;
