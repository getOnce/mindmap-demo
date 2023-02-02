import React from "react";

const TreeContext = React.createContext<{
  focusId: string | null;
  setFocusId: React.Dispatch<React.SetStateAction<null | string>>;
  editId: string | null;
  setEditId: React.Dispatch<React.SetStateAction<null | string>>;
}>({
  focusId: null,
  setFocusId: () => {},
  editId: null,
  setEditId: () => {},
});
export { TreeContext };
