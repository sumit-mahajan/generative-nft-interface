import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useConnection } from "./providers/connection_provider";
import GeneratePage from "./pages/generate_page/GeneratePage";
import CollectionPage from "./pages/collection_page/CollectionPage";
import MintPage from "./pages/mint_page/MintPage";
import Navbar from "./components/navbar/Navbar";

function App() {
  const { connectionState } = useConnection();

  const { web3, poll, errors } = connectionState;

  // // Mostly due to wrong network
  // if (errors) {
  //   console.log(errors);
  //   return <SwitchNetwork msg={errors} />;
  // }

  // // Loading animation while webpage loads contract data
  // if (!web3) {
  //   return <Loading page="app" />;
  // }

  return (
    <div>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/mint" element={<MintPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
