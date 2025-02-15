import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";

import logo from "../Assets/Images/YVH_Draft_AllWhite_Logo.png";
import apiAgent from "../utils/apiAgent";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { ModalContainer } from "./ModalContainer";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";

const pages = ["Home", "Job"];
const settings = ["My Account", "My Post", "Inbox", "Logout"];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.refreshToken
  );

  const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] =
    React.useState<boolean>(false);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page: string) => {
    setAnchorElNav(null);
    switch (page) {
      case "Home":
        navigate("/");
        break;
      case "Job":
        navigate("/jobs");
        break;
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuOptionClick = async (option: string) => {
    switch (option) {
      case "My Post":
        navigate("/myPost");
        break;
      case "Inbox":
        navigate("/inbox");
        break;
      case "Logout":
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const data = await apiAgent.Auth.logout({ refreshToken });
            if (data) {
              dispatch(logout());
              handleCloseUserMenu();
            }
          } catch (error) {
            window.notify("error", "Failed to sign out. Try again later.");
          }
        }

        break;
      default:
        console.log(option);
        break;
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex', backgroundImage: `url(${logo})` }, mr: 1 }} /> */}
          <img
            style={{ height: "50px", width: "50px", cursor: "pointer" }}
            src={logo}
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => {
              navigate("/");
            }}
            sx={{
              mr: 2,
              ml: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              // letterSpacing: '.3rem',
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            NG-Connect
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Button
            variant="outlined"
            onClick={() =>
              isAuthenticated
                ? navigate("/createListing")
                : setShowLoginModal(true)
            }
            style={{
              borderRadius: 15,
              backgroundColor: "white",
              fontWeight: "bold",
            }}
          >
            Looking for Work
          </Button>

          {isAuthenticated ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleMenuOptionClick(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Button
              variant="outlined"
              onClick={() => setShowLoginModal(true)}
              style={{
                borderRadius: 15,
                backgroundColor: "white",
                fontWeight: "bold",
              }}
            >
              Sign in
            </Button>
          )}

          {showLoginModal ? (
            <ModalContainer
              content={
                <Login
                  onSuccessLogin={setShowLoginModal}
                  onRegisterClick={setShowRegisterModal}
                />
              }
              onClose={() => {
                setShowLoginModal(false);
              }}
              open={showLoginModal}
              title="Sign Up / Log in"
            />
          ) : null}

          {showRegisterModal ? (
            <ModalContainer
              content={
                <Register
                  onLoginClick={setShowLoginModal}
                  onRegisterSuccessful={setShowRegisterModal}
                />
              }
              onClose={() => {
                setShowRegisterModal(false);
              }}
              open={showRegisterModal}
              title="Sign Up / Log in"
            />
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
