import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Classes", href: "/admin/classes", icon: GraduationCap },
    { name: "Subjects", href: "/admin/subjects", icon: BookOpen },
    { name: "Chapters", href: "/admin/chapters", icon: FileText },
    {
      name: "Admin Management",
      href: "/admin/admin-management",
      icon: FileText,
    },
    {
      name: "Quiz Management",
      href: "/admin/quiz/quiz-management",
      icon: FileText,
    },
    { name: "Banner Upload", href: "/admin/banner-upload", icon: FileText },
    { name: "Banner List", href: "/admin/banner-list", icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  const { user, profile, loginWithGoogle, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex ">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40  bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed min-h-screen inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <h1 className="text-xl font-heading font-bold text-text-heading">
            GyanBrix Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-subtle hover:text-text-body"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 mb-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-text-body hover:bg-secondary hover:text-secondary-foreground"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-body">
                {profile?.name || user?.displayName || "Admin User"}
              </p>
              <p className="text-xs text-text-subtle">
                {profile?.email || user?.email}
              </p>
            </div>
          </div>
          <button
            className="flex items-center w-full px-3 py-2 text-sm text-text-subtle hover:text-error transition-colors"
            onClick={logout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div> */}

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          {user ? (
            <>
              {/* User Info */}
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-text-body">
                    {profile?.name || user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-text-subtle">
                    {profile?.email || user?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                className="flex items-center w-full px-3 py-2 text-sm text-text-subtle hover:text-error transition-colors"
                onClick={logout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <button
                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={loginWithGoogle}
              >
                <User className="mr-3 h-4 w-4" />
                Login with Google
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="  w-full">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-surface border-b border-border px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text-body hover:text-text-heading"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-2xl font-heading font-bold text-text-heading ml-4 lg:ml-0">
                {navigation.find((item) => isActive(item.href))?.name ||
                  "Dashboard"}
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
