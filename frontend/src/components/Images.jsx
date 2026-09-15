import Annotations from "./Annotations";
import api from "../api";
export default function Images({
  image,
  setAnnotatedImage,
  annotations,
  imageName,
}) {
  return (
    <>
      <div className="image-annotations-container">
        <div className="image-container">{image}</div>
        <Annotations annotations={annotations} />
      </div>
      <div className="img-choice-container">
        <div className="img-choice-wrapper">
          <div className="upload-caption">
            would you like to upload this image?
          </div>
          <div className="button-wrapper">
            <button
              accessKey="y"
              className="upload-button upload-yes"
              onClick={() => {
                api.delete(
                  `http://localhost:8000/upload/delete-upload/?title=${imageName}&upload=True`
                );
                setAnnotatedImage(null);
              }}
            >
              yes
            </button>
            <button
              accessKey="n"
              className="upload-button upload-no"
              onClick={() => {
                api.delete(
                  `http://localhost:8000/upload/delete-upload/?title=${imageName}&upload=False`
                );
                setAnnotatedImage(null);
              }}
            >
              no
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
