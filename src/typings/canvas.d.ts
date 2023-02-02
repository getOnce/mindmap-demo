declare namespace mpcanvas {
  interface TreeNode {
    // 节点唯一标识
    id: string;
    // 父节点标识
    pid: string;
    // 导图文本节点
    topic: string;
    // 节点横坐标
    x?: number;
    // 节点右边的x坐标 - 画连线的时候有用
    rx?: number;
    // 节点纵坐标
    y?: number;
    // 节点中间的y坐标 - 画连线的时候有用
    cy?: number;
    // 节点宽度
    w?: number;
    // 当前节点纵坐标的上限
    topBoundaryPosition?: number;
    // 当前节点特有的class
    className?: string[];
    // 线条颜色
    lineColor: string;
    // 子节点
    children: TreeNode[];
    // 是否为编辑状态
    isEditing?: boolean;
    // 是否收起
    isFold: boolean;
  }
}

declare namespace richtext {
  interface Props {
    node: mpcanvas.TreeNode;
    add: add;
    index: number;
    remove: remove;
    mainData: mpcanvas.TreeNode;
    setMainData: React.Dispatch<React.SetStateAction<mpcanvas.TreeNode>>;
  }
  interface add {
    (action: actions): void;
  }
  interface remove {
    (node: mpcanvas.TreeNode): void;
  }
  type actions = "child" | "sibling";
}
declare namespace line {
  interface Props {
    cNode: mpcanvas.TreeNode;
    index: number;
  }
}
