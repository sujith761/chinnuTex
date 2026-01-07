import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { pricingApi } from '../services/api';

export default function SizingPage() {
  const [yarnTypes, setYarnTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const yarnImages = {
    'cotton': 'https://images.unsplash.com/photo-1599122762299-5e85c0a36c0c?w=600&h=400&fit=crop',
    'polyester': 'https://images.unsplash.com/photo-1578771746014-b94066fb4578?w=600&h=400&fit=crop',
    'viscose': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop',
    'pc-blend': 'https://images.unsplash.com/photo-1608919291141-a0659c826505?w=600&h=400&fit=crop',
    'pv-blend': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=400&fit=crop',
    'nylon': 'https://images.unsplash.com/photo-1574701148211-c798a4018fe3?w=600&h=400&fit=crop',
    'acrylic': 'https://images.unsplash.com/photo-1611987720121-46c63300e859?w=600&h=400&fit=crop'
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await pricingApi.getAllSizingPrices();
        setYarnTypes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sizing prices:', err);
        setError('Failed to load pricing data');
        // Fallback to hardcoded data
        setYarnTypes([
          { yarnType: 'Cotton', slug: 'cotton', pricePerKg: 450 },
          { yarnType: 'Polyester', slug: 'polyester', pricePerKg: 520 },
          { yarnType: 'Viscose', slug: 'viscose', pricePerKg: 480 },
          { yarnType: 'PC Blend', slug: 'pc-blend', pricePerKg: 510 },
          { yarnType: 'PV Blend', slug: 'pv-blend', pricePerKg: 490 },
          { yarnType: 'Nylon', slug: 'nylon', pricePerKg: 550 },
          { yarnType: 'Acrylic', slug: 'acrylic', pricePerKg: 470 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50/30">
      {/* Hero Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-sky-900 to-sky-800 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">
            Sizing Products
          </h1>
          <p className="text-xl text-sky-100">
            Professional sizing products for superior yarn strengthening. Excellence in every application.
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-20">
        {/* Sizing Subheading */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-sky-900 mb-8">Warp Sizing Products</h2>
          <p className="text-lg text-sky-700/80 mb-8 leading-relaxed">
            Our advanced sizing process applies protective coatings to warp yarns, improving their strength, smoothness, 
            and abrasion resistance before weaving. Get optimal results with our specialized sizing solutions for each yarn type.
          </p>
        </div>

        {/* Yarn Types Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-sky-600">Loading pricing data...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">⚠️ {error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {yarnTypes.map((yarn, index) => (
              <div 
                key={index} 
                className="group bg-white border border-sky-100 rounded-xl overflow-hidden hover:shadow-2xl hover:border-sky-300 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50">
                  <div 
                    className="h-full w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                    style={{ backgroundImage: `url(${yarnImages[yarn.slug]})` }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-sky-900 mb-2">{yarn.yarnType}</h3>
                  <p className="text-sky-700/80 mb-4 leading-relaxed text-sm flex-grow">
                    Premium sizing product specifically formulated for {yarn.yarnType.toLowerCase()}.
                  </p>

                  {/* Price Section */}
                  <div className="border-t border-sky-100 pt-4 mb-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-600 text-sm">Price per unit</span>
                      <span className="text-3xl font-bold text-sky-600">₹{yarn.pricePerKg}</span>
                    </div>
                    <span className="text-xs text-gray-500">/kg</span>
                  </div>

                  {/* CTA Button */}
                  <Link 
                    to={`/products/sizing/${yarn.slug}`} 
                    className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-700 transition shadow-md text-sm w-full"
                  >
                    <span>View Details</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 text-center max-w-4xl mx-auto bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-2xl p-12 shadow-xl">
          <h3 className="text-4xl font-bold mb-3">Ready to Order?</h3>
          <p className="text-lg text-sky-100 mb-8">Book your sizing products today and experience superior yarn quality</p>
          <Link 
            to="/booking" 
            className="inline-block bg-white text-sky-700 px-10 py-3.5 rounded-lg font-semibold hover:bg-sky-50 transition shadow-lg hover:shadow-xl"
          >
            Book Service Now
          </Link>
        </div>
      </div>
    </div>
  );
}
