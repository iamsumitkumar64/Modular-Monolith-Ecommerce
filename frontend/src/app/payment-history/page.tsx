"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { RootState, AppDispatch } from "@/redux/store";
import styles from "./payment-history.module.css"
import { getAccount, getHistories } from "@/redux/feature/payment/payment.action";

export default function PaymentHistoryPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { account, histories, loading, error } = useSelector((state: RootState) => state.paymentReducer);

    useEffect(() => {
        dispatch(getAccount());
        dispatch(getHistories());
    }, [dispatch]);

    return (
        <Container maxWidth="xl" className={styles.container}>
            <Typography variant="h4" component="h1" className={styles.header}>
                Payment Account
            </Typography>

            {loading && (
                <Box display="flex" justifyContent="center" marginTop="5%">
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" style={{ marginBottom: "2%" }}>
                    {error}
                </Typography>
            )}

            {!loading && account && (
                <Card className={styles.accountCard}>
                    <CardContent>
                        <Typography variant="h6">Account Balance</Typography>
                        <Typography variant="body1">₹ {account.balance?.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            )}

            {!loading && histories.length === 0 && (
                <Typography>No payment history yet.</Typography>
            )}

            <Typography variant="h4" component="h1" className={styles.header}>
                Payment History
            </Typography>
            <Box className={styles.historyList}>
                {histories.map((item, idx) => (
                    <Card key={item.uuid} className={styles.historyCard}>
                        <CardContent>
                            <Typography variant="subtitle1">{idx}</Typography>
                            <Typography variant="subtitle2">Type: {item.type?.toUpperCase()}</Typography>
                            <Typography>Amount: ₹ {Number(item.amount).toFixed(2)}</Typography>
                            <Typography>{item.description || "No description"}</Typography>
                            <Typography color="textSecondary">
                                {new Date(item.created_at).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}