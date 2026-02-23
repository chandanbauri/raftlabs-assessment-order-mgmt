import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/client';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

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
            setError(err.response?.data?.error || 'Failed to place order');
        } finally {
            setIsLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button onClick={onBack} className="text-primary-600 font-semibold flex items-center justify-center gap-2 mx-auto">
                    <ArrowLeft className="w-5 h-5" /> Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Menu
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Your Order</h2>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h4 className="font-bold">{item.name}</h4>
                                    <p className="text-primary-600 font-bold">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 border-t pt-4 text-xl font-bold flex justify-between">
                        <span>Total</span>
                        <span className="text-primary-600">${total.toFixed(2)}</span>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="123 Street Name, City"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                required
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="+1234567890"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary-200"
                        >
                            {isLoading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
