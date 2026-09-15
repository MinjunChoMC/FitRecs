import { useEffect, useMemo, useState } from "react";
import { STYLE_TAGS } from "../searchOptions";
export default function PanelUnit({ name, filters, setFilters }) {
  const [text, setText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {}, [filters]);

  function filterSetterStyle(prev, value) {
    if (prev == null) return null;
    else if (prev.style == null) {
      return {
        ...prev,
        style: [`(${value})`],
      };
    }
    return {
      ...prev,
      style: [...prev.style, `(${value})`],
    };
  }

  function addStyle(value) {
    setFilters((prev) => filterSetterStyle(prev, value));
    setText("");
    setShowSuggestions(false);
  }

  const styleSuggestions = useMemo(() => {
    if (!text.trim()) return [];
    const query = text.trim().toLowerCase();
    return STYLE_TAGS.filter((tag) => tag.toLowerCase().includes(query)).slice(
      0,
      6,
    );
  }, [text]);
  function filterSetterGender(prev, gender, add) {
    if (prev == null) return null;
    else if (prev.gender == null) {
      return { ...prev, gender: [gender] };
    }
    if (add) {
      const tempGenderList = prev.gender;
      tempGenderList.push(gender);
      return {
        ...prev,
        gender: tempGenderList,
      };
    } else {
      const tempGenderList = prev.gender;
      tempGenderList.splice(tempGenderList.indexOf(gender, 1));
      return {
        ...prev,
        gender: tempGenderList,
      };
    }
  }
  if (name === "Gender")
    return (
      <div id="gender-panel" className="panel-unit">
        <div className="gender-wrapper">
          female{" "}
          <input
            type="checkbox"
            onChange={(e) => {
              const add = e.target.checked;
              setFilters((prev) => {
                const newFilter = filterSetterGender(prev, "(Female)", add);
                return newFilter;
              });
            }}
          />
        </div>
        <div className="gender-wrapper">
          male{" "}
          <input
            type="checkbox"
            onChange={(e) => {
              const add = e.target.checked;
              setFilters((prev) => {
                const newFilter = filterSetterGender(prev, "(Male)", add);
                return newFilter;
              });
            }}
          />
        </div>
      </div>
    );
  if (name === "Date Range")
    return (
      <div id="date-range-panel" className="panel-unit">
        <input
          id="start-date"
          className="date-range-input"
          type="date"
          onChange={(e) => {
            setFilters((prev) => {
              return { ...prev, date: [e.target.value, prev.date[1]] };
            });
          }}
        />
        <input
          id="end-date"
          className="date-range-input"
          type="date"
          onChange={(e) => {
            setFilters((prev) => {
              return { ...prev, date: [prev.date[0], e.target.value] };
            });
          }}
        />
      </div>
    );
  if (name === "Style")
    return (
      <div id="style-panel" className="panel-unit">
        <form
          className="search-field"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            addStyle(text.trim());
          }}
        >
          <input
            id="style-input"
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
          />
          {showSuggestions && styleSuggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {styleSuggestions.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    className="suggestion-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addStyle(tag)}
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    );
}
