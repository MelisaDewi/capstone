import React, { useEffect, useState } from "react";
import "./automation_input.scss";

const Automation_Input: React.FC = () => {
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const [inputs, setInputs] = useState({
    temperature: { min: "", max: "" },
    // humidity: { min: "", max: "" },
    water_level: { min: "", max: "" },
    pH: { min: "", max: "" },
    TDS: { min: "", max: "" },
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
    const payload = {
    min_temperature: parseFloat(inputs.temperature.min),
    max_temperature: parseFloat(inputs.temperature.max),
    // min_humidity: parseFloat(inputs.humidity.min),
    // max_humidity: parseFloat(inputs.humidity.max),
    min_pH: parseFloat(inputs.pH.min),
    max_pH: parseFloat(inputs.pH.max),
    min_TDS: parseFloat(inputs.TDS.min),
    max_TDS: parseFloat(inputs.TDS.max),
    min_water_level: parseFloat(inputs.water_level.min),
    max_water_level: parseFloat(inputs.water_level.max),
  };

  const token = localStorage.getItem('token'); 


    fetch("http://localhost:3000/save-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Settings saved successfully!");
        } else {
          alert("Failed to save settings.");
        }
      })
      .catch((err) => {
        console.error("Error saving settings:", err);
        alert("Error occurred. Check console.");
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/get-settings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
  })
      .then((res) => res.json())
      .then((data) => {
        setInputs({
  temperature: {
    min: data.min_temperature?.toString() || "",
    max: data.max_temperature?.toString() || "",
  },
  // humidity: {
  //   min: data.min_humidity?.toString() || "",
  //   max: data.max_humidity?.toString() || "",
  // },
  water_level: {
    min: data.min_water_level?.toString() || "",
    max: data.max_water_level?.toString() || "",
  },
  pH: {
    min: data.min_pH?.toString() || "",
    max: data.max_pH?.toString() || "",
  },
  TDS: {
    min: data.min_TDS?.toString() || "",
    max: data.max_TDS?.toString() || "",
  },
});

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch settings:", err);
        alert("Failed to fetch existing settings.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="contentContainer">
      <div className="automation-input-container">
        <div className="header">
          <h2>Automation Input Settings</h2>
          {/* <div className="toggle-container">
            <label className="switch">
              <input type="checkbox" checked={automationEnabled} onChange={handleToggle} />
              <span className="slider round"></span>
            </label>
            <span className="toggle-label">Automation {automationEnabled ? "On" : "Off"}</span>
          </div> */}
        </div>

        {loading ? (
          <p>Loading settings...</p>
        ) : (
          <>
            <div className="input-grid">
              {["temperature", "water_level", "pH", "TDS"].map((key) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default Automation_Input;
