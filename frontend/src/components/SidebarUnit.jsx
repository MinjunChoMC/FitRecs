export default function SidebarUnit({ name, handleOpen }) {
  return (
    <div className="sidebar-unit">
      {name}{" "}
      <button
        className="expand-panel"
        onClick={() => {
          handleOpen(name);
        }}
      >
        -
      </button>
    </div>
  );
}
