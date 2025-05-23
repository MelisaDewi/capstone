export const menu = [
  {
    id: 1,
    title: "main",
    listItems: [
      {
        id: 1,
        title: "Dashboard",
        url: "/",
        icon: "home.svg",
      },
      {
        id: 2,
        title: "Automation Input",
        url: "/automation",
        icon: "form.svg",
      },
    ],
  },
  {
    id: 2,
    title: "History",
    listItems: [
      {
        id: 1,
        title: "Actuator Log",
        url: "/actuator_log",
        icon: "element.svg",
      },
      {
        id: 2,
        title: "Garden Log",
        url: "/log",
        icon: "log.svg",
      },
      {
        id: 3,
        title: "Notification",
        url: "/notification",
        icon: "notifications.svg",
      },
      {
        id: 4,
        title: "Note",
        url: "/note",
        icon: "note.svg",
      },
    ],
  }
];


export const chartBoxWaterLevel = {
  // color: "#8884d8",
  // icon: "/userIcon.svg",
  // title: "Total water_level",
  latest: "11.238",
  // dataKey: "water_level",
  mean: 45,
  chartData: [
    { name: "Sun", water_level: 400 },
    { name: "Mon", water_level: 600 },
    { name: "Tue", water_level: 500 },
    { name: "Wed", water_level: 700 },
    { name: "Thu", water_level: 400 },
    { name: "Fri", water_level: 500 },
    { name: "Sat", water_level: 450 },
  ],
};

export const chartBoxTemperature = {
  // color: "skyblue",
  // icon: "/productIcon.svg",
  // title: "Total temperature",
  latest: "238",
  // dataKey: "temperature",
  mean: 21,
  chartData: [
    { name: "Sun", temperature: 400 },
    { name: "Mon", temperature: 600 },
    { name: "Tue", temperature: 500 },
    { name: "Wed", temperature: 700 },
    { name: "Thu", temperature: 400 },
    { name: "Fri", temperature: 500 },
    { name: "Sat", temperature: 450 },
  ],
};
export const chartBoxTDS = {
  // color: "teal",
  // icon: "/TDSIcon.svg",
  // title: "Total TDS",
  latest: "56.432",
  // dataKey: "TDS",
  mean: 12,
  chartData: [
    { name: "Sun", TDS: 400 },
    { name: "Mon", TDS: 600 },
    { name: "Tue", TDS: 500 },
    { name: "Wed", TDS: 700 },
    { name: "Thu", TDS: 400 },
    { name: "Fri", TDS: 500 },
    { name: "Sat", TDS: 450 },
  ],
};
export const chartBoxPH = {
  // color: "gold",
  // icon: "/conversionIcon.svg",
  // title: "Total pH",
  latest: "2.6",
  // dataKey: "pH",
  mean: 12,
  chartData: [
    { name: "Sun", pH: 400 },
    { name: "Mon", pH: 600 },
    { name: "Tue", pH: 500 },
    { name: "Wed", pH: 700 },
    { name: "Thu", pH: 400 },
    { name: "Fri", pH: 500 },
    { name: "Sat", pH: 450 },
  ],
};


export const actuatorLogs = [
  {
    id: 1,
    user_id: 101,
    actuator_action: "Pump Turned ON",
    status: "Success",
    created_at: "2025-05-23T10:15:30Z",
    updated_at: "2025-05-23T10:15:30Z"
  },
  {
    id: 2,
    user_id: 102,
    actuator_action: "Fan Turned OFF",
    status: "Failed",
    created_at: "2025-05-22T16:47:12Z",
    updated_at: "2025-05-22T16:48:00Z"
  },
  {
    id: 3,
    user_id: 103,
    actuator_action: "Heater Adjusted to 30°C",
    status: "Success",
    created_at: "2025-05-21T09:32:10Z",
    updated_at: "2025-05-21T09:33:50Z"
  },
  {
    id: 4,
    user_id: 104,
    actuator_action: "LED Indicator Turned ON",
    status: "Pending",
    created_at: "2025-05-20T14:05:00Z",
    updated_at: "2025-05-20T14:06:30Z"
  },
  {
    id: 5,
    user_id: 105,
    actuator_action: "Nutrient Valve Closed",
    status: "Success",
    created_at: "2025-05-19T11:45:20Z",
    updated_at: "2025-05-19T11:45:20Z"
  }
];


