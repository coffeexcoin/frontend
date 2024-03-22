import { round } from "../utils/currency";
import { useState, useEffect } from "react";

export default function CR({ cr }) {
  const [textColor, setTextColor] = useState("white");

  useEffect(() => {
    if (cr < 150) {
      setTextColor("#FF0000");
    } else if (cr < 200) {
      setTextColor("#FF8C00");
    } else if (cr < 225) {
      setTextColor("#FFA500");
    } else if (cr < 250) {
      setTextColor("#FFFF00");
    } else if (cr < 275) {
      setTextColor("#90EE90");
    } else {
      setTextColor("#008000");
    }
  }, [cr]);

  return <span style={{ color: textColor }}>{round(cr, 2)}</span>;
}
