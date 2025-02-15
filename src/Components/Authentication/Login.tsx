import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { colors } from "../../style/styleVariables";
import { Button, TextField, Typography, Link } from "@mui/material";
import { useState } from "react";
import { validateEmail } from "../../utils/helperMethods";
import apiAgent from "../../utils/apiAgent";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";

interface LoginProps {
  onSuccessLogin: Function;
  onRegisterClick: Function;
}

export default function Login({ onSuccessLogin, onRegisterClick }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (event: any) => {
    event.preventDefault();

    setEmailError(false);
    setPasswordError(false);

    if (email === "" || !validateEmail(email)) {
      setEmailError(true);
    }
    if (password === "" || password.length < 8) {
      setPasswordError(true);
    }

    if (email && password) {
      const data = await apiAgent.Auth.login({ email, password }); // call login api
      if (data.token && data.user) {
        dispatch(
          login({
            userInfo: data.user,
            accessToken: data.token.accessToken,
            refreshToken: data.token.refreshToken,
          })
        );
        onSuccessLogin(false);
      } else window.notify("error", "Failed to log in. Try again later.");
    }
  };

  // ref: https://www.copycat.dev/blog/material-ui-form/
  return (
    <LoginContainer>
      <FormWrapper>
        <form className="SignInForm" onSubmit={handleLogin}>
          <Typography variant="h4" component="h2" color="primary">
            Sign in
          </Typography>
          <p>Welcome, please sign in to continue</p>

          <TextField
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="email"
            sx={{ mb: 2 }}
            fullWidth
            size="small"
            value={email}
            error={emailError}
          />
          <TextField
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="password"
            value={password}
            error={passwordError}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <Button variant="outlined" type="submit">
            Sign in
          </Button>
          <Typography style={{ margin: "15px 0", maxWidth: "460px" }}>
            Need an account?{" "}
            <Link
              component="button"
              onClick={() => {
                onSuccessLogin(false);
                onRegisterClick(true);
              }}
            >
              Register here
            </Link>
          </Typography>
        </form>
      </FormWrapper>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  justify-content: center;
  display: flex;
  /* height: 92vh; */
  align-items: center;
`;
const FormWrapper = styled.div`
  border: 2px solid ${colors.primary};
  border-radius: 25px;
  display: flex;
  justify-content: center;

  form {
    display: grid;
    padding: 20px;
  }
`;
