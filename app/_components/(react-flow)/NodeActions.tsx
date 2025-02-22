import { NodeHeaderAction } from "@/components/node-header";
import { SendHorizonal, Trash } from "lucide-react";
import { useDeleteNode } from "@/app/hooks/useNodeLogics";

interface SubmitActionProps {
  handleSubmit: () => void;
  isLoading: boolean;
}

export function NodeHeaderSubmitAction({ handleSubmit, isLoading }: SubmitActionProps) {
  return (
    <NodeHeaderAction
      onClick={handleSubmit}
      variant="ghost"
      label="Submit"
      className="w-6 h-6"
    >
      {isLoading ? "..." : <SendHorizonal />}
    </NodeHeaderAction>
  );
}

export function NodeHeaderDeleteAction() {
  const { handleDelete } = useDeleteNode();

  return (
    <NodeHeaderAction
      onClick={handleDelete}
      variant="ghost"
      label="Delete node"
      className="w-6 h-6"
    >
      <Trash />
    </NodeHeaderAction>
  );
}