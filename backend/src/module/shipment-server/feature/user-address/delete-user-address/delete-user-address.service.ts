import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/module/user-server/infrastructure/repository/user.repo";
import { UserEntity } from "src/module/shipment-server/domain/user/user.entity";
import { UserAddressRepository } from "src/module/shipment-server/infrastructure/repository/user.address.repo";

@Injectable()
export class DeleteUserAddressService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly userAddressRepo: UserAddressRepository,
    ) { }

    async deleteUserAddress(user: UserEntity, uuid: string) {
        await this.userAddressRepo.deleteUserAddress(uuid);
        return {
            message: "User Address deleted successfully"
        };
    }
}