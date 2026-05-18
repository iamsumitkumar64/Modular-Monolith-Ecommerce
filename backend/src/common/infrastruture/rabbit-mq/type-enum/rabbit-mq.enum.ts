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
    USER_REGISTERED_QUEUE = 'user.registered.queue',
}

export enum RetryMechanismHeaderEnum {
    XREQUEUETRY = 'x-requeue-try'
}