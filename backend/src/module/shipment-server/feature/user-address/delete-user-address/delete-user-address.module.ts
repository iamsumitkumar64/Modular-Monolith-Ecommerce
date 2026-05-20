import { Module } from "@nestjs/common";
import { UserRepository } from "src/module/user-server/infrastructure/repository/user.repo";
import { DeleteUserAddressController } from "./delete-user-address.controller";
import { DeleteUserAddressService } from "./delete-user-address.service";
import { UserAddressRepository } from "src/module/shipment-server/infrastructure/repository/user.address.repo";

@Module({
    imports: [],
    controllers: [DeleteUserAddressController],
    providers: [DeleteUserAddressService, UserRepository, UserAddressRepository],
    exports: [],
})

export class DeleteUserAddressModule { }