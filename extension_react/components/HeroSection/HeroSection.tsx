import React, { useState, useEffect } from 'react';
import { StoreCard } from '../StoreCard';
import { GOOGLE_MAPS_CONFIG } from '../../utils/config';
import { C_BG, C_ACCENT, C_TEXT, C_TEXT_SECONDARY, C_PRIMARY, C_BORDER, C_WHITE } from '../../utils/styles';
import { UserLocation } from '../../utils/location';
import CompactHeroSection from './CompactHeroSection';
import ExpandedHeroSection from './ExpandedHeroSection';

export interface Place {
  name: string;
  lat: number;
  lon: number;
  distance: string;
  duration?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: any;
  tags?: any;
  reviews?: any[];
  google_maps_url?: string;
}

export interface HeroSectionProps {
  data: { places: Place[] } | null;
  userLocation: UserLocation | null;
  isLoading: boolean;
}


const HeroSection: React.FC<HeroSectionProps> = ({ data, userLocation, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedPlaces: Place[] = data?.places ? [...data.places].sort((a, b) => {
    const getVal = (s: string) => {
      const match = s.match(/([\d.]+)\s*(km|m)/);
      if (!match) return Infinity;
      return match[2] === 'km' ? parseFloat(match[1]) : parseFloat(match[1]) / 1000;
    };
    return getVal(a.distance) - getVal(b.distance);
  }) : [];



  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  return (
    <div
      className={`vp-wrapper ${isExpanded ? 'vp-expanded' : ''}`}
      style={{
        width: '100%',
        position: 'relative',
        marginBottom: '20px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <div
        id="vom-platzl-hero-section"
        className={isExpanded ? 'vp-expanded' : ''}
        onClick={handleExpand}
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          margin: '0 auto',
          padding: isExpanded ? '36px 48px' : '24px 32px',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: 'relative',
          zIndex: 10,
          display: 'block',
          border: 'none',
          borderRadius: '16px',
          overflow: 'hidden',
          background: C_BG,
          boxShadow: '0 2px 8px rgba(255, 155, 84, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 600, color: C_ACCENT, marginBottom: '8px', display: 'inline-block' }}>In deiner Nähe verfügbar</span>

        <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 600, lineHeight: 1.3, color: C_TEXT }}>
          Vom Platzl - Lokale Produkte entdecken
        </h3>

        <div style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.5, color: C_TEXT_SECONDARY }}>
          Finde diese Produkte in Geschäften in deiner Umgebung.
        </div>
        
        {isExpanded ? (
          <ExpandedHeroSection 
            places={sortedPlaces} 
            userLocation={userLocation} 
            isLoading={isLoading} 
          />
        ) : (
          <CompactHeroSection />
        )}

        {isExpanded && (
          <button
            id="vp-minimize-btn"
            onClick={handleMinimize}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: C_PRIMARY,
              color: C_WHITE,
              border: 0,
              padding: '10px 18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              zIndex: 20,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(255, 155, 84, 0.3)',
            }}
          >
            ✕ Schließen
          </button>
        )}
      </div>
    </div>
  );
};


export default HeroSection;