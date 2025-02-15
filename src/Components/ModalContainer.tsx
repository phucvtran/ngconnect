import styled from "@emotion/styled";
import { Close } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { ReactNode } from "react";
import { colors } from "../style/styleVariables";

interface ModalProps {
  content: ReactNode;
  size?: string;
  onClose: Function;
  open: boolean;
  title: string;
}

export const ModalContainer = ({
  content,
  size = "lg",
  onClose,
  open,
  title,
}: ModalProps) => {
  return open ? (
    <Container>
      {
        <StyledModalContainer size={size} title={title}>
          <StyledModalHeader>
            <h3>{title}</h3>
            <IconButton aria-label="close" onClick={() => onClose()}>
              <Close />
            </IconButton>
          </StyledModalHeader>
          <StyledModalBody>{content}</StyledModalBody>
        </StyledModalContainer>
      }
    </Container>
  ) : null;
};

const Container = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(108 110 128 / 50%);
  z-index: 1000;
  color: ${colors.textColor};
`;

const StyledModalContainer = styled.div<{ size: string }>`
  position: "absolute";
  top: "50%";
  left: "50%";
  transform: "translate(-50%, -50%)";
  background-color: ${colors.primaryBackgroundColor};
  border: solid 2px ${colors.primary};
  border-radius: 10px;
  width: ${(props) =>
    props.size === "sm" ? "30%" : props.size === "md" ? "40%" : "60%"};
  // height: size == "sm" ? "30%" : size === "md" ? "50%" : "80%",
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: solid 2px ${colors.primary};
  padding: 0 20px;
  background-color: ${colors.secondaryBackgroundColor};
`;

const StyledModalBody = styled.div`
  display: block;
  padding: 0 20px;
  margin: 20px 0;
`;
