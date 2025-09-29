import { Head, usePage } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

export default function AppLayout({ title, children }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen bg-gray-100">
                {/* Language Switcher */}
                <div className="fixed top-4 right-4 z-50">
                    <LanguageSwitcher />
                </div>

                {/* Main content */}
                <main>
                    {children}
                </main>

                {/* Chat widget removed */}
            </div>
        </>
    );
} 