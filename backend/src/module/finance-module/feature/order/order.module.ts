import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { PayUsingCardUsingCardModule } from "./pay-using-card/pay-using-card.module";

@Module({
    imports: [
        PayUsingCardUsingCardModule,
        RouterModule.register([
            {
                path: 'payment/order',
                children: [
                    { path: '/card', module: PayUsingCardUsingCardModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class PaymentOrderModule { }