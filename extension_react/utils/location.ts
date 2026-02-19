export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}

const GPS_DENIED_KEY = 'gpsPermissionDenied';
const GPS_TIMEOUT_MS = 10_000;
const PERMISSION_DENIED_CODE = 1;

/** Check if the user previously denied GPS permission. */
async function wasGPSDenied(): Promise<boolean> {
  try {
    const result = await browser.storage.local.get(GPS_DENIED_KEY);
    return result[GPS_DENIED_KEY] === true;
  } catch {
    return false;
  }
}

/** Persist GPS permission denial flag. */
async function setGPSDenied(denied: boolean): Promise<void> {
  try {
    await browser.storage.local.set({ [GPS_DENIED_KEY]: denied });
  } catch { /* non-critical */ }
}

/** Get location from browser Geolocation API. */
function getGPSLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      (err) => reject(err),
      { timeout: GPS_TIMEOUT_MS, enableHighAccuracy: true },
    );
  });
}

/** Get approximate location from IP address via ipapi.co. */
async function getIPLocation(): Promise<UserLocation> {
  const res = await fetch('https://ipapi.co/json/');
  if (!res.ok) throw new Error(`IP geolocation failed: ${res.status}`);

  const data = await res.json();
  if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    throw new Error('IP geolocation returned no coordinates');
  }

  return {
    lat: data.latitude,
    lng: data.longitude,
    ...(data.city && { city: data.city }),
    ...(data.country_name && { country: data.country_name }),
  };
}

/**
 * Get the user's location – tries GPS first, falls back to IP geolocation.
 * Remembers if the user denied GPS so we don't re-prompt.
 */
export async function getUserLocation(): Promise<UserLocation | null> {
  const gpsDenied = await wasGPSDenied();

  if (!gpsDenied) {
    try {
      const location = await getGPSLocation();
      await setGPSDenied(false);
      return location;
    } catch (err: any) {
      if (err.code === PERMISSION_DENIED_CODE) {
        await setGPSDenied(true);
      }
    }
  }

  try {
    return await getIPLocation();
  } catch {
    console.warn('[Location] All providers failed');
    return null;
  }
}
