import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { pricingApi } from '../services/api';

export default function WeavingPage() {
  const [clothTypes, setClothTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await pricingApi.getAllWeavingPrices();
        setClothTypes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching weaving prices:', err);
        setError('Failed to load pricing data');
        // Fallback to hardcoded data
        setClothTypes([
          { fabricType: 'Cotton', slug: 'cotton', pricePerMetre: 280 },
          { fabricType: 'Rayon', slug: 'rayon', pricePerMetre: 320 },
          { fabricType: 'Polyester', slug: 'polyester', pricePerMetre: 250 },
          { fabricType: 'Silk', slug: 'silk', pricePerMetre: 450 },
          { fabricType: 'Woollen', slug: 'woollen', pricePerMetre: 380 },
          { fabricType: 'Linen', slug: 'linen', pricePerMetre: 400 },
          { fabricType: 'Nylon', slug: 'nylon', pricePerMetre: 240 },
          { fabricType: 'Acrylic', slug: 'acrylic', pricePerMetre: 220 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-base text-emerald-100">
            Professional weaving solutions tailored to your fabric needs. Excellence in every weave.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-20">
        {/* Weaving Subheading */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-xl font-bold text-emerald-900 mb-8">Weaving Services</h2>
          <p className="text-sm text-emerald-700/80 mb-8 leading-relaxed">
            Our state-of-the-art weaving facility features high-speed automated looms capable of producing various fabric 
            types and patterns. Quality control is maintained at every stage to ensure superior fabric quality.
          </p>
        </div>

        {/* Cloth Types Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-emerald-600">Loading pricing data...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">⚠️ {error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {clothTypes.map((cloth, index) => (
              <div 
                key={index} 
                className="group bg-white border border-emerald-100 rounded-xl overflow-hidden hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-b from-emerald-100 to-emerald-50">
                  <div 
                    className="h-full w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                    style={{ backgroundImage: `url(${clothImages[cloth.slug]})` }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">{cloth.fabricType}</h3>
                  <p className="text-emerald-600 font-semibold mb-3">₹{cloth.pricePerMetre}/metre</p>
                  <p className="text-emerald-700/80 mb-4 leading-relaxed text-sm flex-grow">
                    Professional weaving service specifically designed for {cloth.fabricType.toLowerCase()}. Get optimal results with our specialized automated loom technology.
                  </p>

                  {/* CTA Button */}
                  <Link 
                    to={`/products/weaving/${cloth.slug}`} 
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition shadow-md text-sm w-full"
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
        <div className="mt-8 text-center max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl p-12 shadow-xl">
          <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-sm text-emerald-100 mb-8">Book your weaving service today and experience excellence</p>
          <Link 
            to="/booking" 
            className="inline-block bg-white text-emerald-700 px-10 py-3.5 rounded-lg font-semibold hover:bg-emerald-50 transition shadow-lg hover:shadow-xl"
          >
            Book Service Now
          </Link>
        </div>
      </div>
    </div>
  );
}
