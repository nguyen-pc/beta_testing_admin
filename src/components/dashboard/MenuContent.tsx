import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: "/dashboard" },
  { text: "User", icon: <PersonRoundedIcon />, path: "/dashboard/user" },
  {
    text: "Projects",
    icon: <AnalyticsRoundedIcon />,
    path: "/dashboard/projects",
  },
  { text: "Clients", icon: <PeopleRoundedIcon />, path: "/dashboard/company" },
  { text: "Reward", icon: <RedeemRoundedIcon />, path: "/dashboard/reward" },
  { text: "Role", icon: <BusinessRoundedIcon />, path: "/dashboard/role" },
  {
    text: "Permission",
    icon: <SecurityRoundedIcon />,
    path: "/dashboard/permission",
  },
];

const secondaryListItems = [
  {
    text: "Settings",
    icon: <SettingsRoundedIcon />,
    path: "/dashboard/setting-user",
  },
  { text: "About", icon: <InfoRoundedIcon />, path: "/dashboard/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "/dashboard/feedback" },
];

export default function MenuContent() {
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={item.path ? Link : "div"}
              to={item.path ? item.path : undefined}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={item.path ? Link : "div"}
              to={item.path ? item.path : undefined}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
