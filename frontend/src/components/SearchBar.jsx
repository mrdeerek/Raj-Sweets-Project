export default function SearchBar({ setQuery }) {
  return (
    <input
      placeholder="Search by name or category"
      onChange={e => setQuery(e.target.value)}
    />
  );
}
