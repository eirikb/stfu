export default function ({ on }) {
  return <div class="distance">
    {on('pos.distance', distance => distance ? `Kråkedistanse: ${Math.floor(distance)}m` : '')}
    <br/>
    {on('pos.trackDistance', distance => distance ? `Stidistanse: ${Math.floor(distance)}m` : '')}
  </div>;
}