import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
  callAdminGetRewardBatches,
  callAdminFinalizeRewardBatch,
} from "../../../config/api";

import RewardEvidenceViewDialog from "./RewardEvidenceViewDialog";
import { formatChatTimeEmail } from "../../../util/timeFormatter";

const RewardManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [openFinalizeDialog, setOpenFinalizeDialog] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  // Evidence dialog
  const [openEvidenceDialog, setOpenEvidenceDialog] = useState(false);
  const [selectedEvidenceBatch, setSelectedEvidenceBatch] = useState<
    any | null
  >(null);

  // ==========================================================
  // LOAD DATA
  // ==========================================================
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await callAdminGetRewardBatches();
      console.log("Batches:", res.data);

      const list = (res.data || []).map((b: any) => ({
        id: b.id,
        campaignId: b.campaignId,
        campaignName: b.campaignName,
        status: b.status,
        totalAmount: b.totalAmount,
        note: b.note,
        createdAt: formatChatTimeEmail(b.createdAt),
        approvedAt: b.approvedAt,
        finalizedAt: b.finalizedAt,
      }));

      setBatches(list);
    } catch (err) {
      console.error(err);
      setBatches([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // ==========================================================
  // FINALIZE
  // ==========================================================
  const handleOpenFinalize = (row: any) => {
    setSelectedBatch(row);
    setOpenFinalizeDialog(true);
  };

  const handleFinalize = async () => {
    if (!selectedBatch) return;
    try {
      setFinalizing(true);
      const res = await callAdminFinalizeRewardBatch(selectedBatch.id);

      setBatches((prev) =>
        prev.map((b) => (b.id === selectedBatch.id ? { ...b, ...res.data } : b))
      );

      setOpenFinalizeDialog(false);
      setSelectedBatch(null);
      alert("Batch finalized successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to finalize batch!");
    } finally {
      setFinalizing(false);
    }
  };

  // ==========================================================
  // OPEN EVIDENCE VIEW
  // ==========================================================
  const handleOpenEvidence = (row: any) => {
    setSelectedEvidenceBatch(row);
    setOpenEvidenceDialog(true);
  };

  // ==========================================================
  // COLUMNS
  // ==========================================================
  const columns: GridColDef[] = [
    { field: "id", headerName: "Batch ID", width: 100 },
    { field: "campaignId", headerName: "Campaign ID", width: 120 },
    // {
    //   field: "campaignName",
    //   headerName: "Campaign Name",
    //   flex: 1,
    // },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const status = params.value;
        let color: "default" | "warning" | "success" | "info" = "default";
        if (status === "PENDING") color = "warning";
        if (status === "APPROVED") color = "info";
        if (status === "COMPLETED") color = "success";

        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 140,
      renderCell: (p) => `$${p.value ?? 0}`,
    },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "note", headerName: "Note", width: 200 },
    {
      field: "approvedAt",
      headerName: "Approved At",
      width: 180,
      renderCell: (p) => formatChatTimeEmail(p.value) || "-",
    },
    {
      field: "finalizedAt",
      headerName: "Finalized At",
      width: 180,
      renderCell: (p) => formatChatTimeEmail(p.value) || "-",
    },
    {
      field: "evidence",
      headerName: "Evidence",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleOpenEvidence(params.row)}
        >
          View Evidence
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const row = params.row;
        const disabled = row.status !== "APPROVED" || row.finalizedAt != null;

        return (
          <Button
            variant="contained"
            size="small"
            color="success"
            disabled={disabled}
            onClick={() => handleOpenFinalize(row)}
          >
            Finalize
          </Button>
        );
      },
    },
  ];

  // FILTER DATA
  const filteredRows = batches.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.campaignName?.toLowerCase().includes(q) ||
      b.note?.toLowerCase().includes(q) ||
      String(b.id).includes(q)
    );
  });

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={2}>
        Admin – Reward Batch Management
      </Typography>

      {/* FILTER + STAT */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            label="Search by name / note / id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260 }}
          />

          <Box flexGrow={1} />

          <Chip label={`Total: ${batches.length}`} sx={{ mr: 1 }} />
          <Chip
            label={`Completed: ${
              batches.filter((b) => b.status === "COMPLETED").length
            }`}
            color="success"
          />
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ p: 1 }}>
        {loading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
          />
        )}
      </Paper>

      {/* FINALIZE DIALOG */}
      <Dialog
        open={openFinalizeDialog}
        onClose={() => setOpenFinalizeDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Finalize Reward Batch</DialogTitle>
        <DialogContent>
          {selectedBatch && (
            <>
              <Typography mb={1}>
                Are you sure you want to finalize this batch?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Batch ID: <b>{selectedBatch.id}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Campaign:{" "}
                <b>{selectedBatch.campaignName || selectedBatch.campaignId}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Status: <b>{selectedBatch.status}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Total Amount: <b>${selectedBatch.totalAmount ?? 0}</b>
              </Typography>

              <Typography mt={2} variant="body2" color="error">
                After finalize:
                <br />– Company cannot edit this batch.
                <br />– Tester rewards are locked.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFinalizeDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleFinalize}
            disabled={finalizing}
          >
            {finalizing ? "Finalizing..." : "Confirm Finalize"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* EVIDENCE DIALOG */}
      <RewardEvidenceViewDialog
        open={openEvidenceDialog}
        onClose={() => setOpenEvidenceDialog(false)}
        batchId={selectedEvidenceBatch?.id || null}
      />
    </Box>
  );
};

export default RewardManagement;
