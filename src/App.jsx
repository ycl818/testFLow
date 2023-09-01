import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  MarkerType,
  useStore,
  updateEdge,
  MiniMap,
} from "reactflow"; //changed dependency to reactflow and type error appears
import { ReactFlowProvider } from "reactflow";

import FloatingEdge from "./FloatingEdge";

import "./index.css";

import "reactflow/dist/style.css";
import Sidebar from "./Sidebar";
import DrawerForPics from "./Drawer/DrawerForPics";
import { Box, IconButton, Switch, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import CustomNode from "./CustomNode";
import { useReactFlow } from "reactflow/dist/esm";
import CustomConnectionLine from "./CustomConnectionLine";
import Light from "./Light/Light";
import AutoCompleteName from "./AutoCompleteName/AutoCompleteName";
import RenameDialog from "./RenameDialog/RenameDialog";

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  animated: true,

  style: { strokeWidth: 4, stroke: "black" },
  type: "floating",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black",
  },
};

const connectionLineStyle = {
  strokeWidth: 1,
  stroke: "black",
};

const initialNodes = [];
const nodeTypes = {
  custom: CustomNode,
};

let id = 0;
const getId = () => `dndnode_${Date.now()}`;

const flowKey = "example-flow1";

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { setViewport } = useReactFlow();

  // const onConnect = useCallback(
  //   (params) =>
  //     setEdges((eds) => addEdge({ ...params, type: "floating" }, eds)),
  //   [setEdges]
  // );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        console.log(flow);
        const { x, y, zoom } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
        setStateForAutoComplete(true);
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("file: App.jsx:58 ~ onDragOver ~ event.dataTransfer:", event);
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
          // label: `${type}`,
          name: "",
          color: "grey",
          image: {
            url: `${type}`,
            alt: `${type}`,
          },
        },
      };
      newNode.data = { ...newNode.data, id: `${newNode.id}` };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // const nodesV = useStore((state) => state.getNodes());

  //* Drawer Part */
  const [openDrawer, setOpenDrawer] = useState(false);
  const [objectEdit, setObjectEdit] = useState({});
  const [openRename, setOpenRename] = useState(false);

  const onElementClick = useCallback((event, object) => {
    console.log("file: App.js:227 ~ onElementClick ~ event:", event);

    setObjectEdit(object);
  }, []);

  const onElementDoubleClick = useCallback((event, object) => {
    setOpenRename(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setObjectEdit({});
  }, []);

  //* Edge delete part/
  const edgeUpdateSuccessful = useRef(true);
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);

  // switcher
  const [checked, setChecked] = React.useState(true);
  const handleChange = useCallback((event) => {
    setChecked(event.target.checked);
  }, []);

  // Rename
  const [triggerRenameDialog, setTriggerRenameDialog] = useState(false);

  const [stateForAutoComplete, setStateForAutoComplete] = useState(false);

  //

  const palette = useMemo(() => {
    return ["red", "yellow", "green"];
  }, []);
  const palette2 = useMemo(() => {
    return ["yellow", "green", "red"];
  }, []);
  const palette3 = useMemo(() => {
    return ["green", "red", "yellow"];
  }, []);

  const greenLightNum = useMemo(() => {
    let cnt = 0;
    nodes?.map((node) => {
      if (node.data.color === "green") {
        cnt++;
      }
      return cnt;
    });

    return cnt;
  }, [nodes]);

  const yellowLightNum = useMemo(() => {
    let cnt = 0;
    nodes?.map((node) => {
      if (node.data.color === "yellow") {
        cnt++;
      }
      return cnt;
    });

    return cnt;
  }, [nodes]);

  const redLightNum = useMemo(() => {
    let cnt = 0;
    nodes?.map((node) => {
      if (node.data.color === "red") {
        cnt++;
      }
      return cnt;
    });

    return cnt;
  }, [nodes]);

  const greyLightNum = useMemo(() => {
    let cnt = 0;
    nodes?.map((node) => {
      if (node.data.color === "grey") {
        cnt++;
      }
      return cnt;
    });

    return cnt;
  }, [nodes]);

  useEffect(() => {
    const newElement = nodes?.map((item) => {
      if (item?.data.name === "AOI") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette[Math.floor(Math.random() * palette.length)],
          },
        };
      } else if (item?.data.name === "Assembly") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette2[Math.floor(Math.random() * palette.length)],
          },
        };
      } else if (item?.data.name === "Dispenser") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette3[Math.floor(Math.random() * palette.length)],
          },
        };
      } else if (item?.data.name === "Screw") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette2[Math.floor(Math.random() * palette.length)],
          },
        };
      } else if (item?.data.name === "Test") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette[Math.floor(Math.random() * palette.length)],
          },
        };
      }
      return item;
    });

    let timer;
    if (newElement && nodes.length !== 0) {
      timer = setInterval(() => {
        setNodes(newElement);
      }, 3000);
    }

    return () => clearInterval(timer);
  }, [nodes]);

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
          minZoom={0.1}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onNodeClick={onElementClick}
          onNodeDoubleClick={onElementDoubleClick}
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel
            position="top-right"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Tooltip title="Add Cell">
              <IconButton onClick={() => setOpenDrawer(true)}>
                <AddIcon sx={{ fontSize: "3rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton onClick={onSave}>
                <SaveAltIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Restore">
              <IconButton onClick={onRestore}>
                <RestoreIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Tooltip>
            <DrawerForPics
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
              setObjectEdit={setObjectEdit}
              setOpenRename={setOpenRename}
            />
          </Panel>
          <Panel>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "350px",
                }}
              >
                <span style={{ color: "#2dc937" }}>Green:{greenLightNum}</span>
                <span style={{ color: "#e7b416" }}>
                  Yellow:
                  {yellowLightNum}
                </span>
                <span style={{ color: "#cc3232" }}>Red: {redLightNum}</span>
                <span style={{ color: "grey" }}>Grey: {greyLightNum}</span>
                <span>Total: {nodes.length}</span>
              </p>
            </Box>
            <Box
              sx={{
                height: "80vh",
                overflow: "auto",
                width: "240px",
                overflowX: "hidden",
                display: checked ? "block" : "none",
              }}
            >
              {nodes.map((node) => {
                return (
                  <Box
                    display="flex"
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                    key={node["data"].id}
                  >
                    <AutoCompleteName
                      nodeData={node}
                      objectEdit={objectEdit}
                      setObjectEdit={setObjectEdit}
                      setNodes={setNodes}
                      nodes={nodes}
                      setStateForAutoComplete={setStateForAutoComplete}
                      stateForAutoComplete={stateForAutoComplete}
                      setTriggerRenameDialog={setTriggerRenameDialog}
                      triggerRenameDialog={triggerRenameDialog}
                    />
                    <Light nodeData={node} />
                  </Box>
                );
              })}
            </Box>

            {objectEdit.type === "custom" && (
              <>
                <RenameDialog
                  openRename={openRename}
                  setOpenRename={setOpenRename}
                  objectEdit={objectEdit}
                  setObjectEdit={setObjectEdit}
                  setNodes={setNodes}
                  nodes={nodes}
                  setTriggerRenameDialog={setTriggerRenameDialog}
                />
              </>
            )}
          </Panel>
        </ReactFlow>
      </div>

      {/* <Sidebar
        setOpenDrawer={setOpenDrawer}
        setObjectEdit={setObjectEdit}
        setOpenRename={setOpenRename}
      /> */}
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
