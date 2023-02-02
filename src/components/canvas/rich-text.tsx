import "./rich-text.css";

import React, { useContext, useEffect, useRef, useState } from "react";
import { TreeContext } from "@store/index";

import { setRange } from "@utils/tools";
const App = React.memo(RichText);
import AddButton from "./adding";
import Hub from "./hub";
/**
 *
 * @param index {Number} 这里代表当前渲染的结点是哪一级
 * @returns
 */
function RichText({
  node,
  add,
  index,
  remove,
  mainData,
  setMainData,
}: richtext.Props) {
  const { editId, setEditId, focusId, setFocusId } = useContext(TreeContext);
  const editing = editId === node.id;
  const focus = focusId === node.id;
  const [name, setName] = useState(node.topic);
  let className = "mp--canvas__richtext";
  if (focus && !editing) {
    className += " mp--canvas__richtext-focus";
  }

  if (node.className && node.className.length) {
    className += " " + node.className.join(" ");
  }
  if (editing) {
    className += " mp--canvas__richtext-edit";
  }
  const isEditAble = editing
    ? { contentEditable: true, suppressContentEditableWarning: true }
    : {};
  const ref = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (node.isEditing) {
      let p = editRef.current;
      if (p) {
        setRange(p, 0, 0);
      }
    }
  }, [node.isEditing]);
  function setEditing() {
    setEditId(node.id);
    if (!node.className) {
      node.className = [];
    }
    node.isEditing = true;
    setMainData(Object.assign({}, mainData));
    setTimeout(() => {
      let p = editRef.current;
      if (p) {
        setRange(p, 1, 1);
      }
    }, 0);
  }
  return (
    <>
      <div
        className={className}
        style={{
          left: node.x,
          top: node.y,
          width: node.w + "px",
        }}
        ref={ref}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!focus) {
            setFocusId(node.id);
          } else {
            if (!editing) {
              setEditing();
            }
          }
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (!editing) {
            if (e.key && e.key.toLowerCase() === "backspace" && index !== 0) {
              remove(node);
            } else if (e.key && e.key.toLowerCase() === "enter") {
              e.preventDefault();
              setEditing();
            }
          } else {
            if (e.key && e.key.toLowerCase() === "enter") {
              e.preventDefault();
              editRef.current?.blur();
              return;
            }
          }
        }}
      >
        {!editing ? (
          <span>{index === 0 && !node.topic ? "根节点" : node.topic}</span>
        ) : (
          <div
            className="mp--canvas__richtext__editor"
            ref={editRef}
            {...isEditAble}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onBlur={() => {
              setFocusId(null);
              setEditId(null);
              node.isEditing = false;
              // 当节点的内容完全被删除的时候
              if (!node.topic.trim()) {
                // 根节点
                if (index === 0) {
                  node.topic = name || "根节点";
                } else if (node.children && node.children.length > 0) {
                  node.topic = name || "子节点";
                } else {
                  remove(node);
                }
              }

              setName(node.topic);
              setMainData(Object.assign({}, mainData));
            }}
            onInput={() => {
              if (editRef.current) {
                node.topic = editRef.current.innerText;
                setMainData(Object.assign({}, mainData));
              }
            }}
          >
            {name}
          </div>
        )}

        {focus && !editing && !node.isFold ? (
          <AddButton add={add} index={index} node={node} />
        ) : null}
        <Hub
          mainData={mainData}
          setMainData={setMainData}
          node={node}
          index={index}
          editing={editing}
        />
      </div>
    </>
  );
}

export default App;
