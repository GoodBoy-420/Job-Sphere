import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const NOTIFICATION_API_END_POINT = `${import.meta.env.VITE_BACKEND_URL}/notification`;

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${NOTIFICATION_API_END_POINT}/admin`, {
        withCredentials: true
      });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        // Count unread notifications
        const unread = response.data.notifications.filter(
          notification => !notification.isRead
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${NOTIFICATION_API_END_POINT}/unread/count`, {
        withCredentials: true
      });

      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Fetch notifications when dropdown is opened
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(
        `${NOTIFICATION_API_END_POINT}/read/${notificationId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state
        setNotifications(notifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.type === 'company_verification') {
      navigate('/admin/companies');
      setIsOpen(false);
    }
  };

  // Format notification time
  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          {unreadCount > 0 ? (
            <>
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            </>
          ) : (
            <BellOff size={20} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-[#7209b7]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">
                    {notification.type === 'company_verification' && 'Company Verification'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminNotifications;
