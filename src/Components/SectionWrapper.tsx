import styled from "@emotion/styled";
import { colors } from "../style/styleVariables";

export interface ScrollDetailPanelSectionWrapperProps {
  title: string;

  children: JSX.Element;
  className?: string;
}

export default function SectionWrapper({
  title,
  children,
  className,
}: ScrollDetailPanelSectionWrapperProps) {
  return (
    <Wrapper className={className}>
      <h3>{title}</h3>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border-top: 2px solid ${colors.lightGray};
  margin: 20px 0;
  h3 {
    margin: 10px 0;
  }
`;
