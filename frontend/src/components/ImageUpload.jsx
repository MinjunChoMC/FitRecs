import "../styles/ImageUpload.css";
import Images from "./Images.jsx";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants.js";
import api from "../api.js";
export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [annotations, setAnnotations] = useState(null);
  useEffect(() => {
    if (image == null) return;
    const formData = new FormData();
    formData.append("title", image.name);
    formData.append("image", image);
    const token = localStorage.getItem(ACCESS_TOKEN);
    api.post("http://localhost:8000/upload/post/", formData).then((res) => {
      console.log(res);
      console.log(res.data.title);
      api
        .get(
          `http://localhost:8000/upload/get-annotated-image/?title=${res.data.title}`,
          { responseType: "blob" }
        )
        .then((res2) => {
          console.log(res2);
          const blob = res2.data;
          console.log(blob);
          console.log("Blob size:", blob.size);
          console.log("Blob type:", blob.type);

          const imageUrl = URL.createObjectURL(blob);
          console.log([res.data.title, imageUrl]);

          //console.log(res.data[0].annotatedImage);
          setAnnotatedImage([res.data.title, imageUrl]);
        });
      api
        .get(
          `http://localhost:8000/upload/get-annotations/?title=${res.data.title}`
        )
        .then((res) => {
          console.log(res.data);
          const kdude = {
            clothing: JSON.parse(res.data.annotations),
            gender: res.data.gender,
            style: res.data.style,
          };
          console.log(kdude);
          setAnnotations(kdude);
        });
    });
  }, [image]);
  function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.files[0]);
    console.log(e);
    setImage(e.target.files[0]);
    console.log("Image submitted!");
  }
  const imageUploadDiv = (
    <div className="image-upload-container">
      <div className="image-upload">
        <input type="file" onChange={handleSubmit} />
        <div className="image-upload-displays">
          <span className="material-symbols-outlined">cloud_upload</span>
          <div className="image-upload-caption">Upload your images here</div>
        </div>
      </div>
    </div>
  );
  /*const imageDiv = image ? (
    <img src={URL.createObjectURL(image)} alt="" className="uploaded-img" />
  ) : null;*/

  const imageDiv = annotatedImage ? (
    <img src={annotatedImage[1]} alt="" className="uploaded-img" />
  ) : null;
  return annotatedImage ? (
    <Images
      image={imageDiv}
      setAnnotatedImage={setAnnotatedImage}
      annotations={annotations}
      imageName={annotatedImage[0]}
    />
  ) : (
    imageUploadDiv
  );
}
