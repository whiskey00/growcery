import { useState, useEffect } from 'react';

export default function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.selectedOption.label === item.selectedOption.label
      );

      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id, label) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.selectedOption.label === label)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
};


  return { cart, addToCart, removeFromCart, clearCart };
}
