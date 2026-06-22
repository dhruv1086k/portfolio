import React from "react";
import ScrollFloat from "../ui/ScrollFloat";

const ScrollTextComponent = () => {
  return (
    <div style={{ position: "relative", height: "350px", marginTop: "20px" }}>
      <ScrollFloat
        animationDuration={1}
        ease="back.inOut(2)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
      >
        DEVELOPER
      </ScrollFloat>
    </div>
  );
};

export default ScrollTextComponent;
