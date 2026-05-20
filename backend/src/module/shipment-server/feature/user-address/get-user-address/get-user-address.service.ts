import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/module/user-server/infrastructure/repository/user.repo";
import { UserEntity } from "src/module/shipment-server/domain/user/user.entity";
import { UserAddressRepository } from "src/module/shipment-server/infrastructure/repository/user.address.repo";

@Injectable()
export class GetUserAddressService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly userAddressRepo: UserAddressRepository,
    ) { }

    async getUserAddress(user: UserEntity) {
        const addresses = await this.userAddressRepo.findByUserUuid(user.uuid);
        return {
            data: addresses,
            message: "User Address fetched successfully"
        };
    }
}