import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Category as CategoryIcon,
  Timer as TimerIcon,
  MonetizationOn as MonetizationOnIcon,
  Public as PublicIcon,
  Lock as LockIcon,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import { callGetCampaign, callUpdateCampaignStatus } from "../../../config/api";
import { useAppSelector } from "../../../redux/hooks";
import UseCaseSection from "./UseCaseSection";
import { formatChatTimeEmail } from "../../../util/timeFormatter";
import parse from "html-react-parser";
import { extractLinksFromText } from "../../../util/extractLinks";
import LinkSafetyChecker from "./LinkSafetyChecker";
import ProjectDialog from "./ProjectDialog";
import CompanyDialog from "./CompanyDialog";

export default function CampaignDetailUser() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [updating, setUpdating] = React.useState(false);
  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();

  const [openProject, setOpenProject] = React.useState(false);
  const [openCompany, setOpenCompany] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await callGetCampaign(campaignId);
      console.log("Fetched campaign:", res);
      setCampaign(res.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      alert("⚠️ Vui lòng chọn trạng thái trước khi cập nhật!");
      return;
    }
    try {
      setUpdating(true);
      const res = await callUpdateCampaignStatus(campaignId!, newStatus);
      setCampaign(res.data);
      alert("✅ Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      alert("❌ Cập nhật thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  const descriptionLinks = extractLinksFromText(campaign?.description || "");
  const instructionLinks = extractLinksFromText(campaign?.instructions || "");
  const allLinks = Array.from(
    new Set([...descriptionLinks, ...instructionLinks])
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" py={10}>
        Lỗi khi tải dữ liệu chiến dịch.
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6} alignItems="center">
        {/* ====== TRÁI ====== */}
        <Grid item size={{ xs: 12, md: 12 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h4" fontWeight="bold">
              {campaign?.title || "Tên chiến dịch"}
            </Typography>
            {/* Chip hiển thị trạng thái hiện tại */}
            <Chip
              label={campaign?.campaignStatus}
              color={
                campaign?.campaignStatus === "APPROVED"
                  ? "success"
                  : campaign?.campaignStatus === "PENDING"
                  ? "warning"
                  : campaign?.campaignStatus === "REJECTED"
                  ? "default"
                  : "info"
              }
              size="small"
            />
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 3 }}
          >
            {parse(campaign?.description) ||
              "Chưa có mô tả cho chiến dịch này."}
          </Typography>

          {/* ===== FORM CẬP NHẬT TRẠNG THÁI ===== */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              mb: 4,
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 2,
            }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Trạng thái mới</InputLabel>
              <Select
                value={newStatus}
                label="Trạng thái mới"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="APPROVED">APPROVED</MenuItem>
                <MenuItem value="REJECTED">REJECTED</MenuItem>
                {/* <MenuItem value="PUBLISHED">PUBLISHED</MenuItem> */}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateStatus}
              disabled={updating}
            >
              {updating ? "Đang cập nhật..." : "Cập nhật trạng thái"}
            </Button>

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpenProject(true)}
              >
                Xem Project
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpenCompany(true)}
              >
                Xem Company
              </Button>
            </Box>
          </Box>

          {/* ===== THÔNG TIN CHIẾN DỊCH ===== */}
          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "#f9f9fb" : "#1e1e1e",
              borderRadius: 3,
              p: 3,
              mb: 4,
              boxShadow: 1,
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "primary.main" }}
            >
              Thông tin chiến dịch
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {/* Thời gian */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon color="action" />
                  <Typography variant="body2" fontWeight={500}>
                    Thời gian:
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" ml={4}>
                  {campaign?.startDate && campaign?.endDate
                    ? `${formatChatTimeEmail(
                        campaign.startDate
                      )} → ${formatChatTimeEmail(campaign.endDate)}`
                    : "Chưa cập nhật"}
                </Typography>
              </Grid>

              {/* Loại chiến dịch */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CategoryIcon color="action" />
                  <Typography variant="body2" fontWeight={500}>
                    Loại chiến dịch:
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" ml={4}>
                  {campaign?.campaignType?.name || "Chưa xác định"}
                </Typography>
              </Grid>

              {/* Thời lượng */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TimerIcon color="action" />
                  <Typography variant="body2" fontWeight={500}>
                    Thời lượng ước tính:
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" ml={4}>
                  {campaign?.estimatedTime || "Không có"}
                </Typography>
              </Grid>

              {/* Phần thưởng */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <MonetizationOnIcon color="action" />
                  <Typography variant="body2" fontWeight={500}>
                    Phần thưởng:
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" ml={4}>
                  {campaign?.rewardValue
                    ? `${campaign.rewardValue}$`
                    : "Chưa có phần thưởng"}
                </Typography>
              </Grid>

              {/* Công khai */}
              {/* <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  {campaign?.isPublic ? (
                    <PublicIcon color="success" />
                  ) : campaign?.isPublic === false ? (
                    <LockIcon color="warning" />
                  ) : (
                    <LockIcon color="disabled" />
                  )}
                  <Typography variant="body2" fontWeight={500}>
                    Công khai:
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" ml={4}>
                  {campaign?.isPublic
                    ? "Công khai"
                    : campaign?.isPublic === false
                    ? "Riêng tư"
                    : "Chưa xác định"}
                </Typography>
              </Grid> */}
            </Grid>
          </Box>
        </Grid>

        {/* ====== PHẢI ====== */}
        <Grid item size={{ xs: 12, md: 12 }}>
          <Box
            component="img"
            src={
              campaign?.bannerUrl
                ? `http://localhost:8081/storage/project-banners/${campaign.bannerUrl}`
                : "https://picsum.photos/800/450?random=2"
            }
            alt="Campaign Illustration"
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: 4,
              objectFit: "cover",
            }}
          />
        </Grid>

        {/* ====== HƯỚNG DẪN ====== */}
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "#f9f9fb" : "#1e1e1e",
            borderRadius: 3,
            p: 3,
            mb: 4,
            boxShadow: 1,
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: "primary.main" }}
          >
            Hướng dẫn sử dụng
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {parse(campaign?.instructions) ||
              "Chưa có hướng dẫn cho chiến dịch này."}
          </Typography>
        </Box>
      </Grid>

      <LinkSafetyChecker links={allLinks} />
      {/* ====== USE CASE SECTION ====== */}
      <UseCaseSection useCases={campaign?.useCases || []} />

      <ProjectDialog
        open={openProject}
        onClose={() => setOpenProject(false)}
        campaignId={campaignId!}
      />
      <CompanyDialog
        open={openCompany}
        onClose={() => setOpenCompany(false)}
        campaignId={campaignId!}
      />
    </Container>
  );
}
