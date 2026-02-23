import { useEffect, useState } from 'react';
import { getMenu } from '../api/client';
import { Item } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Plus, Star, Clock } from 'lucide-react';

export default function Menu({ onGoToCart }: { onGoToCart: () => void }) {
    const [items, setItems] = useState<Item[]>([]);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        getMenu().then(setItems);
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen pb-20 animate-fade-in">
            <header className="sticky top-0 z-50 glass px-6 py-4 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-950 tracking-tight">FoodDash</h1>
                    </div>

                    <button
                        onClick={onGoToCart}
                        className="group relative flex items-center gap-3 bg-slate-950 text-white px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/20"
                    >
                        <span className="font-bold text-sm uppercase tracking-wider">View Cart</span>
                        <div className="relative">
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-3 -right-3 bg-primary-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-4xl font-black text-slate-950 mb-3 tracking-tight">Discover Deliciousness</h2>
                    <p className="text-slate-500 font-medium">Hand-picked flavors delivered straight to your doorstep.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {items.map((item, idx) => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-premium hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-sm">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9
                                    </span>
                                    <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-sm">
                                        <Clock className="w-3 h-3 text-primary-500" /> 20-30 min
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-extrabold text-slate-950 leading-tight group-hover:text-primary-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <span className="text-lg font-black text-slate-950">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>

                                <p className="text-slate-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                                    {item.description}
                                </p>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="w-full group/btn relative flex items-center justify-center gap-2 bg-slate-50 text-slate-950 py-4 rounded-2xl font-bold border border-slate-100 hover:bg-primary-600 hover:text-white hover:border-primary-600 hover:shadow-lg hover:shadow-primary-600/30 transition-all duration-300"
                                >
                                    <Plus className="w-5 h-5 transition-transform group-hover/btn:rotate-90" />
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
