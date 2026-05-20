"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/redux/store";
import { addAddress, deleteAddress, getAddresses, updateAddress, } from "@/redux/feature/address/address.action";
import { Address } from "@/redux/feature/address/address.type";
import { AddressFormData, addressSchema } from "@/schemas/address";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { Modal, Box, Typography, TextField, Checkbox, FormControlLabel, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./user-address.module.css";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserAddressModal({ isOpen, onClose }: AddressModalProps) {
    const dispatch = useAppDispatch();
    const { addresses, loading, error } = useAppSelector((state: RootState) => state.userAddressReducer);
    const [editingUuid, setEditingUuid] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isDefault: false,
        },
    });

    useEffect(() => {
        if (isOpen) dispatch(getAddresses());
    }, [isOpen, dispatch]);

    const onSubmit = async (data: AddressFormData) => {
        if (editingUuid) {
            await dispatch(updateAddress({ uuid: editingUuid, ...data }));
        } else {
            await dispatch(addAddress(data));
        }
        reset();
        setEditingUuid(null);
    };

    const handleEdit = (addr: Address) => {
        reset({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            isDefault: addr.isDefault,
        });
        setEditingUuid(addr.uuid);
    };

    const handleDelete = async (uuid: string) => {
        await dispatch(deleteAddress({ uuid }));
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className={styles.modalContainer}>
                <Box className={styles.header}>
                    <Typography variant="h6">
                        {editingUuid ? "Edit Address" : "Add Address"}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {error && (
                    <Box className={styles.errorBox}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <TextField
                        label="Street"
                        {...register("street")}
                        error={!!errors.street}
                        helperText={errors.street?.message}
                        fullWidth
                    />
                    <TextField
                        label="City"
                        {...register("city")}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        fullWidth
                    />
                    <TextField
                        label="State"
                        {...register("state")}
                        error={!!errors.state}
                        helperText={errors.state?.message}
                        fullWidth
                    />
                    <TextField
                        label="Postal Code"
                        {...register("postalCode")}
                        error={!!errors.postalCode}
                        helperText={errors.postalCode?.message}
                        fullWidth
                    />
                    <TextField
                        label="Country"
                        {...register("country")}
                        error={!!errors.country}
                        helperText={errors.country?.message}
                        fullWidth
                    />

                    <FormControlLabel
                        control={<Checkbox {...register("isDefault")} />}
                        label="Set as default"
                    />

                    <Button
                        type="submit"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {editingUuid ? "Update Address" : "Add Address"}
                    </Button>
                </form>

                <Typography variant="subtitle1" mt={3}>
                    Your Addresses
                </Typography>
                <List className={styles.addressList}>
                    {addresses?.map((addr) => (
                        <ListItem key={addr.uuid} className={styles.listItem}>
                            <ListItemText
                                primary={`${addr.street}, ${addr.city}, ${addr.state}`}
                                secondary={`${addr.postalCode}, ${addr.country} ${addr.isDefault ? "(Default)" : ""
                                    }`}
                            />
                            <ListItemSecondaryAction className={styles.actions}>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEdit(addr)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(addr.uuid)}
                                >
                                    Delete
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Modal>
    );
}