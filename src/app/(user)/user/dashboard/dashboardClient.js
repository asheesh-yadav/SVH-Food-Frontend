
"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointerClick,
  Link2,
  Calendar,
  Download,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Share2,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Activity,
  Target,
  Award,
} from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardClient = () => {
  const theme = useSelector((state) => state.theme);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedChart, setSelectedChart] = useState("line");
  
  // Sample data for charts
  const trafficData = [
    { name: "Mon", visits: 1200, clicks: 800, conversions: 120 },
    { name: "Tue", visits: 1900, clicks: 1300, conversions: 180 },
    { name: "Wed", visits: 1500, clicks: 1100, conversions: 150 },
    { name: "Thu", visits: 2200, clicks: 1700, conversions: 220 },
    { name: "Fri", visits: 2600, clicks: 2100, conversions: 280 },
    { name: "Sat", visits: 1800, clicks: 1400, conversions: 190 },
    { name: "Sun", visits: 1600, clicks: 1200, conversions: 160 },
  ];

  const deviceData = [
    { name: "Desktop", value: 45, color: "#3B82F6" },
    { name: "Mobile", value: 40, color: "#8B5CF6" },
    { name: "Tablet", value: 15, color: "#10B981" },
  ];

  const topLinks = [
    { 
      name: "Summer Sale 2024", 
      url: "summer-sale-2024", 
      clicks: 1234, 
      conversion: 12.5,
      trend: "+15%",
      positive: true 
    },
    { 
      name: "Product Launch", 
      url: "product-launch", 
      clicks: 987, 
      conversion: 8.3,
      trend: "-3%",
      positive: false 
    },
    { 
      name: "Blog Post: SEO Tips", 
      url: "blog-seo-tips", 
      clicks: 756, 
      conversion: 5.2,
      trend: "+22%",
      positive: true 
    },
    { 
      name: "Newsletter Signup", 
      url: "newsletter", 
      clicks: 543, 
      conversion: 25.1,
      trend: "+8%",
      positive: true 
    },
  ];

  const recentActivity = [
    { action: "New link created", item: "Summer Sale 2024", time: "2 minutes ago", type: "create" },
    { action: "Link clicked", item: "Product Launch", time: "15 minutes ago", type: "click" },
    { action: "Template updated", item: "Business Pro", time: "1 hour ago", type: "update" },
    { action: "New visitor", item: "From Twitter", time: "2 hours ago", type: "visit" },
    { action: "Conversion recorded", item: "Newsletter Signup", time: "3 hours ago", type: "conversion" },
  ];

  const stats = [
    {
      title: "Total Visits",
      value: "12,345",
      change: "+12.3%",
      trend: "up",
      icon: <Eye size={20} />,
      color: "blue",
    },
    {
      title: "Total Clicks",
      value: "8,901",
      change: "+8.1%",
      trend: "up",
      icon: <MousePointerClick size={20} />,
      color: "purple",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.5%",
      trend: "down",
      icon: <Target size={20} />,
      color: "green",
    },
    {
      title: "Active Links",
      value: "24",
      change: "+4",
      trend: "up",
      icon: <Link2 size={20} />,
      color: "orange",
    },
  ];

  const StatCard = ({ stat }) => {
    const colorClasses = {
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    };

    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
            {stat.icon}
          </div>
          <span className={`text-sm font-medium flex items-center gap-1 ${
            stat.trend === "up" ? "text-green-600" : "text-red-600"
          }`}>
            {stat.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {stat.change}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Traffic Overview
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedChart("line")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedChart === "line"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setSelectedChart("area")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedChart === "area"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setSelectedChart("bar")}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedChart === "bar"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Bar
              </button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {selectedChart === "line" ? (
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              ) : selectedChart === "area" ? (
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="visits" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="clicks" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              ) : (
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="visits" fill="#3B82F6" />
                  <Bar dataKey="clicks" fill="#8B5CF6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Device Distribution
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{device.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Links
            </h2>
            <Link
              href="/user/linktree/my-linktree"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {topLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link2 size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{link.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">/{link.url}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{link.clicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">clicks</p>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{link.conversion}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">conv.</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    link.positive 
                      ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  }`}>
                    {link.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === "create" ? "bg-green-100 dark:bg-green-900/20 text-green-600" :
                  activity.type === "click" ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600" :
                  activity.type === "update" ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600" :
                  "bg-orange-100 dark:bg-orange-900/20 text-orange-600"
                }`}>
                  {activity.type === "create" ? <Plus size={16} /> :
                   activity.type === "click" ? <MousePointerClick size={16} /> :
                   activity.type === "update" ? <Edit size={16} /> :
                   <Eye size={16} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.action}</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{activity.item}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
            <Plus size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">New Link</p>
          </button>
          <button className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
            <Share2 size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-purple-500 transition-colors" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Share</p>
          </button>
          <button className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
            <BarChart3 size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-green-500 transition-colors" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Report</p>
          </button>
          <button className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
            <Award size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-orange-500 transition-colors" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Achievements</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;