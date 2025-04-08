
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
import { Trash2, Eye, Link as LinkIcon } from "lucide-react";
import { ExamCategory, EXAM_CATEGORIES, MindMapData } from "@/components/mindmap/types";
import { toast } from "sonner";
import { loadAllMindMaps, deleteMindMap } from "@/utils/mindmapStorage";

const MindMapManagement = () => {
  const [mindMaps, setMindMaps] = useState<MindMapData[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [currentMindMap, setCurrentMindMap] = useState<MindMapData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const [selectedExamCategory, setSelectedExamCategory] = useState<ExamCategory | "">("");
  const [selectedSubExam, setSelectedSubExam] = useState("");

  // Load mind maps data
  useEffect(() => {
    const allMindMaps = loadAllMindMaps();
    setMindMaps(allMindMaps);
  }, []);

  const handleDeleteMindMap = () => {
    if (!currentMindMap) return;

    deleteMindMap(currentMindMap.name);
    setMindMaps(mindMaps.filter((mindMap) => mindMap.name !== currentMindMap.name));
    setIsDeleteDialogOpen(false);
    toast.success("Mind map deleted successfully");
  };

  const handleLinkMindMap = () => {
    if (!currentMindMap) return;

    if (!selectedExamCategory || !selectedSubExam) {
      toast.error("Please select an exam category and sub-exam");
      return;
    }

    // Update the mind map with the new exam category and sub-exam
    const updatedMindMaps = mindMaps.map((mindMap) =>
      mindMap.name === currentMindMap.name
        ? {
            ...mindMap,
            examCategory: selectedExamCategory,
            subExamName: selectedSubExam,
          }
        : mindMap
    );

    // In a real application, we would save this to the storage
    setMindMaps(updatedMindMaps);
    setIsLinkDialogOpen(false);
    toast.success("Mind map linked successfully");
  };

  const openDeleteDialog = (mindMap: MindMapData) => {
    setCurrentMindMap(mindMap);
    setIsDeleteDialogOpen(true);
  };

  const openLinkDialog = (mindMap: MindMapData) => {
    setCurrentMindMap(mindMap);
    setSelectedExamCategory(mindMap.examCategory as ExamCategory || "");
    setSelectedSubExam(mindMap.subExamName || "");
    setIsLinkDialogOpen(true);
  };

  const openPreview = (mindMap: MindMapData) => {
    window.open(`/export?name=${encodeURIComponent(mindMap.name)}`, '_blank');
  };

  // Filter mind maps based on search term and category
  const filteredMindMaps = mindMaps.filter((mindMap) => {
    const matchesSearch = mindMap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mindMap.examCategory && mindMap.examCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mindMap.subExamName && mindMap.subExamName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !categoryFilter || mindMap.examCategory === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mind Map Management</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Mind Maps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search mind maps..."
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
                  <TableHead>Sub-Exam</TableHead>
                  <TableHead>Nodes</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMindMaps.length > 0 ? (
                  filteredMindMaps.map((mindMap) => (
                    <TableRow key={mindMap.name}>
                      <TableCell className="font-medium">{mindMap.name}</TableCell>
                      <TableCell>{mindMap.examCategory || "Uncategorized"}</TableCell>
                      <TableCell>{mindMap.subExamName || "Not specified"}</TableCell>
                      <TableCell>{mindMap.nodes.length}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => openPreview(mindMap)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openLinkDialog(mindMap)}>
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(mindMap)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No mind maps found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Mind Map Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mind Map</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{currentMindMap?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMindMap}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Mind Map Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Mind Map to Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="mind-map-name" className="text-sm font-medium">
                Mind Map
              </label>
              <Input
                id="mind-map-name"
                value={currentMindMap?.name || ""}
                readOnly
                disabled
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="exam-category" className="text-sm font-medium">
                Exam Category
              </label>
              <Select 
                value={selectedExamCategory} 
                onValueChange={(value: string) => setSelectedExamCategory(value as ExamCategory)}
              >
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
              <label htmlFor="sub-exam" className="text-sm font-medium">
                Sub-Exam
              </label>
              <Input
                id="sub-exam"
                value={selectedSubExam}
                onChange={(e) => setSelectedSubExam(e.target.value)}
                placeholder="e.g., CSE, IFS"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkMindMap}>Link Mind Map</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindMapManagement;
