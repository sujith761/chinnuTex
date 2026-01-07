export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-emerald-600 opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-emerald-600">
            About Chinnu Tex
          </h1>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for professional sizing and weaving services
          </p>
        </div>
      </div>

      {/* Story Cards */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-l-8 border-sky-500 transform hover:scale-105 transition-all duration-300">
            <div className="p-10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Our Mission</h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Chinnu Tex is a premier textile processing company specializing in professional sizing and weaving services. 
                    We are committed to delivering superior quality products at competitive rates, helping textile manufacturers 
                    achieve excellence in their production processes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sizing Services Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-l-8 border-blue-500 transform hover:scale-105 transition-all duration-300">
            <div className="p-10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Sizing Services</h2>
                  <p className="text-gray-700 leading-relaxed text-sm mb-4">
                    Our advanced sizing process applies protective coatings to warp yarns, enhancing their strength, 
                    smoothness, and abrasion resistance. We specialize in sizing for various yarn types including:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-sky-600">✓</span> Cotton Yarn
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-600">✓</span> Polyester Yarn
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-600">✓</span> Viscose Yarn
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-600">✓</span> PC Blended Yarn
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-600">✓</span> PV Blended Yarn
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-600">✓</span> Nylon Yarn
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-sky-600">✓</span> Acrylic Yarn
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Weaving Services Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-l-8 border-emerald-500 transform hover:scale-105 transition-all duration-300">
            <div className="p-10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Weaving Services</h2>
                  <p className="text-gray-700 leading-relaxed text-sm mb-4">
                    Our state-of-the-art weaving facility features high-speed automated looms capable of producing various fabric 
                    types with consistent quality. We provide professional weaving solutions for:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-3 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Cotton Fabric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Rayon Fabric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Polyester Fabric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Silk Fabric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Woollen Fabric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Linen Fabric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Nylon Fabric
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span> Acrylic Fabric
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Excellence Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-l-8 border-teal-500 transform hover:scale-105 transition-all duration-300">
            <div className="p-10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Why Choose Chinnu Tex?</h2>
                  <p className="text-gray-700 leading-relaxed text-sm mb-4">
                    With cutting-edge technology, experienced professionals, and a commitment to quality, we deliver exceptional 
                    results for manufacturers across the textile industry.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-teal-600">✓</span> Advanced automated equipment
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-600">✓</span> Expert technical team
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-600">✓</span> Competitive pricing
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-600">✓</span> Quality assurance
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-600">✓</span> Timely delivery
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-600">✓</span> Eco-friendly processes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-3xl font-extrabold mb-2">500+</div>
              <div className="text-sky-100 text-sm">Satisfied Clients</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-3xl font-extrabold mb-2">15+</div>
              <div className="text-emerald-100 text-sm">Years Experience</div>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all">
              <div className="text-3xl font-extrabold mb-2">100%</div>
              <div className="text-teal-100 text-sm">Quality Assured</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
