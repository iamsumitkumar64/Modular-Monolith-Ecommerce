"use client";

import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, RadioGroup, FormControlLabel, Radio, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from "notistack";
import { Address } from "@/redux/feature/address/address.type";
import { Cart } from "@/redux/feature/cart/cart.type";
import { createOrder } from "@/redux/feature/order/order-action";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks.ts";
import { concatenateAddress } from "@/app/util/format-address";
import { deleteAddress } from "@/redux/feature/address/address.action";
import styles from './place-order-comp.module.css';

interface PlaceOrderDialogProps {
    open: boolean;
    onClose: () => void;
    addresses: Address[];
    cart: Cart | null;
    onAddAddressClick: () => void;
}

export default function PlaceOrderDialog({
    open,
    onClose,
    addresses,
    cart,
    onAddAddressClick
}: PlaceOrderDialogProps) {
    const [selectedAddressUuid, setSelectedAddressUuid] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const getSelectedAddress = (): Address | undefined => {
        return addresses?.find(addr => addr.uuid === selectedAddressUuid);
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

        setLoading(true);

        try {
            const concatenated = concatenateAddress(selectedAddress);

            const payload = {
                cart_uuid: cart.uuid,
                total_price: Number(cart.total_price),
                order_address: concatenated,
                items: cart.items.map(item => ({
                    product_uuid: item.product_uuid,
                    name: item.product?.name || "",
                    description: item.product?.description || "",
                    image_url: item.product?.image_url || "",
                    price: Number(item.product?.price) || 0,
                    quantity: item.quantity
                }))
            };

            await dispatch(createOrder(payload)).unwrap();
            enqueueSnackbar("Order placed successfully!", { variant: "success" });

            setSelectedAddressUuid("");
            onClose();

            setTimeout(() => { router.push("/order"); }, 500);
        } catch (err: any) {
            enqueueSnackbar(err || "Failed to place order", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedAddressUuid("");
        onClose();
    };

    const handleDelete = async (uuid: string) => {
        await dispatch(deleteAddress({ uuid }));
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Choose Delivery Address</DialogTitle>
            <DialogContent>
                <Box className={styles.contentBox}>
                    {!addresses || addresses.length === 0 ? (
                        <Box>
                            <Typography color="textSecondary" className={styles.noAddressText}>
                                No addresses found. Create one to place an order.
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="subtitle2" className={styles.selectAddressText}>
                                Select an address:
                            </Typography>
                            <RadioGroup
                                value={selectedAddressUuid}
                                className={styles.addressRadioGroup}
                                onChange={(e) => setSelectedAddressUuid(e.target.value)}
                            >
                                {addresses.map((address: Address) => (
                                    <Box
                                        key={address.uuid}
                                        className={styles.addressBox}
                                    >
                                        <FormControlLabel
                                            value={address.uuid}
                                            control={<Radio />}
                                            className={styles.addressesLabel}
                                            label={
                                                <Box className={styles.labelBox}>
                                                    <Box className={styles.labelBoxLeftBox}>
                                                        <Typography variant="body2" className={styles.addressLine}>
                                                            {address.street}, {address.city}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary" className={styles.addressDetails}>
                                                            {address.state}, {address.postalCode}, {address.country}
                                                        </Typography>
                                                        {address.isDefault && (
                                                            <Typography variant="caption" className={styles.defaultLabel}>
                                                                (Default)
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    <Box className={styles.labelBoxRightBox}>
                                                        <Button
                                                            className={styles.deleteAddress}
                                                            onClick={() => handleDelete(address.uuid)}
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </Box>
                                ))}
                            </RadioGroup>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions className={styles.dialogActions}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        handleClose();
                        onAddAddressClick();
                    }}
                    className={styles.addButton}
                >
                    Add New Address
                </Button>

                <Button onClick={handleClose} disabled={loading} className={styles.cancelBtn}>
                    Cancel
                </Button>

                <Button
                    onClick={handlePlaceOrder}
                    variant="contained"
                    color="primary"
                    disabled={loading || !selectedAddressUuid}
                >
                    {loading ? "Placing Order..." : "Place Order"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}