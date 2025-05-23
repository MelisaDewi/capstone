import ChartBox from "../../components/chartBox/ChartBox";
import ChartBoxPH from "../../components/chartBoxPH/ChartBoxPH";
import ChartBoxTDS from "../../components/chartBoxTDS/ChartBoxTDS";
import ChartBoxTemperature from "../../components/chartBoxTemperature/ChartBoxTemperature";
import ChartBoxWaterLevel from "../../components/chartBoxWaterLevel/ChartBoxWaterLevel";
import {
  chartBoxPH,
  chartBoxTDS,
  chartBoxTemperature,
  chartBoxWaterLevel,
} from "../../data";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <div className="box box1">
        <ChartBoxWaterLevel {...chartBoxWaterLevel} />
      </div>
      <div className="box box2">
        <ChartBoxTemperature {...chartBoxTemperature} />
      </div>
      <div className="box box3">
        <ChartBoxTDS {...chartBoxTDS} />
      </div>
      <div className="box box4">
        <ChartBoxPH {...chartBoxPH} />
      </div>
    </div>
  );
};

export default Home;
