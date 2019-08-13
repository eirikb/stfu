export default function ({ on }) {
  return <div class="distance">
    {on('pos.distance', distance => `Kråkedistanse: ${Math.floor(distance)}m`)}
    <br/>
    {on('pos.trackDistance', distance => `Stidistanse: ${Math.floor(distance)}m`)}
  </div>;
}