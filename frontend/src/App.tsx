import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";
import User from "./pages/note/Note";
import Product from "./pages/notification/Notification";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Automation_Input from "./pages/Automation_Input/Automation_Input";
import Notifications from "./pages/notifications/Notifications";
import Notes from "./pages/notes/Notes";
import Notification from "./pages/notification/Notification";
import Note from "./pages/note/Note";
import Register from "./pages/register/Register";
import Log from "./pages/log/Log";
import Logs from "./pages/logs/Logs";
import Actuator_Logs from "./pages/actuator_logs/Actuator_Logs";
import Actuator_Log from "./pages/actuator_log/Actuator_Log";


const queryClient = new QueryClient();

function App() {
  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/automation",
          element: <Automation_Input />,
        },
        {
          path: "/notification",
          element: <Notifications />,
        },
        {
          path: "/note",
          element: <Notes />,
        },
        {
          path: "/notification/:id",
          element: <Notification />,
        },
        {
          path: "/note/:id",
          element: <Note />,
        },
        {
          path: "/log",
          element: <Logs />,
        },
        {
          path: "/log/:id",
          element: <Log />,
        },
        {
          path: "/actuator_log",
          element: <Actuator_Logs />,
        },
        {
          path: "/actuator_log/:care_id",
          element: <Actuator_Log />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
