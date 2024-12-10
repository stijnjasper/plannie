import { useState } from "react";
import { TeamMember } from "@/types/calendar";

export const useTeamState = () => {
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah Chen",
      title: "Lead Designer",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      team: "Design",
    },
    {
      id: "2",
      name: "Mike Johnson",
      title: "Frontend Developer",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
      team: "Development",
    },
    {
      id: "3",
      name: "Emma Davis",
      title: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      team: "Marketing",
    },
  ]);

  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({
    Marketing: true,
    Development: true,
    Design: true,
  });

  const toggleTeam = (team: string) => {
    setOpenTeams((prev) => ({
      ...prev,
      [team]: !prev[team],
    }));
  };

  return {
    teamMembers,
    openTeams,
    toggleTeam,
  };
};