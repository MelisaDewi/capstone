import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  color: string;
  icon: string;
  title: string;
  dataKey: string;
  number: number | string;
  unit?: string; // e.g., "ppm", "°C", "pH", "cm"
  percentage: number; // can be positive or negative
  chartData: object[];
};

const ChartBox = (props: Props) => {
  const isPositive = props.percentage >= 0;

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src={props.icon} alt={`${props.title} icon`} />
          <span>{props.title}</span>
        </div>
        <h1>
          {props.number} {props.unit && <small className="unit">{props.unit}</small>}
        </h1>
        <p>Average in 7 days</p>
      </div>

      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={props.chartData}>
              <Tooltip
                wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)", borderRadius: "8px", border: "none" }}
                formatter={(value: any) => [`${value} ${props.unit ?? ""}`, ""]}
                labelFormatter={() => ""}
              />

              <Line
                type="monotone"
                dataKey={props.dataKey}
                stroke={props.color}
                strokeWidth={3}
                dot={{ stroke: props.color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="texts">
          <span
            className={`percentage ${isPositive ? "positive" : "negative"}`}
            style={{ color: isPositive ? "#4caf50" : "#f44336" }}
          >
            {isPositive ? "+" : ""}
            {props.percentage}%
          </span>
          <span className="duration">latest</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBox;
