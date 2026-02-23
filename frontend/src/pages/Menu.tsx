import { useEffect, useState } from 'react';
import { getMenu } from '../api/client';
import { Item } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search, User, ChevronDown, Percent } from 'lucide-react';

export default function Menu({ onGoToCart }: { onGoToCart: () => void }) {
    const [items, setItems] = useState<Item[]>([]);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        getMenu().then(setItems);
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 bg-white shadow-md h-20 flex items-center">
                <div className="max-content w-full flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <svg className="w-12 h-14 hover:scale-110 transition-transform cursor-pointer" viewBox="0 0 541 771">
                            <path fill="#FC8019" d="M304 771c-223 0-304-162-304-334 0-165 74-323 209-405C235 15 264 0 300 0c149 0 241 83 241 334 0 165-71 310-237 437z" />
                            <path fill="#FFF" d="M301 645c-112 0-155-83-155-171 0-83 38-164 107-207 13-8 27-16 45-16 77 0 124 43 124 171 0 83-36 158-121 223z" />
                        </svg>
                        <div className="flex items-center gap-2 group cursor-pointer border-b-2 border-transparent hover:border-primary-500 pb-1">
                            <span className="font-bold text-sm text-swiggy-dark">Home</span>
                            <span className="text-swiggy-light text-sm truncate max-w-[200px]">Bengaluru, Karnataka, India</span>
                            <ChevronDown className="w-4 h-4 text-primary-500" />
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3 text-swiggy-dark font-medium hover:text-primary-500 cursor-pointer">
                            <Search className="w-5 h-5" />
                            <span>Search</span>
                        </div>
                        <div className="flex items-center gap-3 text-swiggy-dark font-medium hover:text-primary-500 cursor-pointer">
                            <Percent className="w-5 h-5" />
                            <span>Offers</span>
                        </div>
                        <div className="flex items-center gap-3 text-swiggy-dark font-medium hover:text-primary-500 cursor-pointer">
                            <User className="w-5 h-5" />
                            <span>Sign In</span>
                        </div>
                        <div
                            onClick={onGoToCart}
                            className="flex items-center gap-3 text-swiggy-dark font-medium hover:text-primary-500 cursor-pointer text-primary-500"
                        >
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                            </div>
                            <span>Cart</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero / Filter Section */}
            <div className="max-content mt-8 pb-12 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-6">Restaurants with online food delivery</h2>
                <div className="flex gap-4">
                    {['Filter', 'Sort By', 'Fast Delivery', 'New on Swiggy', 'Ratings 4.0+', 'Pure Veg', 'Offers', 'Rs. 300-Rs. 600', 'Less than Rs. 300'].map(filter => (
                        <button key={filter} className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Listing */}
            <div className="max-content py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group cursor-pointer flex flex-col transition-all duration-200"
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:scale-95 transition-transform">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                                    <span className="text-white font-black text-xl uppercase tracking-tighter">Items at ${item.price}</span>
                                </div>
                            </div>

                            <div className="px-2">
                                <h3 className="text-lg font-bold text-swiggy-dark truncate mb-1">{item.name}</h3>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                        <Star className="w-3 h-3 text-white fill-white" />
                                    </div>
                                    <span className="font-bold text-swiggy-dark text-sm">4.3 • 20-25 mins</span>
                                </div>
                                <p className="text-swiggy-light text-sm truncate mb-4">{item.description}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(item);
                                    }}
                                    className="w-full py-2 bg-white border-2 border-gray-200 text-green-600 font-bold rounded-lg hover:bg-green-50 hover:border-green-200 transition-all uppercase text-sm tracking-wide"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Star({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        </svg>
    );
}
