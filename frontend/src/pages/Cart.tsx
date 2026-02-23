import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/client';
import { Minus, Plus, Trash2, ArrowLeft, ShieldCheck, MapPin, Phone, User } from 'lucide-react';

export default function Cart({ onBack, onOrderPlaced }: { onBack: () => void; onOrderPlaced: (orderId: string) => void }) {
    const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setIsLoading(true);
        setError('');

        try {
            const order = await createOrder({
                customer_name: formData.name,
                customer_address: formData.address,
                customer_phone: formData.phone,
                items: cart.map(i => ({ item_id: i.id, quantity: i.quantity })),
            });
            clearCart();
            onOrderPlaced(order.id);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Validation failed. Check details.');
        } finally {
            setIsLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Trash2 className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-3xl font-black text-slate-950 mb-3">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet.</p>
                <button onClick={onBack} className="btn-primary">
                    Explore Menu
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto p-6 md:p-12 animate-fade-in">
            <button
                onClick={onBack}
                className="group flex items-center gap-3 text-slate-500 mb-12 hover:text-slate-950 transition-colors font-bold uppercase tracking-widest text-xs"
            >
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-slate-950 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Menu
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-7">
                    <h2 className="text-4xl font-black text-slate-950 mb-10 tracking-tight">Your Order</h2>
                    <div className="space-y-6">
                        {cart.map((item) => (
                            <div key={item.id} className="group flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-premium hover:border-primary-100 transition-all">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-black text-slate-950 mb-1">{item.name}</h4>
                                    <p className="text-primary-600 font-bold">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-bold text-slate-950">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-primary-600 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="sticky top-12 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-premium">
                        <h2 className="text-2xl font-black text-slate-950 mb-8">Checkout Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-semibold"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-5 w-5 h-5 text-slate-400" />
                                    <textarea
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-semibold"
                                        placeholder="Delivery Address"
                                        rows={3}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-semibold"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 space-y-4">
                                <div className="flex justify-between text-slate-500 font-bold uppercase tracking-wider text-xs">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-bold uppercase tracking-wider text-xs">
                                    <span>Delivery</span>
                                    <span>FREE</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black text-slate-950 pt-2">
                                    <span>Total</span>
                                    <span className="text-primary-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-primary-50 border border-primary-100 p-4 rounded-2xl text-primary-700 text-sm font-bold flex items-center gap-3">
                                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                                    {error}
                                </div>
                            )}

                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-950/20 active:scale-[0.98]"
                            >
                                {isLoading ? 'Processing...' : 'Complete Purchase'}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest pt-4">
                                <ShieldCheck className="w-4 h-4" />
                                Secure Checkout Powered by FoodDash
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
