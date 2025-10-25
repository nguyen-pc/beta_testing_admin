import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeSignUp from "../pages/home/HomeSignUp";
import SignInSide from "../pages/auth/SignInSide";
import SignUpSide from "../pages/auth/SignUpSign";
import Home from "../pages/home/Home";
import ProjectShow from "../components/home/ProjectShow";
import DetailCampaign from "../pages/home/DetailCampaign";
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/dashboard/Analytics";
import User from "../pages/dashboard/User";
import Role from "../pages/dashboard/Role";
import Profile from "../pages/profile/Profile";
import Permission from "../pages/dashboard/Permission";
import Company from "../pages/dashboard/Company";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home/*" element={<Home />} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUpSide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home/detail/:campaignId" element={<DetailCampaign />} />
        <Route path="/home_signup" element={<HomeSignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/projects/*" element={<Analytics />} />
        <Route path="/dashboard/user/*" element={<User />} />
        <Route path="/dashboard/role/*" element={<Role />} />
        <Route path="/dashboard/permission/*" element={<Permission />} />
        <Route path="/dashboard/company/*" element={<Company />} />
        
      </Routes>
    </BrowserRouter>
  );
}
