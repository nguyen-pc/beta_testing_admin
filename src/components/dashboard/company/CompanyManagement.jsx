import { Box, Button, IconButton, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { callFetchCompany, callDeleteCompany } from "../../../config/api"; // ✅ API company

const CompanyManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await callFetchCompany();
      if (res && res.data) {
        setCompanies(res.data);
      }
    } catch (error) {
      console.error("Fetch companies failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEdit = (id) => {
    const companyData = companies.find((c) => c.id === id);
    if (companyData) {
      navigate(`/dashboard/company/${id}/edit`, { state: companyData });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa công ty này không?")) {
      try {
        const res = await callDeleteCompany(id.toString());
        if (res) {
          alert("Xóa công ty thành công!");
          fetchCompanies(); // reload lại danh sách
        }
      } catch (error) {
        console.error("Xóa công ty thất bại:", error);
        alert("Không thể xóa công ty này!");
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "companyName",
      headerName: "Tên công ty",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "companyEmail",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "companyAddress",
      headerName: "Địa chỉ",
      flex: 1,
    },
    {
      field: "companyPhoneNumber",
      headerName: "Số điện thoại",
      width: 150,
    },
    {
      field: "companyMST",
      headerName: "Mã số thuế",
      width: 150,
    },
    {
      field: "active",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => (
        <span
          style={{
            color: params.row.active ? "green" : "red",
            fontWeight: 600,
          }}
        >
          {params.row.active ? "Hoạt động" : "Tạm ngưng"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon style={{ color: "#ffa500" }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon style={{ color: "#ff4d4f" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h2 style={{ color: colors.greenAccent[300], fontWeight: "bold" }}>
          QUẢN LÝ CÔNG TY
        </h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/company/new")}
        >
          + Thêm công ty
        </Button>
      </Box>

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={companies || []}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Box>
  );
};

export default CompanyManagement;
