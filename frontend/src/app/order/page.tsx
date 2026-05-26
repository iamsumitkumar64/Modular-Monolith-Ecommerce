"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { RootState, AppDispatch } from "@/redux/store";
import styles from "./order.module.css";
import { returnOrder, getOrders } from "@/redux/feature/order/order-action";
import { Order } from "@/redux/feature/order/order-type";
import { enqueueSnackbar } from "notistack";
import Image from "next/image";
import Slider from "react-slick";
import { sliderSettings } from "../../config/slider";
import PayModal from "@/component/pay-modal/pay-modal";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "@/enum/order.enum";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Tooltip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import isReturnPolicyExpired from "@/service/return.policy.service";

export default function OrderPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading } = useSelector((state: RootState) => state.orderReducer);
    const [limit] = useState(Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10);
    const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
    const [hasMore, setHasMore] = useState(true);
    const [payModalOrder, setPayModalOrder] = useState<string | null>(null);

    useEffect(() => {
        if (!orders?.length) {
            fetchOrders();
        }
    }, []);

    const fetchOrders = async () => {
        try {
            const result = await dispatch(getOrders({ limit, offset })).unwrap();
            const fetchedOrders = Array.isArray(result.data) ? result.data : [];
            setOffset(prevOffset => prevOffset + limit);
            if (fetchedOrders.length < limit) setHasMore(false);
        } catch (err: any) {
            console.log(err);
            enqueueSnackbar(err, { variant: "warning", });
        }
    };

    const handleReturnOrder = async (order_uuid: string) => {
        try {
            const result = await dispatch(returnOrder({ order_uuid })).unwrap();
            enqueueSnackbar(result.message, { variant: "success", });
        } catch (err: any) {
            console.log(err);
            enqueueSnackbar(err, { variant: "warning", });
        }
    };


    const orderSteps = [
        OrderStatusEnum.PENDING,
        OrderStatusEnum.PROCESSING,
        OrderStatusEnum.PACKED,
        OrderStatusEnum.DELIVERED,
    ];

    const getActiveStep = (status: OrderStatusEnum) => {
        return orderSteps.indexOf(status);
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
                        orders.map((order: Order, idx: number) => {
                            const descendingIndex = orders.length - 1 - idx;

                            return (
                                <Card key={order.uuid} className={styles.orderCard}>

                                    <Stepper activeStep={getActiveStep((order.returned_from_status || order.order_status) as OrderStatusEnum)} alternativeLabel className={styles.stepper}>
                                        {orderSteps.map((step) => (
                                            <Step
                                                key={step}
                                                completed={
                                                    order.order_status === OrderStatusEnum.DELIVERED
                                                        ? true
                                                        : undefined
                                                }
                                            >
                                                <StepLabel
                                                    error={order.payment_status === OrderPaymentStatusEnum.REFUND && order.returned_from_status === step}
                                                    sx={{
                                                        "& .MuiStepLabel-label": {
                                                            textTransform: "capitalize",
                                                            fontSize: "0.85rem",
                                                        },
                                                    }}
                                                >
                                                    {step}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    <Box className={styles.orderLabel}>
                                        # {descendingIndex + 1}
                                    </Box>

                                    <CardContent className={styles.orderDetail}>
                                        <Typography variant="h6">
                                            Order ID: {order.uuid}
                                        </Typography>

                                        <Typography variant="h6">
                                            Total Price: {order.total_price}
                                        </Typography>

                                        <Box>
                                            {
                                                order.payment_status !== OrderPaymentStatusEnum.PAID &&
                                                order.payment_status !== OrderPaymentStatusEnum.REFUND &&
                                                order.order_status !== OrderStatusEnum.RETURNED &&
                                                <Button
                                                    color="primary"
                                                    onClick={() => setPayModalOrder(order.uuid)}
                                                >
                                                    Pay {order.total_price}
                                                </Button>
                                            }

                                            {
                                                order.payment_status === OrderPaymentStatusEnum.PAID &&
                                                order.order_status !== OrderStatusEnum.RETURNED &&
                                                <Tooltip
                                                    followCursor
                                                    describeChild
                                                    placement="bottom"
                                                    title={`You can only return orders within ${process.env.NEXT_PUBLIC_MAX_RETURN_ORDER_DAYS_POLICY} days.`}
                                                >
                                                    <span>
                                                        <Button
                                                            onClick={() => handleReturnOrder(order.uuid)}
                                                            disabled={isReturnPolicyExpired(new Date(order.created_at))}
                                                            startIcon={
                                                                isReturnPolicyExpired(new Date(order.created_at)) && (
                                                                    <WarningAmberIcon color="error" />
                                                                )
                                                            }
                                                        >
                                                            Return Order and Get Refund {order.total_price}
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            }

                                            <Box sx={{ width: "100%", mt: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ mt: 1, textAlign: "center" }}
                                                >
                                                    Payment: {order.payment_status.toUpperCase()}
                                                </Typography>
                                            </Box>

                                            <PayModal
                                                open={payModalOrder === order.uuid}
                                                onClose={() => setPayModalOrder(null)}
                                                amount={Number(order.total_price)}
                                                order_uuid={order.uuid}
                                            />
                                        </Box>

                                        <Box className={styles.slidercomp}>
                                            <Slider {...sliderSettings}>
                                                {order.items.map((item) => (
                                                    <Card key={item.uuid} className={styles.itemCard}>
                                                        <Box className={styles.imageWrapper}>
                                                            <Image
                                                                width={200}
                                                                height={100}
                                                                src={item.image_url}
                                                                alt={item.name}
                                                                className={styles.itemImage}
                                                            />
                                                        </Box>
                                                        <Box className={styles.itemContent}>
                                                            <Typography variant="subtitle1">{item.name}</Typography>
                                                            <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                                            <Typography variant="body2">Price: ${item.price}</Typography>
                                                        </Box>
                                                    </Card>
                                                ))}
                                            </Slider>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );

                        })
                    ) : (!loading && <Typography>No Orders Found</Typography>)}
                </InfiniteScroll>
            </Box>
        </Container>
    );
}