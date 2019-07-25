const parser = new DOMParser();

export function query(path, options = {}) {
  return fetch(path, { credentials: 'include', ...options });
}

export async function queryDom(path, options) {
  const cache = (options || {}).cache !== false;
  if (cache && localStorage[path]) {
    return parser.parseFromString(localStorage[path], 'text/html');
  }
  const data = await query(path).then(r => r.text());
  localStorage[path] = data;
  return parser.parseFromString(data, 'text/html');
}

export function queryJson(path) {
  return query(path).then(res => res.json());
}
