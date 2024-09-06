import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
    return (
        <>
            <Navbar fixed={true} />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 mt-14">
                <Outlet />
            </div>
        </>
    )
}

export default MainLayout;

