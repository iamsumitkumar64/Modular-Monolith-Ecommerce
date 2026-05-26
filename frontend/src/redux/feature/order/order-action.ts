"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { OrderResponse, CreateOrderPayload, returnOrderResponse } from "./order-type";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getOrders = createAsyncThunk<
    OrderResponse,
    { limit?: number; offset?: number },
    { state: RootState }
>(
    "order/list",
    async (
        { limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10, offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0 }: { limit?: number; offset?: number },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/order?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    }
                }
            );

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createOrder = createAsyncThunk<
    OrderResponse,
    CreateOrderPayload,
    { state: RootState }
>("order/createOrder", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";
        const res = await fetch(`${API_URL}/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        return result;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const returnOrder = createAsyncThunk<
    returnOrderResponse,
    { order_uuid: string },
    { state: RootState }
>("order/returnOrder", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";
        const res = await fetch(`${API_URL}/order/return`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        return result;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});