import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { chatClient, getRoomId, getUserDisplayName } from '@/Services/ablyChat';

export default function Chat({ vendorId, customerId, roomId: propRoomId, otherUserName: propOtherUserName, onClose }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [otherUserName, setOtherUserName] = useState(propOtherUserName || '');
    const messagesEndRef = useRef(null);
    const channelRef = useRef(null);
    const lastSendTimeRef = useRef(0);

    // Always use the generated room ID format for consistency
    // This ensures both customer and vendor connect to the same channel
    const roomId = getRoomId(vendorId, customerId);

    useEffect(() => {
        if (!auth?.user) return;

        // Connect to Ably channel for real-time messaging

        // Check if chatClient is properly initialized
        if (!chatClient || !chatClient.channels) {
            console.error('❌ Chat client not properly initialized');
            return;
        }

        // Get the channel
        const channel = chatClient.channels.get(`chat:${roomId}`);
        channelRef.current = channel;

        // Subscribe to messages
        channel.subscribe('message', (message) => {
            setMessages(prev => [...prev, {
                id: message.id,
                text: message.data.text,
                senderId: message.data.senderId,
                senderName: message.data.senderName,
                timestamp: message.timestamp
            }]);
        });

        // Listen for connection state changes
        chatClient.connection.on('connected', () => {
            setIsConnected(true);
        });

        chatClient.connection.on('disconnected', () => {
            setIsConnected(false);
        });

        chatClient.connection.on('connecting', () => {
            setIsConnected(false);
        });

        chatClient.connection.on('failed', (error) => {
            console.error('Failed to connect to Ably:', error);
            setIsConnected(false);
        });

        // Check current connection state
        if (chatClient.connection.state === 'connected') {
            setIsConnected(true);
        }

        // Load existing messages from database
        loadChatHistory();

        return () => {
            channel.unsubscribe();
        };
    }, [roomId, auth?.user]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Update otherUserName when prop changes
    useEffect(() => {
        if (propOtherUserName) {
            setOtherUserName(propOtherUserName);
        }
    }, [propOtherUserName]);

    const loadChatHistory = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const roomResponse = await fetch('/api/chat/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    vendor_id: vendorId,
                    customer_id: customerId
                })
            });

            if (roomResponse.ok) {
                const roomData = await roomResponse.json();
                
                if (roomData.room) {
                    // Set the other user's name
                    const otherUser = auth.user.id === vendorId ? roomData.room.customer : roomData.room.vendor;
                    setOtherUserName(otherUser.name);
                    
                    const messagesResponse = await fetch(`/api/chat/rooms/${roomData.room.id}/messages`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': csrfToken || '',
                        },
                        credentials: 'same-origin'
                    });

                    if (messagesResponse.ok) {
                        const messagesData = await messagesResponse.json();
                        
                        const formattedMessages = messagesData.messages.map(msg => ({
                            id: msg.id,
                            text: msg.message,
                            senderId: msg.sender_id,
                            senderName: msg.sender.name,
                            timestamp: msg.created_at
                        }));
                        
                        setMessages(formattedMessages);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || isSending || !isConnected) {
            return;
        }

        // Prevent double sending by checking if already sending
        if (isSending) {
            return;
        }

        // Debounce: prevent sending messages too quickly (within 1 second)
        const now = Date.now();
        if (now - lastSendTimeRef.current < 1000) {
            return;
        }
        lastSendTimeRef.current = now;

        setIsSending(true);
        
        try {
            const messageData = {
                text: newMessage.trim(),
                senderId: auth.user.id,
                senderName: auth.user.name,
                timestamp: new Date().toISOString()
            };

            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            // Step 1: Get or create room
            const roomResponse = await fetch('/api/chat/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    vendor_id: vendorId,
                    customer_id: customerId
                })
            });

            if (!roomResponse.ok) {
                throw new Error('Failed to get room');
            }

            const roomData = await roomResponse.json();
            
            // Step 2: Send message to the room
            const receiverId = auth.user.id === vendorId ? customerId : vendorId;
            
            const saveResponse = await fetch('/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    room_id: roomData.room.id,
                    receiver_id: receiverId,
                    message: newMessage.trim()
                })
            });

            if (saveResponse.ok) {
                const savedMessage = await saveResponse.json();
                
                // Then publish to Ably channel for real-time delivery
                await channelRef.current.publish('message', {
                    ...messageData,
                    id: savedMessage.message.id,
                    room_id: savedMessage.message.room_id
                });
                
                // Add message to local state immediately for better UX
                setMessages(prev => [...prev, {
                    id: savedMessage.message.id,
                    text: savedMessage.message.message,
                    senderId: savedMessage.message.sender_id,
                    senderName: auth.user.name,
                    timestamp: savedMessage.message.created_at
                }]);
                
                setNewMessage('');
            } else {
                throw new Error('Failed to save message to database');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const groupMessagesByDate = (messages) => {
        if (!messages || !Array.isArray(messages)) {
            return {};
        }
        
        const groups = {};
        messages.forEach(message => {
            const date = new Date(message.timestamp).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });
        return groups;
    };

    const messageGroups = groupMessagesByDate(messages);

    // Don't render if user is not authenticated
    if (!auth?.user) {
        return null;
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium">{otherUserName || 'Chat Room'}</h3>
                        <p className="text-xs opacity-90">
                            {isConnected ? 'Connected' : 'Connecting...'}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.keys(messageGroups).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs text-gray-400">Start the conversation!</p>
                    </div>
                ) : (
                    Object.entries(messageGroups).map(([date, dateMessages]) => (
                    <div key={date}>
                        {/* Date separator */}
                        <div className="flex items-center justify-center my-4">
                            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                {new Date(date).toLocaleDateString([], { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </div>
                        
                        {/* Messages for this date */}
                        {dateMessages.map((message, index) => {
                            const isOwnMessage = message.senderId === auth.user.id;
                            return (
                                <div
                                    key={message.id || index}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            isOwnMessage
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${
                                            isOwnMessage ? 'text-green-100' : 'text-gray-500'
                                        }`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isSending || !isConnected}
                        maxLength={1000}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending || !isConnected}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
