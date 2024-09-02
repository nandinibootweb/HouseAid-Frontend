import { useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
  useNavigate,
  Link,
  useRouteError,
  NavLink,
} from "react-router-dom";
// import "./App.css";
import Home from "./components/Home";
import Requests from "./components/Requests";
import UserDashboard from "./components/UserDashboard";
// import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Protected from "./components/Protected";
import Footer from "./components/Footer";
// import Contact from "./components/Contact";
import AuthProvider from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile_old";
import Mod_MyProfile from "./components/MyProfile/Mod_MyProfile";

const publicLinks = [
  { name: "Home", value: "/" },
  { name: "Login", value: "/login" },
  { name: "Sign Up", value: "/signup" },
];

const protectedLinks = [
  { name: "Home", value: "/app/" },
  { name: "+ Add new request", value: "/app/requests" },
  { name: "User Dashboard", value: "/app/user-dashboard" },
  { name: "My Profile", value: "/app/my-profile" },
  // { name: "MyP-old", value: "/app/my-profile-old" },
];

const PageLayout = ({ links, showLogout }) => {
  const navigate = useNavigate();

  return (
    <>
      <AuthProvider>
        <Navbar links={links} showLogout={showLogout} />
        <Outlet />
      </AuthProvider>
      <Footer />
    </>
  );
};

const ErrorBoundary = () => {
  let error = useRouteError();
  console.error(error);

  return (
    <>
      <p>Something Went Wrong!!!</p>
      <Link to="/"> Go To Home Page</Link>
    </>
  );
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          errorElement={<ErrorBoundary />}
          element={<PageLayout links={publicLinks} />}
        >
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route
          path="/"
          errorElement={<ErrorBoundary />}
          element={<PageLayout links={protectedLinks} showLogout />}
        >
          <Route path="app" element={<Protected />}>
            <Route index element={<Home />} />
            <Route path="requests" element={<Requests />} />
            <Route path="user-dashboard" element={<UserDashboard />} />
            {/* <Route path="my-profile-old" element={<Profile />} /> */}
            <Route path="my-profile" element={<Mod_MyProfile />} />
          </Route>
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
