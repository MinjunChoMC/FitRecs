import "../styles/Footer.css";
export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span className="footer-brand">FitRecs</span>
        <span className="footer-note">
          &copy; {new Date().getFullYear()} FitRecs. Find outfit inspiration
          from your closet.
        </span>
      </div>
    </footer>
  );
}
