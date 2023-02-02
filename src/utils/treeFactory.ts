import { defaultValue } from "@const/canvas";
import { generatorTextMeasure, flatten } from "./tools";
// 提前获取 div，这样就不会每次都执行这个函数了
const { $div, $editing, getTextWidth, getTextHeight } = generatorTextMeasure();

/**
 * 获取纵向最多结点数量
 * @param node {mpcanvas.TreeNode}
 * @param sum 纵向最高的节点
 */
function getVerticalNodeSum(node: mpcanvas.TreeNode, sum: number) {
  // 纵向最高结点数量
  if (node.children && node.children.length) {
    node.children.forEach((childNode) => {
      sum = getVerticalNodeSum(childNode, sum);
    });
  } else {
    sum = sum + 1;
  }
  return sum;
}
/**
 * @param root {mpcanvas.TreeNode}
 * @des 获取纵向高度
 */
function getVerticalHeight(node: mpcanvas.TreeNode) {
  // 当前节点是编辑状态
  if (node.isEditing) {
    const editingHeight = getTextHeight(node.topic, $editing as HTMLDivElement);
    const sum = getVerticalNodeSum(node, 0);
    return Math.max(
      editingHeight + defaultValue.verticalSeparator,
      sum * defaultValue.nodeItemHeight
    );
    // 当前节点不是编辑状态
  } else {
    // 如果不是编辑状态那么高度按照默认高度计算
    const height = defaultValue.nodeItemHeight;
    if (node.children && node.children.length) {
      let childHeight = 0;
      node.children.forEach((childNode) => {
        childHeight += getVerticalHeight(childNode);
      });
      return childHeight;
    } else {
      return height;
    }
  }
}
function getParentNode(ary: mpcanvas.TreeNode[], index: number, pid: string) {
  while (--index > -1) {
    if (pid === ary[index].id) {
      return ary[index];
    }
  }
  return ary[0];
}
type UnionData = {
  tree?: mpcanvas.TreeNode;
  flattenedTree?: mpcanvas.TreeNode[];
};
// 计算横坐标
function setCoordinateX(
  { tree, flattenedTree }: UnionData,
  initialX: number = defaultValue.rootX
) {
  if (!tree) {
    return { tree, flattenedTree };
  }
  let $target = $div;
  // 编辑的时候使用的编辑的shadow box
  if (tree.isEditing) {
    $target = $editing;
  }
  if ($target) {
    // 如果当前节点用到了特殊class，需要把这个class也加到shadow box上，这样保证样式一致
    if (tree.className && tree.className.length) {
      $target.classList.add(...tree.className);
    }
    // 获取节点的宽度
    const nodeWidth = getTextWidth(tree.topic, $target as HTMLDivElement);
    // 还原shadow box
    if (tree.className && tree.className.length) {
      $target.classList.remove(...tree.className);
    }
    // 获取当前根节点的横坐标
    tree.x = initialX;
    tree.w = nodeWidth || 0;
    tree.rx = initialX + nodeWidth;
    if (tree.children && tree.children.length) {
      tree.children.forEach((childNode) => {
        setCoordinateX(
          { tree: childNode },
          initialX + nodeWidth + defaultValue.horizontalSeparator
        );
      });
    }
  }
  return { tree, flattenedTree };
}

/**
 * @param root {mpcanvas.TreeNode}
 * @param flattenedTree{mpcanvas.TreeNode}
 * @param initialY {number}
 * @description 1. 确定根节点的位置 ry
 * 2. 每一个子节点的高度，第一个子节点，第二个子节点
 */
function setCoordinateY(
  { tree, flattenedTree }: UnionData,
  initialY: number = defaultValue.rootY
) {
  if (!flattenedTree) {
    return { tree, flattenedTree };
  }

  flattenedTree.forEach((node, index) => {
    // 获取node的子元素纵向最高容纳的节点数量
    // 获取顶线的位置
    if (index === 0) {
      node.y = initialY;
      // 根节点编辑的时候需要去计算当前盒子的高度
      if (node.isEditing) {
        node.cy =
          initialY + getTextHeight(node.topic, $editing as HTMLDivElement) / 2;
      } else {
        node.cy = initialY + defaultValue.nodeSingleItemHeight / 2;
      }
      // 顶部上限计算: 当前结点的纵坐标减去子节点占的高度
      node.topBoundaryPosition =
        node.cy -
        (getVerticalHeight(node) - defaultValue.verticalSeparator) / 2;
    } else {
      const parentNode = getParentNode(flattenedTree, index, node.pid);
      // 当前节点在父节点的位置
      const nodeIndex = parentNode.children.indexOf(node);
      // 当前节点上拥抱的最高点，等于 (父节点包含元素的最高点 + 当前节点兄弟元素且这个兄弟元素索引比当前节点的索引小，这个种节点占的高度之和)
      node.topBoundaryPosition = parentNode.children
        .filter((cnode, i) => i < nodeIndex)
        .reduce((initialValue, current) => {
          return initialValue + getVerticalHeight(current);
        }, parentNode.topBoundaryPosition || 0);

      // 当前节点的 sibling节点并且index小于当前节点
      // 当前节点的高度，是同级节点占了位置之后 再加上当前节点高度的一半儿
      // 存在子节点
      node.cy =
        node.topBoundaryPosition +
        (getVerticalHeight(node) - defaultValue.verticalSeparator) / 2;

      // 节点的纵坐标加上当前节点一半的高度，就是节点中心的高度
      node.y =
        node.cy -
        getTextHeight(
          node.topic,
          node.isEditing
            ? ($editing as HTMLDivElement)
            : ($div as HTMLDivElement)
        ) /
          2;
    }
  });
  return { tree, flattenedTree };
}

export function execFunctionQue(root: mpcanvas.TreeNode) {
  const flattenedTree = flatten(root);
  [setCoordinateX, setCoordinateY].forEach((fn) => {
    fn({ tree: root, flattenedTree: flattenedTree });
  });
  return {
    root,
    flattenedTree,
  };
}
