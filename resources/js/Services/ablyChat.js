import * as Ably from 'ably';

// Get Ably key from environment
const ablyKey = import.meta.env.VITE_ABLY_KEY;

// Initialize Ably Realtime client directly
export const chatClient = new Ably.Realtime({
    clientId: 'growcery-chat',
    key: ablyKey,
    // Use token authentication in production
    // authUrl: '/api/ably/auth'
});

// Helper function to get room ID for vendor-customer pair
export const getRoomId = (vendorId, customerId) => {
    // Sort IDs to ensure consistent room ID regardless of who initiates
    const sortedIds = [vendorId, customerId].sort((a, b) => a - b);
    return `room-${sortedIds[0]}-${sortedIds[1]}`;
};

// Helper function to get user display name
export const getUserDisplayName = (user) => {
    return user.name || user.email || `User ${user.id}`;
};

export default chatClient;
