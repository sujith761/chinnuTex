import { Link } from 'react-router-dom';
import { useState } from 'react';
import services from '../data/services';

export default function WeavingServicesPage() {
  const [quantities, setQuantities] = useState({});

  const incrementQuantity = (fabricType) => {
    setQuantities(prev => ({
      ...prev,
      [fabricType]: (prev[fabricType] || 0) + 1
    }));
  };

  const decrementQuantity = (fabricType) => {
    setQuantities(prev => ({
      ...prev,
      [fabricType]: Math.max(0, (prev[fabricType] || 0) - 1)
    }));
  };

  // Get the weaving service
  const weavingService = services.find(s => s.slug === 'weaving') || services[1];

  // Map fabric types to suitable images
  const fabricImages = {
    'Cotton fabric': 'https://images.unsplash.com/photo-1599122762299-5e85c0a36c0c?w=600&h=400&fit=crop',
    'Rayon fabric': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop',
    'Polyester fabric': 'https://images.unsplash.com/photo-1578771746014-b94066fb4578?w=600&h=400&fit=crop',
    'Silk fabric': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=400&fit=crop',
    'Woollen fabric': 'https://images.unsplash.com/photo-1575634662424-d3150ddef644?w=600&h=400&fit=crop',
    'Linen fabric': 'https://images.unsplash.com/photo-1599122765355-52d81e58c6ef?w=600&h=400&fit=crop',
    'Nylon fabric': 'https://images.unsplash.com/photo-1574701148211-c798a4018fe3?w=600&h=400&fit=crop',
    'Acrylic fabric': 'https://images.unsplash.com/photo-1611987720121-46c63300e859?w=600&h=400&fit=crop'
  };

  // Pricing for fabric types (Service pricing - higher than product pricing)
  const fabricPricing = {
    'Cotton fabric': 380,
    'Rayon fabric': 420,
    'Polyester fabric': 350,
    'Silk fabric': 580,
    'Woollen fabric': 480,
    'Linen fabric': 520,
    'Nylon fabric': 340,
    'Acrylic fabric': 320
  };

  return (
    <div className="min-h-screen bg-stone-50 font-serif selection:bg-emerald-200">
      {/* Hero Header */}
      <div className="relative bg-emerald-950 text-white overflow-hidden py-24 border-b-4 border-yellow-600">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-900 to-transparent opacity-60"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1 mb-6 border border-emerald-700 rounded-full bg-emerald-900/50 backdrop-blur-sm">
            <span className="text-emerald-300 text-xs font-bold uppercase tracking-[0.2em]">Service Division</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-serif">
            Expert Weaving Services
          </h1>
          <p className="text-lg text-emerald-200/80 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Leverage our state-of-the-art automated looms. We transform your raw materials into exquisite fabrics with precision and care.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-20">

        {/* Service Intro */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="md:w-1/2">
            <div className="relative rounded-lg overflow-hidden shadow-2xl border-2 border-emerald-900/10">
              <img src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80" alt="Loom Machine" className="w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">Advanced Machinery</h3>
                  <p className="text-emerald-200 text-sm">Our facility is equipped with the latest European looms.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-emerald-950 font-serif">{weavingService?.title || 'Weaving Service'}</h2>
            <div className="w-20 h-1 bg-yellow-500"></div>
            <p className="text-emerald-900/70 text-lg leading-relaxed">
              {weavingService?.summary || 'Professional weaving services using state-of-the-art automated looms for various fabric types.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <span className="text-yellow-600">✓</span> Custom Patterns
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <span className="text-yellow-600">✓</span> Rapid Turnaround
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <span className="text-yellow-600">✓</span> Quality Testing
              </div>
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <span className="text-yellow-600">✓</span> Bulk Processing
              </div>
            </div>
          </div>
        </div>

        {/* Fabric Types Grid */}
        <h3 className="text-2xl font-bold text-center text-emerald-950 mb-12 font-serif relative">
          <span className="bg-stone-50 px-4 relative z-10">Available Service Options</span>
          <span className="absolute left-0 top-1/2 w-full h-px bg-emerald-900/20 -z-0"></span>
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(weavingService?.bullets || []).map((fabricType, index) => (
            <div
              key={index}
              className="group bg-white rounded-lg overflow-hidden shadow-lg border border-emerald-100 hover:border-emerald-300 transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-emerald-900/0 transition-colors z-10"></div>
                <img
                  src={fabricImages[fabricType]}
                  alt={fabricType}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-0 right-0 bg-yellow-500 text-emerald-950 text-xs font-bold px-3 py-1 m-2 rounded-sm shadow-md">
                  SERVICE
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-emerald-900 mb-2 font-serif">
                  {fabricType} weaving
                </h3>
                <p className="text-xs text-emerald-600 mb-4 uppercase tracking-wide">Premium Contract Weaving</p>

                {/* Price */}
                <div className="mb-4 bg-stone-50 p-3 rounded-md border border-stone-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-stone-500">Service Cost</span>
                    <span className="text-xl font-bold text-emerald-700">
                      ₹{((quantities[fabricType] || 0) > 0 ? fabricPricing[fabricType] * quantities[fabricType] : fabricPricing[fabricType]).toFixed(2)}
                    </span>
                  </div>
                  {(quantities[fabricType] || 0) > 0 && (
                    <div className="text-right text-xs text-stone-400 mt-1">({quantities[fabricType]}m × ₹{fabricPricing[fabricType]})</div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="mt-auto">
                  {(quantities[fabricType] || 0) === 0 ? (
                    <button
                      onClick={() => incrementQuantity(fabricType)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-800 text-white px-4 py-2.5 rounded hover:bg-emerald-700 transition shadow-sm font-medium text-sm"
                    >
                      <span>Select Service</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  ) : (
                    <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center justify-between gap-2 bg-white p-1 rounded border border-emerald-200">
                        <button
                          onClick={() => decrementQuantity(fabricType)}
                          className="w-8 h-8 flex items-center justify-center bg-stone-100 text-stone-600 rounded hover:bg-stone-200 transition"
                        >
                          -
                        </button>
                        <span className="text-base font-bold text-emerald-950">
                          {quantities[fabricType]}m
                        </span>
                        <button
                          onClick={() => incrementQuantity(fabricType)}
                          className="w-8 h-8 flex items-center justify-center bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                        >
                          +
                        </button>
                      </div>
                      <Link
                        to="/booking"
                        state={{
                          type: 'service',
                          category: 'weaving',
                          item: fabricType,
                          itemSlug: fabricType.toLowerCase().replace(/\s+/g, '-'),
                          price: fabricPricing[fabricType],
                          unit: 'metre',
                          quantity: quantities[fabricType]
                        }}
                        className="block text-center w-full bg-yellow-600 text-white px-4 py-2 rounded shadow-md font-bold text-sm hover:bg-yellow-500 transition-colors"
                      >
                        Book Service
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
