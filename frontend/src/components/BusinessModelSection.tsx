import React from 'react';
import { TrendingUp, Users, Zap, Shield, BarChart3, Target } from 'lucide-react';

const BusinessModelSection: React.FC = () => {
  const businessModels = [
    {
      id: 1,
      title: "Professional Trader",
      description: "Individual traders seeking systematic strategy development",
      features: [
        "Personal backtesting environment",
        "Strategy optimization tools",
        "Risk management framework",
        "Performance analytics"
      ],
      pricing: "$99/month",
      icon: <TrendingUp size={32} style={{ color: 'var(--highlight)' }} />,
      popular: false
    },
    {
      id: 2,
      title: "Institutional Fund",
      description: "Hedge funds and asset managers requiring enterprise solutions",
      features: [
        "Multi-strategy portfolio testing",
        "Team collaboration tools",
        "Custom indicator development",
        "Compliance reporting",
        "API integration",
        "Dedicated support"
      ],
      pricing: "Custom Pricing",
      icon: <BarChart3 size={32} style={{ color: 'var(--highlight)' }} />,
      popular: true
    },
    {
      id: 3,
      title: "Algo Trading Firm",
      description: "Quantitative firms building systematic trading systems",
      features: [
        "High-frequency backtesting",
        "Advanced optimization engines",
        "Multi-asset class support",
        "Real-time strategy monitoring",
        "Custom infrastructure"
      ],
      pricing: "Contact Sales",
      icon: <Zap size={32} style={{ color: 'var(--highlight)' }} />,
      popular: false
    }
  ];

  const valuePropositions = [
    {
      icon: <Shield size={24} style={{ color: '#10b981' }} />,
      title: "Risk-First Approach",
      description: "Built-in risk management ensures capital preservation while maximizing returns"
    },
    {
      icon: <Target size={24} style={{ color: '#3b82f6' }} />,
      title: "Precision Analytics",
      description: "SATA scoring and Stage Analysis provide precise entry/exit signals"
    },
    {
      icon: <Users size={24} style={{ color: '#8b5cf6' }} />,
      title: "Community Driven",
      description: "Learn from thousands of professional traders sharing strategies and insights"
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Business Model & Pricing
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Scalable solutions for traders at every level, from individual professionals to large institutions
        </p>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {valuePropositions.map((prop, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-3">
              {prop.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {prop.title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {prop.description}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {businessModels.map((model) => (
          <div
            key={model.id}
            className={`relative p-6 rounded-xl border hover:shadow-lg transition-all duration-300 ${
              model.popular ? 'ring-2' : ''
            }`}
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: model.popular ? 'var(--highlight)' : 'var(--border)',
              ringColor: model.popular ? 'var(--highlight)' : 'transparent'
            }}
          >
            {model.popular && (
              <div
                className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: 'var(--highlight)' }}
              >
                Most Popular
              </div>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-4">
              {model.icon}
            </div>

            {/* Title and Description */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {model.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {model.description}
              </p>
              <div className="text-2xl font-bold" style={{ color: 'var(--highlight)' }}>
                {model.pricing}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {model.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                model.popular 
                  ? 'text-white hover:opacity-90' 
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: model.popular ? 'var(--highlight)' : 'transparent',
                border: model.popular ? 'none' : '1px solid var(--border)',
                color: model.popular ? 'white' : 'var(--text-primary)'
              }}
            >
              {model.pricing === 'Custom Pricing' || model.pricing === 'Contact Sales' 
                ? 'Contact Sales' 
                : 'Start Free Trial'
              }
            </button>
          </div>
        ))}
      </div>

    </section>
  );
};

export default BusinessModelSection;