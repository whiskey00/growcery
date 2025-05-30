import { router } from '@inertiajs/react';
import axios from 'axios';
import { create } from 'zustand';

const useCart = create((set, get) => ({
    items: [],
    isLoading: false,

    setItems: (items) => set({ items }),

    addToCart: async (item) => {
        set({ isLoading: true });
        try {
            // Check if the item already exists in the cart with the same option
            const response = await axios.post('/customer/cart', {
                product_id: item.id,
                quantity: item.quantity,
                selectedOption: item.selectedOption,
                update_existing: true, // Add this flag to indicate we want to update existing items
            });

            // Refresh the page props
            router.reload({ only: ['cartItems'] });
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            alert(error.response?.data?.message || 'Failed to add item to cart');
        } finally {
            set({ isLoading: false });
        }
    },

    updateQuantity: async (cartItemId, quantity) => {
        set({ isLoading: true });
        try {
            await axios.patch(`/customer/cart/${cartItemId}`, {
                quantity,
            });

            // Refresh the page props
            router.reload({ only: ['cartItems'] });
        } catch (error) {
            console.error('Failed to update cart item:', error);
            alert(error.response?.data?.message || 'Failed to update cart item');
        } finally {
            set({ isLoading: false });
        }
    },

    removeFromCart: async (cartItemId) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/customer/cart/${cartItemId}`);

            // Refresh the page props
            router.reload({ only: ['cartItems'] });
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
            alert(error.response?.data?.message || 'Failed to remove item from cart');
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useCart;
