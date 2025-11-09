import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import { callCheckLinkSafety, callScanDownloadFile } from "../../../config/api";
import SecurityIcon from "@mui/icons-material/Security";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface LinkSafetyCheckerProps {
  links?: string[];
}

const LinkSafetyChecker: React.FC<LinkSafetyCheckerProps> = ({
  links = [],
}) => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});

  const handleCheck = async (
    link: string,
    mode: "check" | "scan",
    index: number
  ) => {
    setLoadingIndex(index);
    try {
      let res;
      if (mode === "check") res = await callCheckLinkSafety(link);
      else res = await callScanDownloadFile(link);
      console.log("Link safety result:", res.data);

      setResults((prev) => ({ ...prev, [link]: res.data }));
    } catch (err: any) {
      setResults((prev) => ({
        ...prev,
        [link]: { status: "ERROR", error: err.message },
      }));
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "#fafafa",
        mt: 3,
        mb: 5,
      }}
    >
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Kiểm tra độ an toàn của link tải
      </Typography>

      {links.length === 0 && (
        <Alert severity="info">
          Không phát hiện liên kết nào trong chiến dịch.
        </Alert>
      )}

      {links.length > 0 && (
        <Stack spacing={2}>
          {links.map((link, idx) => {
            const result = results[link];
            const isLoading = loadingIndex === idx;

            return (
              <Box
                key={idx}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "60%",
                    }}
                  >
                    🔗 {link}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="info"
                      startIcon={<SecurityIcon />}
                      onClick={() => handleCheck(link, "check", idx)}
                      disabled={isLoading}
                    >
                      Website
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      startIcon={<CloudDownloadIcon />}
                      onClick={() => handleCheck(link, "scan", idx)}
                      disabled={isLoading}
                    >
                      File
                    </Button>
                  </Stack>
                </Stack>

                {isLoading && (
                  <Box textAlign="center" mt={2}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                {result && (
                  <Box mt={2}>
                    {result.status === "ERROR" && (
                      <Alert severity="error">
                        ❌ Lỗi: {result.error || "Không thể kiểm tra link này!"}
                      </Alert>
                    )}

                    {typeof result === "string" && (
                      <Alert severity="info"> Kết quả: {result}</Alert>
                    )}
                    {result?.message && !result?.data && (
                      <Alert severity="success">{result.message}</Alert>
                    )}

                    {result.status === "DONE" && result.virusTotal && (
                      <>
                        <Alert
                          severity={
                            result.virusTotal?.stats?.malicious > 0 ||
                            result.virusTotal?.stats?.suspicious > 0
                              ? "warning"
                              : "success"
                          }
                          icon={
                            result.virusTotal?.stats?.malicious > 0 ? (
                              <WarningAmberIcon />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                        >
                          {result.virusTotal?.stats?.malicious > 0
                            ? "⚠️ Phát hiện file đáng ngờ hoặc độc hại!"
                            : "✅ Không phát hiện mã độc — File an toàn."}
                        </Alert>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                          🔹 SHA256: <b>{result.sha256}</b>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          🔹 Thống kê VirusTotal:
                          <pre
                            style={{
                              background: "#f5f5f5",
                              padding: "8px",
                              borderRadius: "6px",
                            }}
                          >
                            {JSON.stringify(result.virusTotal.stats, null, 2)}
                          </pre>
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      )}

      <Divider sx={{ mt: 3 }} />
    </Paper>
  );
};

export default LinkSafetyChecker;
