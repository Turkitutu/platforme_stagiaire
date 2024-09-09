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

import Services from "./pages/admin/Services";
import { ConfigProvider } from "antd";

import frFR from 'antd/locale/fr_FR';
import { useState } from "react";

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
        element: <h1>stagaires</h1>,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "etablissements",
        element: <Etablissements />,
      },
    ]
  },
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
