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
}

export enum RoutingKeyEnum {
    USER_REGISTERED = 'user.registered',
}

export enum QueueEnum {
    PRODUCT_USER_REGISTERED_QUEUE = 'product.user.registered.queue',
    CART_USER_REGISTERED_QUEUE = 'cart.user.registered.queue',
    ORDER_USER_REGISTERED_QUEUE = 'order.user.registered.queue',
    FINANCE_USER_REGISTERED_QUEUE = 'finance.user.registered.queue',
    SHIPMENT_USER_REGISTERED_QUEUE = 'shipment.user.registered.queue',
}

export enum RetryMechanismHeaderEnum {
    XREQUEUETRY = 'x-requeue-try'
}