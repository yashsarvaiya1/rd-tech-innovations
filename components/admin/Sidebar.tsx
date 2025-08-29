"use client";
import {
  Bell,
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
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/stores/admin";

interface SectionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  description?: string;
  priority?: boolean;
}

interface SectionGroup {
  title: string;
  items: SectionItem[];
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export default function Sidebar() {
  const { selectedSection, setSelectedSection, submissionStats, content } =
    useAdminStore();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "priority",
    "content",
    "forms",
  ]);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle)
        ? prev.filter((g) => g !== groupTitle)
        : [...prev, groupTitle],
    );
  };

  // Check if section is hidden
  const isSectionHidden = (sectionId: string) => {
    if (!content) return false;
    const sectionData = content[sectionId as keyof typeof content] as any;
    return sectionData?.hidden === true;
  };

  const sectionGroups: SectionGroup[] = [
    {
      title: "Priority",
      defaultOpen: true,
      icon: <Shield className="h-4 w-4 text-amber-600" />,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          description: "Overview & Stats",
          priority: true,
        },
        {
          id: "contactSubmissions",
          label: "Contact Enquiries",
          icon: <MessageSquare className="h-4 w-4" />,
          count: submissionStats?.pending || 0,
          description: "Customer enquiries",
          priority: true,
        },
        {
          id: "careerSubmissions",
          label: "Job Applications",
          icon: <Briefcase className="h-4 w-4" />,
          description: "Career applications",
          priority: true,
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
      icon: <Globe className="h-4 w-4 text-blue-600" />,
      items: [
        {
          id: "navbar",
          label: "Navigation Bar",
          icon: <Navigation className="h-4 w-4" />,
          description: "Site navigation",
        },
        {
          id: "landingPage",
          label: "Landing Page",
          icon: <Home className="h-4 w-4" />,
          description: "Hero section",
        },
        {
          id: "companyMarquee",
          label: "Company Logos",
          icon: <Building className="h-4 w-4" />,
          description: "Partner logos",
        },
        {
          id: "companyBrief",
          label: "Company Brief",
          icon: <Info className="h-4 w-4" />,
          description: "About section",
        },
        {
          id: "serviceOptions",
          label: "Services",
          icon: <Settings className="h-4 w-4" />,
          description: "Service offerings",
        },
        {
          id: "projects",
          label: "Projects",
          icon: <FolderOpen className="h-4 w-4" />,
          description: "Portfolio items",
        },
        {
          id: "testimonials",
          label: "Testimonials",
          icon: <MessageCircle className="h-4 w-4" />,
          description: "Client reviews",
        },
        {
          id: "technologies",
          label: "Technologies",
          icon: <Monitor className="h-4 w-4" />,
          description: "Tech stack",
        },
        {
          id: "industries",
          label: "Industries",
          icon: <Globe className="h-4 w-4" />,
          description: "Industry focus",
        },
        {
          id: "whyUs",
          label: "Why Choose Us",
          icon: <HelpCircle className="h-4 w-4" />,
          description: "Value propositions",
        },
        {
          id: "vision",
          label: "Vision",
          icon: <Eye className="h-4 w-4" />,
          description: "Company vision",
        },
        {
          id: "eventsPhotoWall",
          label: "Events Gallery",
          icon: <Calendar className="h-4 w-4" />,
          description: "Event photos",
        },
      ],
    },
    {
      title: "Forms & Contact",
      icon: <Phone className="h-4 w-4 text-emerald-600" />,
      items: [
        {
          id: "contactUs",
          label: "Contact Form",
          icon: <Phone className="h-4 w-4" />,
          description: "Contact page form",
        },
        {
          id: "career",
          label: "Career Form",
          icon: <Users className="h-4 w-4" />,
          description: "Job application form",
        },
        {
          id: "jobOpening",
          label: "Job Openings",
          icon: <Briefcase className="h-4 w-4" />,
          description: "Available positions",
        },
        {
          id: "footer",
          label: "Footer",
          icon: <Info className="h-4 w-4" />,
          description: "Site footer",
        },
      ],
    },
  ];

  const totalPendingItems = submissionStats?.pending || 0;

  return (
    <aside className="w-64 bg-card border-r border-border fixed top-16 bottom-0 shadow-lg">
      <div className="h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-card to-muted/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-foreground">
                Admin Panel
              </h2>
              {totalPendingItems > 0 && (
                <div className="flex items-center space-x-2 mt-1">
                  <Bell className="h-3 w-3 text-amber-600" />
                  <span className="text-xs text-amber-600 font-sans font-medium">
                    {totalPendingItems} pending
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <ScrollArea className="flex-1 p-4 bg-card overflow-auto">
          <nav className="space-y-6">
            {sectionGroups.map((group) => {
              const groupId = group.title.toLowerCase().replace(/\s+/g, "");
              const isExpanded = expandedGroups.includes(groupId);

              return (
                <div key={group.title}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupId)}
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-sm font-heading font-semibold text-foreground hover:bg-muted/50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-2">
                      {group.icon && (
                        <div className="flex-shrink-0">{group.icon}</div>
                      )}
                      <span>{group.title}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {/* Show total pending items for priority group */}
                      {group.title === "Priority" && totalPendingItems > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-heading"
                        >
                          {totalPendingItems}
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 group-hover:text-primary transition-colors" />
                      ) : (
                        <ChevronRight className="h-4 w-4 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1 pl-2">
                      {group.items.map((item) => {
                        const isHidden = isSectionHidden(item.id);
                        const isSelected = selectedSection === item.id;

                        return (
                          <Button
                            key={item.id}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start h-auto py-3 px-3 rounded-lg transition-all duration-200",
                              isSelected
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                              item.priority &&
                                !isSelected &&
                                "hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-transparent",
                            )}
                            onClick={() => setSelectedSection(item.id)}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <div
                                  className={cn(
                                    "mt-0.5 flex-shrink-0",
                                    isSelected ? "text-primary-foreground" : "",
                                  )}
                                >
                                  {item.icon}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                  <div
                                    className={cn(
                                      "text-sm font-heading font-semibold truncate",
                                      isSelected
                                        ? "text-primary-foreground"
                                        : "",
                                    )}
                                  >
                                    {item.label}
                                  </div>
                                  {item.description && (
                                    <div
                                      className={cn(
                                        "text-xs truncate font-sans",
                                        isSelected
                                          ? "text-primary-foreground/80"
                                          : "text-muted-foreground",
                                      )}
                                    >
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Badges container */}
                              <div className="flex flex-col items-end space-y-1 ml-3 flex-shrink-0">
                                {/* Priority indicator */}
                                {item.priority && (
                                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                )}

                                {/* Count badge */}
                                {item.count !== undefined && item.count > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      "text-xs px-2 py-0 h-5 leading-none font-heading",
                                      isSelected
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-amber-100 text-amber-800 border-amber-200",
                                    )}
                                  >
                                    {item.count}
                                  </Badge>
                                )}

                                {/* Hidden badge */}
                                {isHidden && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs px-1.5 py-0 h-5 leading-none font-heading",
                                      isSelected
                                        ? "border-primary-foreground/30 text-primary-foreground/80"
                                        : "border-orange-300 text-orange-700 bg-orange-50",
                                    )}
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
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-sans">
              Admin Dashboard v2.0
            </p>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              {sectionGroups.reduce(
                (total, group) => total + group.items.length,
                0,
              )}{" "}
              sections available
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
