import { Routes, Route } from "react-router-dom";
import VerificaCpf from "./components/VerificaCpf";
import Aprovado from "./pages/Aprovado";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VerificaCpf />} />
      <Route path="/aprovado" element={<Aprovado />} />
    </Routes>
  );
}
