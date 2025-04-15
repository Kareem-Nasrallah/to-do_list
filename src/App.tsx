import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./componentes/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import RequireAuth from "./componentes/RequireAuth";
import ToDoList from "./pages/ToDoList";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RequireAuth>
          <Layout />
        </RequireAuth>
      ),
      errorElement: <NotFound />,
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
      <RouterProvider router={router} />
    </>
  );
}

export default App;
