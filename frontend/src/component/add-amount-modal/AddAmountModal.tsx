"use client";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addAmountSchema, AddAmountSchemaType } from "@/schemas/payment";
import { addAmount, getAccount } from "@/redux/feature/payment/payment.action";
import { useAppDispatch } from "@/redux/hooks.ts";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AddAmountModal({ open, onClose }: Props) {
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AddAmountSchemaType>({
        resolver: zodResolver(addAmountSchema),
    });

    const onSubmit = async (data: AddAmountSchemaType) => {
        try {
            await dispatch(addAmount(data)).unwrap();
            enqueueSnackbar("Amount Added", { variant: "success" });
            reset();
            onClose();
            await dispatch(getAccount()).unwrap();
        } catch (error: any) {
            enqueueSnackbar(String(error), { variant: "error" });
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ width: 400, bgcolor: "white", p: 4, mx: "auto", mt: 10, borderRadius: 2 }}>
                <Typography variant="h6" mb={2}>Add Amount</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        margin="normal"
                        {...register("amount")}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    />
                    <Button type="submit" fullWidth sx={{ mt: 2 }}>Add Amount</Button>
                </form>
            </Box>
        </Modal>
    );
}