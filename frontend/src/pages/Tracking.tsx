import { useEffect, useState } from 'react';
import { getOrder } from '../api/client';
import { Order } from '../types';
import { ArrowLeft, Clock, MapPin, Phone, MessageCircle, Star } from 'lucide-react';

export default function Tracking({ orderId, onBack }: { orderId: string; onBack: () => void }) {
    const [order, setOrder] = useState<Order | null>(null);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        getOrder(orderId).then((o) => {
            setOrder(o);
            setStatus(o.status);
        });

        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws/order-status?orderId=${orderId}`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status) {
                setStatus(data.status);
            }
        };

        return () => ws.close();
    }, [orderId]);

    const steps = [
        { label: 'Order Received', key: 'Order Received', time: 'Received' },
        { label: 'Out for Delivery', key: 'Out for Delivery', time: 'In progress' },
        { label: 'Delivered', key: 'Delivered', time: 'Enjoy' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === status);

    if (!order) return <div className="h-screen flex items-center justify-center font-bold text-swiggy-light">Updating status...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
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
                {/* Estimated Time Card */}
                <div className="bg-white p-8 rounded-lg shadow-sm flex justify-between items-center relative overflow-hidden">
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

                {/* Tracker */}
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <div className="space-y-12 relative">
                        {/* Vertical Line */}
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

                {/* Delivery Partner */}
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
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

                {/* Address & Bill */}
                <div className="bg-white p-8 rounded-lg shadow-sm">
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
                                <h4 className="font-bold text-sm mb-1">{order.order_items.length} ITEM(S)</h4>
                                <p className="text-xs text-swiggy-dark font-black tracking-tighter">Total Amount: ₹{(order.total_price + 47).toFixed(2)}</p>
                            </div>
                            <span className="text-xs font-bold text-primary-500 uppercase cursor-pointer hover:underline">View Receipt</span>
                        </div>
                    </div>
                </div>
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
