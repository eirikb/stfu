import { query } from "./query";

export default ({ on, set }) => {
  on("= initAuth", async () => {
    try {
      const authed = await query("/api/min-side?nocache").then(
        (r) => !r.match(/Logg inn/)
      );
      document.body.removeChild(document.querySelector("#intro"));
      set("auth", authed);
      set("route", authed ? "home" : "login");
    } catch (e) {
      console.log(e);
      console.log("failed to login");
    }
  });

  on("= login", async (e) => {
    e.preventDefault();
    set("loading", "Logger på");
    set("login.failed", "");
    const data = new URLSearchParams(new FormData(e.target));
    const authed = await query("/api/login?nocache", {
      method: "post",
      body: data,
    }).then((r) => !r.match(/Logg inn/));
    set("loading", false);
    if (authed) {
      set("route", "home");
      set("auth", true);
    } else {
      set("login.failed", "Pålogging feilet. Prøv på nytt!");
    }
  });

  on("= logout", async () => {
    if (!confirm("Er ikke du ikke sikker på du ikke vil ikke logge ut?"))
      return;

    localStorage.clear();
    sessionStorage.clear();
    await query("/api/logout?nocache");
    window.location.reload();
  });
};
