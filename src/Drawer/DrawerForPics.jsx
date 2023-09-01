import { Drawer, Typography } from "@mui/material";
import React, { useMemo } from "react";
import m1 from "../asset/a.png";
import m2 from "../asset/b.png";
import m3 from "../asset/c.png";
import "./DrawerForPics.css";
import { useStore, useStoreApi } from "reactflow";

const DrawerForPics = ({
  openDrawer,
  setOpenDrawer,

  setObjectEdit,
  setOpenRename,
}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const store = useStoreApi();

  const { nodeInternals } = store.getState();

  // const nodesV = useStore((state) => state.getNodes());
  const nodesLength = useMemo(() => {
    return Array.from(nodeInternals.values()).length || 0;
  }, [nodeInternals]);

  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "transparent",
        },
      }}
    >
      <aside style={{ width: 300 }}>
        <Typography className="description">
          Drag and Drop wanted icon.
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="wrapMachine">
            <div
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
            ></div>
            <p className="machineParagraph">m1</p>
          </div>

          <div className="wrapMachine">
            <div
              className="machine"
              // className="dndnode"
              onDragStart={(event) => onDragStart(event, "m2")}
              draggable
              style={{
                width: "100px",
                height: "100px",
                background: `url(${m2}) no-repeat center`,
                backgroundSize: "contain",

                padding: "0 2rem",
              }}
            ></div>
            <p className="machineParagraph">m2</p>
          </div>

          <div className="wrapMachine">
            <div
              className="machine"
              //lassName="dndnode output"
              onDragStart={(event) => onDragStart(event, "m3")}
              draggable
              style={{
                width: "100px",
                height: "100px",
                background: `url(${m3}) no-repeat center`,
                backgroundSize: "contain",
                padding: "0 2rem",
              }}
            ></div>
            <p className="machineParagraph">m3</p>
          </div>
        </div>

        {/* <section>
          <p style={{ textAlign: "center" }}>
            Current Cell Quantity: {nodesLength}
          </p>
          <ul style={{ margin: 0, padding: 0 }}>
            {nodesV.map((node) => {
              return (
                <li
                  key={node.data.id}
                  className="listStyle"
                  onClick={() => {
                    setOpenRename(true);
                    setObjectEdit(node);
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <p> M: {node.data?.image?.url}</p>
                    <p style={{ marginLeft: "0.5rem" }}>
                      {" "}
                      Name: {node.data?.name}
                    </p>
                  </div>
                  <div style={{ border: "1px solid black" }}></div>
                </li>
              );
            })}
          </ul>
        </section> */}
      </aside>
    </Drawer>
  );
};

export default React.memo(DrawerForPics);
