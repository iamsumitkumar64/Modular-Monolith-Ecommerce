export enum ExchangeTypeEnum {
    DIRECT = 'direct',
    FANOUT = 'fanout',
    TOPIC = 'topic',
    HEADERS = 'headers',
}

export enum XMatchHeaderEnum {
    ALL = 'all',
    ANY = 'any'
}

export enum ExchangeNameEnum {
    USER_EXCHANGE = 'user.exchange',
    ORDER_EXCHANGE = 'order.exchange',
}

export enum RoutingKeyEnum {
    USER_REGISTERED = 'user.registered',
    ORDER_CREATED = 'order.created',
}

export enum QueueEnum {
    PRODUCT_USER_REGISTERED_QUEUE = 'product.user.registered.queue',
    CART_USER_REGISTERED_QUEUE = 'cart.user.registered.queue',
    ORDER_USER_REGISTERED_QUEUE = 'order.user.registered.queue',
    FINANCE_USER_REGISTERED_QUEUE = 'finance.user.registered.queue',
    SHIPMENT_USER_REGISTERED_QUEUE = 'shipment.user.registered.queue',
    CART_ORDER_CREATED_QUEUE = 'cart.order.created.queue',
    FINANCE_ORDER_CREATED_QUEUE = 'finance.order.created.queue',
    SHIPMENT_ORDER_CREATED_QUEUE = 'shipment.order.created.queue',
}

export enum RetryMechanismHeaderEnum {
    XREQUEUETRY = 'x-requeue-try'
}