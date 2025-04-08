
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Settings = () => {
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState("5");
  const [deleteConfirmation, setDeleteConfirmation] = useState(true);
  const [showTips, setShowTips] = useState(true);

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveBackup = () => {
    toast.success("Backup settings saved");
  };

  const handleExportData = () => {
    toast.info("Exporting data...");
    
    // In a real application, this would export all data
    setTimeout(() => {
      toast.success("Data exported successfully");
    }, 1500);
  };

  const handleImportData = () => {
    toast.info("Please upload a backup file");
  };

  const handleResetSystem = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset the system? All data will be lost."
    );
    
    if (confirmed) {
      toast.info("Resetting system...");
      
      setTimeout(() => {
        toast.success("System reset successfully");
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save mind maps while editing
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
              
              {autoSave && (
                <div className="space-y-2">
                  <Label htmlFor="auto-save-interval">Auto Save Interval (minutes)</Label>
                  <Input
                    id="auto-save-interval"
                    type="number"
                    min="1"
                    max="60"
                    value={autoSaveInterval}
                    onChange={(e) => setAutoSaveInterval(e.target.value)}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="delete-confirmation">Delete Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Show confirmation dialog when deleting items
                  </p>
                </div>
                <Switch
                  id="delete-confirmation"
                  checked={deleteConfirmation}
                  onCheckedChange={setDeleteConfirmation}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-tips">Show Tips</Label>
                  <p className="text-sm text-muted-foreground">
                    Show helpful tips while using the application
                  </p>
                </div>
                <Switch
                  id="show-tips"
                  checked={showTips}
                  onCheckedChange={setShowTips}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
              <CardDescription>
                Configure automatic backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create backups of your data
                  </p>
                </div>
                <Switch
                  id="auto-backup"
                  defaultChecked
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <select
                  id="backup-frequency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="daily"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveBackup}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manual Backup & Restore</CardTitle>
              <CardDescription>
                Export or import your data manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Export Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download a backup of all your mind maps and exam data
                </p>
                <Button className="mt-2" onClick={handleExportData}>
                  Export All Data
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium">Import Data</h3>
                <p className="text-sm text-muted-foreground">
                  Restore from a previously exported backup file
                </p>
                <div className="mt-2 flex gap-2">
                  <Input type="file" />
                  <Button onClick={handleImportData}>Upload</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                These settings are for advanced users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Debug Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Enable additional logging and developer tools
                </p>
                <div className="mt-2">
                  <Switch id="debug-mode" />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium">Reset System</h3>
                <p className="text-sm text-muted-foreground">
                  Reset the system to its default state. This will delete all your data.
                </p>
                <Button variant="destructive" className="mt-2" onClick={handleResetSystem}>
                  Reset System
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
