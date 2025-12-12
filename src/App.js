import "./styles.css";
import React from "react";
import WhereIAm from "./whereiam";

export default function App() {
  return (
    <div className="App">
      <div id="clouds">
        <h1>Where am I?</h1>
        <br />
        <h2></h2>
        <h3>MultiCloud demo</h3>
        <br />
        <WhereIAm />
        <div className="cloud x1"></div>
        <div className="cloud x2"></div>
        <div className="cloud x3"></div>
        <div className="cloud x4"></div>
        <div className="cloud x5"></div>
        <div className="cloud x3"></div>
        <div className="cloud x1"></div>
        <div className="cloud x2"></div>
        <a href="#" target="_blank" rel="noreferrer"></a>
      </div>
    </div>
  );
}
