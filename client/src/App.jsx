import "./App.css";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import Home from "./pages/landing/home";
import Projects from "./pages/project/projects";
import ForgotPassword from "./pages/auth/forget-pwd";
import AppHome from "./pages/landing/app-home";
import Users from "./pages/users/users";
import UserProfile from "./pages/users/profil";
import CreateUser from "./pages/users/create-user";
import OwnProjects from "./pages/project/own-projects";
import User from "./pages/users/user";
import Privileges from "./pages/privilege/privilege";
import CreateWorkflow from "./pages/template/create-workflow";
import AddProject from "./pages/project/add-project";
import ProjectDashboard from "./pages/project/project-dashboard";
import Workflow from "./pages/template/workflow";
import Roles from "./pages/role/role";
import ProjectRoles from "./pages/role/project-role";
import GlobalRoles from "./pages/role/global-role";
import Workflows from "./pages/workflow/workflow";

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
          <Route path="/projects" element={<Projects />} />
          <Route path="/reset-pwd" element={<ForgotPassword />} />
          <Route path="/profil" element={<UserProfile />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/privileges" element={<Privileges />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/project/:id/dashboard" element={<ProjectDashboard />} />
          <Route path="/create-workflow" element={<Workflow />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/templates" element={<CreateWorkflow />} />
          <Route path="/roles/project" element={<ProjectRoles />} />
          <Route path="/roles/global" element={<GlobalRoles />} />
          <Route path="/workflows" element={<Workflows />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
