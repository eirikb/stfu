import { postForm, queryDom } from "./query";

const getAllTurs = async () =>
  [
    ...(await queryDom("we-api/min-side?nocache")).querySelectorAll(
      ".regtable:first-of-type .regtable__name"
    ),
  ].map((e) => e.innerText.replace(/[\n\t]/g, "").trim());

export default function ({ on, get, set }) {
  set("kode.tur", false);
  on("+* kode.tur", (tur) => {
    if (tur === false) {
      set("kode.status", "");
    }
  });

  on("= check", async (e) => {
    e.preventDefault();
    set("kode.status", "Sjekker...");

    const kode = e.target.kode.value;
    const dom = await postForm("we-api/min-side?nocache", {
      "code[]": kode.split(""),
    });
    const companions = [...dom.querySelectorAll(".form__companion")].map(
      (companionDiv) => {
        const id = companionDiv.querySelector("input").value;
        const text = companionDiv.innerText.trim();
        return { id, text };
      }
    );
    const routeNameElement = dom.querySelector(".form__routename");
    const found = !!routeNameElement;
    if (found) {
      set("kode.status", "");
      const tur = {
        to: routeNameElement.innerText,
        companions,
        members: dom.querySelector(`[name='members[]']`).value,
      };
      set("kode.tur", tur);
      set("kode.kode", kode);
    } else {
      set("kode.status", "Finner ikke tur");
    }
  });

  on("= register", async (e) => {
    e.preventDefault();
    let members = [...(e.target.companions || [])]
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    if (members.length === 0) {
      members = get("kode.tur.members");
    }
    const kode = get("kode.kode");
    set("kode.status", `Registrerer ${kode}...`);
    const allTursBefore = await getAllTurs();
    const date = new Date().toISOString().split("T")[0];
    let dom = await postForm("we-api/min-side?nocache", {
      codeword: kode,
      "members[]": members,
      date,
    });
    const ok = (
      (dom.querySelector(".hero__intro") || {}).innerText || ""
    ).match(/Gratulerer/);
    if (ok) {
      set("kode.tur", false);
      set("kode.status", "Koden er registrert! Dobbeltsjekker...");

      const allTursAfter = await getAllTurs();
      const newTur = allTursAfter
        .filter((t) => !allTursBefore.includes(t))
        .join();
      set("kode.status", "Koden er registrert! Siste tur: " + newTur);
    } else {
      set("kode.status", "Noe gikk galt - IKKE registrert");
    }
  });
}
