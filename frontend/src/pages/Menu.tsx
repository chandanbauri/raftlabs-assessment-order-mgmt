import { useEffect, useState } from 'react';
import { getMenu } from '../api/client';
import { Item } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus } from 'lucide-react';

export default function Menu({ onGoToCart }: { onGoToCart: () => void }) {
    const [items, setItems] = useState<Item[]>([]);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        getMenu().then(setItems);
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">FoodDash</h1>
                <button
                    onClick={onGoToCart}
                    className="relative p-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow"
                >
                    <ShoppingCart className="w-6 h-6 text-gray-700" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                        <img src={item.image_url} alt={item.name} className="w-full h-56 object-cover" />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                <span className="text-lg font-bold text-primary-600">${item.price.toFixed(2)}</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2">{item.description}</p>
                            <button
                                onClick={() => addToCart(item)}
                                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
