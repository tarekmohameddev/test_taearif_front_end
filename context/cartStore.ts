"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem, Tenant } from "@/lib/types";

interface StoreState {
  tenant: Tenant | null;
  cart: {
    items: CartItem[];
    total: number;
  };
  wishlist: Product[];

  // Actions
  setTenant: (tenant: Tenant) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      tenant: null,
      cart: {
        items: [],
        total: 0,
      },
      wishlist: [],

      setTenant: (tenant) => set({ tenant }),

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.cart.items.find(
            (item) => item.productId === product?.id,
          );

          if (existingItem) {
            const updatedItems = state.cart.items.map((item) =>
              item.productId === product?.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );

            return {
              cart: {
                items: updatedItems,
                total: updatedItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                ),
              },
            };
          }

          const newItem: CartItem = {
            id: `cart-${product?.id}-${Date.now()}`,
            productId: product?.id,
            name: product?.name,
            price: product?.price,
            quantity,
            image: product?.images[0] || "",
          };

          const updatedItems = [...state.cart.items, newItem];

          return {
            cart: {
              items: updatedItems,
              total: updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              ),
            },
          };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const updatedItems = state.cart.items.filter(
            (item) => item.productId !== productId,
          );

          return {
            cart: {
              items: updatedItems,
              total: updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              ),
            },
          };
        }),

      updateCartItemQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const updatedItems = state.cart.items.filter(
              (item) => item.productId !== productId,
            );

            return {
              cart: {
                items: updatedItems,
                total: updatedItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                ),
              },
            };
          }

          const updatedItems = state.cart.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          );

          return {
            cart: {
              items: updatedItems,
              total: updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              ),
            },
          };
        }),

      clearCart: () =>
        set({
          cart: {
            items: [],
            total: 0,
          },
        }),

      toggleWishlist: (product) =>
        set((state) => {
          const isInWishlist = state.wishlist.some(
            (item) => item.id === product?.id,
          );

          if (isInWishlist) {
            return {
              wishlist: state.wishlist.filter(
                (item) => item.id !== product?.id,
              ),
            };
          }

          return {
            wishlist: [...state.wishlist, product],
          };
        }),
    }),
    {
      name: "tenant-store",
    },
  ),
);
