"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Container, IconButton, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import styles from "./cart.module.css";
import { RootState } from "@/redux/store";
import { getCart, removeCartItem, updateCartItem } from "@/redux/feature/cart/cart-action";
import { createOrder } from "@/redux/feature/order/order-action";
import { getAddresses } from "@/redux/feature/address/address.action";
import { Address } from "@/redux/feature/address/address.type";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { CartItem } from "@/redux/feature/cart/cart.type";
import { useRouter } from "next/navigation";
import PayModal from "@/component/pay-modal/pay-modal";
import UserAddressModal from "@/component/user-address-modal/user-address-modal";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { cart, loading } = useAppSelector((state: RootState) => state.cartReducer);
    const { addresses } = useAppSelector((state: RootState) => state.userAddressReducer);
    const [openPayModal, setOpenPayModal] = useState(false);
    const [openUserAddressModal, setOpenUserAddressModal] = useState(false);
    const [openPlaceOrderDialog, setOpenPlaceOrderDialog] = useState(false);
    const [selectedAddressUuid, setSelectedAddressUuid] = useState<string>("");
    const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

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

    const handlePlaceOrderClick = () => {
        setOpenPlaceOrderDialog(true);
    };

    const concatenateAddress = (address: Address): string => {
        return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
    };

    const getSelectedAddress = (): Address | undefined => {
        return addresses?.find(addr => addr.uuid === selectedAddressUuid);
    };

    const handleAddAddressClose = () => {
        setOpenUserAddressModal(false);
        setTimeout(() => {
            fetchAddresses();
        }, 500);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressUuid) {
            enqueueSnackbar("Please select or create a delivery address", { variant: "warning" });
            return;
        }

        const selectedAddress = getSelectedAddress();
        if (!selectedAddress) {
            enqueueSnackbar("Selected address not found", { variant: "error" });
            return;
        }

        if (!cart) {
            enqueueSnackbar("Cart is empty", { variant: "error" });
            return;
        }

        setPlaceOrderLoading(true);

        try {
            const concatenatedAddress = concatenateAddress(selectedAddress);

            const orderPayload = {
                cart_uuid: cart.uuid,
                total_price: Number(cart.total_price),
                order_address: concatenatedAddress,
                items: cart.items.map(item => ({
                    name: item.product?.name || "",
                    description: item.product?.description || "",
                    image_url: item.product?.image_url || "",
                    price: Number(item.product?.price) || 0,
                    quantity: item.quantity
                }))
            };

            await dispatch(createOrder(orderPayload)).unwrap();
            enqueueSnackbar("Order placed successfully!", { variant: "success" });
            setOpenPlaceOrderDialog(false);
            setSelectedAddressUuid("");

            // Refresh cart to get new empty cart
            setTimeout(() => {
                fetchCart();
                router.push("/order");
            }, 1000);
        } catch (err: any) {
            enqueueSnackbar(err || "Failed to place order", { variant: "error" });
        } finally {
            setPlaceOrderLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenPlaceOrderDialog(false);
        setSelectedAddressUuid("");
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
                    <Button color="primary" onClick={handlePlaceOrderClick} variant="contained">
                        Place Order
                    </Button>

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
            <UserAddressModal isOpen={openUserAddressModal} onClose={handleAddAddressClose} />

            <Dialog open={openPlaceOrderDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Choose Delivery Address</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {!addresses || addresses.length === 0 ? (
                            <Box>
                                <Typography color="textSecondary" sx={{ mb: 2 }}>
                                    No addresses found. Create one to place an order.
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                        setOpenPlaceOrderDialog(false);
                                        setOpenUserAddressModal(true);
                                    }}
                                >
                                    Add New Address
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                    Select an address:
                                </Typography>
                                <RadioGroup
                                    value={selectedAddressUuid}
                                    onChange={(e) => setSelectedAddressUuid(e.target.value)}
                                >
                                    {addresses.map((address) => (
                                        <Box key={address.uuid} sx={{ mb: 2, p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                            <FormControlLabel
                                                value={address.uuid}
                                                control={<Radio />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {address.street}, {address.city}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {address.state}, {address.postalCode}, {address.country}
                                                        </Typography>
                                                        {address.isDefault && (
                                                            <Typography variant="caption" sx={{ ml: 1, color: '#1976d2', fontWeight: 600 }}>
                                                                (Default)
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </Box>
                                    ))}
                                </RadioGroup>

                                <Divider sx={{ my: 2 }} />

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                        setOpenPlaceOrderDialog(false);
                                        setOpenUserAddressModal(true);
                                    }}
                                    sx={{ mt: 1 }}
                                >
                                    Add New Address
                                </Button>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={placeOrderLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePlaceOrder}
                        variant="contained"
                        color="primary"
                        disabled={placeOrderLoading || !selectedAddressUuid}
                    >
                        {placeOrderLoading ? "Placing Order..." : "Place Order"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}