interface Node {
  id: string;
  type: string;
  content: string;
  metadata?: any;
  parentNodeld?: string;
}

export default Node;