import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderEntity } from "../../domain/order/order.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "../../domain/order/order.enum";

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema')
        private readonly dataSource: DataSource,
    ) {
        super(OrderEntity, dataSource.createEntityManager());
    }

    async createOrder(body: Partial<OrderEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async getOrderListing(user: UserEntity, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: { user_uuid: user.uuid },
            relations: {
                items: true,
            },
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async updateOrderPaymentStatus(uuid: string, status: OrderPaymentStatusEnum) {
        return await this.update(
            {
                uuid: uuid
            },
            {
                payment_status: status
            }
        )
    }

    async updateOrderStatus(uuid: string, status: OrderStatusEnum) {
        return await this.update(
            {
                uuid: uuid
            },
            {
                order_status: status
            }
        )
    }

    async updateReturnedFromStatus(uuid: string, status: OrderStatusEnum) {
        return await this.update(
            {
                uuid: uuid
            },
            {
                returned_from_status: status
            }
        )
    }

    async updateOrderStatusIfNotReturned(uuid: string, status: OrderStatusEnum) {
        return await this.update(
            {
                uuid: uuid,
                order_status: Not(OrderStatusEnum.RETURNED)
            },
            {
                order_status: status
            }
        )
    }

    async findByUserUuidAndOrderUuid(user_uuid: string, order_uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: order_uuid,
                user_uuid: user_uuid
            },
            relations: {
                items: true,
                user: true,
            }
        });
        return user;
    }

    async findTopTenPaidButNotDeliveredOrderStatus() {
        return await this.find({
            where: {
                payment_status: OrderPaymentStatusEnum.PAID,
                order_status: Not(OrderStatusEnum.RETURNED)
            },
            order: {
                created_at: 'ASC'
            },
        });
    }
}