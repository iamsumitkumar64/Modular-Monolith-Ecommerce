"use client";

import { createSlice } from "@reduxjs/toolkit";
import { OrderState } from "./order-type";
import { getOrders, createOrder, returnOrder } from "./order-action";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "@/enum/order.enum";

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
        socketUpdateOrderStatus: (state, action) => {
            const { order_uuid, nextStatus } = action.payload;
            if (!state.orders) return;

            const orderIndex = state.orders.findIndex(o => o.uuid === order_uuid);

            if (orderIndex !== -1) {
                state.orders[orderIndex].order_status = nextStatus;
            }
        },
        socketUpdateOrderPaymentStatus: (state, action) => {
            const { order_uuid } = action.payload;
            if (!state.orders) return;

            const orderIndex = state.orders.findIndex(o => o.uuid === order_uuid);

            if (orderIndex !== -1) {
                state.orders[orderIndex].payment_status = OrderPaymentStatusEnum.PAID;
            }
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

                const newOrders = action.payload.data as any[];

                if (state.orders) {
                    const uuids = new Set(state.orders.map(o => o.uuid));
                    const filteredNewOrders = newOrders.filter(o => !uuids.has(o.uuid));
                    state.orders = [...state.orders, ...filteredNewOrders];
                } else {
                    state.orders = newOrders;
                }

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
                if (state.orders) state.orders.unshift(action.payload.data as any);
                else state.orders = [action.payload.data as any];
                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(returnOrder.fulfilled, (state, action) => {
                const orderIndex = state.orders?.findIndex(o => o.uuid === action.meta.arg.order_uuid);
                if (orderIndex !== undefined && orderIndex !== -1 && state.orders) {
                    state.orders[orderIndex].returned_from_status = state.orders[orderIndex].order_status;
                    state.orders[orderIndex].order_status = OrderStatusEnum.RETURNED;
                    state.orders[orderIndex].payment_status = OrderPaymentStatusEnum.REFUND;
                }
            });
    },
});

export const { resetOrderError, clearOrderState, socketUpdateOrderStatus, socketUpdateOrderPaymentStatus } = orderSlice.actions;
export default orderSlice.reducer;