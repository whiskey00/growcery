import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

export default function ChatDrawer({ 
    isOpen, 
    onClose, 
    conversations, 
    activeConversation: initialActiveConversation, 
    onConversationSelect,
    isLoading,
    error
}) {
    const { auth } = usePage().props;
    const [localMessages, setLocalMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);

    // Update local state when initialActiveConversation changes
    useEffect(() => {
        if (initialActiveConversation) {
            setActiveConversation(initialActiveConversation);
            setLocalMessages(initialActiveConversation.messages || []);
        } else {
            setActiveConversation(null);
            setLocalMessages([]);
        }
    }, [initialActiveConversation]);

    // If user is not authenticated, don't render the drawer
    if (!auth?.user) {
        return null;
    }

    const messagesEndRef = useRef(null);
    const { data, setData, post, processing } = useForm({
        message_text: '',
        receiver_id: '',
    });

    useEffect(() => {
        if (activeConversation) {
            setData('receiver_id', 
                activeConversation.customer_id === auth.user.id 
                    ? activeConversation.vendor_id 
                    : activeConversation.customer_id
            );
        }
    }, [activeConversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const messageText = data.message_text.trim();
        if (!messageText) return;

        // Clear the input immediately
        setData('message_text', '');
        
        // Create a temporary message
        const tempMessage = {
            id: 'temp-' + Date.now(),
            message_text: messageText,
            sender_id: auth.user.id,
            sender: auth.user,
            created_at: new Date().toISOString(),
            is_temporary: true
        };

        // Add temporary message to local state
        setLocalMessages(prev => [...prev, tempMessage]);
        
        post('/messages', {
            data: {
                receiver_id: data.receiver_id,
                message_text: messageText
            },
            preserveScroll: true,
            onSuccess: (response) => {
                if (response.message) {
                    // Replace temporary message with real one
                    setLocalMessages(prev => 
                        prev.map(msg => 
                            msg.is_temporary ? response.message : msg
                        )
                    );

                    // Update the conversation
                    if (activeConversation) {
                        const updatedConversation = {
                            ...activeConversation,
                            messages: localMessages,
                            last_message: response.message
                        };
                        onConversationSelect(updatedConversation);
                    }
                }
            },
            onError: (errors) => {
                console.error('Failed to send message:', errors);
                // Remove the temporary message
                setLocalMessages(prev => 
                    prev.filter(msg => !msg.is_temporary)
                );
                // Restore the message text
                setData('message_text', messageText);
            }
        });
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-out duration-300"
                    enterFrom="translate-y-full opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transform transition ease-in duration-200"
                    leaveFrom="translate-y-0 opacity-100"
                    leaveTo="translate-y-full opacity-0"
                >
                    <div className="fixed bottom-6 right-6 w-[320px] h-[600px] max-h-[calc(100vh-96px)] bg-white shadow-2xl rounded-xl">
                        <div className="flex h-full flex-col">
                            {/* Header */}
                            <div className="border-b border-gray-200 px-3 py-2 flex items-center">
                                {activeConversation ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => onConversationSelect(null)}
                                            className="mr-2 text-gray-400 hover:text-gray-500 transition-colors"
                                        >
                                            <ArrowLeftIcon className="h-4 w-4" />
                                        </button>
                                        <div className="flex-1">
                                            <h2 className="text-base font-semibold text-gray-900">
                                                {activeConversation.customer_id === auth.user.id 
                                                    ? activeConversation.vendor.name 
                                                    : activeConversation.customer.name}
                                            </h2>
                                            {activeConversation.product && (
                                                <p className="text-xs text-gray-500">
                                                    Re: {activeConversation.product.name}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <h2 className="flex-1 text-base font-semibold text-gray-900">Messages</h2>
                                )}
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                    onClick={onClose}
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto bg-gray-50">
                                {error ? (
                                    <div className="flex flex-col items-center justify-center h-full p-4">
                                        <p className="text-red-600 text-center mb-3 text-sm">{error}</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                                    </div>
                                ) : !activeConversation ? (
                                    // Conversation List
                                    <div className="divide-y divide-gray-200">
                                        {conversations.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-sm mb-1">No conversations yet</p>
                                                <p className="text-xs text-gray-400">
                                                    Your messages will appear here
                                                </p>
                                            </div>
                                        ) : (
                                            conversations.map((conversation) => {
                                                const otherUser = conversation.customer_id === auth.user.id 
                                                    ? conversation.vendor 
                                                    : conversation.customer;
                                                
                                                return (
                                                    <button
                                                        key={conversation.id}
                                                        onClick={() => onConversationSelect(conversation)}
                                                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors duration-200 relative"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                                                                    <span className="text-white text-sm font-semibold">
                                                                        {otherUser.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                                        {otherUser.name}
                                                                    </p>
                                                                    {conversation.last_message && (
                                                                        <p className="text-xs text-gray-500">
                                                                            {format(new Date(conversation.last_message.created_at), 'MMM d')}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {conversation.last_message && (
                                                                    <p className="text-xs text-gray-500 truncate">
                                                                        {conversation.last_message.message_text}
                                                                    </p>
                                                                )}
                                                                {conversation.product && (
                                                                    <p className="text-xs text-green-600 truncate">
                                                                        Re: {conversation.product.name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {conversation.unread_count > 0 && (
                                                                <div className="absolute top-3 right-3">
                                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                                                        {conversation.unread_count}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                ) : (
                                    // Message List
                                    <div className="p-3 space-y-3">
                                        {localMessages.map((message) => {
                                            const isSender = message.sender_id === auth.user.id;
                                            return (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ${
                                                            isSender
                                                                ? 'bg-green-600 text-white'
                                                                : 'bg-white text-gray-900'
                                                        } ${message.is_temporary ? 'opacity-70' : ''}`}
                                                    >
                                                        <div className="text-sm whitespace-pre-wrap break-words">
                                                            {message.message_text}
                                                        </div>
                                                        <div className={`text-[10px] mt-1 ${isSender ? 'text-green-100' : 'text-gray-500'}`}>
                                                            {format(new Date(message.created_at), 'h:mm a')}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            {activeConversation && !error && !isLoading && (
                                <div className="border-t border-gray-200 p-3 bg-white">
                                    <form onSubmit={handleSubmit} className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={data.message_text}
                                            onChange={e => setData('message_text', e.target.value)}
                                            className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500 placeholder-gray-400 text-sm py-1.5"
                                            placeholder="Type your message..."
                                            disabled={processing}
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing || !data.message_text.trim()}
                                            className="inline-flex items-center justify-center rounded-full bg-green-600 p-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {processing ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            ) : (
                                                <PaperAirplaneIcon className="h-4 w-4" />
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition.Root>
    );
} 