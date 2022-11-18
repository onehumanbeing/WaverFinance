import React from "react";
import { transDigital } from "../../utils/digital";

const TrendDigital: React.FC<{
  className?: string,
  style?: React.CSSProperties,
  digital?: string | number,
  mode?: "normal" | "brief",
  prefix?: string,
  suffix?: string,
  trend?: "up" | "down",
  disableTrendColor?: boolean,
}> = ({
  className,
  style,
  digital,
  mode = "normal",
  prefix,
  suffix,
  trend,
  disableTrendColor = false,
}) => {
  const trendColor = trend === "up" ? "#52C41A" : "#FF4D4F";
  // const trendIcon = trend === "up" ? "▲" : (trend === "down" ? "▼": "");
  const trendIcon = trend === "up" ? "+ " : (trend === "down" ? "- ": "");
  const trendStyle = trend && !disableTrendColor ? { color: trendColor } : {};

  if (digital === undefined) {
    return (
      <div 
        className={className} 
        style={{
          ...trendStyle,
          ...style,
        }} 
        title="Loading or No Data"
      >
        -
      </div>
    )
  }

  const wrappedDigital = `${prefix ?? ""}${transDigital(digital, mode)}${suffix ?? ""}`;

  return (
    <div 
      className={className} 
      style={{
        ...trendStyle,
        ...style,
      }} 
      title={digital.toString()}
    >
      {trend && <span>{trendIcon}</span>}
      {wrappedDigital}
    </div>
  );
}

export default TrendDigital;
