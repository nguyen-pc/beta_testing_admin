import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";

import { callGetRewardEvidence } from "../../../config/api";

interface Props {
  open: boolean;
  onClose: () => void;
  batchId: number;
}

const RewardEvidenceViewDialog: React.FC<Props> = ({
  open,
  onClose,
  batchId,
}) => {
  const [loading, setLoading] = useState(true);
  const [evidence, setEvidence] = useState<any | null>(null);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await callGetRewardEvidence(batchId);
      console.log("Evidence:", res.data);
      setEvidence(res.data);
    } catch {
      setEvidence(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchEvidence();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Evidence for Batch #{batchId}</DialogTitle>

      <DialogContent>
        {loading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : !evidence ? (
          <Typography color="error">No evidence uploaded yet.</Typography>
        ) : (
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            {evidence.fileUrl.endsWith(".pdf") ? (
              <a
                href={`http://localhost:8081/storage/reward-evidences/${evidence.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 Open PDF Evidence
              </a>
            ) : (
              <img
                src={evidence.fileUrl}
                alt="Evidence"
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  borderRadius: 8,
                }}
              />
            )}

            <Typography mt={1}>Note: {evidence.note || "(no note)"}</Typography>
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardEvidenceViewDialog;
