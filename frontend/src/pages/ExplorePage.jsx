import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar.jsx";
import Recommended from "../components/Recommended.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Filter from "../components/Filter.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/ImageExplore.css";
import { useEffect, useState } from "react";
export default function ExplorePage() {
  const [filters, setFilters] = useState({ date: ["-1", "-1"] });

  useEffect(() => {}, [filters]);
  function filterLister(filters) {
    let filterList = [];
    for (const [key, value] of Object.entries(filters)) {
      for (let i = 0; i < value.length; i++) {
        if (key == "date" && value[i] == "-1") {
          continue;
        }
        filterList.push([key, value[i]]);
      }
    }
    return filterList;
  }
  return (
    <>
      <TopBar />
      <Hero />
      <div className="recommended-sidebar-container">
        <Sidebar filters={filters} setFilters={setFilters} />
        <div className="searchbar-recommended-container">
          <SearchBar filters={filters} setFilters={setFilters} />
          <div className="filters">
            {filterLister(filters).map((filter, i) => {
              return (
                <Filter
                  key={i}
                  filterType={filter[0]}
                  filter={filter[1]}
                  setFilters={setFilters}
                />
              );
            })}
          </div>
          <Recommended filters={filters} />
        </div>
      </div>
      <Footer />
    </>
  );
}
