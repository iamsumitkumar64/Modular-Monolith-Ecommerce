export interface OrderItem {
    uuid: string;
    order_uuid: string;
    name: string;
    description: string;
    image_url: string;
    price: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id?: string;
}

export interface Order {
    uuid: string;
    user_uuid: string;
    cart_uuid: string;
    total_price: string;
    payment_status: string;
    order_status: string;
    order_address: string | null;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id?: string;
}

export interface OrderResponse {
    data: Order | Order[];
    limit?: number;
    offset?: number;
    totalDocuments?: number;
    message: string;
}

export interface returnOrderResponse {
    message: string;
}

export interface CreateOrderPayload {
    cart_uuid: string;
    total_price: number;
    order_address: string;
    items: {
        product_uuid: string;
        name: string;
        description: string;
        price: number;
        quantity: number;
        image_url: string;
    }[];
}

export interface OrderState {
    orders: Order[] | null;
    loading: boolean;
    error: string | null;
    status: "pending" | "succeed" | "rejected";
}