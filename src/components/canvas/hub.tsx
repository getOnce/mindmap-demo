export default function Hub({
  node,
  index,
  editing,
  mainData,
  setMainData,
}: {
  node: mpcanvas.TreeNode;
  index: number;
  editing: boolean;
  mainData: mpcanvas.TreeNode;
  setMainData: React.Dispatch<React.SetStateAction<mpcanvas.TreeNode>>;
}) {
  return (
    <>
      {node.children && node.children.length && index !== 0 && !editing ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            node.isFold = !node.isFold;
            setMainData(Object.assign({}, mainData));
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="mp--canvas__richtext__hub"
          style={{ border: `solid 2px ${node.lineColor}` }}
        >
          {node.isFold ? "+" : ""}
        </div>
      ) : null}
    </>
  );
}
