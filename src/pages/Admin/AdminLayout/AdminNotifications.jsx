import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabaseClient';
import { Bell, Check, Trash2, Clock, UserPlus, FilePlus } from 'lucide-react';
import './AdminNotifications.css';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('admin_notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching notifications:', error);
        } else {
            setNotifications(data || []);
            setUnreadCount(data?.filter(n => !n.is_read).length || 0);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Real-time subscription
        const channel = supabase
            .channel('admin_notifications_changes')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'admin_notifications' 
            }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = async () => {
        const { error } = await supabase
            .from('admin_notifications')
            .update({ is_read: true })
            .eq('is_read', false);

        if (error) {
            console.error('Error marking all as read:', error);
        } else {
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        }
    };

    const clearAll = async () => {
        const { error } = await supabase
            .from('admin_notifications')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (error) {
            console.error('Error clearing notifications:', error);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    const markOneRead = async (id) => {
        const { error } = await supabase
            .from('admin_notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (!error) {
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const getIcon = (type) => {
        switch (type) {
            case 'signup': return <UserPlus size={16} className="notif-icon-signup" />;
            case 'post': return <FilePlus size={16} className="notif-icon-post" />;
            default: return <Bell size={16} />;
        }
    };

    return (
        <div className="admin-notif-container" ref={dropdownRef}>
            <button 
                className={`admin-notif-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="admin-notif-dropdown">
                    <div className="notif-header">
                        <h3>Notifications</h3>
                        <div className="notif-header-actions">
                            <button onClick={markAllRead} title="Mark all as read">
                                <Check size={14} />
                            </button>
                            <button onClick={clearAll} title="Clear all">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <div className="notif-empty">No notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                                    onClick={() => !n.is_read && markOneRead(n.id)}
                                >
                                    <div className="notif-icon-box">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="notif-content">
                                        <p className="notif-message">{n.message}</p>
                                        <div className="notif-time">
                                            <Clock size={10} />
                                            <span>{getTimeAgo(n.created_at)}</span>
                                        </div>
                                    </div>
                                    {!n.is_read && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotifications;
