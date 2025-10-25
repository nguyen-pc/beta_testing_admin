import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { callCreateCompany } from "../../../config/api"; // ✅ dùng API tạo công ty

const FormCompanyAdd = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await callCreateCompany(values);
      if (res && res.statusCode === 201) {
        alert("Tạo công ty thành công!");
        navigate("/dashboard/company"); // quay lại trang danh sách
      } else {
        alert(res?.message || "Tạo công ty thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo công ty:", error);
      alert("Không thể tạo công ty!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <h2 className="mb-4">THÊM MỚI CÔNG TY</h2>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Tên công ty */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Tên công ty"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyName}
                name="companyName"
                error={!!touched.companyName && !!errors.companyName}
                helperText={touched.companyName && errors.companyName}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Email */}
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email công ty"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyEmail}
                name="companyEmail"
                error={!!touched.companyEmail && !!errors.companyEmail}
                helperText={touched.companyEmail && errors.companyEmail}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Số điện thoại */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Số điện thoại"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyPhoneNumber}
                name="companyPhoneNumber"
                error={
                  !!touched.companyPhoneNumber && !!errors.companyPhoneNumber
                }
                helperText={
                  touched.companyPhoneNumber && errors.companyPhoneNumber
                }
                sx={{ gridColumn: "span 2" }}
              />

              {/* Mã số thuế */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Mã số thuế"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyMST}
                name="companyMST"
                error={!!touched.companyMST && !!errors.companyMST}
                helperText={touched.companyMST && errors.companyMST}
                sx={{ gridColumn: "span 2" }}
              />

              {/* Địa chỉ */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Địa chỉ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyAddress}
                name="companyAddress"
                error={!!touched.companyAddress && !!errors.companyAddress}
                helperText={touched.companyAddress && errors.companyAddress}
                sx={{ gridColumn: "span 4" }}
              />

              {/* Website */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Website"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyWebsite}
                name="companyWebsite"
                sx={{ gridColumn: "span 2" }}
              />

              {/* Địa chỉ MST */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Địa chỉ MST"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyAddressMST}
                name="companyAddressMST"
                sx={{ gridColumn: "span 2" }}
              />

              {/* Mô tả */}
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="filled"
                type="text"
                label="Mô tả"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Tạo công ty"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// ✅ Schema kiểm tra đầu vào
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
  companyMST: yup.string().required("Vui lòng nhập mã số thuế"),
});

// ✅ Giá trị khởi tạo
const initialValues = {
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  companyPhoneNumber: "",
  companyWebsite: "",
  companyMST: "",
  companyAddressMST: "",
  description: "",
  logo: "",
  banner: "",
  active: false,
};

export default FormCompanyAdd;
