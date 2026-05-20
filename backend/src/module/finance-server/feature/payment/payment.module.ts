import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetAccountModule } from "./get-account/get-account.module";
import { GetPayHistoryModule } from "./get-pay-history/get-pay-history.module";
import { PayModule } from "./pay/pay.module";

@Module({
    imports: [
        GetAccountModule,
        GetPayHistoryModule,
        PayModule,
        RouterModule.register([
            {
                path: 'payment',
                children: [
                    { path: '', module: GetAccountModule },
                    { path: '', module: GetPayHistoryModule },
                    { path: '', module: PayModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class PaymentModule { }