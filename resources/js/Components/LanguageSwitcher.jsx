import React from 'react';
import { usePage, router } from '@inertiajs/react';

export default function LanguageSwitcher() {
    const { locale, translations } = usePage().props;
    
    const switchLanguage = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('locale', locale.current === 'en' ? 'tl' : 'en');
        
        router.post(route('language.switch'), formData, {
            preserveScroll: true,
            preserveState: true,
            forceFormData: true
        });
    };

    return (
        <form onSubmit={switchLanguage} className="m-0">
            <button
                type="submit"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white hover:text-green-100 hover:bg-green-700 rounded-lg transition duration-150 ease-in-out"
            >
                <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
                    />
                </svg>
                {translations.switch_language}
            </button>
        </form>
    );
}