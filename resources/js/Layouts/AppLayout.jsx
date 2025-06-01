import { Head, usePage } from '@inertiajs/react';
import FloatingChatWidget from '@/Components/Chat/FloatingChatWidget';

export default function AppLayout({ title, children }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen bg-gray-100">
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