"use client"

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Card, CardContent, Container, Typography, CircularProgress } from "@mui/material";
import { RootState } from "@/redux/store";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PaymentHistoryPage() {
    const token = useSelector((state: RootState) => state.authReducer.token);
    const [histories, setHistories] = useState<any[]>([]);
    const [account, setAccount] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        loadData();
    }, [token]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [historyRes, accountRes] = await Promise.all([
                fetch(`${API_URL}/finance/histories`, {
                    headers: { Authorization: token }
                }),
                fetch(`${API_URL}/finance/account`, {
                    headers: { Authorization: token }
                })
            ]);

            const historiesData = await historyRes.json();
            const accountData = await accountRes.json();

            if (!historyRes.ok) throw new Error(historiesData.message || "Unable to fetch payment history");
            if (!accountRes.ok) throw new Error(accountData.message || "Unable to fetch account data");

            setHistories(historiesData.data || []);
            setAccount(accountData.data || null);
        } catch (err: any) {
            setError(err.message || "Unable to load payment history");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" style={{ padding: 24 }}>
            <Typography variant="h4" component="h1" style={{ marginBottom: 16 }}>
                Payment History
            </Typography>

            {loading && (
                <Box display="flex" justifyContent="center" marginTop={6}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" style={{ marginBottom: 16 }}>
                    {error}
                </Typography>
            )}

            {!loading && account && (
                <Card style={{ marginBottom: 24 }}>
                    <CardContent>
                        <Typography variant="h6">Account Balance</Typography>
                        <Typography variant="body1">₹ {account.balance?.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            )}

            {!loading && histories.length === 0 && (
                <Typography>No payment history yet.</Typography>
            )}

            <Box display="grid" gap={16}>
                {histories.map((item) => (
                    <Card key={item.uuid}>
                        <CardContent>
                            <Typography variant="subtitle1">{item.type?.toUpperCase()}</Typography>
                            <Typography>Amount: ₹ {Number(item.amount).toFixed(2)}</Typography>
                            <Typography>{item.description || "No description"}</Typography>
                            <Typography color="textSecondary">{new Date(item.created_at).toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}
