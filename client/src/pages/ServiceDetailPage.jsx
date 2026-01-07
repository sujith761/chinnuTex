import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import services from '../data/services';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const svc = services.find((s) => s.slug === slug);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const yarnTypes = [
    { name: 'Cotton', slug: 'cotton', pricePerKg: 450 },
    { name: 'Polyester', slug: 'polyester', pricePerKg: 520 },
    { name: 'Viscose', slug: 'viscose', pricePerKg: 480 },
    { name: 'PC Blended', slug: 'pc-blended', pricePerKg: 510 },
    { name: 'PV Blended', slug: 'pv-blended', pricePerKg: 490 },
    { name: 'Nylon', slug: 'nylon', pricePerKg: 550 },
    { name: 'Acrylic', slug: 'acrylic', pricePerKg: 470 }
  ];

  const clothTypes = [
    { name: 'Cotton', slug: 'cotton', pricePerMetre: 280 },
    { name: 'Rayon', slug: 'rayon', pricePerMetre: 320 },
    { name: 'Polyester', slug: 'polyester', pricePerMetre: 250 },
    { name: 'Silk', slug: 'silk', pricePerMetre: 450 },
    { name: 'Woollen', slug: 'woollen', pricePerMetre: 380 },
    { name: 'Linen', slug: 'linen', pricePerMetre: 400 },
    { name: 'Nylon', slug: 'nylon', pricePerMetre: 240 },
    { name: 'Acrylic', slug: 'acrylic', pricePerMetre: 220 }
  ];

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

  // Handle search result click
  const handleSelectProduct = (category, slug) => {
    setSearchQuery('');
    setShowSearch(false);
    navigate(`/products/${category}/${slug}`);
  };

  // Handle service click
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

  // Handle navigation
  const handleNavigation = (path) => {
    setSearchQuery('');
    setShowSearch(false);
    navigate(path);
  };

  if (!svc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Service Not Found</h2>
          <p className="mb-6 text-gray-600">The service you're looking for doesn't exist.</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100">
      {/* Hero Image Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${svc.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-blue-900/60 to-transparent"></div>
        
        {/* Floating badge */}
        <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-600 mb-1">Service Category</div>
          <div className="text-lg font-bold text-indigo-600">Premium</div>
        </div>

        {/* Back button */}
        <div className="absolute top-8 left-8">
          <Link 
            to="/services" 
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl text-gray-800 font-semibold hover:bg-white transition-all group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
        </div>

        {/* Search Bar */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search yarns & fabrics..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="w-full px-6 py-3 pl-12 bg-white/90 backdrop-blur-sm border-2 border-indigo-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-lg"
            />
            <svg className="absolute left-4 top-3.5 w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Search Results Dropdown */}
            {showSearch && (searchResults.length > 0 || searchQuery.trim()) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-indigo-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((result) => (
                      <div key={result.name} className="border-b border-indigo-100">
                        <div className="px-4 py-2 bg-indigo-50 text-xs font-bold text-indigo-700">
                          {result.name}
                        </div>
                        
                        {/* Sizing Product */}
                        {result.yarn && (
                          <button
                            type="button"
                            onMouseDown={() => handleSelectProduct('sizing', result.yarn.slug)}
                            className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 border-b border-indigo-50 transition flex items-center justify-between group text-sm"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">🧵 Sizing Yarn - Per kg</div>
                              <div className="text-xs text-gray-600">Product: ₹{result.yarn.pricePerKg}/kg</div>
                            </div>
                            <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {/* Sizing Service */}
                        {result.yarn && (
                          <button
                            type="button"
                            onMouseDown={() => handleSelectService('sizing', result.yarn.slug)}
                            className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 border-b border-indigo-50 transition flex items-center justify-between group text-sm"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">⚙️ Sizing Service - Per kg</div>
                              <div className="text-xs text-gray-600">Service for {result.name} yarn</div>
                            </div>
                            <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {/* Weaving Product */}
                        {result.cloth && (
                          <button
                            type="button"
                            onMouseDown={() => handleSelectProduct('weaving', result.cloth.slug)}
                            className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 border-b border-indigo-50 transition flex items-center justify-between group text-sm"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">🧵 Weaving Cloth - Per meter</div>
                              <div className="text-xs text-gray-600">Product: ₹{result.cloth.pricePerMetre}/metre</div>
                            </div>
                            <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {/* Weaving Service */}
                        {result.cloth && (
                          <button
                            type="button"
                            onMouseDown={() => handleSelectService('weaving', result.cloth.slug)}
                            className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition flex items-center justify-between group text-sm"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">⚙️ Weaving Service - Per meter</div>
                              <div className="text-xs text-gray-600">Service for {result.name} cloth</div>
                            </div>
                            <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Navigation Options */}
                    <div>
                      <div className="px-4 py-2 bg-indigo-50 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Browse
                      </div>
                      <button
                        type="button"
                        onMouseDown={() => handleNavigation('/products')}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-indigo-100 transition flex items-center justify-between group text-sm"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">All Products</div>
                          <div className="text-xs text-gray-600">Browse sizing & weaving</div>
                        </div>
                        <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={() => handleNavigation('/services')}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition flex items-center justify-between group text-sm"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">Our Services</div>
                          <div className="text-xs text-gray-600">View all services offered</div>
                        </div>
                        <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  /* No results message with quick links */
                  <div>
                    <div className="px-4 py-6 text-center">
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-4">No results found for "{searchQuery}"</p>
                    </div>
                    <div className="border-t border-indigo-100">
                      <div className="px-4 py-2 bg-indigo-50 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Browse
                      </div>
                      <button
                        type="button"
                        onMouseDown={() => handleNavigation('/products')}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-indigo-100 transition flex items-center justify-between group text-sm"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">All Products</div>
                          <div className="text-xs text-gray-600">Browse sizing & weaving</div>
                        </div>
                        <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={() => handleNavigation('/services')}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition flex items-center justify-between group text-sm"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">Our Services</div>
                          <div className="text-xs text-gray-600">View all services offered</div>
                        </div>
                        <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <p className="text-sm text-indigo-200 uppercase tracking-wider mb-3 font-bold">Professional Service</p>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl">{svc.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100 -mt-32 relative z-10">
            <div className="p-12">
              {/* Description */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed text-lg">{svc.summary}</p>
              </div>

              {/* Features */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Features</h2>
                <div className="space-y-4">
                  {svc.bullets.map((b, index) => (
                    <div key={b} className="flex items-start gap-4 p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-800 flex-1 text-lg">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/booking"                   state={{ 
                    type: 'service',
                    category: 'sizing',
                    item: svc.title,
                    itemSlug: svc.slug
                  }}                  className="flex-1 text-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Book This Service
                </Link>
                <Link 
                  to="/contact" 
                  className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Ask Questions
                </Link>
              </div>
            </div>

            {/* Info Footer */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-12 py-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Professional fabric processing with guaranteed quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">24-72 hour turnaround</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
