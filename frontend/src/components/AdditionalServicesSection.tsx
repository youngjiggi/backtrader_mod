import React, { useState } from 'react';
import { BookOpen, Users, Headphones, Code, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const AdditionalResourcesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const services = [
    {
      id: 1,
      title: "Strategy Consulting",
      description: "One-on-one sessions with professional traders to optimize your strategies",
      features: [
        "Personalized strategy review",
        "Risk assessment and optimization",
        "Market analysis coaching",
        "Custom indicator development"
      ],
      pricing: "$299/hour",
      icon: <Users size={32} style={{ color: 'var(--highlight)' }} />,
      category: "Professional Services"
    },
    {
      id: 2,
      title: "Trading Education",
      description: "Comprehensive courses covering strategy development and market analysis",
      features: [
        "Stan Weinstein Stage Analysis course",
        "SATA scoring system training",
        "Advanced backtesting techniques",
        "Portfolio management principles"
      ],
      pricing: "$499",
      icon: <BookOpen size={32} style={{ color: 'var(--highlight)' }} />,
      category: "Education"
    },
    {
      id: 3,
      title: "Custom Development",
      description: "Bespoke indicator and strategy development for your specific needs",
      features: [
        "Custom indicator creation",
        "Strategy automation",
        "API integrations",
        "Data pipeline setup"
      ],
      pricing: "Starting at $2,500",
      icon: <Code size={32} style={{ color: 'var(--highlight)' }} />,
      category: "Development"
    },
    {
      id: 4,
      title: "Premium Support",
      description: "Priority technical support with dedicated account management",
      features: [
        "24/7 priority support",
        "Dedicated account manager",
        "Strategy optimization reviews",
        "Monthly performance calls"
      ],
      pricing: "$199/month",
      icon: <Headphones size={32} style={{ color: 'var(--highlight)' }} />,
      category: "Support"
    },
    {
      id: 5,
      title: "Masterclass Series",
      description: "Monthly live sessions with industry experts and successful traders",
      features: [
        "Live trading sessions",
        "Q&A with experts",
        "Market outlook discussions",
        "Strategy deep dives"
      ],
      pricing: "$99/month",
      icon: <Calendar size={32} style={{ color: 'var(--highlight)' }} />,
      category: "Education"
    },
    {
      id: 6,
      title: "Certification Program",
      description: "Professional certification in systematic trading and strategy development",
      features: [
        "Comprehensive curriculum",
        "Hands-on projects",
        "Industry recognition",
        "Career placement assistance"
      ],
      pricing: "$1,999",
      icon: <Award size={32} style={{ color: 'var(--highlight)' }} />,
      category: "Certification"
    }
  ];

  const categories = Array.from(new Set(services.map(service => service.category)));

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Additional Resources
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Comprehensive support services to accelerate your trading success
        </p>
      </div>

      {/* Services Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - itemsPerView))}
            disabled={currentIndex === 0}
            className="p-2 rounded-full border transition-opacity"
            style={{
              borderColor: 'var(--border)',
              opacity: currentIndex === 0 ? 0.5 : 1
            }}
          >
            <ChevronLeft size={20} style={{ color: 'var(--text-primary)' }} />
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(services.length - itemsPerView, currentIndex + itemsPerView))}
            disabled={currentIndex >= services.length - itemsPerView}
            className="p-2 rounded-full border transition-opacity"
            style={{
              borderColor: 'var(--border)',
              opacity: currentIndex >= services.length - itemsPerView ? 0.5 : 1
            }}
          >
            <ChevronRight size={20} style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Services Grid */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${(currentIndex / itemsPerView) * 100}%)` }}
          >
            {services.map((service) => (
              <div key={service.id} className="flex-shrink-0 w-1/3 px-2">
                <div
                  className="p-4 rounded-xl border hover:shadow-lg transition-all duration-300 h-full"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    {React.cloneElement(service.icon, { size: 24 })}
                  </div>

                  {/* Title and Pricing */}
                  <div className="text-center mb-4">
                    <h4 className="text-md font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {service.title}
                    </h4>
                    <div className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>
                      {service.pricing}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-center mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {service.description}
                  </p>

                  {/* CTA Button */}
                  <button
                    className="w-full py-2 px-3 rounded-lg text-xs font-medium border transition-colors duration-200 hover:opacity-80"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default AdditionalResourcesSection;