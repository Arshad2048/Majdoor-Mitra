import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAlert } from '../../../context/AlertContext';
import { Users, FileText, Activity, Clock, ShieldCheck, TrendingUp, BarChart2, ChevronDown } from 'lucide-react';
import AdminCharts from './AdminCharts';
import './AdminDashboard.css';
import '../AdminSkeleton.css';

const AdminDashboard = () => {
    const { showAlert } = useAlert();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        recentUsers: 0,
        recentPosts: 0,
    });
    const [chartData, setChartData] = useState({
        userGrowth: [],
        postActivity: [],
    });
    const [chartRange, setChartRange] = useState('14'); // Default 14 days
    const [activeSessions, setActiveSessions] = useState(24);
    const [loading, setLoading] = useState(true);
    const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get Total Users
                const { count: usersCount, error: usersErr } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });
                
                // Get Total Posts
                const { count: postsCount, error: postsErr } = await supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_deleted', false);

                // Get Recent Users (Last 7 days)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const { count: recentUsersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', sevenDaysAgo.toISOString());

                // Get Recent Posts
                const { count: recentPostsCount } = await supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_deleted', false)
                    .gte('created_at', sevenDaysAgo.toISOString());

                // Fetch Historical Data based on selected range
                const rangeDays = parseInt(chartRange);
                const rangeDate = new Date();
                rangeDate.setDate(rangeDate.getDate() - rangeDays);
 
                const { data: historicalUsers } = await supabase
                    .from('profiles')
                    .select('created_at')
                    .gte('created_at', rangeDate.toISOString());
 
                const { data: historicalPosts } = await supabase
                    .from('posts')
                    .select('created_at')
                    .gte('created_at', rangeDate.toISOString());
 
                // Aggregate Data by Day or Month
                const aggregateData = (data) => {
                    const buckets = {};
                    const isYear = rangeDays > 90;
 
                    if (isYear) {
                        // Aggregate by Month for 1 year view
                        for (let i = 0; i < 12; i++) {
                            const d = new Date();
                            d.setMonth(d.getMonth() - i);
                            const label = d.toLocaleDateString('en-GB', { month: 'short' });
                            buckets[label] = 0;
                        }
                    } else {
                        // Aggregate by Day
                        for (let i = 0; i < rangeDays; i++) {
                            const d = new Date();
                            d.setDate(d.getDate() - i);
                            const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                            buckets[label] = 0;
                        }
                    }
 
                    data.forEach(item => {
                        const d = new Date(item.created_at);
                        const label = isYear 
                            ? d.toLocaleDateString('en-GB', { month: 'short' })
                            : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                        if (buckets[label] !== undefined) buckets[label]++;
                    });
 
                    return Object.keys(buckets).reverse().map(key => ({ label: key, value: buckets[key] }));
                };
 
                setChartData({
                    userGrowth: aggregateData(historicalUsers || []),
                    postActivity: aggregateData(historicalPosts || []),
                });

                if (usersErr || postsErr) throw new Error('Failed to fetch stats');

                setStats({
                    totalUsers: usersCount || 0,
                    totalPosts: postsCount || 0,
                    recentUsers: recentUsersCount || 0,
                    recentPosts: recentPostsCount || 0,
                });
            } catch (err) {
                console.error(err);
                showAlert('Error loading dashboard stats', 'error');
            } finally {
                setLoading(false);
            }
        };

        const fetchActiveSessions = async () => {
            try {
                const fiveMinutesAgo = new Date();
                fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

                const { count, error } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .gte('last_seen_at', fiveMinutesAgo.toISOString());

                if (!error) {
                    setActiveSessions(count || 0);
                }
            } catch (err) {
                console.error('Error fetching active sessions:', err);
            }
        };

        fetchStats();
        fetchActiveSessions();

        // ── Refresh Active Sessions every 30s ──
        const sessionInterval = setInterval(fetchActiveSessions, 30000);

        // ── Real-Time Subscriptions ──
        
        // Listen for raw table inserts to update the COUNT stats live
        const profileSubscription = supabase
            .channel('admin-profile-count')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, () => {
                setStats(prev => ({ ...prev, totalUsers: prev.totalUsers + 1, recentUsers: prev.recentUsers + 1 }));
            })
            .subscribe();

        const postSubscription = supabase
            .channel('admin-post-count')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
                setStats(prev => ({ ...prev, totalPosts: prev.totalPosts + 1, recentPosts: prev.recentPosts + 1 }));
            })
            .subscribe();

        // ── Click Outside to close dropdown ──
        const handleClickOutside = (e) => {
            if (!e.target.closest('.custom-admin-dropdown')) {
                setIsRangeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearInterval(sessionInterval);
            supabase.removeChannel(profileSubscription);
            supabase.removeChannel(postSubscription);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAlert, chartRange]);

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: '#3B82F6', trend: `+${stats.recentUsers} this week` },
        { title: 'Total Posts', value: stats.totalPosts, icon: <FileText size={24} />, color: '#10B981', trend: `+${stats.recentPosts} this week` },
        { title: 'Platform Status', value: 'Healthy', icon: <ShieldCheck size={24} />, color: '#8B5CF6', trend: 'Systems Operational' },
        { title: 'Active Sessions', value: 'Tracking...', icon: <Activity size={24} />, color: '#F59E0B', trend: 'Live' },
    ];

    if (loading) {
        return (
            <div className="admin-dashboard core-fade-in">
                <div className="admin-dashboard-grid skeleton-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton-stat-card">
                            <div className="skeleton-stat-header">
                                <div className="skeleton-base skeleton-icon-box"></div>
                                {i === 3 && <div className="skeleton-base" style={{width: '80px', height: '24px', borderRadius: '12px'}}></div>}
                            </div>
                            <div className="skeleton-base skeleton-stat-title"></div>
                            <div className="skeleton-base skeleton-stat-value"></div>
                            <div className="skeleton-base skeleton-stat-trend"></div>
                        </div>
                    ))}
                </div>

                <div className="skeleton-section-header">
                    <div className="skeleton-base skeleton-header-title"></div>
                    <div className="skeleton-base skeleton-header-action"></div>
                </div>

                <div className="admin-charts-grid">
                    {[1, 2].map(i => (
                        <div key={i} className="skeleton-chart-card skeleton-base"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard core-fade-in">
            <div className="admin-dashboard-grid">
                <div className="admin-stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon" style={{ backgroundColor: '#3B82F615', color: '#3B82F6' }}>
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="stat-card-body">
                        <h3 className="stat-title">Total Users</h3>
                        <p className="stat-value">{stats.totalUsers}</p>
                        <div className="stat-trend">
                            <Clock size={12} />
                            <span>+{stats.recentUsers} this week</span>
                        </div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon" style={{ backgroundColor: '#10B98115', color: '#10B981' }}>
                            <FileText size={24} />
                        </div>
                    </div>
                    <div className="stat-card-body">
                        <h3 className="stat-title">Total Posts</h3>
                        <p className="stat-value">{stats.totalPosts}</p>
                        <div className="stat-trend">
                            <Clock size={12} />
                            <span>+{stats.recentPosts} this week</span>
                        </div>
                    </div>
                </div>

                <div className="admin-stat-card session-card">
                    <div className="stat-card-header">
                        <div className="stat-icon" style={{ backgroundColor: '#F59E0B15', color: '#F59E0B' }}>
                            <Activity size={24} />
                        </div>
                        <div className="live-badge">
                            <span className="pulse-dot"></span>
                            REAL-TIME
                        </div>
                    </div>
                    <div className="stat-card-body">
                        <h3 className="stat-title">Active Users</h3>
                        <p className="stat-value sessions-count">{activeSessions}</p>
                        <div className="stat-trend" style={{ color: '#F59E0B' }}>
                            <span>Users active in last 5m</span>
                        </div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="stat-card-header">
                        <div className="stat-icon" style={{ backgroundColor: '#8B5CF615', color: '#8B5CF6' }}>
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                    <div className="stat-card-body">
                        <h3 className="stat-title">System Status</h3>
                        <p className="stat-value" style={{ fontSize: '1.4rem', marginTop: '4px' }}>Healthy</p>
                        <div className="stat-trend" style={{ color: '#10B981' }}>
                            <TrendingUp size={12} />
                            <span>Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="admin-section-header">
                <div className="section-title-group">
                    <BarChart2 size={24} />
                    <h2>Analytics Overview</h2>
                </div>
                <div className="date-range-picker-container">
                    <div 
                        className={`custom-admin-dropdown ${isRangeDropdownOpen ? 'open' : ''}`}
                        onClick={() => setIsRangeDropdownOpen(!isRangeDropdownOpen)}
                    >
                        <Clock size={16} className="dropdown-icon" />
                        <span className="selected-value">
                            {chartRange === '7' && 'Last 7 Days'}
                            {chartRange === '14' && 'Last 14 Days'}
                            {chartRange === '30' && 'Last 30 Days'}
                            {chartRange === '90' && 'Last 90 Days'}
                            {chartRange === '365' && 'Last Year'}
                        </span>
                        <ChevronDown size={14} className="dropdown-arrow" />
                        
                        {isRangeDropdownOpen && (
                            <div className="dropdown-menu-portal">
                                <div className={`dropdown-item ${chartRange === '7' ? 'active' : ''}`} onClick={() => setChartRange('7')}>Last 7 Days</div>
                                <div className={`dropdown-item ${chartRange === '14' ? 'active' : ''}`} onClick={() => setChartRange('14')}>Last 14 Days</div>
                                <div className={`dropdown-item ${chartRange === '30' ? 'active' : ''}`} onClick={() => setChartRange('30')}>Last 30 Days</div>
                                <div className={`dropdown-item ${chartRange === '90' ? 'active' : ''}`} onClick={() => setChartRange('90')}>Last 90 Days</div>
                                <div className={`dropdown-item ${chartRange === '365' ? 'active' : ''}`} onClick={() => setChartRange('365')}>Last Year</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="admin-charts-grid">
                <div className="admin-chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <TrendingUp size={18} />
                            <span>User Growth ({chartRange === '365' ? 'Last 12 Months' : `Last ${chartRange} Days`})</span>
                        </div>
                    </div>
                    <AdminCharts data={chartData.userGrowth} type="line" color="#3B82F6" />
                </div>

                <div className="admin-chart-card">
                    <div className="chart-header">
                        <div className="chart-title">
                            <BarChart2 size={18} />
                            <span>Post Activity ({chartRange === '365' ? 'Last 12 Months' : `Last ${chartRange} Days`})</span>
                        </div>
                    </div>
                    <AdminCharts data={chartData.postActivity} type="bar" color="#10B981" />
                </div>
            </div>

            <div className="admin-dashboard-welcome">
                <h2>Welcome to Majdoor Mitra Admin</h2>
                <p>Use the sidebar to manage users and moderate platform content.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
