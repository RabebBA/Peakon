"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Sun, Moon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchForm } from "@/components/ui/search-form";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { useTheme } from "@/components/context/theme.context";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header
      className="flex sticky top-0 pr-3 z-50 w-full h-12 items-center border-b border-white/10 shadow-md backdrop-blur-md
  bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-600
  dark:from-indigo-700 dark:via-indigo-800 dark:to-indigo-900
  text-white  "
    >
      <div className="flex h-full w-full items-center gap-2 px-4">
        {/* Sidebar Trigger */}
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1   p-2 rounded-md hover:bg-purple-300 hover:text-white" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>

        {/* Barre de recherche */}
        <div className="flex w-full">
          <SearchForm className="w-full sm:w-auto text-white" />
        </div>

        {/* Icônes et actions */}
        <div className="flex gap-4 items-center flex-row w-full sm:w-auto">
          {/* Bouton Messages */}
          <button onClick={() => setShowMessages(!showMessages)}>
            <Mail className="w-5 h-5" />
          </button>

          {/* Bouton Notifications */}
          <button onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="w-5 h-5" />
          </button>

          {/* Bouton Toggle Dark Mode */}
          <button onClick={toggleDarkMode}>
            {darkMode ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Messages */}
      {showMessages && (
        <Card className="absolute top-12 right-12 w-64 bg-white shadow-lg dark:bg-gray-800">
          <CardContent className="p-3">
            <h1 className="font-semibold dark:text-white">Messages</h1>
            <ul className="mt-2">
              <Separator className=" dark:bg-gray-700" />
              <li className="p-2 border-b flex items-center gap-2 dark:text-white">
                <img
                  src="https://i.pravatar.cc/150?img=5"
                  alt="Wade"
                  className="w-8 h-8 rounded-full"
                />
                Wade Warren: Hi! How are you?
              </li>
              <li className="p-2 border-b flex items-center gap-2 dark:text-white">
                <img
                  src="https://i.pravatar.cc/150?img=8"
                  alt="Savannah"
                  className="w-8 h-8 rounded-full"
                />
                Savannah: Hi! How are you?
              </li>
              <li className="p-2 flex items-center gap-2 dark:text-white">
                <img
                  src="https://i.pravatar.cc/150?img=7"
                  alt="Ralph"
                  className="w-8 h-8 rounded-full"
                />
                Ralph Edwards: Hi! How are you?
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Dropdown Notifications */}
      {showNotifications && (
        <Card className="absolute top-12 right-0 w-64 bg-white shadow-lg dark:bg-gray-800">
          <CardContent className="p-3 gap-2">
            <h1 className="font-semibold dark:text-white">Notifications</h1>
            <ul className="mt-2">
              <Separator className=" dark:bg-gray-700" />
              <li className="p-2 border-b flex items-center gap-2 dark:text-white">
                <img
                  src="https://i.pravatar.cc/150?img=8"
                  alt="User1"
                  className="w-8 h-8 rounded-full"
                />
                New message received
              </li>
              <li className="p-2 border-b flex items-center gap-2 dark:text-white">
                <img
                  src="https://i.pravatar.cc/150?img=7"
                  alt="User2"
                  className="w-8 h-8 rounded-full"
                />
                Your order is shipped
              </li>
              <li className="p-2 flex items-center gap-2 dark:text-white">
                <img
                  src="https://i.pravatar.cc/150?img=6"
                  alt="User3"
                  className="w-8 h-8 rounded-full"
                />
                New comment on your post
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </header>
  );
}
