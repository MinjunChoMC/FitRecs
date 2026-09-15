import { useMemo, useState } from "react";
import { CLOTHING_ITEMS } from "../searchOptions";

export default function SearchBar({ filters, setFilters }) {
  const [text, setText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  function filterSetter(prev, value) {
    if (prev == null) return null;
    else if (prev.annotations == null) {
      return {
        ...prev,
        annotations: [`(${value})`],
      };
    }
    return {
      ...prev,
      annotations: [...prev.annotations, `(${value})`],
    };
  }

  function addFilter(value) {
    setFilters((prev) => filterSetter(prev, value));
    setText("");
    setShowSuggestions(false);
  }

  const suggestions = useMemo(() => {
    if (!text.trim()) return [];
    const query = text.trim().toLowerCase();
    return CLOTHING_ITEMS.filter((item) =>
      item.toLowerCase().includes(query),
    ).slice(0, 6);
  }, [text]);

  return (
    <form
      className="search-field"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        addFilter(text.trim());
      }}
    >
      <input
        className="searchbar"
        placeholder="Type in a clothing item to start filtering"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="suggestion-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addFilter(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
