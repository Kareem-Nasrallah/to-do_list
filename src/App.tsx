import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./componentes/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import RequireAuth from "./componentes/RequireAuth";
import ToDoList from "./pages/ToDoList";
import AuthPage from "./pages/AuthPage";

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
      errorElement: (
        <Layout>
          <NotFound />
        </Layout>
      ), // Fallback for invalid routes
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
      element: (
        <Layout>
          <AuthPage />
        </Layout>
      ),
    },
    {
      path: "/register",
      element: (
        <Layout>
          <AuthPage />
        </Layout>
      ),
    },
  ]);
  return (
    <div className="min-h-[100vh]">
      {/* Provide the router to the app */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
