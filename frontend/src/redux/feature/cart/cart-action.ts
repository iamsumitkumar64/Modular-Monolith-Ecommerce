"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "@/redux/store";
import { AddToCartPayload, RemoveCartItemPayload, UpdateCartItemPayload } from "./cart.type";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCart = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
    "cart/getCart",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token =
                getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/cart`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: token,
                    },
                }
            );

            const result = await res.json();

            if (!res.ok)
                throw new Error(result.message);

            return result;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const addItemToCart = createAsyncThunk<
    any,
    AddToCartPayload,
    { state: RootState }
>(
    "cart/addItemToCart",
    async (
        payload,
        { getState, rejectWithValue }
    ) => {
        try {
            const token =
                getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/cart/item`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const result = await res.json();

            if (!res.ok)
                throw new Error(result.message);

            return result;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const removeCartItem = createAsyncThunk<
    any,
    RemoveCartItemPayload,
    { state: RootState }
>(
    "cart/removeCartItem",
    async (
        payload,
        { getState, rejectWithValue }
    ) => {
        try {
            const token =
                getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/cart/item`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const result = await res.json();

            if (!res.ok)
                throw new Error(result.message);

            return {
                ...result,
                item_uuid:
                    payload.item_uuid,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// export const deleteCart = createAsyncThunk<
//     any,
//     void,
//     { state: RootState }
// >(
//     "cart/deleteCart",
//     async (_, { getState, rejectWithValue }) => {
//         try {
//             const token =
//                 getState().authReducer.token || "";

//             const res = await fetch(
//                 `${API_URL}/cart`,
//                 {
//                     method: "DELETE",
//                     headers: {
//                         "Content-Type":
//                             "application/json",
//                         Authorization: token,
//                     },
//                 }
//             );

//             const result = await res.json();

//             if (!res.ok)
//                 throw new Error(result.message);

//             return result;
//         } catch (err: any) {
//             return rejectWithValue(err.message);
//         }
//     }
// );



export const updateCartItem = createAsyncThunk<
    any,
    UpdateCartItemPayload,
    { state: RootState }
>(
    "cart/updateCartItem",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/cart/item`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message);

            return {
                ...result,
                item_uuid: payload.item_uuid,
            };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);