import SidebarUnit from "./SidebarUnit";
import PanelUnit from "./PanelUnit";
import { useState } from "react";
import React from "react";
export default function Sidebar({ filters, setFilters }) {
  const [opened, setOpened] = useState([]);
  const Categories = ["Date Range", "Gender", "Style"];
  function handleOpen(name) {
    const tempOpened = opened.slice();
    if (tempOpened.includes(name)) {
      tempOpened.splice(opened.indexOf(name), 1);
    } else {
      tempOpened.push(name);
    }
    setOpened(tempOpened);
  }

  return (
    <div className="sidebar">
      {Categories.map((category, i) => {
        return (
          <React.Fragment key={category}>
            <SidebarUnit
              key={category}
              name={category}
              handleOpen={handleOpen}
            />
            {opened.includes(category) ? (
              <PanelUnit
                name={category}
                filters={filters}
                setFilters={setFilters}
              />
            ) : (
              <></>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
