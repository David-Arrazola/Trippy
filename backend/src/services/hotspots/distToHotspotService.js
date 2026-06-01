function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function avgDistanceToHotspots(hotel, hotspots) {
  const lat1 = hotel.gps_coordinates?.latitude;
  const lng1 = hotel.gps_coordinates?.longitude;

  if (!lat1 || !lng1 || hotspots.length === 0) return 0;

  let total = 0;
  let count = 0;

  for (const spot of hotspots) {
    if (!spot.lat || !spot.lng) continue;

    total += getDistanceKm(lat1, lng1, spot.lat, spot.lng);
    count++;
  }

  return count ? total / count : 0;
}

export default avgDistanceToHotspots;
