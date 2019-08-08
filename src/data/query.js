const parser = new DOMParser();

export const isLocalhost = window.location.host.match(/localhost/);

export function query(path, options = {}) {
  return fetch(path, { credentials: 'include', ...options });
}

export async function queryDom(path, options) {
  const data = isLocalhost && sessionStorage[path] || await query(path, options).then(r => r.text());
  if (isLocalhost) {
    sessionStorage[path] = data;
  }
  return parser.parseFromString(data, 'text/html');
}

export function queryJson(path) {
  return query(path).then(res => res.json());
}

export function postForm(path, bodyObject) {
  const body = Object.entries(bodyObject).map(([key, value]) =>
    [].concat(value).map(part =>
      [encodeURIComponent(key), encodeURIComponent(part)].join('=')
    ).join('&')).join('&');
  return queryDom(path, {
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body
  });
}
