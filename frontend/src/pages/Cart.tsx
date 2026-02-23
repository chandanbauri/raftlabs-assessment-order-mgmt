import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/client';
import { MapPin, Receipt, Wallet, User, Phone, CheckCircle2, ChevronRight, Loader2, Percent } from 'lucide-react';

export default function Cart({ onBack, onOrderPlaced }: { onBack: () => void; onOrderPlaced: (orderId: string) => void }) {
    const { cart, total, updateQuantity, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [formData] = useState({
        name: user?.name || '',
        address: 'Indiranagar, Bengaluru, 560038',
        phone: '9876543210'
    });

    const [step, setStep] = useState<'checkout' | 'payment'>('checkout');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePlaceOrder = async (paymentMethod: string) => {
        setIsLoading(true);
        setError('');

        try {
            const order = await createOrder({
                customer_name: formData.name,
                customer_address: formData.address,
                customer_phone: formData.phone,
                payment_method: paymentMethod,
                items: cart.map(i => ({ item_id: i.id, quantity: i.quantity })),
            });


            await new Promise(resolve => setTimeout(resolve, 2000));

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

                {}
                <div className="lg:col-span-2 space-y-6">

                    {}
                    <div className={`bg-white p-6 md:p-10 relative ${!isAuthenticated ? 'opacity-100' : 'opacity-80'}`}>
                        <div className="absolute left-0 top-10 flex flex-col items-center">
                            <div className={`w-10 h-10 ${isAuthenticated ? 'bg-green-600' : 'bg-swiggy-dark'} flex items-center justify-center text-white shadow-lg`}>
                                {isAuthenticated ? <CheckCircle2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <div className="h-full w-0.5 bg-gray-100 mt-2" />
                        </div>
                        <div className="ml-8">
                            <h2 className="text-xl font-bold mb-2">Account</h2>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="font-bold text-swiggy-dark">{user?.name}</p>
                                        <p className="text-swiggy-light text-sm">{user?.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-500 mb-8 font-medium">Please sign in to your account to place order.</p>
                                    <button onClick={onBack} className="border-2 border-primary-500 text-primary-500 px-8 py-3 font-bold uppercase transition-all hover:bg-primary-50">Log In</button>
                                </>
                            )}
                        </div>
                    </div>

                    {}
                    <div className={`bg-white p-6 md:p-10 relative ${step === 'checkout' ? 'opacity-100' : 'opacity-80'}`}>
                        <div className="absolute left-0 top-10 flex flex-col items-center">
                            <div className={`w-10 h-10 ${step === 'payment' ? 'bg-green-600' : 'bg-swiggy-dark'} flex items-center justify-center text-white shadow-lg`}>
                                {step === 'payment' ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                            </div>
                        </div>
                        <div className="ml-8">
                            <h2 className="text-xl font-bold mb-8">Delivery Address</h2>
                            {step === 'checkout' ? (
                                <div className="space-y-6">
                                    <div className="border-2 border-primary-500 p-4 md:p-8 rounded-md relative flex flex-col md:flex-row gap-4 md:gap-6 group cursor-pointer">
                                        <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors"><MapPin className="w-6 h-6" /></div>
                                        <div>
                                            <h4 className="font-bold text-swiggy-dark mb-1">Home</h4>
                                            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">{formData.address}</p>
                                            <button
                                                onClick={() => isAuthenticated && setStep('payment')}
                                                disabled={!isAuthenticated}
                                                className="bg-green-600 text-white px-8 py-3 font-bold uppercase text-sm tracking-tight shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                            >
                                                Deliver Here
                                            </button>
                                        </div>
                                        <div className="absolute top-4 right-4 text-primary-500 font-bold text-xs">SELECTED</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center group cursor-pointer" onClick={() => setStep('checkout')}>
                                    <p className="text-swiggy-light text-sm font-medium">{formData.address}</p>
                                    <span className="text-primary-500 font-bold text-xs uppercase hover:underline">Change</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    {step === 'payment' && (
                        <div className="bg-white p-6 md:p-10 relative animate-fade-in">
                            <div className="absolute left-0 top-10">
                                <div className="w-10 h-10 bg-swiggy-dark flex items-center justify-center text-white shadow-lg">
                                    <Wallet className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="ml-8">
                                <h2 className="text-xl font-bold mb-8">Choose Payment Method</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Swiggy Money', subtitle: 'Balance: ₹0.00', icon: Wallet },
                                        { name: 'Amazon Pay', subtitle: 'Link your wallet', icon: Percent },
                                        { name: 'Credit/Debit Card', subtitle: 'Visa, Mastercard...', icon: Receipt },
                                        { name: 'Cash on Delivery', subtitle: 'Pay after delivery', icon: Phone }
                                    ].map(method => (
                                        <div
                                            key={method.name}
                                            onClick={() => !isLoading && handlePlaceOrder(method.name)}
                                            className="border border-gray-200 p-6 flex items-center justify-between group cursor-pointer hover:border-primary-500 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <method.icon className="w-6 h-6 text-gray-400 group-hover:text-primary-500" />
                                                <div>
                                                    <p className="font-bold text-swiggy-dark">{method.name}</p>
                                                    <p className="text-xs text-gray-400">{method.subtitle}</p>
                                                </div>
                                            </div>
                                            {isLoading ? <Loader2 className="w-5 h-5 text-primary-500 animate-spin" /> : <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 md:p-8 sticky xl:top-24 shadow-sm">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <img src={cart[0].image_url} className="w-14 h-14 object-cover rounded-md" alt="Restaurant" />
                            <div>
                                <h3 className="font-bold text-lg mb-1 truncate max-w-[180px]">{cart[0].name}</h3>
                                <p className="text-xs text-swiggy-light font-medium uppercase tracking-widest">Bengaluru</p>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border border-green-600 flex items-center justify-center p-[2px]">
                                            <div className="w-full h-full bg-green-600 rounded-full" />
                                        </div>
                                        <span className="text-swiggy-dark">{item.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end md:flex-row lg:items-center gap-2 md:gap-6 mt-2 md:mt-0">
                                        <div className="flex items-center border border-gray-200 px-2 py-1 gap-4">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-red-500">-</button>
                                            <span className="text-green-600">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-green-600 lg:hover:text-green-700">+</button>
                                        </div>
                                        <span className="text-swiggy-dark">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t-[1px] border-swiggy-dark/10">
                            <h4 className="font-black text-sm uppercase tracking-widest text-swiggy-dark">Bill Details</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-swiggy-light font-bold">
                                    <span>Item Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-swiggy-light font-bold">
                                    <span>Delivery Fee</span>
                                    <span>₹40</span>
                                </div>
                                <div className="flex justify-between text-xs text-swiggy-light font-bold border-b border-gray-100 pb-4">
                                    <span>Platform fee</span>
                                    <span>₹7.00</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-base font-black text-swiggy-dark pt-2">
                                <span>TO PAY</span>
                                <span>₹{(total + 47).toFixed(2)}</span>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs mt-4 font-bold text-center bg-red-50 p-2 rounded">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
