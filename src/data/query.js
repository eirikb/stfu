const parser = new DOMParser();

export const isLocalhost = !!window.location.host.match(/localhost/);

export function query(path, options = {}) {
  return fetch(`https://stfu.run/${path}`, {
    credentials: "include",
    ...options,
  })
    .then((r) => r.json())
    .then((r) => r.data);
}

export async function queryDom(path, options) {
  const data = await query(path, options);
  return parser.parseFromString(data || "", "text/html");
}

export function queryJson(path) {
  return query(path);
}

export function postForm(path, bodyObject) {
  const body = Object.entries(bodyObject)
    .map(([key, value]) =>
      []
        .concat(value)
        .map((part) =>
          [encodeURIComponent(key), encodeURIComponent(part)].join("=")
        )
        .join("&")
    )
    .join("&");
  return queryDom(path, {
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });
}
