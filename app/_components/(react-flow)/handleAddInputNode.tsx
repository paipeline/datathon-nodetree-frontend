import { Node } from "@xyflow/react";
import { UserInput } from "./user-input";
import { v4 as uuidv4 } from "uuid";
import { initialNodes } from "./canvas.node";

export const nodeTypes = {
    userInput: UserInput,
  };

export const handleAddInputNode = (setNodes: React.Dispatch<React.SetStateAction<Node[]>>) => {
  const newNode = {
    id: uuidv4(),
    type: "userInput",
    content: "",
    position: { x: Math.random() * 200 , y: Math.random() * 200 },
    data: { label: 'User Input Node' }
  };
  console.log("Node added:", newNode);
  setNodes((prevNodes: any) => [...prevNodes, newNode]);
};

export default handleAddInputNode;