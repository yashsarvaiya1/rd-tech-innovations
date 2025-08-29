"use client";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  MessageSquare,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStore } from "@/stores/admin";

export default function DashboardOverview() {
  const {
    submissionStats,
    submissions,
    admins,
    selectedSection,
    setSelectedSection,
  } = useAdminStore();

  const recentSubmissions = submissions.slice(0, 5);
  const totalSubmissions = submissionStats?.total || 0;
  const pendingSubmissions = submissionStats?.pending || 0;
  const completedSubmissions = submissionStats?.completed || 0;

  // Calculate completion rate
  const completionRate =
    totalSubmissions > 0
      ? Math.round((completedSubmissions / totalSubmissions) * 100)
      : 0;

  const stats = [
    {
      title: "Total Submissions",
      value: totalSubmissions,
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      change:
        pendingSubmissions > 0 ? `${pendingSubmissions} new` : "All caught up",
      changeType:
        pendingSubmissions > 0 ? ("increase" as const) : ("neutral" as const),
      bgColor: "bg-blue-50",
      iconBg: "bg-primary/10",
    },
    {
      title: "Pending Review",
      value: pendingSubmissions,
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      change: pendingSubmissions > 0 ? "Needs attention" : "All clear",
      changeType:
        pendingSubmissions > 0 ? ("warning" as const) : ("neutral" as const),
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
    },
    {
      title: "Completed",
      value: completedSubmissions,
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      change: `${completionRate}% rate`,
      changeType:
        completionRate > 75 ? ("increase" as const) : ("neutral" as const),
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
    },
    {
      title: "Admin Users",
      value: admins.length,
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      change: "Active",
      changeType: "neutral" as const,
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "lost":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const navigateToSection = (section: string) => {
    setSelectedSection(section);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-background to-muted/20 p-6 rounded-xl border border-border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-black text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground font-sans">
              Welcome to your admin dashboard - Here's what's happening today
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-auto p-4 justify-start font-heading"
          onClick={() => navigateToSection("contactSubmissions")}
        >
          <MessageSquare className="h-5 w-5 mr-3 text-primary" />
          <div className="text-left">
            <div className="font-semibold">Contact Submissions</div>
            <div className="text-sm text-muted-foreground">
              View and manage inquiries
            </div>
          </div>
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Button>

        <Button
          variant="outline"
          className="h-auto p-4 justify-start font-heading"
          onClick={() => navigateToSection("careerSubmissions")}
        >
          <Briefcase className="h-5 w-5 mr-3 text-primary" />
          <div className="text-left">
            <div className="font-semibold">Career Applications</div>
            <div className="text-sm text-muted-foreground">
              Review job applications
            </div>
          </div>
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Button>

        <Button
          variant="outline"
          className="h-auto p-4 justify-start font-heading"
          onClick={() => navigateToSection("addMember")}
        >
          <Users className="h-5 w-5 mr-3 text-primary" />
          <div className="text-left">
            <div className="font-semibold">Manage Admins</div>
            <div className="text-sm text-muted-foreground">
              Add or remove admin users
            </div>
          </div>
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`${stat.bgColor} border-border shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-heading font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-heading font-black text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 ${stat.iconBg} rounded-xl shadow-sm`}>
                  {stat.icon}
                </div>
              </div>

              <div className="flex items-center">
                {getChangeIcon(stat.changeType)}
                <span className="text-sm font-sans font-medium ml-2 text-foreground">
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Submissions - Takes 2/3 width */}
        <Card className="xl:col-span-2 bg-card border-border shadow-lg">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="text-foreground font-heading flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-3 text-primary" />
                Recent Submissions
              </div>
              <Badge variant="secondary" className="font-heading">
                {recentSubmissions.length} recent
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-card">
            {recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/40 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                        {submission.type === "career" ? (
                          <Briefcase className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-base font-heading font-semibold text-foreground">
                          {submission.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-muted-foreground font-sans">
                            {submission.email}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {submission.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full font-heading"
                    onClick={() => navigateToSection("contactSubmissions")}
                  >
                    View All Submissions
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No Recent Submissions
                </h3>
                <p className="text-muted-foreground font-sans">
                  New submissions will appear here when they arrive
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Users - Takes 1/3 width */}
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="text-foreground font-heading flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-3 text-primary" />
                Admin Users
              </div>
              <Badge variant="secondary" className="font-heading">
                {admins.length} active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-card">
            {admins.length > 0 ? (
              <div className="space-y-3">
                {admins.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-muted/20 rounded-lg border border-border"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-heading font-bold text-primary-foreground">
                        {email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-heading font-semibold text-foreground">
                        {email}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-xs bg-primary/10 text-primary border-primary/30"
                        >
                          Administrator
                        </Badge>
                        {index === 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-accent/10 text-accent border-accent/30"
                          >
                            Primary
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full font-heading"
                    onClick={() => navigateToSection("addMember")}
                  >
                    Manage Admins
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No Admin Users
                </h3>
                <p className="text-muted-foreground font-sans text-sm">
                  Add administrators to manage the system
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
