import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center space-x-1">
            <button
                className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                    i18n.language === 'en'
                        ? 'bg-white text-green-600'
                        : 'text-white hover:bg-green-700'
                }`}
                onClick={() => changeLanguage('en')}
            >
                EN
            </button>
            <span className="text-white">|</span>
            <button
                className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                    i18n.language === 'tl'
                        ? 'bg-white text-green-600'
                        : 'text-white hover:bg-green-700'
                }`}
                onClick={() => changeLanguage('tl')}
            >
                TL
            </button>
        </div>
    );
} 