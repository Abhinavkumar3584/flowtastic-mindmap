
import { ReactFlowProvider } from '@xyflow/react';
import { MindMap } from "@/components/mindmap/MindMap";

const Index = () => {
  return (
    <ReactFlowProvider>
      <MindMap />
    </ReactFlowProvider>
  );
};

export default Index;
