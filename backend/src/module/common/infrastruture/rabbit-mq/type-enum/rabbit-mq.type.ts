export interface PublishHeadersInterface {
    'x-match'?: 'all' | 'any';
    [key: string]: any;
}

export type ExchangeType = | 'direct' | 'fanout' | 'topic' | 'headers';


// RabbitMQ Payloads down here

enum OrderPaymentStatusEnum {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    REFUND = 'refund'
}

enum OrderStatusEnum {
    PENDING = 'pending',
    PROCESSING = 'processing',
    PACKED = 'packed',
    DELIVERED = 'delivered',
    RETURNED = 'returned'
}

export interface RabbitMQConsumerMessage<TPayload = unknown> {
    outbox_uuid: string;
    payload: TPayload;
}

export interface UserRegisteredEventPayload {
    uuid: string;
    name: string;
    email: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface OrderEventItemPayload {
    uuid: string;
    product_uuid: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
    quantity: number;
}

export interface OrderCreatedEventPayload {
    order_uuid: string;
    cart_uuid: string;
    user_uuid: string;
    total_price: number;
    order_address: string;
    items: OrderEventItemPayload[];
    created_at: Date | string;
}

export interface OrderPaidEventPayload {
    order_uuid: string;
}

export interface OrderStatusChangedEventPayload {
    order_uuid: string;
    nextStatus: OrderStatusEnum;
}

export interface OrderEventUserPayload {
    uuid: string;
    name?: string;
    email?: string;
}

export interface OrderEventPayload {
    uuid: string;
    user_uuid: string;
    cart_uuid: string;
    total_price: number;
    payment_status?: OrderPaymentStatusEnum;
    order_status?: OrderStatusEnum;
    returned_from_status?: OrderStatusEnum | null;
    order_address?: string;
    user: OrderEventUserPayload;
    items: OrderEventItemPayload[];
    created_at?: Date | string;
    updated_at?: Date | string;
    deleted_at?: Date | string | null;
}

export interface OrderWithDetailsEventPayload {
    order_uuid: string;
    order: OrderEventPayload;
}