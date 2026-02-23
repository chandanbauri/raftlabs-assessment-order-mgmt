import { useEffect, useState, useMemo } from 'react';
import { getMenu, getOffers, getLocations, loginUser } from '../api/client';
import { Item } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Search, User, ChevronDown, Percent, X, MapPin, Tag, LogIn, Loader2 } from 'lucide-react';

export default function Menu({ onGoToCart }: { onGoToCart: () => void }) {
    const [items, setItems] = useState<Item[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [sortBy, setSortBy] = useState<string | null>(null);

    // Modals state
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showOffersModal, setShowOffersModal] = useState(false);

    const [currentLocation, setCurrentLocation] = useState('Bengaluru, Karnataka, India');
    const { addToCart, cart } = useCart();
    const { user, login, logout, isAuthenticated } = useAuth();

    useEffect(() => {
        getMenu().then(setItems);
        getOffers().then(setOffers);
        getLocations().then(setLocations);
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const filteredItems = useMemo(() => {
        let result = [...items];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        }
        if (activeFilter) {
            switch (activeFilter) {
                case 'Pure Veg':
                    result = result.filter(item => item.description.toLowerCase().includes('veg'));
                    break;
                case 'Less than Rs. 300':
                    result = result.filter(item => item.price < 300);
                    break;
                case 'Rs. 300-Rs. 600':
                    result = result.filter(item => item.price >= 300 && item.price <= 600);
                    break;
            }
        }
        if (sortBy) {
            if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
            else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
        }
        return result;
    }, [items, searchQuery, activeFilter, sortBy]);

    return (
        <div className="min-h-screen relative">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 bg-white shadow-md h-20 flex items-center">
                <div className="max-content w-full flex justify-between items-center">
                    <div className="flex items-center gap-2 md:gap-8">
                        <svg className="w-12 h-14 hover:scale-110 transition-transform cursor-pointer" viewBox="0 0 541 771">
                            <path fill="#FC8019" d="M304 771c-223 0-304-162-304-334 0-165 74-323 209-405C235 15 264 0 300 0c149 0 241 83 241 334 0 165-71 310-237 437z" />
                            <path fill="#FFF" d="M301 645c-112 0-155-83-155-171 0-83 38-164 107-207 13-8 27-16 45-16 77 0 124 43 124 171 0 83-36 158-121 223z" />
                        </svg>
                        <div
                            onClick={() => setShowLocationModal(true)}
                            className="flex items-center gap-2 group cursor-pointer border-b-2 border-transparent hover:border-primary-500 pb-1 max-w-[300px]"
                        >
                            <span className="font-bold text-sm text-swiggy-dark">Home</span>
                            <span className="text-swiggy-light text-sm truncate hidden md:inline">{currentLocation}</span>
                            <ChevronDown className="w-4 h-4 text-primary-500 hidden md:block" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-10">
                        {isSearchVisible ? (
                            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg gap-2 animate-fade-in border border-gray-200">
                                <Search className="w-4 h-4 text-gray-500" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search for dishes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent outline-none text-sm w-48 font-medium"
                                />
                                <X
                                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                                    onClick={() => { setIsSearchVisible(false); setSearchQuery(''); }}
                                />
                            </div>
                        ) : (
                            <div onClick={() => setIsSearchVisible(true)} className="nav-item">
                                <Search className="w-5 h-5" />
                                <span className="hidden md:inline">Search</span>
                            </div>
                        )}

                        <div onClick={() => setShowOffersModal(true)} className="nav-item">
                            <Percent className="w-5 h-5" />
                            <span className="hidden md:inline">Offers</span>
                        </div>

                        <div onClick={() => isAuthenticated ? logout() : setShowAuthModal(true)} className="nav-item">
                            <User className="w-5 h-5" />
                            <span className="hidden md:inline">{isAuthenticated ? user?.name : 'Sign In'}</span>
                        </div>

                        <div onClick={onGoToCart} className="nav-item text-primary-500 font-bold">
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                            </div>
                            <span className="hidden md:inline">Cart</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero / Filter Section */}
            <div className="max-content mt-8 pb-12 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-6">Restaurants with online food delivery</h2>
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 hide-scrollbar whitespace-nowrap">
                    {['Fast Delivery', 'Ratings 4.0+', 'Pure Veg', 'Rs. 300-Rs. 600', 'Less than Rs. 300'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        >
                            {filter}
                            {activeFilter === filter && <X className="inline-block ml-2 w-3 h-3" />}
                        </button>
                    ))}
                    <div className="h-10 w-px bg-gray-200 mx-2" />
                    {['Price: Low to High', 'Price: High to Low'].map(sort => (
                        <button
                            key={sort}
                            onClick={() => setSortBy(sortBy === sort ? null : sort)}
                            className={`filter-btn ${sortBy === sort ? 'active-sort' : ''}`}
                        >
                            {sort}
                            {sortBy === sort && <X className="inline-block ml-2 w-3 h-3" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Listing */}
            <div className="max-content py-12">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="group cursor-pointer flex flex-col transition-all duration-200">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:scale-95 transition-transform bg-gray-100">
                                    <ImageWithSkeleton src={item.image_url} alt={item.name} />
                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                                        <span className="text-white font-black text-xl uppercase tracking-tighter">Items at ₹{item.price}</span>
                                    </div>
                                </div>
                                <div className="px-2">
                                    <h3 className="text-lg font-bold text-swiggy-dark truncate mb-1">{item.name}</h3>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center"><Star className="w-3 h-3 text-white fill-white" /></div>
                                        <span className="font-bold text-swiggy-dark text-sm">4.3 • 20-25 mins</span>
                                    </div>
                                    <p className="text-swiggy-light text-sm truncate mb-4">{item.description}</p>
                                    <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} className="w-full py-2 bg-white border-2 border-gray-200 text-green-600 font-bold rounded-lg hover:bg-green-50 hover:border-green-200 transition-all uppercase text-sm tracking-wide">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center animate-fade-in">
                        <div className="inline-block p-10 bg-gray-50 rounded-full mb-6 text-gray-300"><Search className="w-12 h-12" /></div>
                        <h3 className="text-2xl font-bold text-swiggy-dark mb-2">No results found</h3>
                        <button onClick={() => { setSearchQuery(''); setActiveFilter(null); setSortBy(null); }} className="mt-4 text-primary-500 font-bold border-b-2 border-primary-500 pb-1">Clear all filters</button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title="Login">
                <AuthForm onSuccess={(email, name) => { login(email, name); setShowAuthModal(false); }} />
            </Modal>

            <Modal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} title="Search Location">
                <div className="space-y-4">
                    <input type="text" placeholder="Search for area, street..." className="w-full border p-4 outline-none focus:border-primary-500" />
                    <div className="space-y-2">
                        {locations.map(loc => (
                            <div
                                key={loc.id}
                                onClick={() => { setCurrentLocation(loc.name); setShowLocationModal(false); }}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            >
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-swiggy-dark">{loc.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showOffersModal} onClose={() => setShowOffersModal(false)} title="Available Offers">
                <div className="space-y-4">
                    {offers.map(offer => (
                        <div key={offer.id} className="border-2 border-dashed border-primary-200 p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group hover:border-primary-500 transition-colors">
                            <div className="flex justify-between items-center">
                                <div className="bg-primary-50 text-primary-600 px-3 py-1 rounded-md font-black text-sm tracking-widest">{offer.code}</div>
                                <Tag className="w-5 h-5 text-primary-200 group-hover:text-primary-500" />
                            </div>
                            <p className="font-bold text-swiggy-dark text-lg">{offer.description}</p>
                            <p className="text-swiggy-light text-xs uppercase font-black tracking-widest">Use code {offer.code}</p>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

// Sub-components
function Modal({ isOpen, onClose, title, children }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end animate-fade-in">
            <div className="absolute inset-0 bg-swiggy-dark/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-10 flex flex-col animate-slide-in-right">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <X className="w-8 h-8 text-swiggy-dark cursor-pointer mb-8 hover:rotate-90 transition-transform" onClick={onClose} />
                        <h2 className="text-3xl font-black text-swiggy-dark tracking-tight">{title}</h2>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}

function AuthForm({ onSuccess }: { onSuccess: (email: string, name: string) => void }) {
    const [email, setEmail] = useState('demo@example.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await loginUser(email, password);
            onSuccess(user.email, user.name);
        } catch (err) {
            setError('Invalid credentials. Use demo@example.com / password123');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full border-2 border-gray-100 p-4 focus:border-primary-500 outline-none font-bold"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border-2 border-gray-100 p-4 focus:border-primary-500 outline-none font-bold"
                />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button
                disabled={loading}
                className="w-full bg-primary-500 text-white py-4 font-black uppercase tracking-widest hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                Login to Swiggy
            </button>
            <p className="text-xs text-swiggy-light font-medium text-center">By clicking on Login, I accept the Terms & Conditions & Privacy Policy</p>
        </form>
    );
}

function Star({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        </svg>
    );
}

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <>
            {!loaded && !error && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                </div>
            )}
            {error ? (
                <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
                    <ShoppingCart className="w-12 h-12 text-gray-300 mb-2" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image Unavailable</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
        </>
    );
}
