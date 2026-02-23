import { useEffect, useState } from 'react';
import { getOrder } from '../api/client';
import { Order } from '../types';
import { Package, Clock, Truck, CheckCircle2, ArrowLeft, Loader2, MapPin, FileText } from 'lucide-react';

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
        { label: 'Order Received', icon: Package, key: 'Order Received', desc: 'We have received your order' },
        { label: 'Preparing', icon: Clock, key: 'Preparing', desc: 'Our chef is preparing your meal' },
        { label: 'Out for Delivery', icon: Truck, key: 'Out for Delivery', desc: 'Your food is on the way' },
        { label: 'Delivered', icon: CheckCircle2, key: 'Delivered', desc: 'Enjoy your meal!' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === status);

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen max-w-4xl mx-auto p-6 md:p-12 animate-fade-in">
            <button
                onClick={onBack}
                className="group flex items-center gap-3 text-slate-500 mb-12 hover:text-slate-950 transition-colors font-bold uppercase tracking-widest text-xs"
            >
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-slate-950 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Menu
            </button>

            <div className="grid grid-cols-1 gap-12">
                <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-premium relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-32 -mt-32 -z-10 opacity-50" />

                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                        <div className="text-center md:text-left">
                            <span className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
                                Live Tracking
                            </span>
                            <h2 className="text-4xl font-black text-slate-950 tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</h2>
                        </div>
                        <div className="bg-slate-50 px-8 py-4 rounded-[1.5rem] border border-slate-100 text-center">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Estimated Arrival</p>
                            <p className="text-xl font-black text-slate-950">25 - 35 min</p>
                        </div>
                    </div>

                    <div className="relative pt-8 pb-12">
                        <div className="absolute top-[3.7rem] left-0 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            />
                        </div>

                        <div className="relative flex justify-between items-start">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.key} className="flex flex-col items-center max-w-[120px] text-center">
                                        <div
                                            className={`w-16 h-16 rounded-3xl flex items-center justify-center border-4 transition-all duration-700 ${isCompleted
                                                ? 'bg-primary-600 border-primary-100 text-white shadow-xl shadow-primary-200 scale-110 z-10'
                                                : 'bg-white border-slate-50 text-slate-200'
                                                }`}
                                        >
                                            <Icon className={`w-7 h-7 ${isCurrent ? 'animate-pulse' : ''}`} />
                                        </div>
                                        <div className="mt-6 space-y-1 px-2">
                                            <p className={`text-xs font-black uppercase tracking-wider ${isCompleted ? 'text-slate-950' : 'text-slate-400'}`}>
                                                {step.label}
                                            </p>
                                            {isCurrent && (
                                                <p className="text-[10px] text-slate-400 font-medium leading-tight">
                                                    {step.desc}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-premium">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-black text-slate-950 text-xl tracking-tight">Delivery Address</h3>
                        </div>
                        <p className="text-slate-600 font-bold mb-1">{order.customer_name}</p>
                        <p className="text-slate-400 font-medium leading-relaxed">{order.customer_address}</p>
                        <p className="text-slate-400 font-medium mt-2">{order.customer_phone}</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-premium">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-black text-slate-950 text-xl tracking-tight">Order Details</h3>
                        </div>
                        <div className="space-y-4">
                            {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center group">
                                    <span className="text-slate-500 font-bold text-sm">
                                        <span className="text-primary-600 mr-2">{item.quantity}x</span> {item.item.name}
                                    </span>
                                    <span className="font-extrabold text-slate-950 text-sm group-hover:text-primary-600 transition-colors">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <div className="pt-6 mt-2 border-t border-slate-50 flex justify-between items-center">
                                <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Total Amount</span>
                                <span className="text-3xl font-black text-primary-600">${order.total_price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
