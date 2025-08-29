"use client";
import {
  Briefcase,
  Building,
  Calendar,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  FolderOpen,
  Globe,
  HelpCircle,
  Home,
  ImageIcon,
  Info,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Monitor,
  Navigation,
  Phone,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores/admin";

interface SectionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  description?: string;
}

interface SectionGroup {
  title: string;
  items: SectionItem[];
  defaultOpen?: boolean;
}

export default function Sidebar() {
  const { selectedSection, setSelectedSection, submissionStats, content } =
    useAdminStore();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "priority",
    "content",
  ]);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle)
        ? prev.filter((g) => g !== groupTitle)
        : [...prev, groupTitle],
    );
  };

  // COMPLETELY FIXED: Check if section is hidden
  const isSectionHidden = (sectionId: string) => {
    if (!content) return false;

    // The content structure is: content[sectionId][sectionId].hidden
    // For example: content.footer.footer.hidden
    const sectionData = content[sectionId as keyof typeof content] as any;
    return sectionData?.hidden === true;
  };

  const sectionGroups: SectionGroup[] = [
    {
      title: "Priority",
      defaultOpen: true,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          description: "Overview & Stats",
        },
        {
          id: "contactSubmissions",
          label: "Contact Enquiries",
          icon: <MessageSquare className="h-4 w-4" />,
          count: submissionStats?.pending || 0,
          description: "Customer enquiries",
        },
        {
          id: "careerSubmissions",
          label: "Job Applications",
          icon: <Briefcase className="h-4 w-4" />,
          description: "Career applications",
        },
        {
          id: "addMember",
          label: "Manage Admins",
          icon: <UserPlus className="h-4 w-4" />,
          description: "Add/remove admins",
        },
        {
          id: "assetsManager",
          label: "Assets Manager",
          icon: <ImageIcon className="h-4 w-4" />,
          description: "Manage uploaded files",
        },
      ],
    },
    {
      title: "Website Content",
      defaultOpen: true,
      items: [
        {
          id: "navbar",
          label: "Navigation Bar",
          icon: <Navigation className="h-4 w-4" />,
        },
        {
          id: "landingPage",
          label: "Landing Page",
          icon: <Home className="h-4 w-4" />,
        },
        {
          id: "companyMarquee",
          label: "Company Logos",
          icon: <Building className="h-4 w-4" />,
        },
        {
          id: "companyBrief",
          label: "Company Brief",
          icon: <Info className="h-4 w-4" />,
        },
        {
          id: "serviceOptions",
          label: "Services",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          id: "projects",
          label: "Projects",
          icon: <FolderOpen className="h-4 w-4" />,
        },
        {
          id: "testimonials",
          label: "Testimonials",
          icon: <MessageCircle className="h-4 w-4" />,
        },
        {
          id: "technologies",
          label: "Technologies",
          icon: <Monitor className="h-4 w-4" />,
        },
        {
          id: "industries",
          label: "Industries",
          icon: <Globe className="h-4 w-4" />,
        },
        {
          id: "whyUs",
          label: "Why Choose Us",
          icon: <HelpCircle className="h-4 w-4" />,
        },
        { id: "vision", label: "Vision", icon: <Eye className="h-4 w-4" /> },
        {
          id: "eventsPhotoWall",
          label: "Events Gallery",
          icon: <Calendar className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Forms & Contact",
      items: [
        {
          id: "contactUs",
          label: "Contact Form",
          icon: <Phone className="h-4 w-4" />,
        },
        {
          id: "career",
          label: "Career Form",
          icon: <Users className="h-4 w-4" />,
        },
        {
          id: "jobOpening",
          label: "Job Openings",
          icon: <Briefcase className="h-4 w-4" />,
        },
        { id: "footer", label: "Footer", icon: <Info className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed top-16 bottom-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Admin Panel
        </h2>

        <nav className="space-y-6">
          {sectionGroups.map((group) => {
            const isExpanded = expandedGroups.includes(
              group.title.toLowerCase().replace(" ", ""),
            );

            return (
              <div key={group.title}>
                <button
                  type="button"
                  onClick={() =>
                    toggleGroup(group.title.toLowerCase().replace(" ", ""))
                  }
                  className="flex items-center justify-between w-full text-left px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span>{group.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-1">
                    {group.items.map((item) => {
                      const isHidden = isSectionHidden(item.id);

                      return (
                        <Button
                          key={item.id}
                          variant={
                            selectedSection === item.id ? "default" : "ghost"
                          }
                          size="sm"
                          className={cn(
                            "w-full justify-start h-auto py-2 px-3",
                            selectedSection === item.id
                              ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                          )}
                          onClick={() => setSelectedSection(item.id)}
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex items-start space-x-2 flex-1 min-w-0">
                              <div className="mt-0.5">{item.icon}</div>
                              <div className="text-left flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {item.label}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-gray-500 truncate">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Fixed badges container */}
                            <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                              {/* Count badge on top */}
                              {item.count !== undefined && item.count > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0 h-4 leading-none"
                                >
                                  {item.count}
                                </Badge>
                              )}
                              {/* Hidden badge below */}
                              {isHidden && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0 h-4 leading-none border-orange-300 text-orange-700"
                                >
                                  <EyeOff className="h-2.5 w-2.5" />
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
