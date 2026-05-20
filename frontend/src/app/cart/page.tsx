"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Container, IconButton, Typography, CircularProgress, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./cart.module.css";
import { RootState } from "@/redux/store";
import { getCart, removeCartItem, updateCartItem } from "@/redux/feature/cart/cart-action";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { CartItem } from "@/redux/feature/cart/cart.type";
import PayModal from "@/component/pay-modal/pay-modal";
import UserAddressModal from "@/component/user-address-modal/user-address-modal";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector((state: RootState) => state.cartReducer);
    const [openPayModal, setOpenPayModal] = useState(false);
    const [openUserAddressModal, setOpenUserAddressModal] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            await dispatch(getCart()).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    const handleRemoveItem = async (item_uuid: string, cart_uuid: string) => {
        try {
            await dispatch(removeCartItem({ item_uuid, cart_uuid })).unwrap();
            enqueueSnackbar("Item removed from cart", { variant: "success" });
            // await fetchCart();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    // const handleDeleteCart = async () => {
    //     try {
    //         await dispatch(deleteCart()).unwrap();
    //         enqueueSnackbar("Cart deleted", { variant: "success", });
    //     } catch (err: any) {
    //         enqueueSnackbar(err, { variant: "warning", });
    //     }
    // };

    const handleUpdateQuantity = async (item_uuid: string, quantity: number) => {
        if (quantity < 1) return;

        try {
            await dispatch(updateCartItem({ item_uuid, quantity })).unwrap();
            enqueueSnackbar("Cart updated", { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    return (
        <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Cart
                </Typography>

                <Typography className={styles.subHeading}>
                    Infinite Scroll Products
                </Typography>
            </Box>
            {/* 
            {loading && (
                <Box className={styles.loader}>
                    <CircularProgress size={30} />
                </Box>
            )} */}

            {!loading && (!cart?.items || cart.items.length === 0) && (
                <Box className={styles.emptyWrapper}>
                    <Typography className={styles.emptyText}>
                        Cart is empty
                    </Typography>
                </Box>
            )}

            {/* {!!cart?.items?.length && (
                <Button
                    color="error"
                                    // onClick={handleDeleteCart}
                >
                    Delete Cart
                </Button>
            )} */}

            {cart && cart?.items?.length > 0 && (
                <Box className={styles.productWrapper}>
                    {cart.items.map((item: CartItem) => (
                        <Card key={item.uuid} className={styles.card}>
                            <Box className={styles.imageWrapper}>
                                <CardMedia
                                    component="img"
                                    image={item.product?.image_url}
                                    alt={item.product?.name}
                                    className={styles.image}
                                />
                            </Box>

                            <CardContent className={styles.cardContent}>
                                <Typography className={styles.productName}>
                                    {item.product?.name}
                                </Typography>

                                <Typography className={styles.description}>
                                    {item.product?.description}
                                </Typography>


                                <Box className={styles.placeWrapper}>
                                    <Typography className={styles.quantity}>
                                        Quantity: {item.quantity}
                                    </Typography>
                                    <Typography className={styles.price}>
                                        ₹ {Number(item.product?.price) * item.quantity}
                                    </Typography>
                                </Box>

                                <IconButton
                                    className={styles.removeBtn}
                                    onClick={() =>
                                        handleRemoveItem(item.uuid, item.cart_uuid)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardContent>

                            <Box className={styles.quantityWrapper}>
                                <Button
                                    size="small"
                                    onClick={() =>
                                        handleUpdateQuantity(item.uuid, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </Button>

                                <Typography>{item.quantity}</Typography>

                                <Button
                                    size="small"
                                    onClick={() =>
                                        handleUpdateQuantity(item.uuid, item.quantity + 1)
                                    }
                                >
                                    +
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}

            {cart && (
                <Box className={styles.summary}>
                    <Typography className={styles.summaryText}>
                        Total Items: {cart?.items?.length}
                    </Typography>

                    <Typography className={styles.summaryPrice}>
                        Total: ₹ {cart.total_price}
                    </Typography>
                </Box>
            )}

            {cart && cart?.items?.length > 0 && (
                <Box className={styles.paybox}>
                    <Button color="primary" onClick={() => setOpenPayModal(true)}>
                        Pay
                    </Button>

                    <Button onClick={() => setOpenUserAddressModal(true)}>
                        Add address
                    </Button>
                </Box>
            )}

            {cart && (
                <PayModal
                    open={openPayModal}
                    onClose={() => setOpenPayModal(false)}
                    amount={Number(cart.total_price)}
                />
            )}
            <UserAddressModal isOpen={openUserAddressModal} onClose={() => setOpenUserAddressModal(false)} />
        </Container>
    );
}