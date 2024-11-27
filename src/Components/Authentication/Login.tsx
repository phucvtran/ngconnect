import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { colors } from "../../style/styleVariables";
import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { validateEmail } from "../../utils/helperMethods";
// import { axios } from "../../utils/apiAgent";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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
      //TODO: call sign in api here
      console.log(email, password);
      // const response = await apiAgent.Auth.login({ email, password });
      // console.log(response);

      let response;
      try {
        // not through api agent because don't attach token for this public route
        // response = await axios.post<any>(
        //   "http://18.222.224.69:8080/api/users/login",
        //   // "https://api.sampleapis.com/coffee/hot",
        //   { email, password }
        // );
        response = await fetch("http://localhost:8080/api/users/login");
        console.log(response.json());
      } catch (e: any) {
        console.log(e);
        const errorObject = e?.response?.data;
        if (errorObject) {
          // unauthorized error or not found error
          console.log(errorObject);
        }
      }

      window.notify("success", "abc");
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
          <small style={{ margin: "15px 0", maxWidth: "460px" }}>
            Need an account? <Link to="/register">Register here</Link>
          </small>
        </form>
      </FormWrapper>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  justify-content: center;
  display: flex;
  height: 92vh;
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
