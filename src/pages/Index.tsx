import { MindMap } from "@/components/mindmap/MindMap";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
const Index = () => {
  return <div>
      <div className="absolute top-4 right-4 z-10">
        <Link to="/examsdata">
          <Button variant="outline" className="flex gap-2 items-center text-base mx-[200px] my-[-10px] text-center">
            <BookOpen size={16} />
            <span>View Exams</span>
          </Button>
        </Link>
      </div>
      <MindMap />
    </div>;
};
export default Index;