import ChartBox from "../../components/chartBox/ChartBox";
import ChartBoxPH from "../../components/chartBoxPH/ChartBoxPH";
import ChartBoxTDS from "../../components/chartBoxTDS/ChartBoxTDS";
import ChartBoxTemperature from "../../components/chartBoxTemperature/ChartBoxTemperature";
import ChartBoxWaterLevel from "../../components/chartBoxWaterLevel/ChartBoxWaterLevel";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <div className="box box1">
        <ChartBoxWaterLevel />
      </div>
      <div className="box box2">
        <ChartBoxTemperature />
      </div>
      <div className="box box3">
        <ChartBoxTDS />
      </div>
      <div className="box box4">
        <ChartBoxPH />
      </div>
    </div>
  );
};

export default Home;
