import { Node, useReactFlow } from "@xyflow/react";

// 创建自定义 hook
export const useNodeColor = () => {
  const { setNodes, getNodes } = useReactFlow();

  const setColor = (color: string) => {
    const selectedNode = getNodes().find(n => n.selected);
    if (!selectedNode) return;

    setNodes(nodes => 
      nodes.map(node => 
        node.id === selectedNode.id 
          ? { ...node, style: { ...node.style, backgroundColor: color, overflow: 'hidden', borderRadius: '12px' }} 
          : node
      )
    );
  };

  return {
    setRed: () => setColor("#ff4d4d"),
    setOrange: () => setColor("#ff9933"),
    setYellow: () => setColor("#ffd633")
  };
};