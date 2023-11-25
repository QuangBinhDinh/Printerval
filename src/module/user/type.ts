export interface ShippingAddressArgs {
    full_name: string;
    phone: string | number;
    zip_code: string;
    country_id: number | string;
    province_id: number | string;
    city_name: string;
    optional_address: string;
    address: string;
    id?: number | string;
}
