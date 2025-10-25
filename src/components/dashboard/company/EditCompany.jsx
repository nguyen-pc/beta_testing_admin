import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  callFetchCompanyById,
  callUpdateCompany,
  callSwitchStatusCompany,
  callFetchUserByCompanyId,
  callSendEmailAccount,
  // 👉 nếu bạn có API gửi mail thực tế, import ở đây:
  // callSendEmailToUser
} from "../../../config/api";
import FormUserAdd from "./FormUserAdd";

const EditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const companyData = location.state;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [company, setCompany] = useState(null);
  const [loadingSwitch, setLoadingSwitch] = useState(false);

  // ✅ Danh sách người dùng
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ✅ Dialog thêm user
  const [openUserDialog, setOpenUserDialog] = useState(false);

  // ---------------- Fetch công ty ----------------
  useEffect(() => {
    if (companyData) {
      setCompany(companyData);
      fetchUsersByCompany(companyData.id);
    } else if (id) {
      fetchCompanyDetail(id);
    }
  }, [companyData, id]);

  const fetchCompanyDetail = async (companyId) => {
    try {
      const res = await callFetchCompanyById(companyId);
      if (res && res.data) {
        setCompany(res.data);
        fetchUsersByCompany(res.data.id);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu công ty:", error);
    }
  };

  // ---------------- Fetch user theo company ----------------
  const fetchUsersByCompany = async (companyId) => {
    setLoadingUsers(true);
    try {
      const res = await callFetchUserByCompanyId(companyId);
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ---------------- Update company ----------------
  const handleFormSubmit = async (values) => {
    try {
      const res = await callUpdateCompany(values.id, values);
      if (res && res.statusCode === 200) {
        alert("Cập nhật công ty thành công!");
        navigate("/dashboard/company");
      } else {
        alert("Cập nhật công ty thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật công ty:", error);
      alert("Không thể cập nhật công ty!");
    }
  };

  // ---------------- Chuyển trạng thái ----------------
  const handleSwitchStatus = async () => {
    if (!company?.id) return;
    setLoadingSwitch(true);
    try {
      const res = await callSwitchStatusCompany(company.id);
      if (res && res.data) {
        alert(
          res.data.active
            ? "Công ty đã được kích hoạt!"
            : "Công ty đã bị tạm ngưng!"
        );
        setCompany(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi chuyển trạng thái công ty:", error);
      alert("Không thể thay đổi trạng thái!");
    } finally {
      setLoadingSwitch(false);
    }
  };

  // ---------------- Gửi email thật ----------------
  const handleSendEmail = async (user) => {
    try {
      const payload = {
        to: "nguyenthcs430@gmail.com",
        username: user.name,
        password: "123456",
      };
      console.log("📨 Sending email payload:", payload);
      const res = await callSendEmailAccount(payload);

      alert(`📧 Đã gửi email thông tin tài khoản đến ${user.email}`);
    } catch (error) {
      console.error("❌ Lỗi khi gửi email:", error);
      alert("Không thể gửi email!");
    }
  };

  // ---------------- Render ----------------
  if (!company) {
    return <p style={{ margin: 20 }}>Đang tải dữ liệu công ty...</p>;
  }

  return (
    <Box m="20px">
      {/* --- Header --- */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <h2>CẬP NHẬT THÔNG TIN CÔNG TY</h2>

        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={company.active}
                onChange={handleSwitchStatus}
                color="primary"
                disabled={loadingSwitch}
              />
            }
            label={company.active ? "Đang hoạt động" : "Đang tạm ngưng"}
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenUserDialog(true)}
          >
            Tạo người dùng mới
          </Button>
        </Box>
      </Box>

      {/* --- Form cập nhật công ty --- */}
      <Formik
        onSubmit={handleFormSubmit}
        enableReinitialize
        initialValues={{
          id: company.id,
          companyName: company.companyName || "",
          companyEmail: company.companyEmail || "",
          companyAddress: company.companyAddress || "",
          companyPhoneNumber: company.companyPhoneNumber || "",
          companyWebsite: company.companyWebsite || "",
          companyMST: company.companyMST || "",
          companyAddressMST: company.companyAddressMST || "",
          description: company.description || "",
          logo: company.logo || "",
          banner: company.banner || "",
          active: company.active || false,
        }}
        validationSchema={companySchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Tên công ty"
                name="companyName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyName}
                error={!!touched.companyName && !!errors.companyName}
                helperText={touched.companyName && errors.companyName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Email"
                name="companyEmail"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyEmail}
                error={!!touched.companyEmail && !!errors.companyEmail}
                helperText={touched.companyEmail && errors.companyEmail}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Địa chỉ"
                name="companyAddress"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyAddress}
                error={!!touched.companyAddress && !!errors.companyAddress}
                helperText={touched.companyAddress && errors.companyAddress}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Số điện thoại"
                name="companyPhoneNumber"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyPhoneNumber}
                error={
                  !!touched.companyPhoneNumber && !!errors.companyPhoneNumber
                }
                helperText={
                  touched.companyPhoneNumber && errors.companyPhoneNumber
                }
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Mã số thuế"
                name="companyMST"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyMST}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Địa chỉ MST"
                name="companyAddressMST"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyAddressMST}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Website"
                name="companyWebsite"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyWebsite}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                variant="filled"
                label="Mô tả"
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Cập nhật công ty
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* --- Danh sách user --- */}
      <Box mt={6}>
        <h3>Danh sách người dùng trong công ty</h3>

        {loadingUsers ? (
          <p>Đang tải danh sách...</p>
        ) : users.length === 0 ? (
          <p>Chưa có người dùng nào thuộc công ty này.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>#</th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Họ và tên
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Email
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Vai trò
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Ngày tạo
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {user.name}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {user.email}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {user.role?.name || "Chưa có vai trò"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleSendEmail(user)}
                    >
                      Gửi Email
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Box>

      {/* --- Dialog thêm user --- */}
      <Dialog
        open={openUserDialog}
        onClose={() => setOpenUserDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Tạo người dùng cho công ty: {company.companyName}
        </DialogTitle>
        <DialogContent>
          <FormUserAdd
            companyId={company.id}
            onSuccess={() => {
              setOpenUserDialog(false);
              fetchUsersByCompany(company.id);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ✅ Validation schema
const companySchema = yup.object().shape({
  companyName: yup.string().required("Vui lòng nhập tên công ty"),
  companyEmail: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email công ty"),
  companyAddress: yup.string().required("Vui lòng nhập địa chỉ công ty"),
  companyPhoneNumber: yup
    .string()
    .matches(/^[0-9]{9,15}$/, "Số điện thoại không hợp lệ"),
});

export default EditCompany;
