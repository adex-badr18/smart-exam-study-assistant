import { Outlet } from "react-router";

const MockExamLayout = () => {
    return (
        <div className="bg-gray-50">
            <Outlet />
        </div>
    );
};

export default MockExamLayout;
