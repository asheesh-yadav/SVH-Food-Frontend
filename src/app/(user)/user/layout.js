"use client";
import {
  ChevronDown,
  Share2,
  X,
  PanelLeftOpen,
  PanelLeftClose,
  HelpCircle,
  HomeIcon,
  House,
  ListOrdered,
  LogOut,
  MoveLeft,
  Settings,
  SettingsIcon,
  User2Icon,
  UserIcon,
  UserPen,
  Bell,
  LayoutGrid,
  Link2,
  Globe,
  CreditCard,
  BarChart3,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter, redirect } from "next/navigation";
import "../user/dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { setVerified } from "@/store/home_Slices/emailLogin";
import ProtectedRoute from "@/hooks/protectedRoute";
import { useCrisp } from "@/hooks/CrispIntergration";
import {
  setDarkTheme,
  setLightTheme,
} from "@/store/dashboard_Slices/themeSlice";
import { Toaster } from "sonner";

const userList = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutGrid size={20} />,
    description: "Overview & analytics",
  },
  {
    name: "Linktree",
    path: "linktree",
    icon: <Link2 size={20} />,
    description: "Manage your links",
    subRoutes: [
      {
        name: "Linktree",
        path: "",
        description: "View and edit your Linktree",
      },
      {
        name: "My Linktree",
        path: "my-linktree",
        description: "View and edit your Linktree",
      },
    ],
  },
  {
    name: "Website",
    path: "",
    icon: <Globe size={20} />,
    description: "Customize your site",
    subRoutes: [
      {
        name: "Template",
        path: "website",
        description: "Manage custom domains",
      },

      {
        name: "My Template",
        path: "my-template",
        description: "Choose and customize templates",
      },
    ],
  },
  {
    name: "Billing",
    path: "billing",
    icon: <CreditCard size={20} />,
    description: "Manage subscriptions",
  },
  {
    name: "Analytics",
    path: "analytics",
    icon: <BarChart3 size={20} />,
    description: "View insights",
  },

  {
    name: "Settings",
    path: "settings",
    icon: <SettingsIcon size={20} />,
    description: "Account preferences",
  },
  {
    name: "Help & Support",
    path: "help",
    icon: <HelpCircle size={20} />,
    description: "Get assistance",
  },
];

