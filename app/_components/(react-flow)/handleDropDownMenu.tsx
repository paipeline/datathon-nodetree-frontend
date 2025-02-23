import { Node, useReactFlow } from "@xyflow/react";

export const useNodeColor = () => {
  const { setNodes, getNodes } = useReactFlow();

  const setColor = (id: string, color: string) => {
    const selectedNode = getNodes().find(n => n.selected);
    if (!selectedNode) return;

    setNodes(nodes => 
      nodes.map(node => 
        node.id === selectedNode.id 
          ? { ...node, style: { ...node.style, backgroundColor: color, overflow: 'hidden', borderRadius: '12px' }} 
          : node
      )
    );

    // set the priority based on the color
    let priority = 0;
    if (color === "#ff4d4d") {
      priority = 2;
    } else if (color === "#ff9933") {
      priority = 1;
    } else if (color === "#ffd633") {
      priority = 0;
    }

    // continue here
    fetch('http://localhost:8000/api/v2/set-priority', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: selectedNode.id, 
        priority: priority,
        parentId: id
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('success to set priority:', data.node);
      } else {
        console.log('failed to set priority:', data);
      }
    })
    .catch(error => {
      console.error('failed to set priority:', error);
    });
  };

  return {
    setRed: (id: string, color: string) => setColor(id, color),
    setOrange: (id: string, color: string) => setColor(id, color),
    setYellow: (id: string, color: string) => setColor(id, color)
  };
};