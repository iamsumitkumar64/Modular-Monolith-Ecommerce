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

export enum RetryMechanismHeaderEnum {
    XREQUEUETRY = 'x-requeue-try'
}

// which exchange belong to
export enum ExchangeNameEnum {
    USER_EXCHANGE = 'user.exchange',
    ORDER_EXCHANGE = 'order.exchange',
}

// exchange name + routing key
export enum RoutingKeyEnum {
    USER_REGISTERED = 'user.registered',
    ORDER_CREATED = 'order.created',
    ORDER_PAID = 'order.paid',
    ORDER_STATUS_CHANGED = 'order.status.changed',
    ORDER_PAID_DEDUCT_STOCK = 'order.paid.stock.deduct',
    ORDER_RETURNED = 'order.returned',
}

// queue name (module name) + routing key + endfix(queue)
export enum QueueEnum {
    PRODUCT_USER_REGISTERED_QUEUE = 'product.user.registered.queue',
    CART_USER_REGISTERED_QUEUE = 'cart.user.registered.queue',
    ORDER_USER_REGISTERED_QUEUE = 'order.user.registered.queue',
    FINANCE_USER_REGISTERED_QUEUE = 'finance.user.registered.queue',
    SHIPMENT_USER_REGISTERED_QUEUE = 'shipment.user.registered.queue',
    CART_ORDER_CREATED_QUEUE = 'cart.order.created.queue',
    SHIPMENT_ORDER_CREATED_QUEUE = 'shipment.order.created.queue',
    SHIPMENT_ORDER_PAID_QUEUE = 'shipment.order.paid.queue',
    ORDER_PAID_QUEUE = 'order.paid.queue',
    PRODUCT_ORDER_PAID_DEDUCT_STOCK_QUEUE = 'product.order.paid.deduct.stock.queue',
    CART_ORDER_PAID_DEDUCT_STOCK_QUEUE = 'cart.order.paid.deduct.stock.queue',
    ORDER_STATUS_CHANGED_QUEUE = 'order.status.changed.queue',
    ORDER_RETURNED_QUEUE = 'order.returned.queue',
    PRODUCT_ORDER_RETURNED_QUEUE = 'product.order.returned.queue',
    CART_ORDER_RETURNED_QUEUE = 'cart.order.returned.queue',
    FINANCE_ORDER_RETURNED_QUEUE = 'finance.order.returned.queue',
}
