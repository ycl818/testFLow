import React, { useState, useRef, useCallback } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  useStore,
} from "reactflow"; //changed dependency to reactflow and type error appears
import { ReactFlowProvider } from "reactflow";

import FloatingEdge from "./FloatingEdge";

import "./index.css";

import "reactflow/dist/style.css";
import Sidebar from "./Sidebar";
import DrawerForPics from "./Drawer/DrawerForPics";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import SaveAltIcon from "@mui/icons-material/SaveAlt";
// import RestoreIcon from "@mui/icons-material/Restore";
import CustomNode from "./CustomNode";

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  type: "step",
  style: { strokeWidth: 2, stroke: "#000" },
};

const initialNodes = [];
const nodeTypes = {
  custom: CustomNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, type: "floating" }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type: "custom",

        position,
        data: {
          label: `${type}`,
          name: "",
          color: "grey",
          image: {
            url: `${type}`,
            alt: `${type}`,
          },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const nodesV = useStore((state) => state.getNodes());
  console.log("🚀 ~ file: App.jsx:95 ~ DnDFlow ~ nodesV:", nodesV);
  //* Drawer Part */
  const [openDrawer, setOpenDrawer] = useState(false);
  const [objectEdit, setObjectEdit] = useState({});
  const [openRename, setOpenRename] = useState(false);

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          connectionMode="loose"
        >
          <Background />
          <Controls />
          <Panel
            position="top-right"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Tooltip title="Add Cell">
              <IconButton onClick={() => setOpenDrawer(true)}>
                <AddIcon sx={{ fontSize: "3rem" }} />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Save">
              <IconButton onClick={onSave}>
                <SaveAltIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Restore">
              <IconButton onClick={onRestore}>
                <RestoreIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Tooltip> */}
          </Panel>
          <Panel>
            <DrawerForPics
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              setObjectEdit={setObjectEdit}
              setOpenRename={setOpenRename}
            />
          </Panel>
        </ReactFlow>
      </div>

      <Sidebar />
    </div>
  );
};

function DnDFlowProvider(props) {
  return (
    <ReactFlowProvider>
      <DnDFlow {...props} />
    </ReactFlowProvider>
  );
}

export default DnDFlowProvider;
