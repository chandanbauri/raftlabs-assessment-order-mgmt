import { useEffect, useState } from 'react';
import { getOrder, getUserOrders } from '../api/client';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, MapPin, Phone, MessageCircle, Star, ShoppingBag, ChevronRight } from 'lucide-react';

export default function Tracking({ orderId, onBack }: { orderId: string; onBack: () => void }) {
    const { user, isAuthenticated } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [status, setStatus] = useState<string>('');
    const [pastOrders, setPastOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrder = () => {
            getOrder(orderId).then((o) => {
                setOrder(o);
                setStatus(o.status);
            });
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 2000);

        return () => clearInterval(interval);
    }, [orderId]);

    useEffect(() => {
        if (isAuthenticated && user?.name) {
            getUserOrders(user.name).then((orders) => {

                setPastOrders(orders.filter(o => o.id !== orderId));
            });
        }
    }, [isAuthenticated, user?.name, orderId]);

    const steps = [
        { label: 'Order Received', key: 'Order Received', time: 'Received' },
        { label: 'Out for Delivery', key: 'Out for Delivery', time: 'In progress' },
        { label: 'Delivered', key: 'Delivered', time: 'Enjoy' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === status);

    if (!order) return <div className="h-screen flex items-center justify-center font-bold text-swiggy-light">Updating status...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {}
            <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-[1240px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight">Order Status</h1>
                    </div>
                    <span className="text-swiggy-light text-sm font-bold">HELP</span>
                </div>
            </div>

            <div className="max-w-[800px] mx-auto w-full p-6 space-y-6">
                {}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden gap-4 md:gap-0">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary-500" />
                    <div>
                        <h2 className="text-3xl font-black mb-1">25 MINS</h2>
                        <p className="text-swiggy-light font-medium text-sm">Estimated delivery for #{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center animate-bounce">
                            <Clock className="w-6 h-6 text-swiggy-dark" />
                        </div>
                    </div>
                </div>

                {}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <div className="space-y-12 relative">
                        {}
                        <div className="absolute left-[11px] top-2 bottom-2 w-1 bg-gray-100" />

                        {steps.map((step, index) => {
                            const active = index <= currentStepIndex;
                            return (
                                <div key={step.key} className="flex items-start gap-8 relative z-10">
                                    <div className={`w-6 h-6 rounded-full border-4 border-white ${active ? 'bg-orange-500 scale-125' : 'bg-gray-200'} transition-all`} />
                                    <div>
                                        <h3 className={`text-lg font-bold ${active ? 'text-swiggy-dark' : 'text-gray-300'}`}>{status === step.key ? 'Your food is ' + step.label.toLowerCase() : step.label}</h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{step.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {}
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 text-center sm:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-swiggy-gray/10 rounded-full flex items-center justify-center overflow-hidden relative">
                            <PartnerImageWithSkeleton src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_100,h_100,c_fill/delivery-partner-v2" />
                        </div>
                        <div>
                            <h4 className="font-bold">Rahul Mishra</h4>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-gray-400 fill-gray-400" />
                                <span className="text-xs text-gray-400 font-medium">4.8 Rating</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <Phone className="w-4 h-4 text-swiggy-dark" />
                        </div>
                        <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <MessageCircle className="w-4 h-4 text-swiggy-dark" />
                        </div>
                    </div>
                </div>

                {}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <div className="flex gap-2 mb-6">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                            <h4 className="font-bold text-sm mb-1">Delivering to</h4>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">{order.customer_address}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm mb-1">{order.order_items?.length || 0} ITEM(S)</h4>
                                <p className="text-xs text-swiggy-dark font-black tracking-tighter">Total Amount: ₹{((order.total_price || 0) + 47).toFixed(2)}</p>
                            </div>
                            <span className="text-xs font-bold text-primary-500 uppercase cursor-pointer hover:underline">View Receipt</span>
                        </div>
                    </div>
                </div>

                {}
                {pastOrders.length > 0 && (
                    <div className="mt-10">
                        <h3 className="text-xl font-black text-swiggy-dark mb-4">Past Orders</h3>
                        <div className="space-y-4">
                            {pastOrders.map((po) => (
                                <div key={po.id} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between group hover:border-primary-500 border border-transparent transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1 text-swiggy-dark flex items-center gap-2">
                                                Order #{po.id.slice(0, 8).toUpperCase()}
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${po.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-500'}`}>
                                                    {po.status}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-gray-400 font-medium">
                                                <span className="font-bold">₹{((po.total_price || 0) + 47).toFixed(2)}</span> • {po.order_items?.length || 0} Items
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PartnerImageWithSkeleton({ src }: { src: string }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <>
            {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
            <img
                src={src}
                alt="Partner"
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </>
    );
}
