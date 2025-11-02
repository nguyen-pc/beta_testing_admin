import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  styled,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callGetAllCampaigns } from "../../../config/api";

// 🎨 Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

// 👤 Author Component
function Author({ name, date }: { name: string; date?: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <AvatarGroup max={1}>
          <Avatar alt={name} />
        </AvatarGroup>
        <Typography variant="caption">{name}</Typography>
      </Box>
      {date && (
        <Typography variant="caption" color="text.secondary">
          {new Date(date).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}

// 💡 Main Component
export default function AllCampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const navigate = useNavigate();

  // 📦 Gọi API lấy tất cả campaign (có lọc)
  const fetchCampaigns = async () => {
    try {
      const query = `page=0&size=20${
        statusFilter ? `&campaignStatus=${statusFilter}` : ""
      }`;
      const res = await callGetAllCampaigns(query);
      setCampaigns(res.data.result || []);
      console.log("✅ All campaigns fetched:", res.data.result);
    } catch (err) {
      console.error("❌ Error fetching campaigns:", err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const handleDetailClick = (campaignId: number) => {
    navigate(`/dashboard/projects/${campaignId}/detail`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          All Campaigns
        </Typography>

        {/* Bộ lọc trạng thái */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          {["", "PENDING", "APPROVED", "REJECTED"].map((status) => (
            <Chip
              key={status || "all"}
              label={status || "All"}
              color={statusFilter === status ? "primary" : "default"}
              onClick={() => setStatusFilter(status)}
            />
          ))}
        </Box>

        {/* Danh sách campaign */}
        <Grid container spacing={2}>
          {campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign, index) => (
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }} key={campaign.id}>
                <StyledCard
                  onClick={() =>
                    handleDetailClick(campaign.id, campaign.campaignStatus)
                  }
                  variant="outlined"
                  tabIndex={0}
                >
                  <CardMedia
                    component="img"
                    alt={campaign.title}
                    image={
                      campaign?.bannerUrl
                        ? `http://localhost:8081/storage/project-banners/${campaign.bannerUrl}`
                        : "https://picsum.photos/800/450?random=2"
                    }
                    sx={{ height: 180, objectFit: "cover" }}
                  />

                  <StyledCardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {campaign.title}
                    </Typography>
                    <StyledTypography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      dangerouslySetInnerHTML={{
                        __html: campaign.description || "No description",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Chip
                        size="small"
                        label={campaign.campaignStatus}
                        color={
                          campaign.campaignStatus === "APPROVED"
                            ? "success"
                            : campaign.campaignStatus === "PENDING"
                            ? "warning"
                            : "default"
                        }
                      />
                      {campaign.campaignType.name && (
                        <Chip
                          size="small"
                          label={campaign.campaignType.name}
                          color="info"
                        />
                      )}
                    </Box>
                  </StyledCardContent>

                  <Author
                    name={campaign.createdBy || "Unknown"}
                    date={campaign.startDate}
                  />
                </StyledCard>
              </Grid>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ p: 3 }}>
              No campaigns found.
            </Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
