import React from "react";
import HomePage from "./pages/home_page/HomePage";
import { useConnection } from "./providers/connection_provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
      <HomePage />
    </div>
  );
}

export default App;
