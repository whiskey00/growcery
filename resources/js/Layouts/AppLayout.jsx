import { Head, usePage } from '@inertiajs/react';
import FloatingChatWidget from '@/Components/Chat/FloatingChatWidget';
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

                {/* Chat Widget */}
                {auth.user && ['customer', 'vendor'].includes(auth.user.role) && (
                    <FloatingChatWidget />
                )}
            </div>
        </>
    );
} 