import { Module } from "@nestjs/common";
import { GetProductListingController } from "./get-product-listing.controller";
import { GetProductListingService } from "./get-product-listing.service";
import { ProductRepository } from "src/module/product-server/infrastructure/repository/product.repo";

@Module({
    imports: [],
    controllers: [GetProductListingController],
    providers: [GetProductListingService, ProductRepository],
    exports: [],
})

export class GetProductListingModule { }