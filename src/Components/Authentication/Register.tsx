import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { colors } from "../../style/styleVariables";
import { Button, Stack, TextField, Typography, Link } from "@mui/material";
import { useState } from "react";
import { UpdateCreateUserDto } from "../../models/User";
import { validateEmail } from "../../utils/helperMethods";
import apiAgent from "../../utils/apiAgent";
import { ERROR_MESSAGE, constants } from "../../utils/constants";

const emptyUser: UpdateCreateUserDto = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  city: "",
  state: "",
  zipcode: "",
  phone: "",
};

interface SignUpProps {
  onLoginClick: Function;
  onRegisterSuccessful: Function;
}

export default function Register({
  onLoginClick,
  onRegisterSuccessful,
}: SignUpProps) {
  const [createObj, setCreateObj] = useState<UpdateCreateUserDto>(emptyUser);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [warning, setWarning] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (event: any) => {
    if (warning.length) setWarning("");
    const { email, password, firstName, lastName } = createObj;
    event.preventDefault();

    let warningMessage = "";

    // only validate email and password, other required fields are checked by MUI
    if (!validateEmail(email)) warningMessage += ERROR_MESSAGE.INVALID_EMAIL;

    if (password.length < constants.PASSWORD_LENGTH)
      warningMessage += ERROR_MESSAGE.PASSWORD_LENGTH_VALIDATION;

    if (password !== confirmPassword)
      warningMessage += ERROR_MESSAGE.PASSWORD_MATCHING;

    if (warningMessage.length) {
      setWarning(warningMessage + ERROR_MESSAGE.PLEASE_TRY_AGAIN);
      return;
    }

    if (email && password && firstName && lastName) {
      const response = await apiAgent.Users.createUser(createObj);
      window.notify("success", response?.message);
      onLoginClick(true);
      onRegisterSuccessful(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setCreateObj({
      ...createObj,
      [name]: value !== "" ? value : null,
    });
  };

  // ref: https://www.copycat.dev/blog/material-ui-form/
  return (
    <Container>
      <FormWrapper>
        <form className="SignInForm" onSubmit={handleLogin}>
          <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
            Register
          </Typography>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
            <TextField
              label="First Name"
              sx={{ mb: 2 }}
              onChange={(e) => handleInputChange(e)}
              required
              variant="outlined"
              color="secondary"
              size="small"
              fullWidth
              name="firstName"
              value={createObj.firstName}
            />
            <TextField
              label="Last Name"
              sx={{ mb: 2 }}
              onChange={(e) => handleInputChange(e)}
              required
              variant="outlined"
              color="secondary"
              size="small"
              fullWidth
              name="lastName"
              value={createObj.lastName}
            />
          </Stack>

          <TextField
            label="Email"
            onChange={(e) => handleInputChange(e)}
            required
            variant="outlined"
            color="secondary"
            type="email"
            sx={{ mb: 2 }}
            size="small"
            fullWidth
            name="email"
            value={createObj.email}
          />
          <TextField
            label="Password"
            onChange={(e) => handleInputChange(e)}
            required
            variant="outlined"
            color="secondary"
            type="password"
            value={createObj.password}
            name="password"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="password"
            value={confirmPassword}
            name="confirmPassword"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Address"
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            name="address"
            value={createObj.address}
            sx={{ mb: 2 }}
          />

          <TextField
            label="City"
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            name="city"
            value={createObj.city}
            sx={{ mb: 2 }}
            required
          />
          <Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
            <TextField
              label="State"
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              name="state"
              value={createObj.state}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              label="Zipcode"
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              name="zipcode"
              value={createObj.zipcode}
              sx={{ mb: 2 }}
              required
            />
          </Stack>

          <TextField
            label="Phone"
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            fullWidth
            name="phone"
            value={createObj.phone}
            sx={{ mb: 2 }}
            required
          />

          {warning.length ? (
            <p style={{ color: "red", maxWidth: "460px" }}>{warning}</p>
          ) : null}
          <Button variant="outlined" type="submit">
            Sign up
          </Button>
          <Typography style={{ margin: "15px 0" }}>
            Already has an account?{" "}
            <Link
              component="button"
              onClick={() => {
                onLoginClick(true);
                onRegisterSuccessful(false);
              }}
            >
              Login here
            </Link>
          </Typography>
        </form>
      </FormWrapper>
    </Container>
  );
}

const Container = styled.div`
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
