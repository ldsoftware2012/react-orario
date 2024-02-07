import "../App.css";
import { server } from "../data/config";

export function Footer() {
  return (
    <>
      <div className="footer">
        <p>Server : {server}</p>
      </div>
    </>
  );
}
