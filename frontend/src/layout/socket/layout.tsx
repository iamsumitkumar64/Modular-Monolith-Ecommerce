"use client"
import { SocketEventNameEnum } from "@/enum/socket.enum";
import { socketUpdateOrderPaymentStatus, socketUpdateOrderStatus } from "@/redux/feature/order/order-slice";
import { socketProductStockDeduct, socketProductStockIncrease } from "@/redux/feature/product/product-slice";
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

            socket.on(SocketEventNameEnum.ORDER_STATUS_CHANGED, (message) => {
                enqueueSnackbar(`Order Status ${message.nextStatus} changed Success`, { variant: "info" });
                dispatch(socketUpdateOrderStatus(message));
            });

            socket.on(SocketEventNameEnum.ORDER_PAID, (message) => {
                enqueueSnackbar(`Order's Payment paid Success`, { variant: "info" });
                dispatch(socketUpdateOrderPaymentStatus(message));
            });

            socket.on(SocketEventNameEnum.PRODUCT_STOCK_DEDUCT, (message) => {
                enqueueSnackbar(`Stock Deduct Success`, { variant: "info" });
                dispatch(socketProductStockDeduct(message));
            });

            socket.on(SocketEventNameEnum.PRODUCT_STOCK_INCREASE, (message) => {
                enqueueSnackbar(`Stock increase as order return Success`, { variant: "info" });
                dispatch(socketProductStockIncrease(message));
            });

            return () => {
                disconnectSocket();
            };
        }
    }, [token, dispatch]);

    return null;
}