"use client";

import { createSlice } from "@reduxjs/toolkit";
import { addItemToCart, getCart, removeCartItem, updateCartItem, } from "./cart-action";
import { CartState } from "./cart.type";

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
    status: "pending",
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCartError: (state) => {
            state.error = null;
            state.status = "pending";
        },
        clearCartState: (state) => {
            state.cart = null;
            state.error = null;
            state.status = "pending";
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";
                state.cart = action.payload.data;
                state.error = null;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";
                state.cart = action.payload.data;
                state.error = null;
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";

                if (state.cart) {
                    const itemToRemove = state.cart.items.find((item) => item.uuid === action.payload.item_uuid);

                    if (itemToRemove) {
                        const itemPrice = parseFloat(itemToRemove.product?.price || "0");
                        const itemQuantity = itemToRemove.quantity;
                        const totalDeduction = itemPrice * itemQuantity;

                        state.cart.total_price = (parseFloat(state.cart.total_price) - totalDeduction).toFixed(2);
                        state.cart.items = state.cart.items.filter((item) => item.uuid !== action.payload.item_uuid);
                    }
                }
                state.error = null;
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";

                if (state.cart) {
                    const updatedItemFromApi = action.payload.data.items.find((item: any) => item.uuid === action.payload.item_uuid);
                    const existingItem = state.cart.items.find((item) => item.uuid === action.payload.item_uuid);

                    if (updatedItemFromApi && existingItem) {
                        const price = parseFloat(existingItem.product?.price || "0");
                        const oldTotal = price * existingItem.quantity;
                        existingItem.quantity = updatedItemFromApi.quantity;
                        const newTotal = price * existingItem.quantity;
                        state.cart.total_price = (parseFloat(state.cart.total_price) - oldTotal + newTotal).toFixed(2);
                    }
                }

                state.error = null;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            });
        // .addCase(deleteCart.pending, (state) => {
        //     state.loading = true;
        //     state.status = "pending";
        // })
        // .addCase(deleteCart.fulfilled, (state) => {
        //     state.loading = false;
        //     state.status = "succeed";
        //     state.cart = null;
        //     state.error = null;
        // })
        // .addCase(deleteCart.rejected, (state, action) => {
        //     state.loading = false;
        //     state.status = "rejected";
        //     state.error = action.payload as string;
        // });
    },
});

export const { resetCartError, clearCartState, } = cartSlice.actions;
export default cartSlice.reducer;