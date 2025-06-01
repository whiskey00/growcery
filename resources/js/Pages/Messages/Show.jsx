import { useEffect, useRef, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ conversation }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(conversation.messages);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { data, setData, post, processing, reset } = useForm({
        message_text: '',
        receiver_id: conversation.customer_id === auth.user.id 
            ? conversation.vendor_id 
            : conversation.customer_id,
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!window.Echo) {
            console.error('Echo is not initialized');
            return;
        }

        // Join presence channel
        const channel = window.Echo.join(`conversation.${conversation.id}`)
            .here((users) => {
                console.log('Users in channel:', users);
            })
            .joining((user) => {
                console.log('User joined:', user);
            })
            .leaving((user) => {
                console.log('User left:', user);
            })
            .listen('MessageSent', (e) => {
                setMessages(prevMessages => [...prevMessages, e.message]);
                scrollToBottom();
            });

        // Typing indicator
        let typingTimer;
        channel.whisper('typing', {
            user: auth.user.name
        });

        channel.listenForWhisper('typing', (e) => {
            setIsTyping(true);
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => setIsTyping(false), 3000);
        });

        scrollToBottom();

        return () => {
            channel.leave();
        };
    }, [conversation.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('messages.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('message_text');
                scrollToBottom();
            },
        });
    };

    const handleTyping = (e) => {
        setData('message_text', e.target.value);
        if (window.Echo) {
            window.Echo.join(`conversation.${conversation.id}`)
                .whisper('typing', {
                    user: auth.user.name
                });
        }
    };

    return (
        <AppLayout title="Conversation">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {conversation.customer_id === auth.user.id 
                                    ? conversation.vendor.name 
                                    : conversation.customer.name}
                            </h2>
                            {conversation.product && (
                                <div className="text-sm text-gray-500">
                                    Regarding: {conversation.product.name}
                                </div>
                            )}
                        </div>

                        <div className="h-[60vh] overflow-y-auto mb-4 space-y-4">
                            {messages.map((message) => {
                                const isSender = message.sender_id === auth.user.id;
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                                isSender
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                            }`}
                                        >
                                            <div className="text-sm">{message.message_text}</div>
                                            <div className={`text-xs mt-1 ${isSender ? 'text-green-100' : 'text-gray-500'}`}>
                                                {format(new Date(message.created_at), 'h:mm a')}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                                        <div className="text-sm text-gray-500">Typing...</div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={data.message_text}
                                    onChange={handleTyping}
                                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    placeholder="Type your message..."
                                />
                                <button
                                    type="submit"
                                    disabled={processing || !data.message_text.trim()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 