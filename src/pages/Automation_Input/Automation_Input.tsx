import React, { useState } from "react";
import "./automation_input.scss";

const Automation_Input: React.FC = () => {
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [inputs, setInputs] = useState({
    temperature: { min: "", max: "" },
    waterLevel: { min: "", max: "" },
    pH: { min: "", max: "" },
    tds: { min: "", max: "" },
  });

  const handleInputChange = (key: string, type: "min" | "max", value: string) => {
    setInputs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key as keyof typeof prev],
        [type]: value,
      },
    }));
  };

  const handleToggle = () => {
    setAutomationEnabled((prev) => !prev);
  };

  const handleSubmit = () => {
    console.log("Submitted Values:", inputs, "Automation:", automationEnabled);
    // You can send the data to your backend here
  };

  return (
    <div className="contentContainer">
    <div className="automation-input-container">
      <div className="header">
        <h2>Automation Input Settings</h2>
        <div className="toggle-container">
          <label className="switch">
            <input type="checkbox" checked={automationEnabled} onChange={handleToggle} />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">Automation {automationEnabled ? "On" : "Off"}</span>
        </div>
      </div>

      <div className="input-grid">
        {["temperature", "waterLevel", "pH", "tds"].map((key) => (
          <div key={key} className="input-group">
            <label>{key.toUpperCase()}</label>
            <input
              type="number"
              placeholder="Min"
              value={inputs[key as keyof typeof inputs].min}
              onChange={(e) => handleInputChange(key, "min", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              value={inputs[key as keyof typeof inputs].max}
              onChange={(e) => handleInputChange(key, "max", e.target.value)}
            />
          </div>
        ))}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Save Settings
      </button>
    </div>
    </div>
  );
};

export default Automation_Input;
