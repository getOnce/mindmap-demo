import "./App.css";
import MPCanvas from "@components/canvas/index";
import { TreeContext } from "@store/index";
import { useState } from "react";
import DragCanvas from "./components/DragCanvas";
function App() {
  const [focusId, setFocusId] = useState<null | string>(null);
  const [editId, setEditId] = useState<null | string>(null);
  return (
    <TreeContext.Provider value={{ focusId, setFocusId, editId, setEditId }}>
      <div className="mp--container">
        <DragCanvas>
          <MPCanvas />
        </DragCanvas>
      </div>
    </TreeContext.Provider>
  );
}
export default App;
