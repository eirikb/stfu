import Proj4 from "proj4";

export default ({ on, get, set }) => {
  set("pos.elevationLoading", false);

  on("= getElevation", async () => {
    set("pos.elevation", false);
    set("pos.elevationLoading", true);

    try {
      let { lat, lng } = get("pos.gps");
      [lng, lat] = Proj4("+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs", [
        lng,
        lat,
      ]);
      const res = await fetch(
        `https://stfu.run/api/punkt?nord=${lat}&ost=${lng}`
      ).then((r) => r.json());
      const punkt = res.data.punkter[0];
      if (punkt) {
        set("pos.elevation", {
          placename: punkt.terreng,
          elevation: punkt.z,
        });
      } else {
        set("pos.elevation", {
          placename: "?",
          elevation: "?",
        });
      }
    } finally {
      set("pos.elevationLoading", false);
    }
  });
};
