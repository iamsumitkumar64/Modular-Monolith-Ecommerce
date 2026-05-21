import { Address } from "@/redux/feature/address/address.type";

export const concatenateAddress = (address: Address): string => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
};