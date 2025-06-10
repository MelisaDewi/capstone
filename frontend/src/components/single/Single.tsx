import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./single.scss";

type InfoItem = {
  label: string;
  value: string | number;
  unit?: string;
};

type ChartDataKey = { name: string; color: string };

type Activity = {
  time: string;
  text: string;
};

type Props = {
  id: number;
  img?: string;
  title: string;
  info: InfoItem[];
  chart?: {
    dataKeys: ChartDataKey[];
    data: Record<string, any>[];
  };
  activities?: Activity[];
  isNote?: boolean;
  onEditClick?: () => void;
};

const Single = ({
  id,
  img,
  title,
  info,
  chart,
  activities,
  isNote = false,
  onEditClick,
}: Props) => {
  return (
    <div className="single" key={id}>
      <div className="view">
        <div className="info">
          <div className="topInfo">
            {img && <img src={img} alt={`${title} icon`} />}
            <h1>{title}</h1>
            {isNote && (
              <button className="editButton" onClick={onEditClick}>
                Edit
              </button>
            )}
          </div>

          <div className="details">
            {info.length === 0 && <p>No information available</p>}
            {info.map(({ label, value, unit }) => (
              <div className="item" key={label}>
                <span className="itemTitle">{label}</span>
                <span className="itemValue">
                  {value}
                  {unit && <small className="unit"> {unit}</small>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr />

        {chart && chart.data && chart.data.length > 0 && (
          <div className="chart">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chart.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {chart.dataKeys.map(({ name, color }) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={color}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Optional: Show latest activities */}
      {/* <div className="activities">
        <h2>Latest Activities</h2>
        {activities && activities.length > 0 ? (
          <ul>
            {activities.map(({ time, text }, idx) => (
              <li key={idx}>
                <div>
                  <p>{text}</p>
                  <time>{time}</time>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activities.</p>
        )}
      </div> */}
    </div>
  );
};

export default Single;
