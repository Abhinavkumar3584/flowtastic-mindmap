
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, Link as LinkIcon } from "lucide-react";
import { ExamCategory, EXAM_CATEGORIES } from "@/components/mindmap/types";
import { toast } from "sonner";

interface ExamEntry {
  id: string;
  name: string;
  category: ExamCategory;
  subExams: string[];
  createdAt: string;
}

const ExamManagement = () => {
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<ExamEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const [newExamName, setNewExamName] = useState("");
  const [newExamCategory, setNewExamCategory] = useState<ExamCategory | "">("");
  const [newSubExam, setNewSubExam] = useState("");
  const [subExams, setSubExams] = useState<string[]>([]);

  // Load exams data
  useEffect(() => {
    // For demo purposes, we'll create some mock data
    const mockExams: ExamEntry[] = [
      {
        id: crypto.randomUUID(),
        name: "UPSC Civil Services",
        category: "CIVIL SERVICES EXAMS",
        subExams: ["CSE", "IFS", "IPS"],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: "SSC Combined Graduate Level",
        category: "SSC EXAMS",
        subExams: ["CGL", "CHSL", "JE"],
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        name: "Banking Entrance",
        category: "BANKING EXAMS",
        subExams: ["IBPS PO", "SBI PO", "NABARD"],
        createdAt: new Date().toISOString(),
      },
    ];
    
    setExams(mockExams);
  }, []);

  const handleAddExam = () => {
    if (!newExamName || !newExamCategory) {
      toast.error("Please fill all required fields");
      return;
    }

    if (subExams.length === 0) {
      toast.error("Please add at least one sub-exam");
      return;
    }

    const newExam: ExamEntry = {
      id: crypto.randomUUID(),
      name: newExamName,
      category: newExamCategory as ExamCategory,
      subExams: [...subExams],
      createdAt: new Date().toISOString(),
    };

    setExams([...exams, newExam]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("Exam added successfully");
  };

  const handleEditExam = () => {
    if (!currentExam || !newExamName || !newExamCategory || subExams.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const updatedExams = exams.map((exam) =>
      exam.id === currentExam.id
        ? {
            ...exam,
            name: newExamName,
            category: newExamCategory as ExamCategory,
            subExams: [...subExams],
          }
        : exam
    );

    setExams(updatedExams);
    resetForm();
    setIsEditDialogOpen(false);
    toast.success("Exam updated successfully");
  };

  const handleDeleteExam = () => {
    if (!currentExam) return;

    const updatedExams = exams.filter((exam) => exam.id !== currentExam.id);
    setExams(updatedExams);
    setIsDeleteDialogOpen(false);
    toast.success("Exam deleted successfully");
  };

  const handleAddSubExam = () => {
    if (!newSubExam) return;
    
    if (subExams.includes(newSubExam)) {
      toast.error("Sub-exam already exists");
      return;
    }
    
    setSubExams([...subExams, newSubExam]);
    setNewSubExam("");
  };

  const handleRemoveSubExam = (index: number) => {
    const updatedSubExams = [...subExams];
    updatedSubExams.splice(index, 1);
    setSubExams(updatedSubExams);
  };

  const resetForm = () => {
    setNewExamName("");
    setNewExamCategory("");
    setNewSubExam("");
    setSubExams([]);
    setCurrentExam(null);
  };

  const openEditDialog = (exam: ExamEntry) => {
    setCurrentExam(exam);
    setNewExamName(exam.name);
    setNewExamCategory(exam.category);
    setSubExams([...exam.subExams]);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (exam: ExamEntry) => {
    setCurrentExam(exam);
    setIsDeleteDialogOpen(true);
  };

  const openPreview = (exam: ExamEntry) => {
    toast.info(`Previewing ${exam.name}`);
    // In a real application, this would navigate to a preview page
  };

  const handleLinkExam = (exam: ExamEntry) => {
    toast.info(`Linking ${exam.name} to mind maps`);
    // In a real application, this would open a dialog to link the exam to mind maps
  };

  // Filter exams based on search term and category
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subExams.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !categoryFilter || exam.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Exam Management</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Exams</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Exam
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/3"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="md:w-1/3">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {EXAM_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub-Exams</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{exam.category}</TableCell>
                      <TableCell>{exam.subExams.join(", ")}</TableCell>
                      <TableCell>{new Date(exam.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openPreview(exam)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleLinkExam(exam)}>
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(exam)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(exam)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No exams found.
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
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="exam-name" className="text-sm font-medium">
                Exam Name
              </label>
              <Input
                id="exam-name"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                placeholder="e.g., UPSC Civil Services"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="exam-category" className="text-sm font-medium">
                Category
              </label>
              <Select value={newExamCategory} onValueChange={(value) => setNewExamCategory(value as ExamCategory)}>
                <SelectTrigger id="exam-category">
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
            <div className="grid gap-2">
              <label className="text-sm font-medium">Sub-Exams</label>
              <div className="flex gap-2">
                <Input
                  value={newSubExam}
                  onChange={(e) => setNewSubExam(e.target.value)}
                  placeholder="e.g., CSE, IFS"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSubExam}>
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {subExams.map((subExam, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1"
                  >
                    <span>{subExam}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => handleRemoveSubExam(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddExam}>Add Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exam Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-exam-name" className="text-sm font-medium">
                Exam Name
              </label>
              <Input
                id="edit-exam-name"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-exam-category" className="text-sm font-medium">
                Category
              </label>
              <Select value={newExamCategory} onValueChange={(value) => setNewExamCategory(value as ExamCategory)}>
                <SelectTrigger id="edit-exam-category">
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
            <div className="grid gap-2">
              <label className="text-sm font-medium">Sub-Exams</label>
              <div className="flex gap-2">
                <Input
                  value={newSubExam}
                  onChange={(e) => setNewSubExam(e.target.value)}
                  placeholder="e.g., CSE, IFS"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSubExam}>
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {subExams.map((subExam, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1"
                  >
                    <span>{subExam}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => handleRemoveSubExam(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditExam}>Update Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Exam Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{currentExam?.name}"? This action cannot be undone.
          </p>
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
