"use client";

import { createSlice } from "@reduxjs/toolkit";
import { addAmount, addCard, deleteCard, getAccount, getCards, getHistories, } from "./payment.action";
import { PaymentState } from "./payment.type";

const initialState: PaymentState = {
    cards: [],
    account: null,
    histories: [],
    loading: false,
    error: null,
    status: "pending",
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        resetPaymentError: (state) => {
            state.error = null;
            state.status = "pending";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCards.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getCards.fulfilled, (state, action) => {
                state.loading = false;
                state.cards = action.payload.data;
                state.status = "succeed";
                state.error = null;
            })
            .addCase(getCards.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(addCard.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(addCard.fulfilled, (state, action) => {
                state.loading = false;
                state.cards.unshift(action.payload.data);
                state.status = "succeed";
                state.error = null;
            })
            .addCase(addCard.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(deleteCard.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(deleteCard.fulfilled, (state, action) => {
                state.loading = false;
                state.cards = state.cards.filter((card) => card.uuid !== action.payload);
                state.status = "succeed";
                state.error = null;
            })
            .addCase(deleteCard.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(getAccount.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.account = action.payload.data;
                state.status = "succeed";
                state.error = null;
            })
            .addCase(getAccount.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(addAmount.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(addAmount.fulfilled, (state, action) => {
                state.loading = false;
                state.account = action.payload.data;
                state.status = "succeed";
                state.error = null;
            })
            .addCase(addAmount.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(getHistories.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getHistories.fulfilled, (state, action) => {
                state.loading = false;
                state.histories = action.payload.data;
                state.status = "succeed";
                state.error = null;
            })
            .addCase(getHistories.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const { resetPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;