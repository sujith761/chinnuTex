import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function WeavingDetailPage() {
  const { clothType } = useParams();
  const navigate = useNavigate();
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

  const clothImages = {
    'cotton': 'https://images.unsplash.com/photo-1599122762299-5e85c0a36c0c?w=600&h=400&fit=crop',
    'rayon': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop',
    'polyester': 'https://images.unsplash.com/photo-1578771746014-b94066fb4578?w=600&h=400&fit=crop',
    'silk': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=400&fit=crop',
    'woollen': 'https://images.unsplash.com/photo-1575634662424-d3150ddef644?w=600&h=400&fit=crop',
    'linen': 'https://images.unsplash.com/photo-1599122765355-52d81e58c6ef?w=600&h=400&fit=crop',
    'nylon': 'https://images.unsplash.com/photo-1574701148211-c798a4018fe3?w=600&h=400&fit=crop',
    'acrylic': 'https://images.unsplash.com/photo-1611987720121-46c63300e859?w=600&h=400&fit=crop'
  };

  const cloth = clothTypes.find((c) => c.slug === clothType);

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

  if (!cloth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="mb-6 text-gray-600">The weaving product you're looking for doesn't exist.</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const clothName = cloth.name;
  const clothSlug = cloth.slug;
  const clothImage = clothImages[clothSlug];
  const clothPricePerMetre = cloth.pricePerMetre;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      {/* Hero Image Section */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${clothImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/70 via-green-900/60 to-transparent"></div>
        
        {/* Floating badge */}
        <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
          <div className="text-xs text-gray-600 mb-1">Weaving Product</div>
          <div className="text-lg font-bold text-emerald-600">Premium Quality</div>
        </div>

        {/* Back button */}
        <div className="absolute top-8 left-8">
          <Link 
            to="/products/weaving" 
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl text-gray-800 font-semibold hover:bg-white transition-all group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Weaving
          </Link>
        </div>

        {/* Search Bar */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search other cloth types..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="w-full px-6 py-3 pl-12 bg-white/90 backdrop-blur-sm border-2 border-emerald-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition shadow-lg"
            />
            <svg className="absolute left-4 top-3.5 w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Search Results Dropdown */}
            {showSearch && (searchResults.length > 0 || searchQuery.trim()) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-emerald-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((result) => (
                      <div key={result.name} className="border-b border-emerald-100">
                        <div className="px-4 py-2 bg-emerald-50 text-xs font-bold text-emerald-700">
                          {result.name}
                        </div>
                        
                        {/* Sizing Product */}
                        {result.yarn && (
                          <button
                            type="button"
                            onMouseDown={() => handleSelectProduct('sizing', result.yarn.slug)}
                            className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 border-b border-emerald-50 transition flex items-center justify-between group text-sm"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">🧵 Sizing Yarn - Per kg</div>
                              <div className="text-xs text-gray-600">Product: ₹{result.yarn.pricePerKg}/kg</div>
                            </div>
                            <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {/* Sizing Service */}
                        {result.yarn && (
                          <button
                            type="button"
                            onMouseDown={() => handleSelectService('sizing', result.yarn.slug)}
                            className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 border-b border-emerald-50 transition flex items-center justify-between group text-sm"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">⚙️ Sizing Service - Per kg</div>
                              <div className="text-xs text-gray-600">Service for {result.name} yarn</div>
                            </div>
                            <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {/* Weaving Product */}
                        {result.cloth && (
                          <button
                            type="button"
                            onMouseDown={() => handleSelectProduct('weaving', result.cloth.slug)}
                            className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 border-b border-emerald-50 transition flex items-center justify-between group text-sm"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">🧵 Weaving Cloth - Per meter</div>
                              <div className="text-xs text-gray-600">Product: ₹{result.cloth.pricePerMetre}/metre</div>
                            </div>
                            <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {/* Weaving Service */}
                        {result.cloth && (
                          <button
                            type="button"
                            onMouseDown={() => handleSelectService('weaving', result.cloth.slug)}
                            className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition flex items-center justify-between group text-sm"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">⚙️ Weaving Service - Per meter</div>
                              <div className="text-xs text-gray-600">Service for {result.name} cloth</div>
                            </div>
                            <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Navigation Options */}
                    <div>
                      <div className="px-4 py-2 bg-emerald-50 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Browse
                      </div>
                      <button
                        type="button"
                        onMouseDown={() => handleNavigation('/products')}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-emerald-100 transition flex items-center justify-between group text-sm"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">All Products</div>
                          <div className="text-xs text-gray-600">Browse sizing & weaving</div>
                        </div>
                        <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={() => handleNavigation('/services')}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition flex items-center justify-between group text-sm"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">Our Services</div>
                          <div className="text-xs text-gray-600">View all services offered</div>
                        </div>
                        <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="border-t border-emerald-100">
                      <div className="px-4 py-2 bg-emerald-50 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Browse
                      </div>
                      <button
                        type="button"
                        onMouseDown={() => handleNavigation('/products')}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-emerald-100 transition flex items-center justify-between group text-sm"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">All Products</div>
                          <div className="text-xs text-gray-600">Browse sizing & weaving</div>
                        </div>
                        <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onMouseDown={() => handleNavigation('/services')}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition flex items-center justify-between group text-sm"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">Our Services</div>
                          <div className="text-xs text-gray-600">View all services offered</div>
                        </div>
                        <svg className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-sm text-emerald-200 uppercase tracking-wider mb-3 font-bold">Weaving Service</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-2xl">{clothName}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 -mt-32 relative z-10">
            <div className="p-12">
              {/* Pricing Section */}
              <div className="bg-white/60 rounded-xl p-4 mb-8 border border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-900 mb-3">Pricing</h3>
                <p className="text-2xl font-bold text-emerald-600 mb-4">₹{clothPricePerMetre}/metre</p>
                <div className="bg-white/60 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-700"><strong>Example Costs:</strong></p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• 10 metre: ₹{clothPricePerMetre * 10}</li>
                    <li>• 50 metre: ₹{clothPricePerMetre * 50}</li>
                    <li>• 100 metre: ₹{clothPricePerMetre * 100}</li>
                  </ul>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Product Overview</h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Professional weaving service specifically designed for {clothName.toLowerCase()}. Our state-of-the-art 
                  automated looms produce high-quality {clothName.toLowerCase()} with consistent patterns and superior fabric quality. 
                  Quality control is maintained at every stage of the weaving process to ensure exceptional results.
                </p>
              </div>

              {/* Features */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    'High-speed automated looms',
                    'Consistent pattern quality',
                    'Superior fabric finish',
                    'Quality control at every stage',
                    'Professional expertise',
                    'Timely delivery'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
                          <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">{feature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="border-t border-gray-200 pt-10">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Ready to Order?</h3>
                <p className="text-gray-700 text-sm mb-8">Book your {clothName.toLowerCase()} weaving service today and experience superior quality.</p>
                
                <Link 
                  to="/booking"
                  state={{ 
                    type: 'product',
                    category: 'weaving',
                    item: clothName,
                    itemSlug: clothSlug,
                    price: clothPricePerMetre,
                    unit: 'metre'
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-10 py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl text-lg"
                >
                  <span>Proceed to Booking</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
