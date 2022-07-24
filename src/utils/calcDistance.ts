interface Geo {
  lat: number;
  lng: number;
}

function radians(degree: number) {
  return degree * (Math.PI / 180);
}

export default function calcDistance(origin: Geo, destination: Geo): number {
  const distance =
    6371 *
    Math.acos(
      Math.cos(radians(origin.lat)) *
        Math.cos(radians(destination.lat)) *
        Math.cos(radians(destination.lng) - radians(origin.lng)) +
        Math.sin(radians(origin.lat)) * Math.sin(radians(destination.lat)),
    );

  return Math.round(distance);
}
