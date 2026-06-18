import React from "react";
import TextPressure from "../ui/TextPressure";

const PressureTextComponent = () => {
  return (
    <div style={{ position: "relative", height: "350px" }}>
      <TextPressure
        text="Developer"
        flex
        alpha={false}
        stroke={true}
        width
        weight
        italic
        textColor="#0E0D0B"
        strokeColor="#C8502A"
        minFontSize={36}
      />
    </div>
  );
};

export default PressureTextComponent;
