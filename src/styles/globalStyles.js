import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-image: none;
  background-size: cover;
  background-position: center center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing space between components
export const SpacerXLarge = styled.div`
  height: 64px;
  width: 64px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "#000" : "none")};
  width: 100%;
  background-image: ${({ image,image2 }) => (`url(${image}) ,url(${image2})`)};
  background-position: right, top;
  background-repeat: no-repeat;
  background-size: cover;
}
`;

export const TextTitle = styled.p`
  color: var(--primary-text);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: var(--primary-text);
  font-size: 16px;
  line-height: 1.6;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const StyledLogo = styled.img`
  width: 150px;
  @media (min-width: 767px) {
    width: 100px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;
