import { useState, useEffect } from "react";
import {
  BookOpen,
  GraduationCap,
  FileText,
  Users,
  Plus,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSubjects: 0,
    totalChapters: 0,
    totalStudents: 156, // dummy data
  });

  // Dummy recent activities
  const recentActivities = [
    {
      id: 1,
      action: "Created new class",
      item: "Class 12",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Added subject",
      item: "Physics - Class 11",
      time: "4 hours ago",
    },
    {
      id: 3,
      action: "Updated chapter",
      item: "Thermodynamics",
      time: "6 hours ago",
    },
    {
      id: 4,
      action: "Created chapter",
      item: "Organic Chemistry Basics",
      time: "1 day ago",
    },
  ];

  useEffect(() => {
    // Load stats from localStorage or set defaults
    const classes = JSON.parse(localStorage.getItem("lms_classes") || "[]");
    const subjects = JSON.parse(localStorage.getItem("lms_subjects") || "[]");
    const chapters = JSON.parse(localStorage.getItem("lms_chapters") || "[]");

    setStats({
      totalClasses: classes.length,
      totalSubjects: subjects.length,
      totalChapters: chapters.length,
      totalStudents: 156,
    });
  }, []);

  const statCards = [
    {
      name: "Total Classes",
      value: stats.totalClasses,
      icon: GraduationCap,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Total Subjects",
      value: stats.totalSubjects,
      icon: BookOpen,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      name: "Total Chapters",
      value: stats.totalChapters,
      icon: FileText,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      name: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const quickActions = [
    {
      name: "Create New Class",
      icon: GraduationCap,
      href: "/admin/classes",
      color: "bg-primary",
    },
    {
      name: "Add Subject",
      icon: BookOpen,
      href: "/admin/subjects",
      color: "bg-accent",
    },
    {
      name: "Create Chapter",
      icon: FileText,
      href: "/admin/chapters",
      color: "bg-success",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="admin-card bg-gradient-to-r from-primary/10 to-accent/10 border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-heading mb-2">
              Welcome back, Admin!
            </h1>
            <p className="text-text-body">
              Here's what's happening with your LMS today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="admin-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-subtle">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-heading font-bold text-text-heading mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="admin-card">
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.name}
                  href={action.href}
                  className="flex items-center p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group"
                >
                  <div
                    className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center mr-3 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-text-body group-hover:text-text-heading">
                    {action.name}
                  </span>
                  <Plus className="h-4 w-4 text-text-subtle ml-auto" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-body">
                    <span className="font-medium">{activity.action}</span> -{" "}
                    {activity.item}
                  </p>
                  <p className="text-xs text-text-subtle">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
