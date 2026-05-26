import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { ReturnOrderModule } from "./return-order/return-order.module";

@Module({
    imports: [
        ReturnOrderModule,
        RouterModule.register([
            {
                path: 'order',
                children: [
                    { path: '', module: ReturnOrderModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class ShipmentOrderModule { }
