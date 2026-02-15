import React from 'react';
import { HeroSectionProps, Place } from './HeroSection';
import { UserLocation } from '../../utils/location';
import { C_TEXT_SECONDARY, C_BORDER } from '../../utils/styles';
import styles from './ScrollArea.module.css'

// TODO: Unsafe, overwork this
const getDirectionsEmbedUrl = (origin: UserLocation | null, dest: Place | null) => {
    if (origin && dest) {
      return `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_CONFIG.API_KEY}&origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lon}&mode=walking&zoom=15`;
    }
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_CONFIG.API_KEY}&q=Munich&zoom=15`;
  };

interface ExpandedHeroSectionProps {
    places: Place[];
    userLocation: UserLocation | null;
    isLoading: boolean;
}

const ExpandedHeroSection: React.FC<ExpandedHeroSectionProps> = (props: ExpandedHeroSectionProps) => {
    const sortedPlaces: Place[] = props.places
    const userLocation: UserLocation | null = props.userLocation;

    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    useEffect(() => {
        if (sortedPlaces && sortedPlaces.length > 0 && !selectedPlace) {
        setSelectedPlace(sortedPlaces[0]);
        }
    }, [sortedPlaces]);


    return (
        <>
        <div className="vp-expanded-section" style={{ marginTop: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'stretch', height: '450px' }}>
              <div className={styles.hideScroll + " vp-places-list"} style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto', borderRadius: '16px'}}>
                {props.isLoading ? (
                  <div style={{ color: C_TEXT_SECONDARY, fontStyle: 'italic' }}>Lädt Geschäfte...</div>
                ) : sortedPlaces.length > 0 ? (
                  sortedPlaces.slice(0, 5).map((place, idx) => (
                    <StoreCard key={idx} place={place} onSelect={(lat, lon) => setSelectedPlace(place)} />
                  ))
                ) : (
                  <div style={{ color: C_TEXT_SECONDARY }}>Keine Geschäfte gefunden</div>
                )}
              </div>

              <div className="vp-map" style={{
                width: '100%',
                height: '100%',
                minHeight: '400px',
                border: `2px solid ${C_BORDER}`,
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(255, 155, 84, 0.08)',
                position: 'sticky',
                top: '20px',
              }}>
                <iframe
                  className="vp-iframe"
                  src={getDirectionsEmbedUrl(userLocation, selectedPlace)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Route zum Geschäft"
                ></iframe>
              </div>
            </div>
          </div>
        </>
    )
}
export default ExpandedHeroSection;
