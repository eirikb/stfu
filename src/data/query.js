const parser = new DOMParser();

export function query(path, options = {}) {
  return fetch(path, { credentials: 'include', ...options });
}

export async function queryDom(path, options) {
  const data = await query(path, options).then(r => r.text());
  return parser.parseFromString(data, 'text/html');
}

export function queryJson(path) {
  return query(path).then(res => res.json());
}
