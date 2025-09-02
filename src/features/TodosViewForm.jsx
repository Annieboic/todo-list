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
  return (
    <div>
      <div>
        <label htmlFor="">Search todos:</label>
        <input
          type="text"
          value={queryString}
          onChange={(event) => setQueryString(event.target.value)}
        />
        <button onClick={() => setQueryString('')}>Clear</button>
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
