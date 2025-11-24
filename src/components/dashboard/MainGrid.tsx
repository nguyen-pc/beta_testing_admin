import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import StatCard from "./StatCard";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import Copyright from "../../internals/components/Copyright";
import { callGetDashboardStats } from "../../config/api";
import { Button, Stack } from "@mui/material";
import CustomizedTreeView from "./CustomizedTreeView";
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedDataGrid from "./CustomizedDataGrid";
import { useNavigate } from "react-router-dom";
import CustomizedDataGridCompany from "./CustomizedDataGridCompany";

export default function MainGrid() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await callGetDashboardStats();
        if (res?.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography color="error">Không có dữ liệu thống kê</Typography>;
  }

  // Chuẩn bị dữ liệu cho từng StatCard
  const cards = [
    {
      title: "Users",
      value: stats.totalUsers.toString(),
      interval: "Last 30 days",
      growthRate: stats.userGrowthRate, // ✅
      data: stats.userTrend.map((t: any) => t.count),
      labels: stats.userTrend.map((t: any) => t.date),
    },
    {
      title: "Companies",
      value: stats.totalCompanies.toString(),
      interval: "Last 30 days",
      growthRate: stats.companyGrowthRate, // ✅
      data: stats.companyTrend.map((t: any) => t.count),
      labels: stats.companyTrend.map((t: any) => t.date),
    },

    {
      title: "Projects",
      value: stats.totalProjects.toString(),
      interval: "Last 30 days",
      growthRate: stats.projectGrowthRate, // ✅
      data: stats.projectTrend.map((t: any) => t.count),
      labels: stats.projectTrend.map((t: any) => t.date),
    },
    {
      title: "Campaigns",
      value: stats.totalCampaigns.toString(),
      interval: "Last 30 days",
      growthRate: stats.campaignGrowthRate, // ✅
      data: stats.campaignTrend.map((t: any) => t.count),
      labels: stats.campaignTrend.map((t: any) => t.date),
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>

      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {cards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid sx={{ display: "flex", mb: 2, mt: 2 }}>
        <Typography
          component="h2"
          variant="h6"
          sx={{ mb: 2, marginRight: "20px", mt: 1 }}
        >
          New latest Customer
        </Typography>
        <Button
          onClick={() => navigate("/dashboard/user")}
          variant="contained"
          color="primary"
        >
          See all
        </Button>
      </Grid>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>

      <Grid sx={{ display: "flex", mb: 2, mt: 2 }}>
        <Typography
          component="h2"
          variant="h6"
          sx={{ mb: 2, marginRight: "20px", mt: 1 }}
        >
          New latest companies
        </Typography>
        <Button
          onClick={() => navigate("/dashboard/company")}
          variant="contained"
          color="primary"
        >
          See all
        </Button>
      </Grid>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGridCompany />
        </Grid>
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
