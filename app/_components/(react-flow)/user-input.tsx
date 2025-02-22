import React from 'react';
import { Handle, Position } from 'reactflow';

const UserInput = ({ data }: { data: { label: string } }) => {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, backgroundColor: '#f9f9f9' }}>
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default UserInput;