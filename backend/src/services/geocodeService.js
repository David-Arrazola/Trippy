async function geocodeCities(cities, country) {
  const enrichedCities = await Promise.all(
    cities.map(async (currCity) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            `${currCity.name}, ${country}`,
          )}&key=${process.env.GOOGLE_MAPS_KEY}`,
        );

        const data = await response.json();

        const location = data.results?.[0]?.geometry?.location;

        return {
          ...currCity,

          lat: location?.lat || null,
          lng: location?.lng || null,
        };
      } catch (err) {
        console.error(`GEOCODE ERROR FOR ${currCity.name}`, err);

        return {
          ...currCity,

          lat: null,
          lng: null,
        };
      }
    }),
  );

  return enrichedCities;
}

export default geocodeCities;
