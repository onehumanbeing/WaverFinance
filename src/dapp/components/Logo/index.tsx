import React from "react";

import LogoImg from "../../assets/img/logo/Logo.png";

const Logo: React.FC<{
  className?: string,
  style?: React.CSSProperties,
}> = ({className, style}) => {
  return (
    <img className={className} style={style} src={LogoImg.src} alt="logo" /> 
  );
}

export default Logo;
