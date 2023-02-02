import React from "react";
import "./index.css";

export default function Line({ cNode, index }: line.Props) {
  return (
    <>
      {cNode.children && cNode.children.length
        ? cNode.children.map((node) => {
            const hubX = cNode.rx ? cNode.rx + 50 : 0;

            return index === 0 || cNode.children.length < 2 ? (
              <path
                key={cNode.id + node.id}
                d={
                  !cNode.isFold
                    ? `M ${cNode.rx} ${cNode.cy} l${
                        (node.x || 0) - (cNode.rx || 0)
                      } ${(node.cy || 0) - (cNode.cy || 0)} Z`
                    : `M ${cNode.rx} ${cNode.cy} l${50} ${0} Z`
                }
                fill="none"
                stroke={node.lineColor}
                strokeWidth="3"
                style={{ transform: "translate(500000px, 500000px)" }}
              />
            ) : (
              <React.Fragment key={cNode.id + node.id}>
                <path
                  d={`M ${cNode.rx} ${cNode.cy} l${50} ${0} Z`}
                  fill="none"
                  stroke={node.lineColor}
                  strokeWidth="3"
                  style={{ transform: "translate(500000px, 500000px)" }}
                />
                {!cNode.isFold ? (
                  <path
                    d={`M ${hubX} ${cNode.cy} l${hubX - (cNode.rx || 0)} ${
                      (node.cy || 0) - (cNode.cy || 0)
                    } Z`}
                    fill="none"
                    stroke={node.lineColor}
                    strokeWidth="3"
                    style={{ transform: "translate(500000px, 500000px)" }}
                  />
                ) : null}
              </React.Fragment>
            );
          })
        : null}
    </>
  );
}
