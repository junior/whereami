import "./styles.css";
import WhereIAm from "./whereiam";

export default function App() {
  return (
    <div className="App">
      <div id="clouds">
        <h1>Where am I?</h1>
        <h3>MultiCloud demo</h3>
        <WhereIAm />
        <footer className="by">
          by{" "}
          <a href="https://adao.dev" target="_blank" rel="noopener noreferrer">
            adao.dev
          </a>
        </footer>
        <div className="cloud x1"></div>
        <div className="cloud x2"></div>
        <div className="cloud x3"></div>
        <div className="cloud x4"></div>
        <div className="cloud x5"></div>
        <div className="cloud x3"></div>
        <div className="cloud x1"></div>
        <div className="cloud x2"></div>
      </div>
    </div>
  );
}
