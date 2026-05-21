"use client";

import { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, RadioGroup, FormControlLabel, Radio, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { enqueueSnackbar } from "notistack";
import { Address } from "@/redux/feature/address/address.type";
import { Cart } from "@/redux/feature/cart/cart.type";
import { createOrder } from "@/redux/feature/order/order-action";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks.ts";
import { concatenateAddress } from "@/app/util/format-address";

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

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
                                    handleClose();
                                    onAddAddressClick();
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
                                    handleClose();
                                    onAddAddressClick();
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
                <Button onClick={handleClose} disabled={loading}>
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