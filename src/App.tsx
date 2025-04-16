import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./componentes/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import RequireAuth from "./componentes/RequireAuth";
import ToDoList from "./pages/ToDoList";

function App() {
  // Define application routes with protected and public paths
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // Protect layout and nested routes
        <RequireAuth>
          <Layout />
        </RequireAuth>
      ),
      errorElement: <NotFound />, // Fallback for invalid routes
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "list/:listId",
          element: <ToDoList />,
        },
      ],
    },
    {
      path: "/login",
      element: <LogIn />,
    },
  ]);
  return (
    <>
      {/* Provide the router to the app */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
