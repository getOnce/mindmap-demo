import { useState, useEffect, useContext } from "react";
import { uuid } from "@/utils/tools";
import { colorList } from "@const/canvas";
import { TreeContext } from "@store/index";
import generateBaseMap from "@/utils/generateBaseMap";
import { execFunctionQue } from "@/utils/treeFactory";
export default function hooks() {
  const { setEditId, setFocusId } = useContext(TreeContext);
  // 原始树结构
  const [tree, setTree] = useState<mpcanvas.TreeNode>(generateBaseMap());
  // 扁平过的树结构
  const [flattenedTree, setflattenedTree] = useState<mpcanvas.TreeNode[]>([]);
  useEffect(() => {
    const { flattenedTree } = execFunctionQue(tree);
    setflattenedTree(flattenedTree);
  }, [tree]);

  function add(
    action: richtext.actions,
    cNode: mpcanvas.TreeNode,
    pNode: mpcanvas.TreeNode,
    sIndex: number
  ) {
    const newId = uuid();
    const usedColor: string[] = [];
    if (cNode.id === "root" || pNode.id === "root") {
      const parendNode = cNode.id === "root" ? cNode : pNode;
      if (parendNode.children) {
        parendNode.children.forEach((node) => {
          usedColor.push(node.lineColor);
        });
      }
    }
    const availableColor = colorList.filter((c) => !usedColor.includes(c));
    let lineColor = colorList[0];

    // cNode是根节点
    if (cNode.id === "root" || (pNode.id === "root" && action === "sibling")) {
      lineColor =
        availableColor && availableColor.length
          ? availableColor[0]
          : colorList[0];
      // cNode
    } else {
      lineColor = cNode.lineColor;
    }

    switch (action) {
      case "child":
        cNode.children.push({
          id: newId,
          pid: cNode.id,
          topic: "",
          // 横坐标
          x: 0,
          // 纵坐标
          y: 0,
          // 宽度
          w: 0,
          // 纵坐标的上线
          topBoundaryPosition: 0,
          // 纵向总高度
          //   sumVerticalNodeLength: 0,
          children: [],
          lineColor,
          isEditing: true,
          isFold: false,
        });
        break;
      case "sibling":
        pNode.children.splice(sIndex + 1, 0, {
          id: newId,
          pid: cNode.pid,
          topic: "",
          // 横坐标
          x: 0,
          // 纵坐标
          y: 0,
          // 宽度
          w: 0,
          // 纵坐标的上线
          topBoundaryPosition: 0,
          // 纵向总高度
          //   sumVerticalNodeLength: 0,
          children: [],
          lineColor,
          isEditing: true,
          isFold: false,
        });
        break;
    }
    setFocusId(newId);
    setEditId(newId);
    setTree(Object.assign({}, tree));
  }
  function remove(node: mpcanvas.TreeNode, cNode: mpcanvas.TreeNode) {
    if (node !== tree) {
      setflattenedTree(
        flattenedTree.filter((flatNode) => {
          return flatNode !== node;
        })
      );

      const pNode = flattenedTree.filter((tree) => tree.id === cNode.pid);
      pNode[0].children = pNode[0].children.filter((cNode) => cNode !== node);
      setTree(Object.assign({}, tree));
    }
  }
  return {
    tree,
    flattenedTree,
    add,
    remove,
    setTree,
  };
}
