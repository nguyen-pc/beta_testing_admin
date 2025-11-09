import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  CircularProgress,
  DialogActions,
  Button,
  Divider,
  Chip,
  Avatar,
  Grid,
  Stack,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ApartmentIcon from "@mui/icons-material/Apartment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { callGetProjectByCampaign } from "../../../config/api";
import { formatChatTimeEmail } from "../../../util/timeFormatter";

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
}

export default function ProjectDialog({
  open,
  onClose,
  campaignId,
}: ProjectDialogProps) {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    if (open && campaignId) {
      setLoading(true);
      callGetProjectByCampaign(campaignId)
        .then((res) => setProject(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [open, campaignId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 6,
        },
      }}
    >
      {/* Banner */}
      {project?.bannerUrl && (
        <Box
          component="img"
          src={`http://localhost:8081/storage/project-banners/${project.bannerUrl}`}
          alt={project.projectName}
          sx={{
            width: "100%",
            height: 220,
            objectFit: "cover",
          }}
        />
      )}

      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "primary.main",
          borderBottom: "1px solid #eee",
          pb: 1,
        }}
      >
        {project?.projectName || "Thông tin Project"}
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: "#fafafa" }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={5}
          >
            <CircularProgress />
          </Box>
        ) : project ? (
          <Stack spacing={3}>
            {/* Thông tin mô tả */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.7,
                borderLeft: "4px solid #1976d2",
                pl: 2,
                fontStyle: project.description ? "normal" : "italic",
              }}
            >
              {project.description || "Không có mô tả cho project này."}
            </Typography>

            <Divider />

            {/* Thông tin chính */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <InfoOutlinedIcon color="primary" />
                  <Typography fontWeight={600}>Trạng thái:</Typography>
                </Box>
                <Chip
                  label={project.status ? "Hoạt động" : "Tạm ngưng"}
                  color={project.status ? "success" : "default"}
                  size="small"
                  sx={{ ml: 4, mt: 0.5 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ApartmentIcon color="primary" />
                  <Typography fontWeight={600}>Công ty:</Typography>
                </Box>
                <Typography color="text.secondary" ml={4} mt={0.5}>
                  {project.companyName || "Chưa gắn công ty"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarMonthIcon color="primary" />
                  <Typography fontWeight={600}>Ngày bắt đầu:</Typography>
                </Box>
                <Typography color="text.secondary" ml={4} mt={0.5}>
                  {project.startDate
                    ? formatChatTimeEmail(project.startDate)
                    : "Chưa có"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarMonthIcon color="primary" />
                  <Typography fontWeight={600}>Ngày kết thúc:</Typography>
                </Box>
                <Typography color="text.secondary" ml={4} mt={0.5}>
                  {project.endDate
                    ? formatChatTimeEmail(project.endDate)
                    : "Chưa có"}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        ) : (
          <Typography color="error" align="center">
            Không tìm thấy thông tin project.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Dự án được tạo bởi {project?.createdBy || "Hệ thống"}
        </Typography>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
