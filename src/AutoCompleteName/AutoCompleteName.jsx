import { Autocomplete, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

const AutoCompleteName = ({
  nodeData,
  objectEdit,
  setObjectEdit,
  setNodes,
  nodes,
  stateForAutoComplete,
  setStateForAutoComplete,
  setTriggerRenameDialog,
  triggerRenameDialog,
}) => {
  console.log("file: AutoCompleteName.jsx:11 ~ nodes:", nodes);
  // const nodeDataArray = Object.entries(nodeData);
  // console.log("file: AutoCompleteName.jsx:17 ~ nodeDataArray:", nodeDataArray)

  const options = [
    "Select Cell",
    "AOI",
    "Assembly",
    "Dispenser",
    "Screw",
    "Test",
  ];
  const [cellName, setCellName] = useState("");
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (touch) {
      setCellName(nodeData["data"].name);
    }
    if (stateForAutoComplete) {
      setCellName(nodeData["data"].name);
      setStateForAutoComplete(false);
    }
  }, [nodeData]);

  useEffect(() => {
    if (triggerRenameDialog && !nodeData["data"].name.includes("node")) {
      setCellName(nodeData["data"].name);
      setTriggerRenameDialog(false);
    }
  }, [triggerRenameDialog]);

  const onChange = useCallback((e) => {
    setTouch(true);
    setObjectEdit(nodeData);
    setCellName(e.target.textContent);
  }, []);

  const onBlur = () => {
    console.log(cellName);
    console.log("file: AutoCompleteName.jsx:15 ~ objectEdit:", objectEdit);
    setObjectEdit({
      ...objectEdit,
      data: { ...objectEdit?.data, name: cellName },
    });

    const newElement = nodes.map((item) => {
      if (item.data.id === objectEdit?.id) {
        return {
          ...item,
          data: { ...item.data, name: cellName },
        };
      }
      return item;
    });
    console.log(
      "file: AutoCompleteName.jsx:70 ~ newElement ~ newElement:",
      newElement
    );

    setNodes(newElement);
  };

  return (
    <Autocomplete
      disableClearable
      disablePortal
      value={cellName || options[0]}
      onChange={onChange}
      onBlur={onBlur}
      options={options}
      sx={{ width: 150, marginY: "0.5rem" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Cell Name Type:${nodeData["data"].image.url}`}
        />
      )}
    />
  );
};

export default React.memo(AutoCompleteName);
