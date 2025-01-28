import "./App.css";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
