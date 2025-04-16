import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-base-100 text-center p-4">
      <h1 className="text-6xl font-bold text-error mb-4">404</h1>
      <p className="text-xl mb-6 text-base-content">Oops! The page you are looking for doesn’t exist.</p>
      
      {/* Button that navigates back to home */}
      <Link
        to="/"
        className="btn btn-primary flex items-center gap-2"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;