export interface CartProduct {
    uuid: string;
    name: string;
    description: string;
    image_url: string;
    price: string;
    stock: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CartItem {
    uuid: string;
    cart_uuid: string;
    product_uuid: string;
    quantity: number;
    product?: CartProduct;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Cart {
    uuid: string;
    user_uuid: string;
    total_price: string;
    items: CartItem[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CartResponse {
    data: Cart;
    message: string;
}

export interface RemoveCartItemPayload {
    item_uuid: string;
    cart_uuid: string;
}

export interface AddToCartPayload {
    product_uuid: string;
    quantity: number;
}

export interface UpdateCartItemPayload {
    item_uuid: string;
    quantity: number;
}

export interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    status: "pending" | "succeed" | "rejected";
}