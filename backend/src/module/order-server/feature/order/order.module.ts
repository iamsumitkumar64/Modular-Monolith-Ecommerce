import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateOrderModule } from "./create-order/create-order.module";
import { GetOrderListingModule } from "./get-orders/get-orders.module";
import { ReturnOrderModule } from "./return-order/return-order.module";

@Module({
    imports: [
        CreateOrderModule,
        GetOrderListingModule,
        ReturnOrderModule,
        RouterModule.register([
            {
                path: 'order',
                children: [
                    { path: '', module: CreateOrderModule },
                    { path: '', module: GetOrderListingModule },
                    { path: '', module: ReturnOrderModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class OrderModule { }