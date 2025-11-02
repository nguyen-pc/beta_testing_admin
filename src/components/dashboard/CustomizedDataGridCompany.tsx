import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import { callGetTop10Company } from "../../config/api";

export default function CustomizedDataGridCompany() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Gọi API khi component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await callGetTop10Company();
        if (res?.data) {
          const formatted = res.data.map((c: any, index: number) => ({
            id: index + 1, // ✅ số thứ tự tăng dần
            companyId: c.id, // ID thật nếu cần
            companyName: c.companyName || "—",
            companyEmail: c.companyEmail || "—",
            companyPhoneNumber: c.companyPhoneNumber || "—",
            companyAddress: c.companyAddress || "—",
            companyWebsite: c.companyWebsite || "—",
            companyMST: c.companyMST || "—",
            active: c.active ? "Active" : "Inactive",
          }));
          setRows(formatted);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // 🧭 Cấu hình cột hiển thị
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "STT",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1.2,
      minWidth: 160,
    },
    { field: "companyEmail", headerName: "Email", flex: 1, minWidth: 180 },
    {
      field: "companyPhoneNumber",
      headerName: "Phone",
      flex: 0.8,
      minWidth: 130,
    },
    { field: "companyAddress", headerName: "Address", flex: 1, minWidth: 180 },
    { field: "companyWebsite", headerName: "Website", flex: 1, minWidth: 160 },
    { field: "companyMST", headerName: "MST", flex: 0.8, minWidth: 120 },
    { field: "active", headerName: "Status", flex: 0.6, minWidth: 100 },
  ];

  // 🌀 Loading UI
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ❌ Không có dữ liệu
  if (!rows.length) {
    return (
      <Typography color="text.secondary">Không có công ty mới nào</Typography>
    );
  }

  // ✅ Render bảng
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        disableColumnResize
        density="compact"
      />
    </Box>
  );
}
