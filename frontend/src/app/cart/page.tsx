"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Container, IconButton, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./cart.module.css";
import { RootState } from "@/redux/store";
import { getCart, removeCartItem, updateCartItem } from "@/redux/feature/cart/cart-action";
import { getAddresses } from "@/redux/feature/address/address.action";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { CartItem } from "@/redux/feature/cart/cart.type";
import UserAddressModal from "@/component/user-address-modal/user-address-modal";
import PlaceOrderDialog from "@/component/place-order-comp/place-order.comp";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector((state: RootState) => state.cartReducer);
    const { addresses } = useAppSelector((state: RootState) => state.userAddressReducer);
    const [openUserAddressModal, setOpenUserAddressModal] = useState(false);
    const [openPlaceOrderDialog, setOpenPlaceOrderDialog] = useState(false);

    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, []);

    const fetchCart = async () => {
        try {
            await dispatch(getCart()).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    const fetchAddresses = async () => {
        try {
            await dispatch(getAddresses()).unwrap();
        } catch (err: any) {
            console.error("Error fetching addresses:", err);
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

    const handleAddAddressClose = () => {
        setOpenUserAddressModal(false);
        setTimeout(() => {
            fetchAddresses();
        }, 500);
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
                                    <Typography className={styles.stock}>
                                        Stock: ₹ {Number(item.product?.stock)}
                                    </Typography>
                                    <Typography className={styles.price}>
                                        Price:  ₹ {Number(item.product?.price) * item.quantity}
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
                                    disabled={Number(item.product?.stock) < item.quantity + 1}
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
                    <Button
                        color="primary"
                        onClick={() => setOpenPlaceOrderDialog(true)}
                        variant="contained"
                    >
                        Place Order
                    </Button>

                    <Button onClick={() => setOpenUserAddressModal(true)}>
                        Add address
                    </Button>
                </Box>
            )}
            <UserAddressModal isOpen={openUserAddressModal} onClose={handleAddAddressClose} />

            <PlaceOrderDialog
                open={openPlaceOrderDialog}
                onClose={() => setOpenPlaceOrderDialog(false)}
                addresses={addresses || []}
                cart={cart}
                onAddAddressClick={() => setOpenUserAddressModal(true)}
            />
        </Container>
    );
}