import { queryJson } from './query';
import Proj4 from 'proj4';

export default ({ on, get, set }) => {
  set('pos.elevationLoading', false);

  on('= getElevation', async () => {
    set('pos.elevation', false);
    set('pos.elevationLoading', true);

    try {
      let { lat, lng } = get('pos.gps');
      [lng, lat] = Proj4('+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs', [lng, lat]);
      const elevation = await queryJson(`/elevation?epsg=25833&lat=${lat}&lon=${lng}`);
      set('pos.elevation', elevation);
    } finally {
      set('pos.elevationLoading', false);
    }
  });
};
