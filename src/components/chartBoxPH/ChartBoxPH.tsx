import "./chartBoxPH.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  latest: number | string;
  unit?: string;
  mean: number;
  chartData: object[];
};

const ChartBoxPH = (props: Props) => {
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src="ph.svg" alt="pH icon" />
          <span>pH</span>
        </div>
        <h1>
          {props.latest} {props.unit && <small className="unit">{props.unit}</small>}
        </h1>
        <p>Latest</p>
      </div>

      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={props.chartData}>
              <Tooltip
                wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)", borderRadius: "8px" }}
                formatter={(value: any) => [`${value} ${props.unit ?? ""}`, ""]}
                labelFormatter={() => ""}
              />
              <Line
                type="monotone"
                dataKey="pH"
                stroke="#00e676"
                strokeWidth={3}
                dot={{ stroke: "#00e676", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="texts">
          <span className="mean" style={{ color: "#00e676" }}>{props.mean}</span>
          <span className="duration">average in 7 days</span>
        </div>
      </div>
    </div>
  );
};

export default ChartBoxPH;
