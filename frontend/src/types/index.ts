export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
}

export interface Order {
    id: string;
    customer_name: string;
    customer_address: string;
    customer_phone: string;
    total_price: number;
    status: string;
    created_at: string;
    order_items: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: string;
    item_id: number;
    quantity: number;
    price: number;
    item: Item;
}
