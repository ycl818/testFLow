import React from "react";
import "./Circle.css";

const Circle = ({ color }) => {
  console.log("file: Circle.jsx:7 ~ Circle ~ color:", color);
  return <div className="circle" style={color}></div>;
};

export default React.memo(Circle);
