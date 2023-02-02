// 这里来计算文本框的宽度
export function generatorTextMeasure() {
  const $div = document.getElementById("js-shadow-normal");
  const $editing = document.getElementById("js-shadow-edit");

  return {
    $div,
    $editing,
    getTextWidth(text: string, $target: HTMLDivElement) {
      $target.innerText = text;
      const { width } = $target.getBoundingClientRect();
      return width;
    },
    getTextHeight(text: string, $target: HTMLDivElement) {
      $target.innerText = text;
      const { height } = $target.getBoundingClientRect();
      return height;
    },
  };
}
// 扁平化树结构
export function flatten(node: mpcanvas.TreeNode) {
  let nodes: mpcanvas.TreeNode[] = [];
  let stack: mpcanvas.TreeNode[] = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      //取第一个
      let item = stack.shift();
      let children = (item as mpcanvas.TreeNode).children || [];
      nodes.push(item as mpcanvas.TreeNode);
      if (!item?.isFold) {
        for (let i = 0; i < children.length; i++) {
          stack.push(children[i]);
        }
      }
    }
  }
  return nodes;
}
// 设置光标位置
export function setRange($target: HTMLDivElement, start: number, end: number) {
  let s = window.getSelection();
  let r = document.createRange();
  r.setStart($target, start);
  r.setEnd($target, end);
  if (s) {
    s.removeAllRanges();
    s.addRange(r);
  }
}
// 生成uuid
export function uuid() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substring(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substring((s[19] as bigint & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  const uuid = s.join("");

  return uuid;
}
