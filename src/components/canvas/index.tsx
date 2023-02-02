// src/components/canvas/index.tsx
import "./index.css";

import RichText from "./rich-text";
import hooks from "./canvas-hook";
import Line from "@components/line";
function App() {
  const { add, tree, setTree, flattenedTree, remove } = hooks();
  return (
    <div className="mp--canvas">
      {flattenedTree.map((node, index) => {
        const pNode =
          index !== 0
            ? flattenedTree.filter((tree) => tree.id === node.pid)
            : [];
        return (
          <RichText
            key={node.id}
            add={(action) => {
              add(action, node, pNode[0], pNode[0]?.children.indexOf(node));
            }}
            remove={(dnode) => {
              remove(dnode, node);
            }}
            node={node}
            index={index}
            mainData={tree}
            setMainData={setTree}
          />
        );
      })}
      <svg className="m--line">
        {flattenedTree.map((cNode, index) => {
          return <Line cNode={cNode} key={cNode.id} index={index} />;
        })}
      </svg>
    </div>
  );
}
export default App;
