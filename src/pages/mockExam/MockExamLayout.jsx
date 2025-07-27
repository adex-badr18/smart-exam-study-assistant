import { Outlet, ScrollRestoration } from "react-router";

const MockExamLayout = () => {
    return (
        <div className="bg-gray-50">
            <Outlet />
            <ScrollRestoration />
        </div>
    );
};

export default MockExamLayout;
