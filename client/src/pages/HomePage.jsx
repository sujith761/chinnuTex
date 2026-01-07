import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

// Search data
const yarnTypes = [
  { name: 'Cotton', slug: 'cotton', category: 'sizing' },
  { name: 'Polyester', slug: 'polyester', category: 'sizing' },
  { name: 'Viscose', slug: 'viscose', category: 'sizing' },
  { name: 'PC Blended', slug: 'pc-blended', category: 'sizing' },
  { name: 'PV Blended', slug: 'pv-blended', category: 'sizing' },
  { name: 'Nylon', slug: 'nylon', category: 'sizing' },
  { name: 'Acrylic', slug: 'acrylic', category: 'sizing' }
];

const clothTypes = [
  { name: 'Cotton', slug: 'cotton', category: 'weaving' },
  { name: 'Rayon', slug: 'rayon', category: 'weaving' },
  { name: 'Polyester', slug: 'polyester', category: 'weaving' },
  { name: 'Silk', slug: 'silk', category: 'weaving' },
  { name: 'Woollen', slug: 'woollen', category: 'weaving' },
  { name: 'Linen', slug: 'linen', category: 'weaving' },
  { name: 'Nylon', slug: 'nylon', category: 'weaving' },
  { name: 'Acrylic', slug: 'acrylic', category: 'weaving' }
];

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const getStartedTo = '/about';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredYarns = yarnTypes.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );
    const filteredCloths = clothTypes.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );

    // Combine both yarn and cloth results
    const combined = [];
    const uniqueNames = new Set();

    filteredYarns.forEach(yarn => {
      if (!uniqueNames.has(yarn.name)) {
        uniqueNames.add(yarn.name);
        combined.push({ name: yarn.name, yarn, cloth: filteredCloths.find(c => c.name === yarn.name) });
      }
    });

    filteredCloths.forEach(cloth => {
      if (!uniqueNames.has(cloth.name)) {
        uniqueNames.add(cloth.name);
        combined.push({ name: cloth.name, yarn: filteredYarns.find(y => y.name === cloth.name), cloth });
      }
    });

    setSearchResults(combined);
    setShowSearch(true);
  };

  // Navigate to product detail
  const handleSelectProduct = (category, slug) => {
    setSearchQuery('');
    setShowSearch(false);
    navigate(`/products/${category}/${slug}`);
  };

  // Navigate to service detail
  const handleSelectService = (category, slug) => {
    setSearchQuery('');
    setShowSearch(false);
    // Map to actual service slugs
    if (category === 'sizing') {
      navigate('/services/warp-sizing');
    } else if (category === 'weaving') {
      navigate('/services/weaving');
    }
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section - Soft Gradient */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 via-accent-light/40 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary-900">
            Professional Sizing & Weaving Services
          </h1>
          <p className="text-base text-primary-700/80 mb-12 leading-relaxed">
            Transform your yarns with precision sizing and expert weaving. Trusted by textile manufacturers for quality and reliability.
          </p>

          {/* Search Bar */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for yarns & fabrics..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                className="w-full px-6 py-4 pl-14 bg-white border-2 border-primary-200 rounded-2xl text-base focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition shadow-sm"
              />
              <svg className="absolute left-5 top-4 w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {/* Search Results Dropdown */}
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-primary-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div key={result.name} className="border-b border-primary-100">
                      <div className="px-6 py-2 bg-primary-50 text-sm font-bold text-primary-700">
                        {result.name}
                      </div>
                      
                      {/* Sizing Product */}
                      {result.yarn && (
                        <button
                          type="button"
                          onMouseDown={() => handleSelectProduct('sizing', result.yarn.slug)}
                          className="w-full text-left px-6 py-3 hover:bg-primary-50 border-b border-primary-50 transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-base font-semibold text-primary-900">🧵 Sizing Yarn - Per kg</div>
                            <div className="text-sm text-primary-600">Product Page</div>
                          </div>
                          <svg className="w-5 h-5 text-primary-400 group-hover:text-primary-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}

                      {/* Sizing Service */}
                      {result.yarn && (
                        <button
                          type="button"
                          onMouseDown={() => handleSelectService('sizing', result.yarn.slug)}
                          className="w-full text-left px-6 py-3 hover:bg-primary-50 border-b border-primary-50 transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-base font-semibold text-primary-900">⚙️ Sizing Service - Per kg</div>
                            <div className="text-sm text-primary-600">Service Page</div>
                          </div>
                          <svg className="w-5 h-5 text-primary-400 group-hover:text-primary-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}

                      {/* Weaving Product */}
                      {result.cloth && (
                        <button
                          type="button"
                          onMouseDown={() => handleSelectProduct('weaving', result.cloth.slug)}
                          className="w-full text-left px-6 py-3 hover:bg-primary-50 border-b border-primary-50 transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-base font-semibold text-primary-900">🧵 Weaving Cloth - Per meter</div>
                            <div className="text-sm text-primary-600">Product Page</div>
                          </div>
                          <svg className="w-5 h-5 text-primary-400 group-hover:text-primary-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}

                      {/* Weaving Service */}
                      {result.cloth && (
                        <button
                          type="button"
                          onMouseDown={() => handleSelectService('weaving', result.cloth.slug)}
                          className="w-full text-left px-6 py-3 hover:bg-primary-50 transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-base font-semibold text-primary-900">⚙️ Weaving Service - Per meter</div>
                            <div className="text-sm text-primary-600">Service Page</div>
                          </div>
                          <svg className="w-5 h-5 text-primary-400 group-hover:text-primary-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to={getStartedTo} 
              className="px-8 py-4 bg-primary-700 text-white rounded-lg text-lg font-medium hover:bg-primary-800 transition inline-block shadow-md"
            >
              Get Started
            </Link>
            <Link 
              to="/services" 
              className="px-8 py-4 border-2 border-primary-700 text-primary-700 rounded-lg text-lg font-medium hover:bg-primary-700 hover:text-white transition inline-block"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-primary-100 bg-white/60">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-primary-800 mb-2">500+</div>
              <div className="text-primary-700/80">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-800 mb-2">99%</div>
              <div className="text-primary-700/80">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-800 mb-2">24/7</div>
              <div className="text-primary-700/80">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-primary-900">About Chinnu Tex</h2>
            <p className="text-primary-700/80 text-lg max-w-3xl mx-auto">
              CHINNU TEX is a leading textile processing company specializing in professional sizing and weaving services. With over two decades of expertise, we deliver premium quality textile processing solutions to manufacturers across India.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-primary-50/50 border border-primary-200 rounded-xl p-6 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 bg-primary-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Premium Quality Service</h3>
            </div>
            <div className="bg-primary-50/50 border border-primary-200 rounded-xl p-6 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 bg-primary-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Eco-Friendly Processing</h3>
            </div>
            <div className="bg-primary-50/50 border border-primary-200 rounded-xl p-6 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 bg-primary-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Trusted by Industry Leaders</h3>
            </div>
            <div className="bg-primary-50/50 border border-primary-200 rounded-xl p-6 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 bg-primary-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-primary-900 mb-2">Fast & Reliable Delivery</h3>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-primary-700 text-lg font-medium hover:text-primary-900 hover:gap-3 transition-all"
            >
              More details about the company
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-primary-50/60 to-accent-light/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-primary-900">Simple Booking Process</h2>
            <p className="text-primary-700/80 text-lg max-w-2xl mx-auto">Get started in three easy steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-700 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">
                1
              </div>
              <h3 className="font-semibold text-xl mb-3 text-primary-900">Select Process</h3>
              <p className="text-primary-700/80">Choose sizing or weaving service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-700 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">
                2
              </div>
              <h3 className="font-semibold text-xl mb-3 text-primary-900">Enter Details</h3>
              <p className="text-primary-700/80">Specify fabric type and quantity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-700 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">
                3
              </div>
              <h3 className="font-semibold text-xl mb-3 text-primary-900">Secure Payment</h3>
              <p className="text-primary-700/80">Pay safely via Razorpay/UPI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Professional Fabric Solutions</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-3xl mx-auto">From cotton to polyester, we handle all fabric types with precision and care.</p>
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-gray-900 text-lg font-medium hover:gap-4 transition-all"
          >
            Explore All Services 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Fabrics?</h2>
          <p className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto">
            Join hundreds of satisfied textile manufacturers. Book online, track in real-time, download invoices instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-gray-900 rounded-lg text-lg font-medium hover:bg-gray-100 transition inline-block"
            >
              Create Free Account
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-medium hover:bg-white hover:text-gray-900 transition inline-block"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