function UserSidebar({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  useCrisp();

  const [redirectt, sett] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAtDesk, setisOpenAtDesk] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null); // Track which submenu is open
  const [activeItem, setActiveItem] = useState("/dashboard");

  const navigate = useRouter();

  useEffect(() => {
    const userTheme = typeof window !== "undefined" && localStorage.getItem("userTheme");
    if (userTheme === "dark") {
      dispatch(setDarkTheme());
    } else {
      dispatch(setLightTheme());
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/customer/logout`,
        {
          method: "GET",
          credentials: "include",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const logoutSucess = await response.json();
      console.log(logoutSucess, "logoutSuccessfully");
      localStorage.removeItem("userSession");

      if (logoutSucess.success === true) {
        dispatch(setVerified(false));
        sett(true);
      }
    } catch (error) {
      console.log("Logout failed:", error.message);
    }
  };

  {
    redirectt && redirect("/");
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setisOpenAtDesk(!isOpenAtDesk);
  };

  const handleMenuItemClick = (item, index) => {
    setActiveItem(`/user/${item.path}`);

    if (item.subRoutes) {
      // Toggle submenu - only open the clicked one
      setOpenSubMenu(openSubMenu === index ? null : index);
    } else {
      navigate.push(`/user/${item.path}`);
      setIsOpen(false);
      setOpenSubMenu(null); // Close any open submenu
    }
  };

  const handleSubMenuItemClick = (item, subItem) => {
    setActiveItem(`/user/${item.path}/${subItem.path}`);
    navigate.push(`/user/${item.path}/${subItem.path}`);
    setIsOpen(false);
  };

  // Close sidebar when clicked outside
  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("userModel")) {
        setIsOpen(false);
      }
    });
  }, []);

  return (
    <>
      {/* Header */}
      <div
        className={`userhead bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm py-3 w-full flex items-center justify-between app ${theme}`}
      >
        <div className={`flex items-center justify-center gap-4 app ${theme}`}>
          <div
            onClick={toggleSidebar}
            className="ml-4 flex gap-4 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            {isOpen ? (
              <>
                <PanelLeftClose
                  size={24}
                  className="md:flex hidden text-gray-600 dark:text-gray-300"
                />
                <X
                  className="md:hidden flex text-gray-600 dark:text-gray-300"
                  size={24}
                />
              </>
            ) : (
              <>
                <PanelLeftOpen
                  size={24}
                  className="text-gray-600 dark:text-gray-300"
                />
              </>
            )}
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Builder
          </div>
        </div>

        <div className={`flex gap-4 items-center app ${theme}`}>
          <Link href={`/`}>
            <div className="flex group items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer gap-2 border border-gray-200 dark:border-gray-700 transition-all">
              {/* Arrow Animation Wrapper */}
              <div className="relative w-[20px] h-[20px] overflow-hidden">
                {/* First Arrow */}
                <MoveLeft className="absolute inset-0 transform transition-transform duration-300 group-hover:-translate-x-full text-gray-600 dark:text-gray-300" />

                {/* Second Arrow */}
                <MoveLeft className="absolute inset-0 translate-x-full transition-transform duration-300 group-hover:translate-x-0 text-gray-600 dark:text-gray-300" />
              </div>

              {/* Text */}
              <div className="flex items-center text-sm justify-center gap-1 font-medium text-gray-700 dark:text-gray-200">
                Home
                <House strokeWidth={2} size={16} />
              </div>
            </div>
          </Link>

          <Popover>
            <PopoverTrigger>
              <div className="flex items-center gap-2 mr-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User2Icon size={18} className="text-white" />
                </div>
                <ChevronDown
                  size={16}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl">
              <div className="flex flex-col gap-1">
                <Link
                  href="/user/profile"
                  className="w-full flex gap-3 items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <UserPen size={18} className="text-gray-500" />
                  Profile
                </Link>
                <Link
                  href="/user/settings"
                  className="w-full flex gap-3 items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Settings size={18} className="text-gray-500" />
                  Settings
                </Link>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                <div
                  onClick={handleLogout}
                  className="w-full flex gap-3 items-center px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div
        className={`flex transition-transform duration-500 w-full max-h-[calc(100vh-73px)] `}
      >
        {/* Sidebar Overlay */}
        <div
          className={`w-full bg-black/50 backdrop-blur-sm transition-all duration-500 md:${
            isOpenAtDesk === true ? "block" : "hidden"
          } ${
            isOpen === true ? "block" : "hidden"
          } md:hidden z-[9] max-h-[94vh] userModel absolute top-[73px] left-0 w-full`}
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={` transition-all duration-500
            ${
              theme === "dark"
                ? "bg-gray-900"
                : "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800"
            }
            ${isOpenAtDesk === true ? "md:w-72" : "md:w-0 md:opacity-0"} ${
            isOpen === true ? "w-72" : "w-0 opacity-0"
          } md:opacity-100 overflow-hidden z-10 absolute md:relative top-[73px] md:top-0 left-0 h-[calc(100vh-73px)] md:h-[calc(100vh-73px)]`}
        >
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <div className="p-5">
              {/* User Info */}
              <div className="relative group mb-8">
                {/* Gradient Glow Border */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

                {/* Main Card */}
                <div className="relative p-5 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl overflow-hidden">
                  {/* Shine Animation */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Welcome back
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          John Doe
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Menu */}
              <nav className="space-y-1">
                {userList.map((item, index) => (
                  <div key={index} className="mb-1">
                    {/* Main Menu Item */}
                    <div
                      onClick={() => handleMenuItemClick(item, index)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                        activeItem === `/user/${item.path}` && !item.subRoutes
                          ? ` dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ${
                              theme === "dark" ? "bg-blue-900/30" : "bg-blue-50"
                            }`
                          : ` dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 ${
                              theme === "dark"
                                ? "bg-gray-900"
                                : "hover:bg-gray-100"
                            }`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`${
                            activeItem === `/user/${item.path}`
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-medium ${
                              theme === "dark"
                                ? "text-white"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {item.name}
                          </span>
                          {/* <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span> */}
                        </div>
                      </div>
                      {item.subRoutes && (
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform duration-200 ${
                            openSubMenu === index ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>

                    {/* Submenu */}
                    {item.subRoutes && openSubMenu === index && (
                      <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                        {item.subRoutes.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            onClick={() =>
                              handleSubMenuItemClick(item, subItem)
                            }
                            className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${
                              activeItem ===
                              `/user/${item.path}/${subItem.path}`
                                ? ` dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ${
                                    theme === "dark"
                                      ? "bg-blue-900/30"
                                      : "bg-blue-50"
                                  }`
                                : ` dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 ${
                                    theme === "dark"
                                      ? "hover:bg-gray-800 text-gray-100"
                                      : "hover:bg-gray-100 text-gray-800 "
                                  }`
                            }`}
                          >
                            <div className="flex flex-col">
                              <span
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {subItem.name}
                              </span>
                              {/* <span className="text-xs text-gray-500 dark:text-gray-400">{subItem.description}</span> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
          <ProtectedRoute>
            <Toaster richColors position="bottom-right" />
            <div className="">
              {children}</div>
          </ProtectedRoute>
        </div>
      </div>
    </>
  );
}

export default UserSidebar;
