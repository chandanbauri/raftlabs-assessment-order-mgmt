import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/client';
import { Trash2, MapPin, Receipt, Wallet, User, Phone } from 'lucide-react';

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
            setError(err.response?.data?.error || 'Order placement failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-80 h-80 bg-[url('https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_ybi7ss')] bg-contain bg-no-repeat bg-center mb-6" />
                <h2 className="text-xl font-bold text-swiggy-dark mb-2">Your cart is empty</h2>
                <p className="text-gray-400 text-sm mb-8">You can go to home page to view more restaurants</p>
                <button onClick={onBack} className="btn-swiggy">See Restaurants Near You</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#e9ede3] py-10 px-4">
            <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section: Account & Address */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-10 relative">
                        <div className="absolute left-0 top-10 flex flex-col items-center">
                            <div className="w-10 h-10 bg-swiggy-dark flex items-center justify-center text-white shadow-lg">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="h-full w-0.5 bg-gray-100 mt-2" />
                        </div>
                        <div className="ml-8">
                            <h2 className="text-xl font-bold mb-2">Account</h2>
                            <p className="text-gray-500 mb-8">To place your order now, please log in to your existing account or sign up.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-swiggy-dark p-4 flex flex-col items-center justify-center">
                                    <span className="text-swiggy-dark font-bold">LOG IN</span>
                                    <span className="text-xs text-gray-400 font-medium">Have an account?</span>
                                </div>
                                <div className="bg-swiggy-dark p-4 flex flex-col items-center justify-center">
                                    <span className="text-white font-bold">SIGN UP</span>
                                    <span className="text-xs text-gray-300 font-medium">New to Swiggy?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 relative">
                        <div className="absolute left-0 top-10 flex flex-col items-center">
                            <div className="w-10 h-10 bg-swiggy-dark flex items-center justify-center text-white shadow-lg">
                                <MapPin className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="ml-8">
                            <h2 className="text-xl font-bold mb-8">Delivery Address</h2>
                            <form id="order-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                                <div className="border-2 border-gray-100 p-6 rounded-md hover:shadow-md transition-shadow">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full mb-4 border-b border-gray-200 py-2 outline-none focus:border-primary-500 font-medium"
                                    />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="Mobile Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full mb-4 border-b border-gray-200 py-2 outline-none focus:border-primary-500 font-medium"
                                    />
                                    <textarea
                                        required
                                        placeholder="Delivery Address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full border-b border-gray-200 py-2 outline-none focus:border-primary-500 font-medium resize-none"
                                        rows={2}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Section: Bill Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <img src={cart[0].image_url} className="w-14 h-14 object-cover" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">{cart[0].name}</h3>
                                <p className="text-xs text-gray-400">Selected Items</p>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border border-green-600 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-green-600 rounded-full" />
                                        </div>
                                        <span className="text-gray-600">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-gray-300">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-400">-</button>
                                            <span className="px-2 text-green-600 font-bold">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-green-600">+</button>
                                        </div>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-sm tracking-tight mb-4">Bill Details</h4>
                            <div className="flex justify-between text-xs text-swiggy-light font-medium">
                                <span>Item Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-swiggy-light font-medium">
                                <span>Delivery Fee • 3.2 kms</span>
                                <span>₹40</span>
                            </div>
                            <div className="flex justify-between text-xs text-swiggy-light font-medium border-b border-gray-100 pb-4">
                                <span>Platform fee</span>
                                <span>₹7.00</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-swiggy-dark pt-2">
                                <span>TO PAY</span>
                                <span>₹{(total + 47).toFixed(2)}</span>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs mt-4 font-bold">{error}</p>}

                        <button
                            form="order-form"
                            disabled={isLoading}
                            type="submit"
                            className="w-full mt-8 bg-green-600 text-white py-4 font-bold rounded-sm hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'PROCESSING...' : 'PROCEED TO PAY'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
