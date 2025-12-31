
import { createRoot } from "react-dom/client";
import App from "./src/app/App.tsx";  // ✅ 正确
import "./src/app/styles/index.css";  // ✅ 修正样式路径

createRoot(document.getElementById("root")!).render(<App />);
  