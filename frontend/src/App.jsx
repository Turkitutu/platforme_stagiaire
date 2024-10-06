import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import DemandeDeStage from "./pages/DemandeDeStage";
import Home from "./pages/Home";

import MainLayout from "./layouts/main";

import DashboardLayout from "./pages/admin/DashboardLayout";
import Etablissements from "./pages/admin/Etablissements";
import DemandesTable from "./pages/admin/DemandesTable";
import Encadrants from "./pages/admin/Encadrants";
import Stagaires from "./pages/admin/Stagaires";
import Users from "./pages/admin/Users";
import Session from "./pages/admin/Session";
import Login from "./pages/Login";

import Services from "./pages/admin/Services";
import { ConfigProvider } from "antd";

import frFR from 'antd/locale/fr_FR';
import { useState } from "react";
import Logout from "./pages/Logout";
import VerifyCIN from "./pages/VerifyCIN";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "demande_de_stage",
        element: <DemandeDeStage />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "verify",
        element: <VerifyCIN />,
      }
    ]
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DemandesTable />,
      },
      {
        path: "demandes",
        element: <DemandesTable />,
      },
      {
        path: "encadrants",
        element: <Encadrants />,
      },
      {
        path: "stagaires",
        element: <Stagaires />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "etablissements",
        element: <Etablissements />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "session",
        element: <Session />,
      },
    ]
  },
  {
    path: "logout",
    element: <Logout />,
  }
]);



function App() {

  const [locale] = useState(frFR);

  return (
    <>
      <ConfigProvider locale={locale}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </>
  )
}

export default App
