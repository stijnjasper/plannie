import { TeamMember } from "@/types/calendar";
import { Menu } from '@mantine/core';
import { MoreHorizontal, Shield, ShieldOff, UserMinus } from "lucide-react";

interface TeamMemberActionsProps {
  member: TeamMember;
  onToggleAdmin: (memberId: string, currentStatus: boolean) => Promise<void>;
  onDeactivate: (memberId: string) => Promise<void>;
}

const TeamMemberActions = ({ member, onToggleAdmin, onDeactivate }: TeamMemberActionsProps) => {
  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <button className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={member.is_admin ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
          onClick={() => onToggleAdmin(member.id, member.is_admin)}
        >
          {member.is_admin ? 'Verwijder admin' : 'Maak admin'}
        </Menu.Item>
        
        <Menu.Item
          leftSection={<UserMinus className="h-4 w-4" />}
          color="red"
          onClick={() => onDeactivate(member.id)}
        >
          Deactiveer
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default TeamMemberActions;