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
      <DialogContent className="max-w-2xl p-0 gap-0 max-h-[80vh] flex flex-col">
        <Tabs defaultValue="general" className="w-full flex flex-col flex-1">
          <TabsList className="w-full justify-start rounded-none border-b bg-background p-0 h-14 shrink-0">
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

          <ScrollArea className="flex-1">
            <div className="h-full">
              <TabsContent value="general" className="p-6 m-0">
                <GeneralTab onOpenChange={onOpenChange} />
              </TabsContent>
              <TabsContent value="people" className="p-6 m-0">
                <PeopleTab />
              </TabsContent>
              <TabsContent value="projects" className="p-6 m-0">
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