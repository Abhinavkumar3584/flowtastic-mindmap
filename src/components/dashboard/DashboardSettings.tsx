
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const DashboardSettings = () => {
  // Admin profile settings
  const [displayName, setDisplayName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  
  // System settings
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileUpdate = () => {
    toast.success("Profile updated successfully");
  };

  const handleSystemSettingsUpdate = () => {
    toast.success("System settings updated successfully");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your admin profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleProfileUpdate}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Customize your dashboard experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autosave">Auto Save</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save changes to mind maps
                      </p>
                    </div>
                    <Switch 
                      id="autosave"
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for dashboard
                      </p>
                    </div>
                    <Switch 
                      id="darkMode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for important updates
                      </p>
                    </div>
                    <Switch 
                      id="notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSystemSettingsUpdate}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
