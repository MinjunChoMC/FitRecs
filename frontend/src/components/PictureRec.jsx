export default function PictureRec({ recImage }) {
  return (
    <div className="upload-rec">
      <img className="upload-pic" src={recImage.imageLink} />
    </div>
  );
}
