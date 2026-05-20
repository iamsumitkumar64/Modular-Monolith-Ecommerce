import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AddCardModule } from "./add-card/add-card.module";
import { AddAmountModule } from "./add-amount/add-amount.module";
import { DeleteCardModule } from "./delete-card/delete-card.module";
import { GetCardsModule } from "./get-cards/get-cards.module";

@Module({
    imports: [
        AddCardModule,
        AddAmountModule,
        DeleteCardModule,
        GetCardsModule,
        RouterModule.register([
            {
                path: 'payment',
                children: [
                    { path: '', module: AddAmountModule },
                    { path: '', module: AddCardModule },
                    { path: '', module: DeleteCardModule },
                    { path: '', module: GetCardsModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class PaymentCardModule { }