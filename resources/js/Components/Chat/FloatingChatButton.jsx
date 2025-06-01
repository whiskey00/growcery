import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

export default function FloatingChatButton({ unreadCount = 0, onClick }) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 group"
        >
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold animate-bounce">
                    {unreadCount}
                </span>
            )}
        </button>
    );
} 