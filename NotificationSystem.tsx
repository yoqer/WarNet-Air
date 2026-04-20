import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

interface NotificationRule {
  id: string;
  name: string;
  condition: string;
  enabled: boolean;
  channels: ('in-app' | 'email' | 'sms' | 'webhook')[];
}

export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Mission Completed',
      message: 'Reconnaissance mission Alpha-1 completed successfully',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
      priority: 'high',
      actionable: true,
      action: { label: 'View Report', callback: () => console.log('View report') },
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Battery',
      message: 'Airship Beta-2 battery at 25%. Recommend landing within 15 minutes.',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      read: false,
      priority: 'critical',
      actionable: true,
      action: { label: 'Land Now', callback: () => console.log('Landing') },
    },
    {
      id: '3',
      type: 'info',
      title: 'Weather Update',
      message: 'Wind speed increased to 18 m/s. Adjust flight path accordingly.',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      read: true,
      priority: 'medium',
      actionable: false,
    },
    {
      id: '4',
      type: 'error',
      title: 'Sensor Malfunction',
      message: 'LIDAR sensor on Gamma-3 offline. Switching to backup.',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      read: true,
      priority: 'high',
      actionable: true,
      action: { label: 'Diagnostics', callback: () => console.log('Diagnostics') },
    },
  ]);

  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: 'rule-1',
      name: 'Battery Low Alert',
      condition: 'battery < 30%',
      enabled: true,
      channels: ['in-app', 'sms'],
    },
    {
      id: 'rule-2',
      name: 'Mission Completion',
      condition: 'mission_status = completed',
      enabled: true,
      channels: ['in-app', 'email'],
    },
    {
      id: 'rule-3',
      name: 'Weather Warning',
      condition: 'wind_speed > 20 m/s',
      enabled: true,
      channels: ['in-app', 'webhook'],
    },
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const getTypeIcon = (type: string): string => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };
    return icons[type as keyof typeof icons] || '📢';
  };

  const getPriorityColor = (priority: string): string => {
    const colors = {
      low: 'border-l-4 border-blue-500 bg-blue-50',
      medium: 'border-l-4 border-yellow-500 bg-yellow-50',
      high: 'border-l-4 border-orange-500 bg-orange-50',
      critical: 'border-l-4 border-red-500 bg-red-50',
    };
    return colors[priority as keyof typeof colors] || 'border-l-4 border-gray-500 bg-gray-50';
  };

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleDeleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleToggleRule = useCallback((id: string) => {
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const handlePlaySound = useCallback(() => {
    // Simulate sound notification
    console.log('🔔 Notification sound played');
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === 'unread') return !n.read;
    if (notificationFilter === 'critical') return n.priority === 'critical';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔔 Notification System</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notifications">
                Notifications {unreadCount > 0 && <span className="ml-1 badge">{unreadCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setNotificationFilter('all')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    notificationFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setNotificationFilter('unread')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    notificationFilter === 'unread'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setNotificationFilter('critical')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    notificationFilter === 'critical'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Critical ({criticalCount})
                </button>
              </div>

              <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg ${getPriorityColor(notification.priority)} ${
                        !notification.read ? 'ring-2 ring-blue-300' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                          <div>
                            <h4 className="font-bold">{notification.title}</h4>
                            <p className="text-sm text-gray-700">{notification.message}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs px-2 py-1 bg-white rounded hover:bg-gray-100"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-xs px-2 py-1 bg-white rounded hover:bg-gray-100"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-gray-600">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>

                        {notification.actionable && notification.action && (
                          <button
                            onClick={notification.action.callback}
                            className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Rules Tab */}
            <TabsContent value="rules" className="space-y-4">
              <div className="space-y-3">
                {rules.map(rule => (
                  <div key={rule.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold">{rule.name}</h4>
                        <p className="text-sm text-gray-600 font-mono">{rule.condition}</p>
                      </div>
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          rule.enabled
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-400 text-white'
                        }`}
                      >
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {rule.channels.map(channel => (
                        <span
                          key={channel}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                + Add New Rule
              </Button>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold">Sound Notifications</h4>
                      <p className="text-sm text-gray-600">Play sound for incoming notifications</p>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-4 py-2 rounded font-medium transition ${
                        soundEnabled
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {soundEnabled ? 'On' : 'Off'}
                    </button>
                  </div>
                  {soundEnabled && (
                    <Button onClick={handlePlaySound} variant="outline" className="w-full">
                      🔊 Test Sound
                    </Button>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">Desktop Notifications</h4>
                      <p className="text-sm text-gray-600">Show browser notifications</p>
                    </div>
                    <button
                      onClick={() => setDesktopNotifications(!desktopNotifications)}
                      className={`px-4 py-2 rounded font-medium transition ${
                        desktopNotifications
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {desktopNotifications ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold mb-2">Notification Channels</h4>
                  <div className="space-y-2 text-sm">
                    <p>✅ In-App Notifications</p>
                    <p>✅ Email Alerts</p>
                    <p>✅ SMS Alerts</p>
                    <p>✅ Webhook Integration</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold mb-2">Priority Levels</h4>
                  <div className="space-y-2 text-sm">
                    <p>🔵 Low - General information</p>
                    <p>🟡 Medium - Important updates</p>
                    <p>🟠 High - Urgent actions</p>
                    <p>🔴 Critical - Immediate attention</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
