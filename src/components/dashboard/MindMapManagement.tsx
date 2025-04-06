
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Eye, Trash, Link, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getAllMindMaps, deleteMindMap } from "@/utils/mindmapStorage";
import { useNavigate } from "react-router-dom";

interface MindMapListItem {
  name: string;
  examCategory: string;
  subExamName: string;
}

const MindMapManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mindMaps, setMindMaps] = useState<MindMapListItem[]>(() => {
    const allMaps = getAllMindMaps();
    return allMaps.map(name => {
      // Load data from localStorage to get exam category and sub-exam name
      const mindmapsData = localStorage.getItem('mindmaps') || '{}';
      const mindmaps = JSON.parse(mindmapsData);
      const mapData = mindmaps[name];
      
      return {
        name,
        examCategory: mapData?.examCategory || 'Uncategorized',
        subExamName: mapData?.subExamName || 'Unknown'
      };
    });
  });
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMindMap, setSelectedMindMap] = useState<MindMapListItem | null>(null);
  
  const navigate = useNavigate();

  // Filter mind maps based on search term
  const filteredMindMaps = mindMaps.filter(
    (map) => 
      map.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      map.examCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      map.subExamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteMindMap = () => {
    if (!selectedMindMap) return;
    
    // Delete the mind map from storage
    const result = deleteMindMap(selectedMindMap.name);
    
    if (result) {
      setMindMaps(mindMaps.filter(map => map.name !== selectedMindMap.name));
      toast.success(`Deleted mind map: ${selectedMindMap.name}`);
    } else {
      toast.error(`Failed to delete mind map: ${selectedMindMap.name}`);
    }
    
    setIsDeleteDialogOpen(false);
    setSelectedMindMap(null);
  };

  const handleViewMindMap = (mindMap: MindMapListItem) => {
    navigate('/');  // Navigate to the mind map editor
    toast.info(`Viewing mind map: ${mindMap.name}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Mind Map Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search mind maps..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="ml-4"
            >
              Create New Mind Map
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mind Map Name</TableHead>
                  <TableHead>Exam Category</TableHead>
                  <TableHead>Sub-Exam</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMindMaps.length > 0 ? (
                  filteredMindMaps.map((mindMap) => (
                    <TableRow key={mindMap.name}>
                      <TableCell className="font-medium">{mindMap.name}</TableCell>
                      <TableCell>{mindMap.examCategory || 'Uncategorized'}</TableCell>
                      <TableCell>{mindMap.subExamName || 'Unknown'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleViewMindMap(mindMap)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              setSelectedMindMap(mindMap);
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
                      No mind maps found
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
            <DialogDescription>
              Are you sure you want to delete this mind map? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium">{selectedMindMap?.name}</p>
              <p className="text-sm text-gray-500">
                {selectedMindMap?.examCategory} &gt; {selectedMindMap?.subExamName}
              </p>
            </div>
          </div>
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
    </div>
  );
};

export default MindMapManagement;
