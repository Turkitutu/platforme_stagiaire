import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
    return (
        <>
            <Navbar fixed={false} />
            <div className="min-h-screen bg-gray-100">
                <Outlet />
            </div>
        </>
    )
}

export default DashboardLayout;

