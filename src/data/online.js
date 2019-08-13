export default ({ set }) => {
  set('online', navigator.onLine);
  window.addEventListener('online', () =>
    set('online', true)
  );
  window.addEventListener('offline', () =>
    set('online', false)
  );
};
