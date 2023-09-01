import React from "react";
import m1 from "./asset/a.png";
import m2 from "./asset/b.png";
import m3 from "./asset/c.png";

const Sidebar = ({ setOpenDrawer, setObjectEdit, setOpenRename }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div>
      <div
        className="wrapMachine"
        onDragStart={(event) => onDragStart(event, "m1")}
      >
        {/* <div
          className="machine"
          //className="dndnode input"
          onDragStart={(event) => onDragStart(event, "m1")}
          draggable
          style={{
            width: "100px",
            height: "100px",
            background: `url(${m1}) no-repeat center`,
            backgroundSize: "contain",

            padding: "0rem 2rem",
          }}
        ></div> */}
        <img
          src={m1}
          alt="uu"
          style={{ objectFit: "contain", width: "100px", height: "100px" }}
        />
        <p className="machineParagraph">m1</p>
      </div>
    </aside>
  );
};

export default Sidebar;
