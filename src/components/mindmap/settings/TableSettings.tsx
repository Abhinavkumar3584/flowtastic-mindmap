
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseNodeData } from "../types";
import { Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface TableSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const TableSettings = ({ nodeId, data }: TableSettingsProps) => {
  const [tableHeaders, setTableHeaders] = useState<string[]>(
    data.tableHeaders || ["Header 1", "Header 2", "Header 3"]
  );
  const [tableData, setTableData] = useState<Array<Array<string>>>(
    data.tableData || [
      ["Cell 1", "Cell 2", "Cell 3"],
      ["Cell 4", "Cell 5", "Cell 6"],
    ]
  );
  const [showHeaders, setShowHeaders] = useState<boolean>(
    data.showHeaders !== false
  );
  const [label, setLabel] = useState<string>(data.label || "Table");

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
        tableHeaders,
        tableData,
        showHeaders,
      });
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleHeaderChange = (index: number, value: string) => {
    const newHeaders = [...tableHeaders];
    newHeaders[index] = value;
    setTableHeaders(newHeaders);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    if (!newData[rowIndex]) newData[rowIndex] = [];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  const addColumn = () => {
    const newHeaders = [...tableHeaders, `Header ${tableHeaders.length + 1}`];
    setTableHeaders(newHeaders);
    
    const newData = tableData.map(row => {
      return [...row, ""];
    });
    setTableData(newData);
  };

  const removeColumn = (colIndex: number) => {
    if (tableHeaders.length <= 1) return;
    
    const newHeaders = tableHeaders.filter((_, i) => i !== colIndex);
    setTableHeaders(newHeaders);
    
    const newData = tableData.map(row => {
      return row.filter((_, i) => i !== colIndex);
    });
    setTableData(newData);
  };

  const addRow = () => {
    const newRow = new Array(tableHeaders.length).fill("");
    setTableData([...tableData, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    if (tableData.length <= 1) return;
    const newData = tableData.filter((_, i) => i !== rowIndex);
    setTableData(newData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Table Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="table-label">Table Label</Label>
        <Input
          id="table-label"
          value={label}
          onChange={handleLabelChange}
          onBlur={saveChanges}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="show-headers"
          checked={showHeaders}
          onCheckedChange={(checked) => {
            setShowHeaders(checked);
            saveChanges();
          }}
        />
        <Label htmlFor="show-headers">Show Headers</Label>
      </div>
      
      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="structure" className="space-y-4">
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
          
          {tableHeaders.map((header, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={header}
                onChange={(e) => handleHeaderChange(index, e.target.value)}
                onBlur={saveChanges}
                className="flex-1"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => removeColumn(index)}
                disabled={tableHeaders.length <= 1}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          
          <div className="flex justify-between items-center mt-4">
            <h4 className="text-sm font-semibold">Rows</h4>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addRow}
              className="h-7 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Row
            </Button>
          </div>
          
          {tableData.map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2">
              <div className="flex-1 text-sm">Row {rowIndex + 1}</div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => removeRow(rowIndex)}
                disabled={tableData.length <= 1}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full border-collapse">
              {showHeaders && (
                <thead>
                  <tr>
                    {tableHeaders.map((header, colIndex) => (
                      <th key={colIndex} className="border bg-gray-100 p-1 text-xs font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableHeaders.map((_, colIndex) => (
                      <td key={colIndex} className="border p-0">
                        <Input
                          value={row[colIndex] || ""}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          onBlur={saveChanges}
                          className="border-0 text-xs h-8 rounded-none"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
