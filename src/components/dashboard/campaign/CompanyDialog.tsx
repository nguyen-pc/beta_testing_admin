import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  DialogActions,
  Button,
  Divider,
  Grid,
  Stack,
  Chip,
  Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BusinessIcon from "@mui/icons-material/Business";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { callGetCompanyByCampaign } from "../../../config/api";

interface CompanyDialogProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
}

export default function CompanyDialog({
  open,
  onClose,
  campaignId,
}: CompanyDialogProps) {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (open && campaignId) {
      setLoading(true);
      callGetCompanyByCampaign(campaignId)
        .then((res) => setCompany(res.data))
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
      {company?.banner && (
        <Box
          component="img"
          src={`http://localhost:8081/storage/company-banners/${company.banner}`}
          alt={company.companyName}
          sx={{
            width: "100%",
            height: 220,
            objectFit: "cover",
          }}
        />
      )}

      {/* Tiêu đề */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "primary.main",
          borderBottom: "1px solid #eee",
          pb: 1,
        }}
      >
        Thông tin Công ty
      </DialogTitle>

      {/* Nội dung */}
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
        ) : company ? (
          <Stack spacing={3}>
            {/* Header với logo và tên công ty */}
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={
                  company.logo
                    ? `http://localhost:8081/storage/company-logos/${company.logo}`
                    : undefined
                }
                alt={company.companyName}
                sx={{ width: 72, height: 72, boxShadow: 2 }}
              />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {company.companyName}
                </Typography>
                <Chip
                  label={company.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                  color={company.active ? "success" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Divider />

            {/* Thông tin chính */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon color="primary" />
                  <Typography fontWeight={600}>Email:</Typography>
                </Box>
                <Typography color="text.secondary" ml={4}>
                  {company.companyEmail || "Không có"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneAndroidIcon color="primary" />
                  <Typography fontWeight={600}>Số điện thoại:</Typography>
                </Box>
                <Typography color="text.secondary" ml={4}>
                  {company.companyPhoneNumber || "Không có"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOnIcon color="primary" />
                  <Typography fontWeight={600}>Địa chỉ:</Typography>
                </Box>
                <Typography color="text.secondary" ml={4}>
                  {company.companyAddress || "Không có"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LanguageIcon color="primary" />
                  <Typography fontWeight={600}>Website:</Typography>
                </Box>
                {company.companyWebsite ? (
                  <Link
                    href={
                      company.companyWebsite.startsWith("http")
                        ? company.companyWebsite
                        : `https://${company.companyWebsite}`
                    }
                    target="_blank"
                    rel="noopener"
                    ml={4}
                    color="text.secondary"
                    underline="hover"
                  >
                    {company.companyWebsite}
                  </Link>
                ) : (
                  <Typography color="text.secondary" ml={4}>
                    Không có
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Divider />

            {/* Thông tin mô tả */}
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <InfoOutlinedIcon color="primary" />
                <Typography fontWeight={600}>Giới thiệu công ty:</Typography>
              </Box>
              <Typography
                color="text.secondary"
                sx={{
                  pl: 4,
                  borderLeft: "4px solid #1976d2",
                  lineHeight: 1.7,
                  fontStyle: company.description ? "normal" : "italic",
                }}
              >
                {company.description ||
                  "Không có mô tả chi tiết cho công ty này."}
              </Typography>
            </Box>

            {/* Mã số thuế (nếu có) */}
            {company.companyMST && (
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <BusinessIcon color="primary" />
                  <Typography fontWeight={600}>Mã số thuế:</Typography>
                </Box>
                <Typography color="text.secondary" ml={4}>
                  {company.companyMST}
                </Typography>
              </Box>
            )}
          </Stack>
        ) : (
          <Typography color="error" align="center">
            Không tìm thấy thông tin công ty.
          </Typography>
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          px: 3,
          py: 2,
          borderTop: "1px solid #eee",
        }}
      >
        <Button variant="contained" color="primary" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
