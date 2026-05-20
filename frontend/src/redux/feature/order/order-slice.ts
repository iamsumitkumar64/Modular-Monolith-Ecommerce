"use client";

import { createSlice } from "@reduxjs/toolkit";
import { OrderState } from "./order-type";
import { getOrders, createOrder } from "./order-action";

const initialState: OrderState = {
    orders: null,
    loading: false,
    error: null,
    status: "pending",
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderError: (state) => {
            state.error = null;
            state.status = "pending";
        },
        clearOrderState: (state) => {
            state.orders = null;
            state.error = null;
            state.status = "pending";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";
                state.orders = action.payload.data as any[];
                state.error = null;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";
                if (state.orders) state.orders.push(action.payload.data as any);
                else state.orders = [action.payload.data as any];
                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const { resetOrderError, clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;