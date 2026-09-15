import axios from "axios";
import PictureRec from "./PictureRec";
const PicsPerPage = 25;
import { useState, useEffect } from "react";
import Images from "./Images";
export default function Recommended({ filters }) {
  const [recImages, setRecImages] = useState(null);
  useEffect(() => {
    let params;
    if (Object.keys(filters).length == 0) params = "";
    else {
      params = "?";
      for (const [key, value] of Object.entries(filters)) {
        params += key + "=" + JSON.stringify(value);
      }
    }
    console.log(
      `http://localhost:8000/upload/get-images/?filters=${JSON.stringify(
        filters
      )}`
    );
    axios
      .get(
        `http://localhost:8000/upload/get-images/?filters=${JSON.stringify(
          filters
        )}`
      )
      .then((res2) => {
        setRecImages(res2.data);
        //console.log(res.data[0].annotatedImage);
      });
  }, [filters]);
  if (recImages == null) return <></>;
  else {
    return (
      <div className="recommended">
        {recImages.map((recImage, i) => {
          return <PictureRec key={i} recImage={recImage} />;
        })}
      </div>
    );
  }
}
