
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BaseNodeData } from "../types";
import { Trash2, Plus, Calendar, User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KanbanSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const KanbanSettings = ({ nodeId, data }: KanbanSettingsProps) => {
  const [columns, setColumns] = useState<Array<{
    id: string;
    title: string;
    cards: Array<{
      id: string;
      content: string;
      color?: string;
      assignee?: string;
      dueDate?: string;
      priority?: 'low' | 'medium' | 'high';
    }>;
  }>>(
    data.columns || [
      {
        id: 'col1',
        title: 'To Do',
        cards: [
          { id: 'card1', content: 'Task 1', priority: 'medium' },
          { id: 'card2', content: 'Task 2', priority: 'low' }
        ]
      },
      {
        id: 'col2',
        title: 'In Progress',
        cards: [
          { id: 'card3', content: 'Task 3', priority: 'high' }
        ]
      },
      {
        id: 'col3',
        title: 'Done',
        cards: [
          { id: 'card4', content: 'Task 4' }
        ]
      }
    ]
  );
  const [label, setLabel] = useState<string>(data.label || "Kanban Board");
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string>('');

  // Apply changes when component unmounts
  useEffect(() => {
    return () => {
      saveChanges();
    };
  }, []);

  const saveChanges = () => {
    if (window.mindmapApi) {
      window.mindmapApi.updateNodeData(nodeId, {
        label,
        columns,
      });
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const addColumn = () => {
    const newId = uuidv4();
    setColumns([
      ...columns,
      {
        id: newId,
        title: `New Column`,
        cards: []
      }
    ]);
    setSelectedColumn(newId);
  };

  const removeColumn = (columnId: string) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter(col => col.id !== columnId));
    if (selectedColumn === columnId) {
      setSelectedColumn('');
      setSelectedCard('');
    }
  };

  const updateColumnTitle = (columnId: string, title: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, title } : col
    ));
  };

  const addCard = (columnId: string) => {
    const newId = uuidv4();
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: [...col.cards, { id: newId, content: 'New Task' }]
        };
      }
      return col;
    }));
    setSelectedCard(newId);
  };

  const removeCard = (columnId: string, cardId: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== cardId)
        };
      }
      return col;
    }));
    if (selectedCard === cardId) {
      setSelectedCard('');
    }
  };

  const updateCardContent = (columnId: string, cardId: string, content: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.map(card => 
            card.id === cardId ? { ...card, content } : card
          )
        };
      }
      return col;
    }));
  };

  const updateCardPriority = (columnId: string, cardId: string, priority: 'low' | 'medium' | 'high' | undefined) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.map(card => 
            card.id === cardId ? { ...card, priority } : card
          )
        };
      }
      return col;
    }));
  };

  const updateCardAssignee = (columnId: string, cardId: string, assignee: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.map(card => 
            card.id === cardId ? { ...card, assignee: assignee || undefined } : card
          )
        };
      }
      return col;
    }));
  };

  const updateCardDueDate = (columnId: string, cardId: string, dueDate: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.map(card => 
            card.id === cardId ? { ...card, dueDate: dueDate || undefined } : card
          )
        };
      }
      return col;
    }));
  };

  // Find the selected column and card
  const selectedColumnObj = columns.find(col => col.id === selectedColumn);
  const selectedCardObj = selectedColumnObj?.cards.find(card => card.id === selectedCard);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Kanban Board Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="kanban-label">Board Label</Label>
        <Input
          id="kanban-label"
          value={label}
          onChange={handleLabelChange}
          onBlur={saveChanges}
        />
      </div>
      
      <Tabs defaultValue="columns" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="columns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold">Columns</h4>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addColumn}
              className="h-7 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Column
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto p-1">
            {columns.map((column) => (
              <div 
                key={column.id} 
                className={`p-2 border rounded cursor-pointer ${selectedColumn === column.id ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setSelectedColumn(column.id)}
              >
                <div className="flex items-center justify-between">
                  <Input
                    value={column.title}
                    onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                    onBlur={saveChanges}
                    className="border-0 p-0 h-6 text-sm font-medium focus-visible:ring-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">{column.cards.length} cards</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColumn(column.id);
                        saveChanges();
                      }}
                      disabled={columns.length <= 1}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
                
                {selectedColumn === column.id && (
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        addCard(column.id);
                        saveChanges();
                      }}
                      className="w-full h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Card
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="cards" className="space-y-4">
          {selectedColumn ? (
            <>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Column:</Label>
                <Select 
                  value={selectedColumn} 
                  onValueChange={(value) => {
                    setSelectedColumn(value);
                    setSelectedCard('');
                  }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(col => (
                      <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 max-h-[120px] overflow-y-auto p-1">
                {selectedColumnObj?.cards.map((card) => (
                  <div 
                    key={card.id} 
                    className={`p-2 border rounded cursor-pointer ${selectedCard === card.id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSelectedCard(card.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">{card.content}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCard(selectedColumn, card.id);
                          saveChanges();
                        }}
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedCard && (
                <div className="space-y-3 p-3 border rounded">
                  <div className="space-y-2">
                    <Label htmlFor="card-content" className="text-sm">Content</Label>
                    <Textarea
                      id="card-content"
                      value={selectedCardObj?.content || ''}
                      onChange={(e) => updateCardContent(selectedColumn, selectedCard, e.target.value)}
                      onBlur={saveChanges}
                      className="min-h-[60px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-priority" className="text-sm">Priority</Label>
                    <Select 
                      value={selectedCardObj?.priority || ''} 
                      onValueChange={(value: string) => {
                        updateCardPriority(
                          selectedColumn, 
                          selectedCard, 
                          value ? value as 'low' | 'medium' | 'high' : undefined
                        );
                        saveChanges();
                      }}
                    >
                      <SelectTrigger id="card-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="card-assignee" className="text-sm flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        Assignee
                      </Label>
                      <Input
                        id="card-assignee"
                        value={selectedCardObj?.assignee || ''}
                        onChange={(e) => updateCardAssignee(selectedColumn, selectedCard, e.target.value)}
                        onBlur={saveChanges}
                        placeholder="Add assignee"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-due-date" className="text-sm flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Due Date
                      </Label>
                      <Input
                        id="card-due-date"
                        type="date"
                        value={selectedCardObj?.dueDate || ''}
                        onChange={(e) => updateCardDueDate(selectedColumn, selectedCard, e.target.value)}
                        onBlur={saveChanges}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Select a column first to manage its cards
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
