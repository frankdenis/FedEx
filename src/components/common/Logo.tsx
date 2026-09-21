import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  serviceVariant?: 'Express' | 'Ground' | 'Freight' | 'Custom Critical' | 'Global Enterprise';
  showSubtext?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  light = false,
  size = 'md',
  serviceVariant = 'Express',
  showSubtext = true,
}) => {
  // Variant accent colors for the "Ex" portion
  const variantColorMap = {
    Express: '#FF6600', // FedEx iconic Express orange
    Ground: '#007A33',  // FedEx Ground green
    Freight: '#DF1995', // FedEx Freight crimson
    'Custom Critical': '#00A8E8', // Custom Critical cyan
    'Global Enterprise': '#FF6600',
  };

  const exColor = variantColorMap[serviceVariant] || '#FF6600';
  const fedColor = light ? '#FFFFFF' : '#4D148C'; // Deep FedEx purple on light, crisp white/lavender on dark

  const sizeClasses = {
    sm: {
      text: 'text-xl',
      height: 'h-6',
      subtext: 'text-[9px]',
      badge: 'text-[9px] px-1.5 py-0.2',
    },
    md: {
      text: 'text-2xl sm:text-3xl',
      height: 'h-8 sm:h-9',
      subtext: 'text-[10px]',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      text: 'text-3xl sm:text-4xl',
      height: 'h-10 sm:h-12',
      subtext: 'text-xs',
      badge: 'text-xs px-2.5 py-0.5',
    },
    xl: {
      text: 'text-4xl sm:text-5xl lg:text-6xl',
      height: 'h-14 sm:h-16',
      subtext: 'text-sm',
      badge: 'text-sm px-3 py-1',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          {/* Authentic FedEx Brand Wordmark with precision geometry */}
          <div className="flex items-baseline font-black tracking-[-0.04em] font-sans" style={{ letterSpacing: '-0.06em' }}>
            <span
              className={`font-extrabold ${currentSize.text} leading-none`}
              style={{
                color: fedColor,
                fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                fontWeight: 900,
              }}
            >
              Fed
            </span>
            <div className="relative inline-flex items-baseline">
              <span
                className={`font-black ${currentSize.text} leading-none`}
                style={{
                  color: exColor,
                  fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                  fontWeight: 900,
                  marginLeft: '-0.02em',
                }}
              >
                Ex
              </span>
              {/* Subtle integrated optical indicator for premium showcase */}
              <span
                className="absolute right-[0.18em] top-1/2 -translate-y-1/2 pointer-events-none opacity-0"
                aria-hidden="true"
              >
                ➔
              </span>
            </div>
          </div>

          {/* Service Division Pill */}
          <span
            className={`ml-2 font-mono font-bold tracking-wider uppercase rounded-md border shadow-2xs ${currentSize.badge} ${
              light
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {serviceVariant}
          </span>
        </div>

        {showSubtext && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`font-mono font-semibold tracking-widest uppercase ${currentSize.subtext} ${
                light ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Global Logistics & Freight Fleet
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
