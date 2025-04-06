
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash, Eye, Edit, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { EXAM_CATEGORIES, ExamCategory } from "@/components/mindmap/types";
import { getMindMapsByExamCategory } from "@/utils/mindmapStorage";

type SubExam = {
  id: string;
  name: string;
  category: ExamCategory;
  hasMindMap: boolean;
};

const ExamManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<SubExam | null>(null);
  const [newExamName, setNewExamName] = useState("");
  const [newExamCategory, setNewExamCategory] = useState<ExamCategory | "">("");

  // Generate sub-exams data from LocalStorage
  const generateSubExams = (): SubExam[] => {
    const subExams: SubExam[] = [];
    
    EXAM_CATEGORIES.forEach(category => {
      const mindMaps = getMindMapsByExamCategory(category);
      
      // Add existing sub-exams from mind maps
      mindMaps.forEach(mindMap => {
        if (mindMap.subExamName) {
          subExams.push({
            id: `${category}-${mindMap.subExamName}`,
            name: mindMap.subExamName,
            category: category,
            hasMindMap: true
          });
        }
      });
      
      // Add some demo sub-exams without mind maps
      if (category === 'SSC EXAMS') {
        ['CGL', 'CHSL', 'MTS'].forEach(name => {
          if (!subExams.some(exam => exam.name === name)) {
            subExams.push({
              id: `${category}-${name}`,
              name,
              category,
              hasMindMap: false
            });
          }
        });
      } else if (category === 'BANKING EXAMS') {
        ['IBPS PO', 'SBI PO', 'RBI Grade B'].forEach(name => {
          if (!subExams.some(exam => exam.name === name)) {
            subExams.push({
              id: `${category}-${name}`,
              name,
              category,
              hasMindMap: false
            });
          }
        });
      }
    });
    
    return subExams;
  };

  const [subExams, setSubExams] = useState<SubExam[]>(generateSubExams);
  
  // Filter exams based on search term
  const filteredExams = subExams.filter(
    (exam) => 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExam = () => {
    if (!newExamName || !newExamCategory) {
      toast.error("Please fill all fields");
      return;
    }
    
    const newExam: SubExam = {
      id: `${newExamCategory}-${newExamName}`,
      name: newExamName,
      category: newExamCategory as ExamCategory,
      hasMindMap: false
    };
    
    setSubExams([...subExams, newExam]);
    setNewExamName("");
    setNewExamCategory("");
    setIsAddDialogOpen(false);
    toast.success(`Added ${newExamName} to ${newExamCategory}`);
  };

  const handleDeleteExam = () => {
    if (!selectedExam) return;
    
    setSubExams(subExams.filter(exam => exam.id !== selectedExam.id));
    setIsDeleteDialogOpen(false);
    toast.success(`Deleted ${selectedExam.name} from ${selectedExam.category}`);
    setSelectedExam(null);
  };

  const handlePreviewExam = (exam: SubExam) => {
    toast.info(`Previewing ${exam.name} from ${exam.category}`);
    // In a real app, this would navigate to a preview page
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Exam Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search exams or categories..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="ml-4 gap-2"
            >
              <Plus size={16} />
              Add Exam
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sub-Exam Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{exam.category}</TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            exam.hasMindMap 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {exam.hasMindMap ? 'Mind Map Linked' : 'No Mind Map'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handlePreviewExam(exam)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              setSelectedExam(exam);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      No exams found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Exam Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Exam</DialogTitle>
            <DialogDescription>
              Add a new sub-exam to a category
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="examName" className="text-sm font-medium">Sub-Exam Name</label>
              <Input 
                id="examName" 
                placeholder="e.g., CSE, NDA, CGL"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select 
                value={newExamCategory} 
                onValueChange={(value) => setNewExamCategory(value as ExamCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExam}>
              Add Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Exam Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this exam? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium">{selectedExam?.name}</p>
              <p className="text-sm text-gray-500">{selectedExam?.category}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteExam}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamManagement;
