import { Outlet, ScrollRestoration } from "react-router";

const ExplorerLayout = () => {
    return (
        <div className="bg-gray-50">
            <Outlet />
            <ScrollRestoration />
        </div>
    );
};

export default ExplorerLayout;
