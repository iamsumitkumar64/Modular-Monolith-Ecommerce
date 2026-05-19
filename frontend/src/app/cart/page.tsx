"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Container, IconButton, Typography, CircularProgress, Modal, TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./cart.module.css";
import { RootState } from "@/redux/store";
import { getCart, removeCartItem, updateCartItem } from "@/redux/feature/cart/cart-action";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { CartItem } from "@/redux/feature/cart/cart.type";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector((state: RootState) => state.cartReducer);
    const token = useAppSelector((state: RootState) => state.authReducer.token);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [cards, setCards] = useState<any[]>([]);
    const [selectedCardUuid, setSelectedCardUuid] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [cardForm, setCardForm] = useState({
        name_on_card: "",
        card_number: "",
        expiry_month: "",
        expiry_year: "",
    });
    const [isLoadingCards, setIsLoadingCards] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (cart) {
            setAmount(Number(cart.total_price || 0));
        }
    }, [cart]);

    const fetchCart = async () => {
        try {
            await dispatch(getCart()).unwrap();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    const fetchCards = async () => {
        if (!token) return;
        setIsLoadingCards(true);
        try {
            const res = await fetch(`${API_URL}/finance/cards`, {
                headers: {
                    Authorization: token,
                },
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Unable to fetch cards");
            setCards(result.data || []);
            setSelectedCardUuid(result.data?.[0]?.uuid || "");
        } catch (err: any) {
            enqueueSnackbar(err.message || err, { variant: "warning" });
        } finally {
            setIsLoadingCards(false);
        }
    };

    const handleOpenPaymentModal = async () => {
        setPaymentModalOpen(true);
        await fetchCards();
    };

    const handleClosePaymentModal = () => {
        setPaymentModalOpen(false);
        setSelectedCardUuid("");
    };

    const handleAddCard = async () => {
        if (!token) return;
        if (!cardForm.card_number || !cardForm.name_on_card) {
            enqueueSnackbar("Please fill card number and name", { variant: "warning" });
            return;
        }
        try {
            const res = await fetch(`${API_URL}/finance/cards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(cardForm),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Unable to add card");
            setCards((prev) => [result.data, ...prev]);
            setSelectedCardUuid(result.data.uuid);
            enqueueSnackbar("Card added successfully", { variant: "success" });
            setCardForm({ name_on_card: "", card_number: "", expiry_month: "", expiry_year: "" });
        } catch (err: any) {
            enqueueSnackbar(err.message || err, { variant: "warning" });
        }
    };

    const handleDeleteCard = async (uuid: string) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/finance/cards/${uuid}`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                },
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Unable to delete card");
            setCards((prev) => prev.filter((card) => card.uuid !== uuid));
            if (selectedCardUuid === uuid) {
                setSelectedCardUuid("");
            }
            enqueueSnackbar(result.message, { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err.message || err, { variant: "warning" });
        }
    };

    const handlePay = async () => {
        if (!token) return;
        if (!amount || amount <= 0) {
            enqueueSnackbar("Enter a valid payment amount", { variant: "warning" });
            return;
        }
        try {
            const payload: any = { amount };
            if (selectedCardUuid) {
                payload.card_uuid = selectedCardUuid;
            } else {
                if (!cardForm.card_number || !cardForm.name_on_card) {
                    enqueueSnackbar("Please select or add a card", { variant: "warning" });
                    return;
                }
                payload.card = cardForm;
            }

            const res = await fetch(`${API_URL}/finance/pay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Unable to complete payment");
            enqueueSnackbar(result.message, { variant: "success" });
            handleClosePaymentModal();
        } catch (err: any) {
            enqueueSnackbar(err.message || err, { variant: "warning" });
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
                    variant="contained"
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
                                    color="error"
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
                        Total Items: {cart.items.length}
                    </Typography>

                    <Typography className={styles.summaryPrice}>
                        Total: ₹ {cart.total_price}
                    </Typography>

                    <Box display="flex" gap={12} marginTop={2}>
                        <Button variant="contained" onClick={handleOpenPaymentModal}>
                            Pay
                        </Button>
                        <Button variant="outlined" href="/payment-history">
                            Payment History
                        </Button>
                    </Box>
                </Box>
            )}

            <Modal
                open={paymentModalOpen}
                onClose={handleClosePaymentModal}
                aria-labelledby="payment-modal-title"
                aria-describedby="payment-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute' as const,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 420,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 4,
                        boxShadow: 24,
                    }}
                >
                    <Typography id="payment-modal-title" variant="h6" component="h2" marginBottom={2}>
                        Choose a card or add a new one
                    </Typography>

                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(event) => setAmount(Number(event.target.value))}
                        margin="normal"
                    />

                    {isLoadingCards ? (
                        <Box display="flex" justifyContent="center" padding={2}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <RadioGroup
                            value={selectedCardUuid}
                            onChange={(event) => setSelectedCardUuid(event.target.value)}
                        >
                            {cards.map((card) => (
                                <Box key={card.uuid} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                    <FormControlLabel
                                        value={card.uuid}
                                        control={<Radio />}
                                        label={`${card.name_on_card} •••• ${card.card_number.slice(-4)}`}
                                    />
                                    <Button size="small" color="error" onClick={() => handleDeleteCard(card.uuid)}>
                                        Delete
                                    </Button>
                                </Box>
                            ))}
                        </RadioGroup>
                    )}

                    <Typography variant="subtitle2" marginTop={2}>
                        Add a new card
                    </Typography>
                    <TextField
                        fullWidth
                        label="Name"
                        value={cardForm.name_on_card}
                        onChange={(event) => setCardForm({ ...cardForm, name_on_card: event.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Card Number"
                        value={cardForm.card_number}
                        onChange={(event) => setCardForm({ ...cardForm, card_number: event.target.value })}
                        margin="normal"
                    />
                    <Box display="flex" gap={2}>
                        <TextField
                            fullWidth
                            label="Expiry Month"
                            value={cardForm.expiry_month}
                            onChange={(event) => setCardForm({ ...cardForm, expiry_month: event.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Expiry Year"
                            value={cardForm.expiry_year}
                            onChange={(event) => setCardForm({ ...cardForm, expiry_year: event.target.value })}
                            margin="normal"
                        />
                    </Box>
                    <Box display="flex" justifyContent="flex-end" gap={2} marginTop={3}>
                        <Button variant="outlined" onClick={handleAddCard}>
                            Add Card
                        </Button>
                        <Button variant="contained" onClick={handlePay}>
                            Pay Now
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
}