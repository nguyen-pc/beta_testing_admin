import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography } from "@mui/material";
import { callGetTop10User } from "../../config/api"; // ✅ import API call

export default function CustomizedDataGrid() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Gọi API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await callGetTop10User();
        if (res?.data) {
          // map dữ liệu backend thành dạng DataGrid
          const formatted = res.data.map((u: any, index: number) => ({
            id: index + 1, // ✅ đánh số thứ tự tăng dần (1,2,3,…)
            userId: u.id, // vẫn giữ ID thật (nếu sau này cần)
            name: u.name || "—",
            email: u.email || "—",
            role: u.role?.name || "—",
            company: u.companyProfile?.name || "—",
            createdAt: new Date(u.createdAt).toLocaleString("vi-VN"),
          }));
          setRows(formatted);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🧭 Định nghĩa cột
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "STT",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1.2, minWidth: 200 },
    { field: "role", headerName: "Role", flex: 0.8, minWidth: 130 },
    { field: "company", headerName: "Company", flex: 1, minWidth: 150 },
    { field: "createdAt", headerName: "Created At", flex: 1, minWidth: 180 },
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

  if (!rows.length) {
    return (
      <Typography color="text.secondary">Không có user mới nào</Typography>
    );
  }

  // ✅ Hiển thị DataGrid
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
