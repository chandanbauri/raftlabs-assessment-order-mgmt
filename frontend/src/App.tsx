import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Tracking from './pages/Tracking';

type View = 'menu' | 'cart' | 'tracking';

function AppContent() {
    const [view, setView] = useState<View>('menu');
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

    const handleOrderPlaced = (orderId: string) => {
        setActiveOrderId(orderId);
        setView('tracking');
    };

    return (
        <main className="min-h-screen">
            {view === 'menu' && <Menu onGoToCart={() => setView('cart')} />}
            {view === 'cart' && <Cart onBack={() => setView('menu')} onOrderPlaced={handleOrderPlaced} />}
            {view === 'tracking' && activeOrderId && (
                <Tracking orderId={activeOrderId} onBack={() => setView('menu')} />
            )}
        </main>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </AuthProvider>
    );
}
