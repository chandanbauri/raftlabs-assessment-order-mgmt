import { useEffect, useState, useMemo } from 'react';
import { getMenu } from '../api/client';
import { Item } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search, User, ChevronDown, Percent, X } from 'lucide-react';

export default function Menu({ onGoToCart }: { onGoToCart: () => void }) {
    const [items, setItems] = useState<Item[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        getMenu().then(setItems);
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const filteredItems = useMemo(() => {
        let result = [...items];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        }

        // Category/Tag filters
        if (activeFilter) {
            switch (activeFilter) {
                case 'Pure Veg':
                    result = result.filter(item => item.description.toLowerCase().includes('veg'));
                    break;
                case 'Ratings 4.0+':
                    // Mocking ratings logic as 4.3 for all in current state, but could be dynamic
                    break;
                case 'Less than Rs. 300':
                    result = result.filter(item => item.price < 300);
                    break;
                case 'Rs. 300-Rs. 600':
                    result = result.filter(item => item.price >= 300 && item.price <= 600);
                    break;
                case 'Fast Delivery':
                    // Mocking delivery time logic
                    break;
            }
        }

        // Sort logic
        if (sortBy) {
            if (sortBy === 'Price: Low to High') {
                result.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'Price: High to Low') {
                result.sort((a, b) => b.price - a.price);
            }
        }

        return result;
    }, [items, searchQuery, activeFilter, sortBy]);

    return (
        <div className="min-h-screen">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 bg-white shadow-md h-20 flex items-center">
                <div className="max-content w-full flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <svg className="w-12 h-14 hover:scale-110 transition-transform cursor-pointer" viewBox="0 0 541 771">
                            <path fill="#FC8019" d="M304 771c-223 0-304-162-304-334 0-165 74-323 209-405C235 15 264 0 300 0c149 0 241 83 241 334 0 165-71 310-237 437z" />
                            <path fill="#FFF" d="M301 645c-112 0-155-83-155-171 0-83 38-164 107-207 13-8 27-16 45-16 77 0 124 43 124 171 0 83-36 158-121 223z" />
                        </svg>
                        <div className="flex items-center gap-2 group cursor-pointer border-b-2 border-transparent hover:border-primary-500 pb-1">
                            <span className="font-bold text-sm text-swiggy-dark">Home</span>
                            <span className="text-swiggy-light text-sm truncate max-w-[200px]">Bengaluru, Karnataka, India</span>
                            <ChevronDown className="w-4 h-4 text-primary-500" />
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        {isSearchVisible ? (
                            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg gap-2 animate-fade-in">
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
                                    onClick={() => {
                                        setIsSearchVisible(false);
                                        setSearchQuery('');
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                onClick={() => setIsSearchVisible(true)}
                                className="flex items-center gap-3 text-swiggy-dark font-medium hover:text-primary-500 cursor-pointer"
                            >
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-swiggy-dark font-medium hover:text-primary-500 cursor-pointer">
                            <Percent className="w-5 h-5" />
                            <span>Offers</span>
                        </div>
                        <div className="flex items-center gap-3 text-swiggy-dark font-medium hover:text-primary-500 cursor-pointer">
                            <User className="w-5 h-5" />
                            <span>Sign In</span>
                        </div>
                        <div
                            onClick={onGoToCart}
                            className="flex items-center gap-3 text-swiggy-dark font-medium hover:text-primary-500 cursor-pointer text-primary-500"
                        >
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                            </div>
                            <span>Cart</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero / Filter Section */}
            <div className="max-content mt-8 pb-12 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-6">Restaurants with online food delivery</h2>
                <div className="flex gap-4 flex-wrap">
                    {['Fast Delivery', 'Ratings 4.0+', 'Pure Veg', 'Rs. 300-Rs. 600', 'Less than Rs. 300'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                            className={`px-4 py-2 border rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === filter
                                ? 'bg-swiggy-dark text-white border-swiggy-dark shadow-md'
                                : 'border-gray-300 hover:bg-gray-100 text-swiggy-light'
                                }`}
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
                            className={`px-4 py-2 border rounded-full text-sm font-medium transition-all duration-200 ${sortBy === sort
                                ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                                : 'border-gray-300 hover:bg-gray-100 text-swiggy-light'
                                }`}
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
                            <div
                                key={item.id}
                                className="group cursor-pointer flex flex-col transition-all duration-200"
                            >
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:scale-95 transition-transform bg-gray-100">
                                    <ImageWithSkeleton src={item.image_url} alt={item.name} />
                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                                        <span className="text-white font-black text-xl uppercase tracking-tighter">Items at ₹{item.price}</span>
                                    </div>
                                </div>

                                <div className="px-2">
                                    <h3 className="text-lg font-bold text-swiggy-dark truncate mb-1">{item.name}</h3>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                            <Star className="w-3 h-3 text-white fill-white" />
                                        </div>
                                        <span className="font-bold text-swiggy-dark text-sm">4.3 • 20-25 mins</span>
                                    </div>
                                    <p className="text-swiggy-light text-sm truncate mb-4">{item.description}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(item);
                                        }}
                                        className="w-full py-2 bg-white border-2 border-gray-200 text-green-600 font-bold rounded-lg hover:bg-green-50 hover:border-green-200 transition-all uppercase text-sm tracking-wide"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center animate-fade-in">
                        <div className="inline-block p-10 bg-gray-50 rounded-full mb-6">
                            <Search className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-swiggy-dark mb-2">No results found</h3>
                        <p className="text-gray-400 font-medium">Try different search terms or adjusted filters</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setActiveFilter(null);
                                setSortBy(null);
                            }}
                            className="mt-8 text-primary-500 font-bold border-b-2 border-primary-500 pb-1"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
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
