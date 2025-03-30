import "./App.css";
import Router from "./Router";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        style={{ zIndex: 10000 }}
        className="!z-[10000]"
      />
      <Router />
    </>
  );
}

export default App;
