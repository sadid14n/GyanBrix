import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-600 mt-2">
        You are not authorized to view this page.
      </p>
      <button
        onClick={() => navigate("/")}
        className="border-2 py-2 px-5 rounded-lg bg-primary text-white cursor-pointer"
      >
        Go Home
      </button>
    </div>
  );
};

export default Unauthorized;
