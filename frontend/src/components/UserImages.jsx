import axios from "axios";
import "../styles/UserAccount.css";
import { useEffect, useState } from "react";
import DeleteImages from "../components/DeleteImages";
import api from "../api";
export default function UserImages({ handleChange }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    async function fetchUserImages() {
      api
        .get("/upload/api/get-user-images")
        .then((res) => res.data)
        .then((data) => setImages(data))
        .catch((err) => alert(err));
    }
    fetchUserImages();
  }, []);

  return (
    <>
      <div className="user-images">
        {images.map((image, i) => {
          //console.log(image.title);
          return (
            <div key={i} className="user-image-container" id={image.title}>
              <img className="user-image" src={image.imageLink} alt="" />
              <input
                type="checkbox"
                className="image-select"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
