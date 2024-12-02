export default interface IEvents {
    id: number;
    name: string;
    slug: string;
    start_date: Date;
    end_date: Date;
    price: number;
    discount_price: number;
    city_id?: number;
    city_name?: string;
    location: string;
    description: string;
    eventCategory: {
        id: number,
        name: string,
    };
    eventType: {
        id: number,
        name: string,
    };
    cities: {
        id: number,
        city_name: string,
    };
    seats?: number;
    event_type_id: number;
    event_type_name: string;
    event_category_id: number;
    event_category_name: string;
    organizer_id: number;
    organizer_name: string;
    sale_type: string;
    status?: number;
}