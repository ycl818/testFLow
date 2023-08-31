import {
  Handle,
  NodeResizeControl,
  Position,
  useNodesState,
  useStore,
  useStoreApi,
} from "reactflow";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NodeResizer } from "@reactflow/node-resizer";
import "@reactflow/node-resizer/dist/style.css";

import m1 from "./asset/a.png";
import m2 from "./asset/b.png";
import m3 from "./asset/c.png";
import { Box } from "@mui/material";
import Light from "./Light/Light";

export default React.memo(function CustomNode({ id, data, selected }) {
  const pic = useMemo(() => {
    if (data.image.url === "m1") {
      return "m1";
    } else if (data.image.url === "m2") {
      return "m2";
    } else if (data.image.url === "m3") {
      return "m3";
    }
  }, [data]);
  return (
    <>
      <Handle className="customHandle" position={Position.Left} type="target" />
      <div className="customNode">
        {/* <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      /> */}
        <Box
          className="customNodeBody"
          style={
            {
              // borderStyle: isTarget ? "dashed" : "solid",
              // backgroundColor: isTarget ? "#ffcce3" : "#ccd9f6",
              // border: "5px solid blue !important ",
            }
          }
          sx={{
            border:
              `${data.color}` === "green"
                ? `5px solid #2dc937 !important`
                : `${data.color}` === "red"
                ? `5px solid #cc3232 !important`
                : `${data.color}` === "yellow"
                ? `5px solid #e7b416 !important`
                : `5px solid grey !important`,
          }}
        >
          {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
          {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}

          <img
            src={m1}
            alt={data.image.alt}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "90%",
            }}
          />
        </Box>
        <div
          style={{
            zIndex: 99,
            position: "absolute",
            top: "-24%",
            left: "50%",
            transform: "translate(-50%, 0%)",
            height: "50px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "5px 15px",

            cursor: "pointer",
          }}
        >
          <input
            placeholder="Enter name"
            name="text"
            disabled
            id={id}
            value={data.name}
            className="nodrag"
            style={{
              fontSize: "25px",
              textAlign: "center",
              border: 0,
              width: "150px",
              zIndex: 999,
            }}
          />
          <Light nodeData={data} />
        </div>
      </div>
    </>
  );
});
