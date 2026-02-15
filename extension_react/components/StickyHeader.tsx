import React from 'react';
import { C_PRIMARY, C_WHITE } from '../utils/styles';

const StickyHeader = () => {
  return (
    <div
      id="vom-platzl-sticky-header"
      style={{
        position: 'relative',
        width: '100%',
        background: C_PRIMARY,
        color: C_WHITE,
        padding: '0 32px',
        height: '60px',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(255, 155, 84, 0.2)',
        fontFamily: 'arial, sans-serif',
        fontSize: '14px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
        <img
          src={browser.runtime.getURL('/logo.png')}
          alt="Lion Logo"
          style={{
            height: '32px',
            width: 'auto',
            objectFit: 'contain',
            marginRight: '16px',
          }}
        />
        <span
          style={{
            fontSize: '18px',
            fontWeight: 600,
            letterSpacing: '0.3px',
            padding: '0 20px',
            width: '100%',
            display: 'block',
            color: C_WHITE,
            position: 'relative',
            left: '-15px',
            top: '5px',
          }}
        >
          Kauf bei Local Heroes!
        </span>
      </div>

      

      <img
        src={browser.runtime.getURL('/Silhouette_of_Munich.svg-removebg-preview.png')}
        alt="Munich Skyline"
        style={{
          height: '50px',
          width: 'auto',
          marginLeft: '16px',
          marginTop: '10px',
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)',
        }}
      />
    </div>
  );
};
export default StickyHeader;