
import React, { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button";
import { EXAM_CATEGORIES } from './types';
import { Label } from "@/components/ui/label";

interface MindMapSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onSave: (name: string, examCategory: string, examSubcategory: string) => void;
}

export const MindMapSaveDialog = ({
  open,
  onOpenChange,
  currentName,
  onSave
}: MindMapSaveDialogProps) => {
  const [name, setName] = useState('');
  const [examCategory, setExamCategory] = useState('');
  const [examSubcategory, setExamSubcategory] = useState('');
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [subcategoryError, setSubcategoryError] = useState('');

  // Reset form when dialog opens and set default name
  useEffect(() => {
    if (open) {
      setName(currentName);
      setExamCategory('');
      setExamSubcategory('');
      setNameError('');
      setCategoryError('');
      setSubcategoryError('');
    }
  }, [open, currentName]);

  const handleSave = () => {
    // Validate inputs
    let hasError = false;
    
    if (!name.trim()) {
      setNameError('Mind map name is required');
      hasError = true;
    } else {
      setNameError('');
    }
    
    if (!examCategory) {
      setCategoryError('Exam category is required');
      hasError = true;
    } else {
      setCategoryError('');
    }
    
    if (!examSubcategory.trim()) {
      setSubcategoryError('Sub-exam name is required');
      hasError = true;
    } else {
      setSubcategoryError('');
    }
    
    if (!hasError) {
      onSave(name, examCategory, examSubcategory);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Mind Map</DialogTitle>
          <DialogDescription>
            Categorize your mind map by selecting the exam category and entering the specific exam name.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="mindmap-name">Mind Map Name</Label>
            <Input
              id="mindmap-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter mind map name"
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && <p className="text-xs text-red-500">{nameError}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="exam-category">Exam Category</Label>
            <Select value={examCategory} onValueChange={setExamCategory}>
              <SelectTrigger id="exam-category" className={categoryError ? "border-red-500" : ""}>
                <SelectValue placeholder="Select exam category" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryError && <p className="text-xs text-red-500">{categoryError}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="exam-subcategory">Specific Exam Name</Label>
            <Input
              id="exam-subcategory"
              value={examSubcategory}
              onChange={(e) => setExamSubcategory(e.target.value)}
              placeholder="E.g., CSE, NDA, RRB NTPC"
              className={subcategoryError ? "border-red-500" : ""}
            />
            {subcategoryError && <p className="text-xs text-red-500">{subcategoryError}</p>}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
