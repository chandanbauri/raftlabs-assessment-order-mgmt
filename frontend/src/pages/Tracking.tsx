import { useEffect, useState } from 'react';
import { getOrder } from '../api/client';
import { Order } from '../types';
import { Package, Clock, Truck, CheckCircle2, ArrowLeft } from 'lucide-react';

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
        { label: 'Order Received', icon: Package, key: 'Order Received' },
        { label: 'Preparing', icon: Clock, key: 'Preparing' },
        { label: 'Out for Delivery', icon: Truck, key: 'Out for Delivery' },
        { label: 'Delivered', icon: CheckCircle2, key: 'Delivered' },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === status);

    if (!order) return <div className="p-12 text-center font-semibold">Loading order...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Menu
            </button>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Track Your Order</h2>
                    <p className="text-gray-500">Order ID: #{order.id.slice(0, 8)}</p>
                </div>

                <div className="relative flex justify-between items-start mb-16">
                    <div className="absolute top-7 left-0 w-full h-1 bg-gray-100 -z-10" />
                    <div
                        className="absolute top-7 left-0 h-1 bg-primary-600 transition-all duration-1000 -z-10"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.key} className="flex flex-col items-center">
                                <div
                                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted ? 'bg-primary-600 border-primary-50 text-white shadow-lg shadow-primary-200' : 'bg-white border-gray-100 text-gray-300'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 ${isCurrent ? 'animate-pulse' : ''}`} />
                                </div>
                                <span className={`mt-4 text-xs font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3">
                        {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.quantity}x {item.item.name}</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                            <span>Total Paid</span>
                            <span className="text-primary-600">${order.total_price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
