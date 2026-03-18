export function getDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number {
    const EARTH_RADIUS_KM = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const halfLatSin = Math.sin(dLat / 2);
    const halfLonSin = Math.sin(dLon / 2);

    const haversine =
        halfLatSin * halfLatSin +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        halfLonSin * halfLonSin;

    const angularDistance = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return EARTH_RADIUS_KM * angularDistance;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}
