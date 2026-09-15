export default function Filter({ filterType, filter, setFilters }) {
  function filterRemover(prev) {
    if (filterType == "date") {
      const removingDateIndex = prev.date.indexOf(filter);
      let tempDateList = prev.date;
      tempDateList[removingDateIndex] = "-1";
      return {
        ...prev,
        date: tempDateList,
      };
    }
    prev[filterType].splice(prev[filterType].indexOf(filter), 1);
    return {
      ...prev,
      [filterType]: prev[filterType],
    };
  }
  return (
    <div className="filter">
      {filter}
      <button
        className="remove-filter-button"
        onClick={() => {
          setFilters((prev) => {
            return filterRemover(prev, filterType);
          });
        }}
      >
        x
      </button>
    </div>
  );
}
