import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  callCreateRejectReason,
  callCreateNotification,
  callGetUserByEmail,
  callGetProjectByCampaign,
} from "../../../config/api";

interface RejectReasonDialogProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle?: string;
  createdBy?: string; // email người tạo campaign
  onRejectSuccess: () => void;
}

export default function RejectReasonDialog({
  open,
  onClose,
  campaignId,
  campaignTitle,
  createdBy,
  onRejectSuccess,
}: RejectReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("⚠️ Vui lòng nhập lý do từ chối.");
      return;
    }

    try {
      setLoading(true);
      setSuccessMsg("");

      await callCreateRejectReason(campaignId, reason);

      let targetUserId: number | null = null;
      if (createdBy) {
        const resUser = await callGetUserByEmail(createdBy);
        console.log("Fetched user by email:", resUser);
        targetUserId = resUser.data?.id;
      }

      const resProject = await callGetProjectByCampaign(campaignId);

      if (targetUserId) {
        const message = `Chiến dịch "${
          campaignTitle || "Không rõ tên"
        }" đã bị từ chối. Lý do: ${reason}`;
        await callCreateNotification({
          userId: targetUserId,
          title: "Chiến dịch bị từ chối",
          message,
          type: "REJECT_PROJECT",
          link: `/dashboard/project/${resProject.data?.id}/campaign/${campaignId}`,
        });

      } else {
        console.warn(" Không tìm thấy user để gửi thông báo.");
      }

      setSuccessMsg("✅ Đã gửi lý do từ chối thành công!");
      setReason("");

      setTimeout(() => {
        setSuccessMsg("");
        onClose();
        onRejectSuccess();
      }, 1200);
    } catch (error) {
      console.error("❌ Lỗi khi gửi lý do:", error);
      alert("Gửi thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
        Từ chối chiến dịch
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Vui lòng nêu rõ lý do không chấp nhận chiến dịch này để công ty có thể
          chỉnh sửa hoặc phản hồi lại.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={1}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do từ chối..."
          variant="outlined"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={2}
          >
            <CircularProgress size={28} />
          </Box>
        )}

        {successMsg && (
          <Typography color="success.main" textAlign="center" fontWeight="500">
            {successMsg}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Đang gửi..." : "Gửi lý do từ chối"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
