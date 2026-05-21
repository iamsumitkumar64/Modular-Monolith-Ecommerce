"use client";

import { Box, Button, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { deleteCard, getCards, pay } from "@/redux/feature/payment/payment.action";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import AddCardModal from "../add-card-modal/AddCardModal";
import AddAmountModal from "../add-amount-modal/AddAmountModal";
import { PaymentCard } from "@/redux/feature/payment/payment.type";
import styles from "./pay-modal.module.css";
import DeleteIcon from '@mui/icons-material/Delete';

interface PayModalProps {
    open: boolean;
    onClose: () => void;
    amount: number;
    order_uuid: string;
}

export default function PayModal({ open, onClose, amount, order_uuid }: PayModalProps) {
    const dispatch = useAppDispatch();
    const { cards, account, loading } = useAppSelector((state: RootState) => state.paymentReducer);
    const [selectedCard, setSelectedCard] = useState<string>("");
    const [openCardModal, setOpenCardModal] = useState(false);
    const [openAmountModal, setOpenAmountModal] = useState(false);

    useEffect(() => {
        if (open) {
            dispatch(getCards());
        }
    }, [open, dispatch]);

    const handleDeleteCard = async (card_uuid: string) => {
        try {
            await dispatch(deleteCard(card_uuid)).unwrap();
            enqueueSnackbar("Card Deleted Success", { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    const handlePay = async () => {
        try {
            if (!selectedCard) {
                enqueueSnackbar("Please select a card", { variant: "warning" });
                return;
            }
            if (amount <= 0) {
                enqueueSnackbar("Please enter a valid amount", { variant: "warning" });
                return;
            }

            await dispatch(pay({ amount, card_uuid: selectedCard, order_uuid })).unwrap();
            onClose();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    if (!open) return null;

    return (
        <Box className={styles.overlay}>
            <Box className={styles.modal}>
                <Typography className={styles.accountBalance}>
                    Account balance: ${account?.balance || 0}
                </Typography>

                <Typography variant="h6" mb={2}>
                    Choose Card to Pay
                </Typography>

                {loading && <Typography>Loading cards...</Typography>}

                {!loading && cards.length === 0 && (
                    <Typography>No cards available. Please add a card first.</Typography>
                )}

                <RadioGroup value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
                    <Box className={styles.cardList}>
                        {cards.map((card: PaymentCard) => (
                            <Card key={card.uuid} className={styles.cardItem}>
                                <CardContent className={styles.cardContent}>
                                    <Typography>
                                        **** **** {Number(card.card_number) % 10000} | {card.name_on_card}
                                    </Typography>
                                    <FormControlLabel value={card.uuid} control={<Radio />} label="" />
                                    <Button
                                        className={styles.outlinedButton}
                                        onClick={() => handleDeleteCard(card.uuid)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </RadioGroup>

                <Box className={styles.buttonsContainer}>
                    <Button onClick={() => setOpenCardModal(true)}>
                        Add Card
                    </Button>

                    <Button onClick={() => setOpenAmountModal(true)}>
                        Add Amount
                    </Button>
                </Box>

                <Box className={styles.bottomButtons}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handlePay} disabled={!selectedCard}>
                        Pay
                    </Button>
                </Box>
            </Box>

            <AddCardModal open={openCardModal} onClose={() => setOpenCardModal(false)} />
            <AddAmountModal open={openAmountModal} onClose={() => setOpenAmountModal(false)} />
        </Box>
    );
}