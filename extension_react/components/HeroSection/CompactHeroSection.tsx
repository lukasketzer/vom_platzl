import React from 'react';
import { Place } from './HeroSection';
import { UserLocation } from '../../utils/location';
import { C_BORDER, C_ACCENT, C_TEXT, C_TEXT_SECONDARY, C_PRIMARY } from '../../utils/styles';


// TODO: show closest store
const CompactHeroSection: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'space-between', width: '100%' }}>
      <div style={{
        width: '96px',
        height: '96px',
        background: 'white',
        border: `2px solid ${C_BORDER}`,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(255, 155, 84, 0.1)',
      }}>
        <img src={browser.runtime.getURL('/logo.png')} alt="Vom Platzl Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '8px' }} />
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: '0 16px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: C_ACCENT,
          color: 'white',
          padding: '6px 14px',
          borderRadius: '24px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '10px',
          boxShadow: '0 2px 6px rgba(255, 107, 53, 0.25)',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a className="vp-secondary-btn" style={{
              color: C_WHITE,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '10px 18px',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
              background: 'rgba(255, 155, 84, 0.08)',
            }}>
              Alle Geschäfte anzeigen →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactHeroSection;
