import { useEffect, useState } from 'react';

function TodosViewForm({
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  function preventRefresh(e) {
    e.preventDefault();
  }

  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  return (
    <div>
      <div>
        <label htmlFor="">Search todos:</label>
        <input
          type="text"
          placeholder="Search todo"
          value={localQueryString}
          onChange={(event) => setLocalQueryString(event.target.value)}
        />
        <button onClick={() => setLocalQueryString('')}>Clear</button>
      </div>

      <form onSubmit={preventRefresh}>
        <label htmlFor="sortField">Sort by</label>
        <select
          name="sortField"
          id="sortField"
          onChange={(event) => setSortField(event.target.value)}
          value={sortField}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <label htmlFor="sortDirection">Direction</label>
        <select
          name="sortDirection"
          id="sortDirection"
          value={sortDirection}
          onChange={(event) => setSortDirection(event.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </form>
    </div>
  );
}
export default TodosViewForm;
