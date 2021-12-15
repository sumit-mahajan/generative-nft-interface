import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useConnection } from "./providers/connection_provider";
import GeneratePage from "./pages/generate_page/GeneratePage";
import CollectionPage from "./pages/collection_page/CollectionPage";
import MintPage from "./pages/mint_page/MintPage";
import Navbar from "./components/navbar/Navbar";
import SuccessPage from "./pages/success_page/SuccessPage";
import DocPage from "./pages/doc_page/DocPage";
import { Box } from "./components/Box";
import LandingPage from "./pages/landing_page/LandingPage";

function App() {
  const { connectionState } = useConnection();

  const { errors } = connectionState;

  if (!(navigator.userAgent.indexOf("Chrome") > -1)) {
    return (
      <div className="backdrop">Ohh snap! This website is supported only on Google Chrome or Microsoft Edge since it uses Filesystem API</div>
    );
  }

  if (errors) {
    return (
      <div className="backdrop">{errors}</div>
    );
  }

  return (
    <div>
      <Router>
        {errors && <div style={{ zIndex: "2" }} className="backdrop">{errors}</div>}
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/prerequisites" element={<DocPage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/mint" element={<MintPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
