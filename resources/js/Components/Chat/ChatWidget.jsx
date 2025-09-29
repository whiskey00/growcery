import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Chat from './Chat';
import { chatClient, getRoomId } from '@/Services/ablyChat';

export default function ChatWidget({ className = '', autoOpen = false, targetVendorId = null }) {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(autoOpen);
    const [showInbox, setShowInbox] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatRooms, setChatRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load chat rooms when widget opens
    useEffect(() => {
        if (isOpen && showInbox) {
            loadChatRooms();
        }
    }, [isOpen, showInbox]);

    // Auto-select target vendor if provided
    useEffect(() => {
        if (targetVendorId && chatRooms.length > 0) {
            const targetRoom = chatRooms.find(room => 
                room.vendorId === targetVendorId || room.customerId === targetVendorId
            );
            if (targetRoom) {
                selectChat(targetRoom);
            }
        }
    }, [targetVendorId, chatRooms]);

    // Listen for custom events to open chat widget
    useEffect(() => {
        const handleOpenChatWidget = (event) => {
            const { vendorId } = event.detail;
            setIsOpen(true);
            setShowInbox(true);
            // Store the target vendor ID for when rooms are loaded
            window.targetVendorId = vendorId;
        };

        window.addEventListener('openChatWidget', handleOpenChatWidget);
        return () => window.removeEventListener('openChatWidget', handleOpenChatWidget);
    }, []);

    // Check URL parameters for chat_vendor
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const chatVendor = urlParams.get('chat_vendor');
        if (chatVendor) {
            setIsOpen(true);
            setShowInbox(true);
            window.targetVendorId = parseInt(chatVendor);
        }
    }, []);

    const loadChatRooms = async () => {
        setIsLoading(true);
        try {
            // Try to fetch from the existing Laravel API
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/api/chat/rooms', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                
                // Transform the API response to our format
                const rooms = data.rooms.map(room => {
                    // Determine the other user's name based on current user's role
                    const otherUserName = room.other_user.name;
                    
                    return {
                        id: room.id,
                        vendorId: room.vendor_id,
                        customerId: room.customer_id,
                        vendorName: room.vendor.name,
                        customerName: room.customer.name,
                        otherUserName: otherUserName, // The name to display in inbox
                        lastMessage: room.latest_message?.message || 'No messages yet',
                        lastMessageTime: room.latest_message?.created_at || room.last_message_at || new Date().toISOString(),
                        unreadCount: 0 // TODO: Implement unread count
                    };
                });
                
                setChatRooms(rooms);
                
                // Auto-select target vendor if specified
                if (window.targetVendorId) {
                    const targetRoom = rooms.find(room => 
                        room.vendorId === window.targetVendorId || room.customerId === window.targetVendorId
                    );
                    if (targetRoom) {
                        selectChat(targetRoom);
                        // Clear the target vendor ID
                        window.targetVendorId = null;
                    }
                }
            } else {
                // Fallback to sample data
                const rooms = [];
                
                if (auth.user.role === 'customer') {
                    rooms.push({
                        id: 'room-3-8',
                        vendorId: 3,
                        customerId: 8,
                        vendorName: 'Sample Vendor',
                        customerName: 'Sample Customer',
                        otherUserName: 'Sample Vendor',
                        lastMessage: 'Hello! How can I help you?',
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: 0
                    });
                } else if (auth.user.role === 'vendor') {
                    rooms.push({
                        id: 'room-3-8',
                        vendorId: 3,
                        customerId: 8,
                        vendorName: 'Sample Vendor',
                        customerName: 'Sample Customer',
                        otherUserName: 'Sample Customer',
                        lastMessage: 'Hello! How can I help you?',
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: 0
                    });
                }
                
                setChatRooms(rooms);
                
                // Auto-select target vendor if specified
                if (window.targetVendorId) {
                    const targetRoom = rooms.find(room => 
                        room.vendorId === window.targetVendorId || room.customerId === window.targetVendorId
                    );
                    if (targetRoom) {
                        selectChat(targetRoom);
                        // Clear the target vendor ID
                        window.targetVendorId = null;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load chat rooms:', error);
            setChatRooms([]);
        } finally {
            setIsLoading(false);
        }
    };

    const selectChat = (room) => {
        setSelectedChat(room);
        setShowInbox(false);
    };

    const backToInbox = () => {
        setSelectedChat(null);
        setShowInbox(true);
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

    // Don't render if user is not authenticated
    if (!auth?.user) {
        return null;
    }

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            {isOpen ? (
                <div className="w-80 h-[500px] bg-white rounded-lg shadow-xl border">
                    {showInbox ? (
                        // Inbox View
                        <div className="flex flex-col h-full">
                            {/* Inbox Header */}
                            <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white rounded-t-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Messages</h3>
                                        <p className="text-xs opacity-90">
                                            {auth.user.role === 'customer' ? 'Chat with vendors' : 'Chat with customers'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Chat Rooms List */}
                            <div className="flex-1 overflow-y-auto">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    </div>
                                ) : chatRooms.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                                        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <p className="text-sm text-center">No conversations yet</p>
                                        <p className="text-xs text-gray-400 text-center">
                                            {auth.user.role === 'customer' 
                                                ? 'Start a conversation with a vendor' 
                                                : 'Customers will appear here when they message you'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    chatRooms.map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() => selectChat(room)}
                                            className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-600 font-medium text-sm">
                                                        {room.otherUserName?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {room.otherUserName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatTime(room.lastMessageTime)}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {room.lastMessage}
                                                    </p>
                                                </div>
                                                {room.unreadCount > 0 && (
                                                    <div className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {room.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        // Chat View
                        <Chat
                            vendorId={selectedChat.vendorId}
                            customerId={selectedChat.customerId}
                            otherUserName={selectedChat.otherUserName}
                            onClose={backToInbox}
                        />
                    )}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="hidden sm:inline">Chat</span>
                </button>
            )}
        </div>
    );
}
