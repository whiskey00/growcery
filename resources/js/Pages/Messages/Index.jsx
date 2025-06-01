import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ conversations }) {
    const { auth } = usePage().props;
    
    return (
        <AppLayout title="Messages">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Messages</h2>

                        {conversations.data.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No conversations yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {conversations.data.map((conversation) => {
                                    const otherUser = conversation.customer_id === auth.user.id 
                                        ? conversation.vendor 
                                        : conversation.customer;

                                    return (
                                        <Link
                                            key={conversation.id}
                                            href={`/messages/${conversation.id}`}
                                            className="block hover:bg-gray-50"
                                        >
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                                                                <span className="text-lg font-semibold text-white">
                                                                    {otherUser.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {otherUser.name}
                                                            </div>
                                                            {conversation.last_message && (
                                                                <div className="mt-1 text-sm text-gray-500">
                                                                    {conversation.last_message.message_text.length > 50
                                                                        ? conversation.last_message.message_text.substring(0, 50) + '...'
                                                                        : conversation.last_message.message_text
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                                                        {conversation.last_message && (
                                                            <div className="text-sm text-gray-500">
                                                                {format(new Date(conversation.last_message.created_at), 'MMM d, h:mm a')}
                                                            </div>
                                                        )}
                                                        {conversation.unread_count > 0 && (
                                                            <div className="mt-1">
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    {conversation.unread_count}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 