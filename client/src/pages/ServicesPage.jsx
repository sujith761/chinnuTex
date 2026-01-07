import { Link } from 'react-router-dom';
import services from '../data/services';

export default function ServicesPage() {
  // Get the first service (Warp Sizing)
  const mainService = services[0];
  
  // Map yarn types to suitable images
  const yarnImages = {
    'Cotton yarn': 'https://images.unsplash.com/photo-1599122762299-5e85c0a36c0c?w=600&h=400&fit=crop',
    'Polyester yarn': 'https://images.unsplash.com/photo-1578771746014-b94066fb4578?w=600&h=400&fit=crop',
    'Viscose (Rayon) yarn': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=400&fit=crop',
    'Polyester–Cotton (PC) blended yarn': 'https://images.unsplash.com/photo-1608919291141-a0659c826505?w=600&h=400&fit=crop',
    'Polyester–Viscose (PV) blended yarn': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=400&fit=crop',
    'Nylon yarn': 'https://images.unsplash.com/photo-1574701148211-c798a4018fe3?w=600&h=400&fit=crop',
    'Acrylic yarn': 'https://images.unsplash.com/photo-1611987720121-46c63300e859?w=600&h=400&fit=crop'
  };

  // Pricing for yarn types
  const yarnPricing = {
    'Cotton yarn': 450,
    'Polyester yarn': 520,
    'Viscose (Rayon) yarn': 480,
    'Polyester–Cotton (PC) blended yarn': 510,
    'Polyester–Viscose (PV) blended yarn': 490,
    'Nylon yarn': 550,
    'Acrylic yarn': 470
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/30">
      {/* Hero Header */}
      <div className="py-20 px-4 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-base text-primary-100">
            Professional fabric processing solutions tailored to your needs. Excellence in every process.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-20">
        {/* Warp Sizing Subheading */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-8">{mainService.title}</h2>
          <p className="text-lg text-primary-700/80 mb-8 leading-relaxed">{mainService.summary}</p>
        </div>

        {/* Yarn Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {mainService.bullets.map((yarnType, index) => (
            <div 
              key={index} 
              className="group bg-white border border-primary-100 rounded-xl overflow-hidden hover:shadow-2xl hover:border-primary-300 transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-b from-primary-100 to-primary-50">
                <div 
                  className="h-full w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300" 
                  style={{ backgroundImage: `url(${yarnImages[yarnType]})` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary-900 mb-2">{yarnType}</h3>
                <p className="text-primary-700 font-semibold mb-3">₹{yarnPricing[yarnType]}/kg</p>
                <p className="text-primary-700/80 mb-4 leading-relaxed text-sm flex-grow">
                  Professional {mainService.title.toLowerCase()} service specifically designed for {yarnType.toLowerCase()}. Get optimal results with our specialized processing techniques.
                </p>

                {/* CTA Button */}
                <Link 
                  to={`/services/${mainService.slug}`} 
                  className="inline-flex items-center justify-center gap-2 bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-800 transition shadow-md text-sm w-full"
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

        {/* Bottom CTA */}
        <div className="mt-8 text-center max-w-4xl mx-auto bg-gradient-to-r from-primary-700 to-primary-800 text-white rounded-2xl p-12 shadow-xl">
          <h3 className="text-4xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-lg text-primary-100 mb-8">Book your sizing and weaving service today and experience excellence</p>
          <Link 
            to="/booking" 
            className="inline-block bg-white text-primary-800 px-10 py-3.5 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg hover:shadow-xl"
          >
            Book Service Now
          </Link>
        </div>
      </div>
    </div>
  );
}
