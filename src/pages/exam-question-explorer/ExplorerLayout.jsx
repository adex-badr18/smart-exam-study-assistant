import { Outlet } from "react-router"

const ExplorerLayout = () => {
  return (
    <div className="bg-gray-50">
    <Outlet />
    </div>
  )
}

export default ExplorerLayout