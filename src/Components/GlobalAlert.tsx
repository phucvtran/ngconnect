import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

const GlobalAlert: React.FC = () => {
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "warning" | "info" | "success";
  }>({ open: false, message: "", severity: "info" });

  const handleClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Assign the notify function to the global window object
  window.notify = (type, message) => {
    setAlert({ open: true, message, severity: type });
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={alert.severity} variant="filled">
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalAlert;
