import api from "../api";
export default function DeleteImages({ selectedImgs, setSelectedImgs }) {
  function handleDelete() {
    if (selectedImgs.length == 0) {
      return;
    }
    const selectedImgs_str = JSON.stringify(selectedImgs);
    api.delete(
      `http://localhost:8000/upload/delete-user-images/?titles=${selectedImgs_str}`
    );

    setSelectedImgs([]);
  }
  return (
    <button
      className="delete-button"
      onClick={() => {
        handleDelete();
      }}
    >
      delete
    </button>
  );
}
