import React, { useState } from 'react';
import { isOpenNow, getTimeUntilOpening } from '../utils/helpers';
import { C_PRIMARY, C_PRIMARY_LIGHT, C_TEXT, C_TEXT_SECONDARY, C_BORDER, C_BG_SECONDARY, C_SUCCESS_BG, C_ERROR_BG, C_SUCCESS, C_ERROR, C_SUCCESS_TEXT, C_ERROR_TEXT } from '../utils/styles';

interface Place {
  name: string;
  lat: number;
  lon: number;
  distance: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
    periods?: any[];
  };
  tags?: {
    vicinity?: string;
  };
  reviews?: any[];
  google_maps_url?: string;
}

// TODO: fix typing
const Review: React.FC<{review: any}> = ({review}) => {
  const commentMaxLenght = 100;
  const full_text = review.text || '';
  const truncated = full_text.length > 200 ? full_text.slice(0, 200) + '...' : full_text;
  const [truncatedState, setTruncatedState] = useState(false);
  return (
    <div
      style={{
        fontSize: '13px',
        color: C_TEXT_SECONDARY,
        marginBottom: '12px',
        padding: '12px 16px',
        background: C_BG_SECONDARY,
        borderRadius: '10px',
        borderLeft: `4px solid ${C_PRIMARY}`,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '8px', color: C_TEXT }}>
        {'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}
        <span style={{ marginLeft: '8px', color: C_TEXT_SECONDARY }}>
          {review.author_name || 'Anonymer Nutzer'}
        </span>
      </div>
      <div style={{ fontStyle: 'italic', lineHeight: 1.4, color: C_TEXT }}>
        {(truncatedState ? full_text : truncated) || 'Keine Bewertung verfügbar'}
        <span>
          ({full_text.length > commentMaxLenght && (
            <span
              onClick={() => {
                setTruncatedState(!truncatedState);
              }}
              style={{
                color: C_PRIMARY,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {truncatedState ? 'weniger' : 'mehr'}
            </span>
          )})
        </span>
      </div>
    </div>
  );
}


interface StoreCardProps {
  place: Place;
  onSelect: (lat: number, lon: number) => void;
}


export const StoreCard: React.FC<StoreCardProps> = ({ place, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const openNow = isOpenNow(place.opening_hours);
  const rating = place.rating ? `⭐ ${place.rating}` : '';
  const ratingCount = place.user_ratings_total ? ` (${place.user_ratings_total})` : '';

  const bestReview = place.reviews && place.reviews.length > 0 
    ? place.reviews.reduce((best, current) => (current.rating || 0) > (best.rating || 0) ? current : best)
    : null;

  return (
    <div
      onClick={() => onSelect(place.lat, place.lon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? 'rgba(255, 155, 84, 0.03)' : 'white',
        border: `1px solid ${C_BORDER}`,
        borderRadius: '14px',
        padding: '20px',
        boxShadow: isHovered ? '0 4px 12px rgba(255, 155, 84, 0.15), 0 2px 6px rgba(0, 0, 0, 0.05)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        borderColor: isHovered ? C_PRIMARY_LIGHT : C_BORDER,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: C_TEXT }}>
            {place.name || 'Unbekanntes Geschäft'}
          </h5>
          {place.tags?.vicinity && (
            <div style={{ fontSize: '13px', color: C_TEXT_SECONDARY, marginBottom: '4px' }}>
              {place.tags.vicinity}
            </div>
          )}
          <div style={{ fontSize: '13px', color: C_TEXT_SECONDARY, fontWeight: 500 }}>
            {place.distance || 'Entfernung unbekannt'}
          </div>
          {rating && (
            <div style={{ fontSize: '13px', color: C_TEXT_SECONDARY }}>
              {rating}{ratingCount}
            </div>
          )}
        </div>
      </div>

      {place.opening_hours && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: openNow ? C_SUCCESS_BG : C_ERROR_BG,
            borderRadius: '10px',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: openNow ? C_SUCCESS : C_ERROR,
            }}
          ></span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: openNow ? C_SUCCESS_TEXT : C_ERROR_TEXT,
            }}
          >
            {openNow ? 'Jetzt geöffnet' : getTimeUntilOpening(place.opening_hours)}
          </span>
        </div>
      )}

      {bestReview ? (
        <Review review={bestReview} /> 
      ) : (
        <div
          style={{
            fontSize: '13px',
            color: C_TEXT_SECONDARY,
            fontStyle: 'italic',
            marginBottom: '12px',
            padding: '8px 12px',
            background: C_BG_SECONDARY,
            borderRadius: '8px',
          }}
        >
          Keine Bewertungen verfügbar
        </div>
      )}

      <a
        href={place.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'white',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 600,
          padding: '10px 18px',
          background: C_PRIMARY,
          borderRadius: '10px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(255, 155, 84, 0.25)',
        }}
      >
        <span>In Google Maps öffnen</span>
      </a>
    </div>
  );
};