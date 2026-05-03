import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayoutSkeleton from '../../pages/Admin/AdminLayout/AdminLayoutSkeleton';

const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <AdminLayoutSkeleton />;
    }

    if (!user || !isAdmin) {
        // Redirect non-admins to home page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
