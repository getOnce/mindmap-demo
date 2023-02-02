export default function AddButton({
  add,
  index,
  node,
}: {
  add: richtext.add;
  index: number;
  node: mpcanvas.TreeNode;
}) {
  const actions = [];
  if (index === 0) {
    if (node.children.length === 0) {
      actions.push({
        action: "child",
        value: "mp--canvas__richtext__plus-right",
      });
    } else {
      actions.push({
        action: "child",
        value: "mp--canvas__richtext__plus-bottom",
      });
    }
  } else {
    if (node.children.length === 0) {
      actions.push({
        action: "child",
        value: "mp--canvas__richtext__plus-right",
      });
    } else {
      actions.push({
        action: "child",
        value: "mp--canvas__richtext__plus-bottom",
      });
    }
  }
  return (
    <>
      {actions.map((item) => {
        return (
          <span
            key={item.action}
            className={item.value}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              add(item.action as richtext.actions);
            }}
          >
            +
          </span>
        );
      })}
    </>
  );
}