export const gardenLogs = [
  {
    id: 1,
    user_id: 101,
    temperature: 24.5,
    water_level: 75,
    pH: 6.2,
    TDS: 850,
    created_at: new Date("2025-05-21T09:15:00Z"),
    updated_at: new Date("2025-05-21T09:45:00Z")
  },
  {
    id: 2,
    user_id: 102,
    temperature: 26.0,
    water_level: 60,
    pH: 6.0,
    TDS: 900,
    created_at: new Date("2025-05-21T12:30:00Z"),
    updated_at: new Date("2025-05-21T12:50:00Z")
  },
  {
    id: 3,
    user_id: 103,
    temperature: 22.7,
    water_level: 85,
    pH: 6.4,
    TDS: 750,
    created_at: new Date("2025-05-22T08:00:00Z"),
    updated_at: new Date("2025-05-22T08:10:00Z")
  },
  {
    id: 4,
    user_id: 104,
    temperature: 25.2,
    water_level: 90,
    pH: 6.1,
    TDS: 880,
    created_at: new Date("2025-05-22T14:10:00Z"),
    updated_at: new Date("2025-05-22T14:30:00Z")
  },
  {
    id: 5,
    user_id: 105,
    temperature: 23.9,
    water_level: 70,
    pH: 6.3,
    TDS: 820,
    created_at: new Date("2025-05-23T10:45:00Z"),
    updated_at: new Date("2025-05-23T11:00:00Z")
  }
];


export const noteLogs = [
  {
    id: 1,
    user_id: 101,
    activity: "Checked water level and refilled the tank",
    created_at: new Date("2025-05-21T08:30:00Z"),
    updated_at: new Date("2025-05-21T08:45:00Z")
  },
  {
    id: 2,
    user_id: 102,
    activity: "Adjusted pH level to optimal range",
    created_at: new Date("2025-05-21T10:00:00Z"),
    updated_at: new Date("2025-05-21T10:15:00Z")
  },
  {
    id: 3,
    user_id: 103,
    activity: "Noted unusual temperature spike",
    created_at: new Date("2025-05-22T09:15:00Z"),
    updated_at: new Date("2025-05-22T09:20:00Z")
  },
  {
    id: 4,
    user_id: 104,
    activity: "Performed manual nutrient solution mix",
    created_at: new Date("2025-05-22T11:50:00Z"),
    updated_at: new Date("2025-05-22T12:10:00Z")
  },
  {
    id: 5,
    user_id: 105,
    activity: "Inspected root health under hydroponic tray",
    created_at: new Date("2025-05-23T13:00:00Z"),
    updated_at: new Date("2025-05-23T13:30:00Z")
  }
];

export const notificationLogs = [
  {
    id: 1,
    user_id: 101,
    title: "High Temperature",
    message: "Temperature has exceeded the safe limit.",
    created_at: new Date("2025-05-22T08:00:00Z"),
    updated_at: new Date("2025-05-22T08:05:00Z"),
  },
  {
    id: 2,
    user_id: 102,
    title: "Low Water Level",
    message: "Water level dropped below minimum threshold.",
    created_at: new Date("2025-05-22T09:30:00Z"),
    updated_at: new Date("2025-05-22T09:35:00Z"),
  },
  {
    id: 3,
    user_id: 103,
    title: "pH Imbalance",
    message: "Detected pH value outside the optimal range.",
    created_at: new Date("2025-05-22T10:45:00Z"),
    updated_at: new Date("2025-05-22T10:50:00Z"),
  },
  {
    id: 4,
    user_id: 104,
    title: "TDS Too High",
    message: "TDS reading indicates possible overfeeding.",
    created_at: new Date("2025-05-22T11:15:00Z"),
    updated_at: new Date("2025-05-22T11:20:00Z"),
  },
  {
    id: 5,
    user_id: 105,
    title: "Automation Triggered",
    message: "Automated system activated to balance water level.",
    created_at: new Date("2025-05-22T12:00:00Z"),
    updated_at: new Date("2025-05-22T12:10:00Z"),
  },
];
