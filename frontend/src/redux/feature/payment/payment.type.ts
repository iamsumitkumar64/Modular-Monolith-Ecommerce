export interface PaymentCard {
    uuid: string;
    user_uuid: string;
    name_on_card: string;
    card_number: string;
    expiry_month: string;
    expiry_year: string;
    created_at: string;
}

export interface PaymentAccount {
    uuid: string;
    user_uuid: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface PaymentHistory {
    uuid: string;
    user_uuid: string;
    amount: number;
    type: string;
    card_uuid: string | null;
    description: string | null;
    created_at: string;
}

export interface GetCardsResponse {
    data: PaymentCard[];
    message: string;
}

export interface AddCardPayload {
    name_on_card: string;
    card_number: string;
    expiry_month: string;
    expiry_year: string;
}

export interface GetAccountResponse {
    data: PaymentAccount;
    message: string;
}

export interface GetHistoriesResponse {
    data: PaymentHistory[];
    message: string;
}

export interface AddAmountPayload {
    amount: number;
}

export interface PayPayload {
    amount: number;
    card_uuid: string;
}

export interface PaymentState {
    cards: PaymentCard[];
    account: PaymentAccount | null;
    histories: PaymentHistory[];
    loading: boolean;
    error: string | null;
    status: | "pending" | "succeed" | "rejected";
}