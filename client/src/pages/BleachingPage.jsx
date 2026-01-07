import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function BleachingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get('/products?processType=bleaching');
      setProducts(res.data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="relative py-20 px-4 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/products" className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white hover:bg-white/30 transition-all font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">Bleaching Chemicals</h1>
              <p className="text-base text-sky-100 mt-2">Pristine whites & neutral tones with eco-friendly processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-sky-100">
          <p className="text-gray-700 leading-relaxed text-sm">
            Our state-of-the-art bleaching process uses eco-friendly chemicals to achieve pristine whites and neutral tones. 
            We support hydrogen peroxide, sodium hypochlorite, and enzymatic bleaching to suit different fabric requirements. 
            Ideal for cotton, linen, synthetic blends, and more.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 border border-sky-100">
              {p.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-lg">
                    Bleaching
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{p.description}</p>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Paisa per meter</div>
                    <div className="text-2xl font-bold text-green-600">{p.ratePerMeter} p</div>
                  </div>
                </div>
                <Link to="/booking" className="block text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                  Book Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
