// TODO: own location react hook / globla state
export interface LocationData {
  latitude: number;
  longitude: number;
  source: 'gps' | 'ip';
  accuracy?: number;
  city?: string;
  region?: string;
  country?: string;
}

interface CachedIPLocation {
  data: LocationData;
  timestamp: number;
}

const IP_CACHE_KEY = 'ipLocationCache';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 mins

/**
 * Get cached IP location from local storage
 */
function getCachedIPLocation(): LocationData | null {
  try {
    const cached = localStorage.getItem(IP_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CachedIPLocation = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION_MS) {
      console.info('Using cached IP location');
      return data;
    }

    // Cache expired
    localStorage.removeItem(IP_CACHE_KEY);
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Save IP location to local storage
 */
function cacheIPLocation(location: LocationData): void {
  try {
    const cached: CachedIPLocation = {
      data: location,
      timestamp: Date.now()
    };
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify(cached));
  } catch (error) {}
}

/**
 * Get location from IP address using a geolocation API
 */
async function getLocationFromIP(): Promise<LocationData> {
  // Check cache first
  const cached = getCachedIPLocation();
  if (cached) {
    return cached;
  }

  try {
    // Using ip-api.com which is free, supports CORS, and has better rate limits
    const response = await fetch('http://ip-api.com/json/');
    
    if (!response.ok) {
      throw new Error(`IP geolocation failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(data.message || 'IP geolocation failed');
    }
    
    const location : LocationData = {
      latitude: data.lat,
      longitude: data.lon,
      source: 'ip',
      city: data.city,
      region: data.regionName,
      country: data.country
    };

    // Cache the result
    cacheIPLocation(location);
    
    return location;

  } catch (error) {
    console.error('Failed to get location from IP:', error);
    throw new Error('Could not determine location from IP address');
  }
}

/**
 * Get location from GPS/browser geolocation API
 */
function getLocationFromGPS(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: 'gps'
        });
      },
      (error) => {
        let errorMessage = 'Failed to get GPS location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Request user location with GPS permission, fallback to IP if denied
 */
export async function requestUserLocation(): Promise<LocationData | null> {
  const ipLocation: LocationData | null = await getLocationFromIP().catch(error => {
    console.error('IP-based location failed:', error);
    return null
  });
  
  const gpsLocation = await getLocationFromGPS().catch(error => {
    console.warn('GPS failed, using IP-based location:', error);
    return null;
  });


  if (gpsLocation) {
    return {
      ...gpsLocation,
      city: ipLocation?.city,
      region: ipLocation?.region,
      country: ipLocation?.country
    }    
  }
  return ipLocation;
}


export function getLocationStatusString(location: LocationData | null): { key: string; params?: Record<string, string> } {
    if (!location) {
        return { key: 'location.noLocation' };
    }
    if (location.city && location.country) {
        return {
            key: 'location.cityCountry',
            params: {
                city: location.city,
                country: location.country,
                source: location.source === 'gps' ? 'GPS' : 'IP',
            },
        };
    } else {
        return {
            key: 'location.available',
            params: {
                source: location.source === 'gps' ? 'GPS' : 'IP',
            },
        };
    }
}

/**
 * Check if location permission has been granted
 */
export async function checkLocationPermission(): Promise<PermissionState> {
  if (!navigator.permissions) {
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch (error) {
    console.warn('Could not check location permission:', error);
    return 'prompt';
  }
}
