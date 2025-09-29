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
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const messagesEndRef = useRef(null);
    const channelRef = useRef(null);
    const lastSendTimeRef = useRef(0);
    const fileInputRef = useRef(null);

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
            
            setMessages(prev => {
                // Only add messages with valid IDs and prevent duplicates
                if (!message.data.id) {
                    return prev;
                }
                
                const messageExists = prev.some(msg => msg.id === message.data.id);
                if (messageExists) {
                    return prev;
                }
                
                return [...prev, {
                    id: message.data.id,
                    text: message.data.text,
                    type: message.data.type,
                    attachment_url: message.data.attachment_url,
                    senderId: message.data.senderId,
                    senderName: message.data.senderName,
                    timestamp: message.data.timestamp
                }];
            });
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

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        } else {
            alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        }
    };

    // Remove selected file
    const removeSelectedFile = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Open image modal
    const openImageModal = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setShowImageModal(true);
    };

    // Close image modal
    const closeImageModal = () => {
        setShowImageModal(false);
        setModalImageUrl('');
    };

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
                            type: msg.type,
                            attachment_url: msg.attachment_url,
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
        
        // Allow sending if there's a message OR a selected file
        if ((!newMessage.trim() && !selectedFile) || isSending || !isConnected) {
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
                text: newMessage.trim() || (selectedFile ? 'Attachment' : ''),
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
            
            // Step 2: Prepare FormData for file upload
            const receiverId = auth.user.id === vendorId ? customerId : vendorId;
            const formData = new FormData();
            formData.append('room_id', roomData.room.id);
            formData.append('receiver_id', receiverId);
            if (newMessage.trim()) {
                formData.append('message', newMessage.trim());
            }
            if (selectedFile) {
                formData.append('image', selectedFile);
            }
            
            const saveResponse = await fetch('/api/chat/send', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'same-origin',
                body: formData
            });

            if (saveResponse.ok) {
                const savedMessage = await saveResponse.json();
                
                // Then publish to Ably channel for real-time delivery
                if (savedMessage.message.id) {
                    const ablyMessage = {
                        ...messageData,
                        id: savedMessage.message.id,
                        room_id: savedMessage.message.room_id,
                        type: savedMessage.message.type,
                        attachment_url: savedMessage.message.attachment_url
                    };
                    await channelRef.current.publish('message', ablyMessage);
                }
                
                // Add message to local state immediately for better UX
                setMessages(prev => {
                    // Only add messages with valid IDs and prevent duplicates
                    if (!savedMessage.message.id) {
                        return prev;
                    }
                    
                    const messageExists = prev.some(msg => msg.id === savedMessage.message.id);
                    if (messageExists) {
                        return prev;
                    }
                    
                    const newMessage = {
                        id: savedMessage.message.id,
                        text: savedMessage.message.message,
                        type: savedMessage.message.type,
                        attachment_url: savedMessage.message.attachment_url,
                        senderId: savedMessage.message.sender_id,
                        senderName: auth.user.name,
                        timestamp: savedMessage.message.created_at
                    };
                    return [...prev, newMessage];
                });
                
                setNewMessage('');
                removeSelectedFile();
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
        <div className="flex flex-col h-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{otherUserName || 'Chat Room'}</h3>
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-yellow-300'}`}></div>
                            <p className="text-sm opacity-90">
                                {isConnected ? 'Online' : 'Connecting...'}
                            </p>
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
                {Object.keys(messageGroups).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-600">No messages yet</p>
                        <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                    </div>
                ) : (
                    Object.entries(messageGroups).map(([date, dateMessages]) => (
                    <div key={date}>
                        {/* Date separator */}
                        <div className="flex items-center justify-center my-6">
                            <div className="bg-white text-gray-500 text-xs px-4 py-2 rounded-full shadow-sm border border-gray-200">
                                {new Date(date).toLocaleDateString([], { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </div>
                        
                        {/* Messages for this date */}
                        {dateMessages.filter(message => message.id).map((message, index) => {
                            const isOwnMessage = message.senderId === auth.user.id;
                            
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                            isOwnMessage
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                    >
                                        {/* Image Display */}
                                        {message.type === 'image' && message.attachment_url && (
                                            <div className="mb-3">
                                                <div className="w-32 h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-sm">
                                                    <img 
                                                        src={message.attachment_url}
                                                        alt="Chat image"
                                                        className="w-full h-full object-cover"
                                                        onClick={() => openImageModal(message.attachment_url)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Text Message */}
                                        {message.text && (
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                        )}
                                        
                                        <p className={`text-xs mt-2 ${
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

            {/* Image Preview */}
            {preview && (
                <div className="p-4 border-t bg-white border-gray-200">
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                            <img 
                                src={preview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">Image selected</p>
                            <p className="text-xs text-gray-500 truncate">{selectedFile?.name}</p>
                        </div>
                        <button
                            type="button"
                            onClick={removeSelectedFile}
                            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t bg-white border-gray-200">
                <div className="flex space-x-2">
                    {/* File Upload Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending || !isConnected}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        title="Upload image"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    
                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                            disabled={isSending || !isConnected}
                            maxLength={2000}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={(!newMessage.trim() && !selectedFile) || isSending || !isConnected}
                        className="p-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
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

            {/* Image Modal */}
            {showImageModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={closeImageModal}
                >
                    <div 
                        className="relative max-w-5xl max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src={modalImageUrl}
                                alt="Full size image"
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={closeImageModal}
                                    className="p-3 text-white hover:text-gray-300 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full transition-all duration-200 backdrop-blur-sm"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
