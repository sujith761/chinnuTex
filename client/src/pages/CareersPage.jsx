import { useState } from 'react';

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: 'Process Engineer',
      department: 'Engineering',
      type: 'Full-time',
      experience: '3+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Optimize sizing and weaving workflows with data-driven process improvements',
      responsibilities: [
        'Develop and implement process improvements for sizing operations',
        'Analyze production data to identify optimization opportunities',
        'Collaborate with operations team to troubleshoot technical issues',
        'Ensure compliance with quality standards and safety protocols'
      ],
      requirements: [
        'Bachelor\'s degree in Chemical/Textile Engineering',
        'Minimum 3 years of experience in textile processing',
        'Strong analytical and problem-solving skills',
        'Knowledge of sizing and weaving processes'
      ]
    },
    {
      id: 2,
      title: 'Quality Control Specialist',
      department: 'Operations',
      type: 'Full-time',
      experience: '2+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Ensure compliance with international standards and customer specifications',
      responsibilities: [
        'Conduct quality inspections on sized yarns and woven fabrics',
        'Document and report quality metrics and deviations',
        'Implement quality control procedures and standards',
        'Train staff on quality requirements and best practices'
      ],
      requirements: [
        'Diploma/Degree in Textile Technology or related field',
        'Minimum 2 years of experience in textile quality control',
        'Familiarity with testing equipment and procedures',
        'Attention to detail and strong communication skills'
      ]
    },
    {
      id: 3,
      title: 'Operations Manager',
      department: 'Management',
      type: 'Full-time',
      experience: '5+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Lead day-to-day operations and drive continuous improvement initiatives',
      responsibilities: [
        'Oversee all sizing and weaving production activities',
        'Manage and mentor operations team members',
        'Develop and implement operational strategies',
        'Monitor KPIs and drive performance improvements'
      ],
      requirements: [
        'Bachelor\'s degree in Textile Engineering/Management',
        'Minimum 5 years of operations management experience',
        'Strong leadership and team management skills',
        'Proven track record of process optimization'
      ]
    },
    {
      id: 4,
      title: 'Maintenance Technician',
      department: 'Technical',
      type: 'Full-time',
      experience: '2+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Maintain and repair sizing and weaving machinery for optimal performance',
      responsibilities: [
        'Perform preventive maintenance on sizing and weaving equipment',
        'Diagnose and repair mechanical/electrical issues',
        'Maintain maintenance logs and documentation',
        'Coordinate with vendors for spare parts and services'
      ],
      requirements: [
        'ITI/Diploma in Mechanical/Electrical Engineering',
        'Minimum 2 years of experience in textile machinery maintenance',
        'Strong troubleshooting and repair skills',
        'Knowledge of PLC and automation systems preferred'
      ]
    },
    {
      id: 5,
      title: 'Sizing Operator',
      department: 'Production',
      type: 'Full-time',
      experience: '1+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Operate sizing machines and ensure quality yarn processing for weaving',
      responsibilities: [
        'Operate and monitor sizing machines for optimal performance',
        'Prepare sizing solution according to specifications',
        'Conduct quality checks on sized yarns',
        'Maintain production records and daily reports',
        'Follow safety protocols and maintain clean work environment'
      ],
      requirements: [
        'High school diploma or equivalent',
        'Minimum 1 year of experience in textile sizing operations',
        'Knowledge of different yarn types and sizing requirements',
        'Ability to work in shifts and meet production targets',
        'Good attention to detail and quality consciousness'
      ]
    },
    {
      id: 6,
      title: 'Weaving Operator',
      department: 'Production',
      type: 'Full-time',
      experience: '1+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Operate weaving looms and produce high-quality woven fabrics',
      responsibilities: [
        'Operate and monitor weaving looms efficiently',
        'Set up looms with proper warp and weft threads',
        'Identify and fix weaving defects promptly',
        'Perform routine loom maintenance and adjustments',
        'Ensure production targets and quality standards are met'
      ],
      requirements: [
        'High school diploma or equivalent',
        'Minimum 1 year of experience in weaving operations',
        'Knowledge of different weaving patterns and fabric types',
        'Ability to work in shifts and handle physical demands',
        'Strong problem-solving skills and attention to detail'
      ]
    }
  ];

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Competitive Wages',
      description: 'Fair pay with overtime and incentive bonuses'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Health & Safety',
      description: 'Medical insurance, ESI, and safe working conditions'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Skill Training',
      description: 'On-the-job training and technical skill development'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Shift Flexibility',
      description: 'Rotating shifts with weekly offs and festival holidays'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Growth Opportunities',
      description: 'Promotion from operator to supervisor roles'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Supportive Team',
      description: 'Respectful workplace with experienced supervisors'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Join Our Growing Team
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
            Shape the future of textile processing with Chinnu Tex
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Erode, Tamil Nadu</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{jobs.length} Open Positions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Why Join Chinnu Tex?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We offer more than just a job - we provide a career path with growth opportunities</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-11 h-11 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center text-white mb-3">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="py-16 px-4 bg-gradient-to-b from-white/50 to-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Open Positions</h2>
            <p className="text-gray-600">Find the perfect role that matches your skills and passion</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{job.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{job.description}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.department}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {job.experience}
                    </span>
                    <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                  </div>

                  <button className="w-full py-2.5 bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-lg font-medium hover:from-slate-700 hover:to-gray-700 transition-all flex items-center justify-center gap-2">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-14 bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Make an Impact?</h2>
          <p className="text-base text-white/80 mb-6 max-w-2xl mx-auto">
            Don't see the perfect role? Send us your resume anyway. We're always looking for talented individuals.
          </p>
          <a 
            href="mailto:careers@chinnutex.com" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-lg font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Your Resume
          </a>
          <p className="text-white/60 mt-3 text-sm">careers@chinnutex.com</p>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-slate-600 to-gray-600 p-5 text-white z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-lg text-sm font-medium">
                      {selectedJob.department}
                    </span>
                    <span className="px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-lg text-sm font-medium">
                      {selectedJob.type}
                    </span>
                    <span className="px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-lg text-sm font-medium">
                      {selectedJob.experience}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/25 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{selectedJob.location}</span>
                </div>
                <p className="text-gray-700">{selectedJob.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <a 
                  href="mailto:careers@chinnutex.com?subject=Application for {selectedJob.title}"
                  className="flex-1 py-3 bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-lg font-semibold text-center hover:from-slate-700 hover:to-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Apply Now
                </a>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
