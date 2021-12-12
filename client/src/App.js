import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useConnection } from "./providers/connection_provider";
import GeneratePage from "./pages/generate_page/GeneratePage";
import CollectionPage from "./pages/collection_page/CollectionPage";
import MintPage from "./pages/mint_page/MintPage";
import Navbar from "./components/navbar/Navbar";
import SuccessPage from "./pages/success_page/SuccessPage";
import DocPage from "./pages/doc_page/DocPage";

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
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<DocPage />} />
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
