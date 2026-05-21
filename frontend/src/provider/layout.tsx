"use client"
import { socketUpdateOrderPaymentStatus, socketUpdateOrderStatus } from "@/redux/feature/order/order-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { connectSocket, disconnectSocket } from "@/service/socket";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

export default function RootSocketListener() {
    const { token } = useAppSelector((state: RootState) => state.authReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (token) {
            const socket = connectSocket(token);

            socket.on("order_status_changed", (message) => {
                enqueueSnackbar(`Order Status ${message.nextStatus} changed`, { variant: "info" });
                dispatch(socketUpdateOrderStatus(message));
            });

            socket.on("order_paid", (message) => {
                enqueueSnackbar(`Order paid ${JSON.stringify(message)}`, { variant: "info" });
                dispatch(socketUpdateOrderPaymentStatus(message));
            });

            return () => {
                disconnectSocket();
            };
        }
    }, [token, dispatch]);

    return null;
}