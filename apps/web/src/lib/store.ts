import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCents: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          ).filter((i) => i.quantity > 0),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalCents: () => {
        return get().items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
      },
    }),
    {
      name: 'myglambeauty-cart',
    }
  )
);

interface ChatStore {
  isOpen: boolean;
  sessionId: string | null;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  setOpen: (open: boolean) => void;
  addMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
  setSessionId: (id: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      isOpen: false,
      sessionId: null,
      messages: [],
      setOpen: (open) => set({ isOpen: open }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setSessionId: (id) => set({ sessionId: id }),
    }),
    {
      name: 'myglambeauty-chat',
    }
  )
);
