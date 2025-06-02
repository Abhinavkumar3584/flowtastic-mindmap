
import { MindMap } from "@/components/mindmap/MindMap";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const MindMapEditor = () => {
  return (
    <div>
      <div className="absolute top-4 right-4 z-10">
        <Link to="/exams">
          <Button variant="outline" className="flex gap-2 items-center">
            <BookOpen size={16} />
            <span>Browse Exams</span>
          </Button>
        </Link>
      </div>
      <MindMap />
    </div>
  );
};

export default MindMapEditor;
