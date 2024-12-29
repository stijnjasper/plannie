import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, UsersRound, ClipboardList } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralTab from "./tabs/GeneralTab";
import PeopleTab from "./tabs/PeopleTab";
import ProjectsTab from "./tabs/ProjectsTab";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl p-0 gap-0 h-[85vh] flex flex-col overflow-hidden bg-background border-border dark:bg-background dark:border-gray-800 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-describedby="settings-description"
      >
        <div id="settings-description" className="sr-only">
          Beheer je instellingen, teamleden en projecten
        </div>
        
        <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start rounded-none border-b bg-background p-0 h-12 flex-shrink-0">
            <TabsTrigger
              value="general"
              className="flex gap-2 rounded-none border-b-2 border-transparent px-4 py-3 hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:bg-muted/50"
            >
              <Settings className="h-5 w-5" />
              <span>Algemeen</span>
            </TabsTrigger>
            <TabsTrigger
              value="people"
              className="flex gap-2 rounded-none border-b-2 border-transparent px-4 py-3 hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:bg-muted/50"
            >
              <UsersRound className="h-5 w-5" />
              <span>Personen</span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="flex gap-2 rounded-none border-b-2 border-transparent px-4 py-3 hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:bg-muted/50"
            >
              <ClipboardList className="h-5 w-5" />
              <span>Projecten</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6">
              <TabsContent value="general" className="m-0 outline-none">
                <GeneralTab onOpenChange={onOpenChange} />
              </TabsContent>
              <TabsContent value="people" className="m-0 outline-none">
                <PeopleTab />
              </TabsContent>
              <TabsContent value="projects" className="m-0 outline-none">
                <ProjectsTab />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;