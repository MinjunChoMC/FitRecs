import axios from "axios";
import TopBar from "../components/TopBar";
import UserImages from "../components/UserImages";
import DeleteImages from "../components/DeleteImages";
import { useState } from "react";
export default function UserAccount() {
  const [selectedImgs, setSelectedImgs] = useState([]);
  function handleChange(e) {
    if (e.target.checked) {
      setSelectedImgs((prev) => {
        return [...prev, e.target.parentNode.id];
      });
    } else {
      setSelectedImgs((prev) => {
        const index = prev.indexOf(e.target.parentNode.id);
        prev = prev.splice(index, 1);
        return prev;
      });
    }
  }
  return (
    <>
      <TopBar />
      <div className="user-caption-delete-button-container">
        <h1 className="user-images-caption">Your Images</h1>
        <DeleteImages
          selectedImgs={selectedImgs}
          setSelectedImgs={setSelectedImgs}
        />
      </div>
      <UserImages handleChange={handleChange} />
    </>
  );
}
