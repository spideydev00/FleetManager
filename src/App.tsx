// src/App.tsx
import FleetManagement from "./components";

/**
 * Main App component that renders the FleetManagement application
 * All data fetching and state management is now handled in FleetManagement component
 */
function App() {
  return (
    <div className="app-container">
      <FleetManagement />
    </div>
  );
}

export default App;
