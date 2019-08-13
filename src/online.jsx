export default function ({ when }) {
  return <div>
    {when('online', [
      false, () => <h1 class="offline">Internett er borte!</h1>
    ])}
  </div>;
}