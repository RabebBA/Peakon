import "./App.css";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Home from "./pages/home";
import Boards from "./pages/dashboard";
import ForgotPassword from "./pages/forget-pwd";
import AppHome from "./pages/app-home";
import Users from "./pages/users";
import UserProfile from "./pages/profil";
import CreateUser from "./pages/create-user";
import OwnProjects from "./pages/own-projects";
import User from "./pages/user";
import Privileges from "./pages/privilege";
import CreateWorkflow from "./pages/create-workflow";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />{" "}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<AppHome />} />
          <Route path="/users" element={<Users />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/own-projewt" element={<OwnProjects />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Boards />} />
          <Route path="/reset-pwd" element={<ForgotPassword />} />
          <Route path="/profil" element={<UserProfile />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/privileges" element={<Privileges />} />
          <Route path="/add-template" element={<CreateWorkflow />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
