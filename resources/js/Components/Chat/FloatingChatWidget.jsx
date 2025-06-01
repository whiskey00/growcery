import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import FloatingChatButton from './FloatingChatButton';
import ChatDrawer from './ChatDrawer';

export default function FloatingChatWidget({ initiallyOpen = false }) {
    const [isOpen, setIsOpen] = useState(initiallyOpen);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = usePage().props;

    // If user is not authenticated, don't render the widget
    if (!auth?.user) {
        return null;
    }

    useEffect(() => {
        setIsOpen(initiallyOpen);
    }, [initiallyOpen]);

    useEffect(() => {
        // Initial fetch of conversations
        fetchConversations();

        // Set up Echo for real-time updates
        if (window.Echo) {
            const channel = window.Echo.private(`App.Models.User.${auth.user.id}`)
                .listen('NewMessage', (e) => {
                    // Update conversations list
                    fetchConversations();

                    // If the active conversation matches the new message's conversation,
                    // update the active conversation
                    if (activeConversation?.id === e.conversation_id) {
                        handleConversationSelect({ id: e.conversation_id });
                    }
                });

            return () => channel.leave();
        }
    }, [activeConversation?.id]);

    const fetchConversations = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await fetch('/api/messages/conversations', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find(row => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1]
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            setConversations(data.conversations || []);
            setUnreadCount(data.conversations?.reduce((acc, conv) => acc + (conv.unread_count || 0), 0) || 0);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setError(error.message);
            setConversations([]);
            setUnreadCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConversationSelect = async (conversation) => {
        try {
            // If conversation is null (clicking back), just set active conversation to null
            if (!conversation) {
                setActiveConversation(null);
                return;
            }

            // If this is an update from sending a message, just update the state
            if (conversation.messages) {
                setActiveConversation({...conversation});
                
                // Also update the conversations list with the new last message
                if (conversation.last_message) {
                    setConversations(prevConversations => 
                        prevConversations.map(conv => 
                            conv.id === conversation.id 
                                ? {...conv, last_message: conversation.last_message}
                                : conv
                        )
                    );
                }
                return;
            }

            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/messages/conversations/${conversation.id}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': document.cookie
                        .split('; ')
                        .find(row => row.startsWith('XSRF-TOKEN='))
                        ?.split('=')[1]
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Sort messages by created_at
            if (data.conversation.messages) {
                data.conversation.messages.sort((a, b) => 
                    new Date(a.created_at) - new Date(b.created_at)
                );
            }

            setActiveConversation(data.conversation);
            setIsOpen(true);
        } catch (error) {
            console.error('Error fetching conversation:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <FloatingChatButton 
                unreadCount={unreadCount} 
                onClick={() => setIsOpen(true)} 
            />
            <ChatDrawer 
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setActiveConversation(null);
                    setError(null);
                }}
                conversations={conversations}
                activeConversation={activeConversation}
                onConversationSelect={handleConversationSelect}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
} 