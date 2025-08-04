import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Portfolio Manager",
      company: "Alpine Capital",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "This platform transformed my trading strategy. The SATA scoring system helped me identify high-probability setups that increased my win rate from 65% to 82% in just 3 months.",
      results: "+127% Portfolio Return"
    },
    {
      id: 2,
      name: "David Chen",
      role: "Independent Trader",
      company: "Full-time Trader",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "The Stage Analysis integration is genius. I finally understand market cycles and when to enter/exit positions. My max drawdown dropped from -15% to -6%.",
      results: "Reduced Risk by 60%"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      role: "Quantitative Analyst",
      company: "Hedge Fund Pro",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "The resizable interface and comprehensive analytics save me hours every day. I can backtest entire portfolios and optimize strategies faster than ever before.",
      results: "3x Faster Analysis"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Trusted by Professional Traders
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          See how our platform has helped traders improve their performance and achieve consistent results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="relative p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-20">
              <Quote size={32} style={{ color: 'var(--highlight)' }} />
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {renderStars(testimonial.rating)}
            </div>

            {/* Testimonial Text */}
            <blockquote className="mb-6">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                "{testimonial.text}"
              </p>
            </blockquote>

            {/* Results Badge */}
            <div className="mb-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981'
                }}
              >
                {testimonial.results}
              </span>
            </div>

            {/* Author Info */}
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm mr-4"
              >
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                  {testimonial.name}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {testimonial.role}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {testimonial.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 text-center">
        <div className="flex items-center justify-center space-x-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>10,000+ Active Traders</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>$2.5B+ Backtested Volume</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>4.9/5 Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;