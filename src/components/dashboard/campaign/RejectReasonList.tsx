import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Collapse,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { callGetRejectReasons } from "../../../config/api";
import RejectChatDialog from "./RejectChatDialog";

interface RejectReasonListProps {
  campaignId: string;
}

export default function RejectReasonList({
  campaignId,
}: RejectReasonListProps) {
  const [reasons, setReasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [openChat, setOpenChat] = useState(false);

  const fetchReasons = async () => {
    setLoading(true);
    try {
      const res = await callGetRejectReasons(campaignId);
      setReasons(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách lý do:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, [campaignId]);

  const parseReason = (raw: string) => {
    try {
      const obj = JSON.parse(raw);
      return obj.reason || raw;
    } catch {
      return raw;
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={3}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
        Danh sách lý do từ chối
      </Typography>

      {reasons.length === 0 ? (
        <Typography color="text.secondary">Chưa có lý do nào.</Typography>
      ) : (
        <Stack spacing={2}>
          {reasons.map((r) => {
            const isExpanded = expandedId === r.id;
            const reasonText = parseReason(r.initialReason);
            return (
              <Paper
                key={r.id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 1,
                  backgroundColor: "#fafbfc",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1" fontWeight="500">
                    {reasonText.length > 50
                      ? reasonText.slice(0, 50) + "..."
                      : reasonText}
                  </Typography>
                  <IconButton
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    size="small"
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {new Date(r.createdAt).toLocaleString()}
                </Typography>

                <Collapse in={isExpanded}>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {reasonText}
                  </Typography>

                  <Button
                    startIcon={<ChatBubbleOutlineIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedReason(r);
                      setOpenChat(true);
                    }}
                  >
                    Xem phản hồi
                  </Button>
                </Collapse>
              </Paper>
            );
          })}
        </Stack>
      )}

      {selectedReason && (
        <RejectChatDialog
          open={openChat}
          onClose={() => setOpenChat(false)}
          reason={selectedReason}
        />
      )}
    </Box>
  );
}
