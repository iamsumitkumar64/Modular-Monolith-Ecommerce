import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { ItemAddToCartModule } from "./item-add-to-cart/item-add-to-cart.module";
import { ItemRemoveFromCartModule } from "./item-remove-from-cart/item-remove-from-cart.module";
import { GetCartModule } from "./get-cart/get-cart.module";
import { DeleteCartModule } from "./delete-cart/delete-cart.module";
import { ItemUpdateInCartModule } from "./item-update-in-cart/item-update-in-cart.module";

@Module({
    imports: [
        ItemAddToCartModule,
        ItemRemoveFromCartModule,
        ItemUpdateInCartModule,
        GetCartModule,
        // DeleteCartModule,
        RouterModule.register([
            {
                path: 'cart',
                children: [
                    { path: '', module: GetCartModule },
                    // { path: '', module: DeleteCartModule },
                ],
            },
        ]),
        RouterModule.register([
            {
                path: 'cart/item',
                children: [
                    { path: '', module: ItemAddToCartModule },
                    { path: '', module: ItemRemoveFromCartModule },
                    { path: '', module: ItemUpdateInCartModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class CartModule { }