import React, { useState } from 'react';
import { Mail, Send, ExternalLink, FileText, HelpCircle, Shield, Phone } from 'lucide-react';

const SiteNavigationSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // In a real app, this would send the email to your backend
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const navigationLinks = [
    {
      category: "Platform",
      links: [
        { name: "Dashboard", href: "#", description: "Main analytics interface" },
        { name: "Strategy Library", href: "#", description: "Browse and manage strategies" },
        { name: "Backtesting Tools", href: "#", description: "Test your strategies" },
        { name: "Portfolio Manager", href: "#", description: "Manage your investments" }
      ]
    },
    {
      category: "Resources",
      links: [
        { name: "Documentation", href: "#", description: "Complete platform guides", icon: <FileText size={16} /> },
        { name: "API Reference", href: "#", description: "Developer documentation", icon: <ExternalLink size={16} /> },
        { name: "Trading Guides", href: "#", description: "Educational content", icon: <FileText size={16} /> },
        { name: "Indicator Reference", href: "#", description: "Technical analysis guide", icon: <FileText size={16} /> }
      ]
    },
    {
      category: "Support",
      links: [
        { name: "Help Center", href: "#", description: "Get answers quickly", icon: <HelpCircle size={16} /> },
        { name: "Contact Support", href: "#", description: "Reach our team", icon: <Phone size={16} /> },
        { name: "Community Forum", href: "#", description: "Connect with traders", icon: <ExternalLink size={16} /> },
        { name: "Video Tutorials", href: "#", description: "Learn visually", icon: <ExternalLink size={16} /> }
      ]
    },
    {
      category: "Legal",
      links: [
        { name: "Privacy Policy", href: "#", description: "How we protect your data", icon: <Shield size={16} /> },
        { name: "Terms of Service", href: "#", description: "Usage agreements", icon: <FileText size={16} /> },
        { name: "Security", href: "#", description: "Platform security info", icon: <Shield size={16} /> },
        { name: "Compliance", href: "#", description: "Regulatory information", icon: <FileText size={16} /> }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", color: "#1da1f2" },
    { name: "LinkedIn", href: "#", color: "#0077b5" },
    { name: "YouTube", href: "#", color: "#ff0000" },
    { name: "Discord", href: "#", color: "#7289da" }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Stay Connected
        </h2>
      </div>


      {/* Compact Navigation with Email Signup */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        {/* Navigation Links - 4 columns */}
        {navigationLinks.map((category) => (
          <div key={category.category}>
            <h3 className="text-md font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block group"
                >
                  <div className="flex items-start space-x-2">
                    {link.icon && (
                      <div className="mt-0.5 opacity-60">
                        {React.cloneElement(link.icon, { size: 14 })}
                      </div>
                    )}
                    <div>
                      <div 
                        className="text-sm font-medium group-hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {link.name}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
        
        {/* Email Signup - 1 column */}
        <div>
          <h3 className="text-md font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Stay Updated
          </h3>
          
          {!isSubscribed ? (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-1"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded text-sm font-medium text-white transition-colors duration-200 hover:opacity-90 flex items-center justify-center space-x-1"
                style={{ backgroundColor: 'var(--highlight)' }}
              >
                <Send size={12} />
                <span>Join</span>
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>
                Subscribed ✓
              </p>
            </div>
          )}
          
          <div className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Weekly insights
          </div>
        </div>
      </div>

      {/* Social Links and Footer */}
      <div className="text-center">
        <div className="flex justify-center space-x-3 mb-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs transition-transform hover:scale-110"
              style={{ backgroundColor: social.color }}
            >
              {social.name.charAt(0)}
            </a>
          ))}
        </div>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Built by traders, for traders • Since 2024
        </p>
      </div>
    </section>
  );
};

export default SiteNavigationSection;