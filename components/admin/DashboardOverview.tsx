'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/stores/admin";
import { 
  MessageSquare, 
  Briefcase, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function DashboardOverview() {
  const { submissionStats, submissions, admins } = useAdminStore();

  const recentSubmissions = submissions.slice(0, 5);

  const stats = [
    {
      title: "Total Submissions",
      value: submissionStats?.total || 0,
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
      change: "+12%",
      changeType: "increase" as const
    },
    {
      title: "Pending Review",
      value: submissionStats?.pending || 0,
      icon: <Clock className="h-5 w-5 text-yellow-600" />,
      change: "3 new",
      changeType: "neutral" as const
    },
    {
      title: "Completed",
      value: submissionStats?.completed || 0,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      change: "+8%",
      changeType: "increase" as const
    },
    {
      title: "Admin Users",
      value: admins.length,
      icon: <Users className="h-5 w-5 text-purple-600" />,
      change: "Active",
      changeType: "neutral" as const
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className={`h-4 w-4 mr-1 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <span className={`text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {submission.type === 'career' ? (
                        <Briefcase className="h-4 w-4 text-gray-600" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{submission.name}</p>
                        <p className="text-xs text-gray-600">{submission.email}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No recent submissions</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Admin Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {admins.length > 0 ? (
              <div className="space-y-2">
                {admins.map((email, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-blue-600">
                        {email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">{email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No admin users</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
