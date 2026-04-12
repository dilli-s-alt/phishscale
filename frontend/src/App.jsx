import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Campaign from "./pages/Campaign";
import FakeLogin from "./pages/FakeLogin";
import Caught from "./pages/Caught";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/fake-login" element={<FakeLogin />} />
        <Route path="/caught" element={<Caught />} />
      </Routes>
    </BrowserRouter>
  );
}
