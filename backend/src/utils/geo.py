from math import radians, sin, cos, atan2, sqrt, ceil


def get_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points on the Earth's surface
    using the Haversine formula.

    Args:
        lat1 (float): Latitude of the starting point.
        lon1 (float): Longitude of the starting point.
        lat2 (float): Latitude of the destination point.
        lon2 (float): Longitude of the destination point.

    Returns:
        str: A human-readable distance string formatted as meters (m) for distances
             less than 1km, or kilometers (km) rounded to one decimal place otherwise.
    """
    R = 6371

    lat1_rad = radians(lat1)
    lat2_rad = radians(lat2)

    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)

    a = sin(d_lat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(d_lon / 2) ** 2

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance_km = R * c

    distance_meters = distance_km * 1000

    if distance_meters < 1000:
        return f"{ceil(distance_meters)} m"
    else:
        km_rounded_up = ceil(distance_km * 10) / 10
        return f"{km_rounded_up:.1f} km"
