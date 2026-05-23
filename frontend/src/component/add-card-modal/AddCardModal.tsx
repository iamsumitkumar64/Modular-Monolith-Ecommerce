"use client";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCardSchema, AddCardSchemaType } from "@/schemas/payment";
import { addCard, getCards } from "@/redux/feature/payment/payment.action";
import { useAppDispatch } from "@/redux/hooks.ts";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AddCardModal({ open, onClose }: Props) {
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AddCardSchemaType>({
        resolver: zodResolver(addCardSchema),
    });

    const onSubmit = async (data: AddCardSchemaType) => {
        try {
            // If expiryYear is empty, set a default value (optional)
            if (!data.expiry_year) {
                data.expiry_year = new Date().getFullYear().toString();
            }

            await dispatch(addCard(data)).unwrap();
            enqueueSnackbar("Card Added", { variant: "success" });
            reset();
            onClose();
            await dispatch(getCards()).unwrap();
        } catch (error: any) {
            enqueueSnackbar(String(error), { variant: "error" });
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ width: 400, bgcolor: "white", p: 4, mx: "auto", mt: 20, borderRadius: 2 }}>
                <Typography variant="h6" mb={2}>Add Card</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Name On Card"
                        margin="normal"
                        {...register("name_on_card")}
                        error={!!errors.name_on_card}
                        helperText={errors.name_on_card?.message}
                    />
                    <TextField
                        fullWidth
                        label="Card Number"
                        margin="normal"
                        {...register("card_number")}
                        error={!!errors.card_number}
                        helperText={errors.card_number?.message}
                    />
                    <TextField
                        fullWidth
                        label="Expiry Month"
                        margin="normal"
                        {...register("expiry_month")}
                        error={!!errors.expiry_month}
                        helperText={errors.expiry_month?.message}
                    />
                    <TextField
                        fullWidth
                        label="Expiry Year"
                        margin="normal"
                        {...register("expiry_year")}
                        error={!!errors.expiry_year}
                        helperText={errors.expiry_year?.message}
                    />
                    <Button type="submit" fullWidth sx={{ mt: 2 }}>Add Card</Button>
                </form>
            </Box>
        </Modal>
    );
}