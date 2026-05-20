"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { RootState, AppDispatch } from "@/redux/store";
import styles from "./order.module.css";
import { getOrders } from "@/redux/feature/order/order-action";
import { Order } from "@/redux/feature/order/order-type";
import { enqueueSnackbar } from "notistack";
import Image from "next/image";

export default function OrderPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading } = useSelector((state: RootState) => state.orderReducer);
    const [limit] = useState(Number(process.env.page_limit) || 10);
    const [offset, setOffset] = useState(Number(process.env.page_offset) || 0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const result = await dispatch(getOrders({ limit, offset }));
            const fetchedOrders = (result.payload as any)?.data || [];
            setOffset(offset + limit);
            if (fetchedOrders.length < limit) setHasMore(false);
        } catch (err: any) {
            console.log(err);
            enqueueSnackbar(err, { variant: "warning", });
        }
    };

    return (
        <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Order Listing
                </Typography>

                <Typography className={styles.subHeading}>
                    Infinite Scroll Orders
                </Typography>
            </Box>

            <Box id="scrollableDiv" className={styles.scrollWrapper}>
                <InfiniteScroll
                    dataLength={orders ? orders.length : 0}
                    next={fetchOrders}
                    hasMore={hasMore}
                    loader={<Box className={styles.loader}><CircularProgress /></Box>}
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                    scrollableTarget="scrollableDiv"
                >
                    {orders && orders.length > 0 ? (
                        orders.map((order: Order) => (
                            <Card key={order.uuid} className={styles.orderCard}>
                                <CardContent>
                                    <Typography variant="h6">
                                        Order ID: {order.uuid}
                                    </Typography>
                                    <Typography variant="body2">
                                        Total Paid: ${order.total_price}
                                    </Typography>
                                    <Typography variant="body2">
                                        Status: {order.order_status} | Payment: {order.payment_status}
                                    </Typography>

                                    <Box className={styles.itemsWrapper}>
                                        {order.items.map((item) => (
                                            <Card key={item.uuid} className={styles.itemCard}>
                                                <Image
                                                    width={100}
                                                    height="100"
                                                    src={item.image_url}
                                                    alt={item.name}
                                                />
                                                <Box className={styles.itemContent}>
                                                    <Typography variant="subtitle1">{item.name}</Typography>
                                                    <Typography variant="body2">
                                                        Quantity: {item.quantity}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Price: ${item.price}
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (!loading && <Typography>No Orders Found</Typography>)}
                </InfiniteScroll>
            </Box>
        </Container>
    );
}