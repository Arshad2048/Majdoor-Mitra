import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [role, setRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from Supabase
    const fetchProfile = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (!error && data) {
            if (data.is_banned) {
                await supabase.auth.signOut();
                setUser(null);
                setProfile(null);
                throw new Error('Your account has been suspended by an administrator.');
            }
            setProfile(data);
            setRole(data.role);
            setIsAdmin(data.is_admin || false);
        }
    };

    useEffect(() => {
        let mounted = true;

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                if (mounted) setUser(session.user);
                fetchProfile(session.user.id).finally(() => {
                    if (mounted) setLoading(false);
                });
            } else {
                if (mounted) setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    if (mounted) setUser(session.user);
                    fetchProfile(session.user.id);
                } else {
                    if (mounted) {
                        setUser(null);
                        setProfile(null);
                        setRole(null);
                        setIsAdmin(false);
                        setLoading(false);
                    }
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const register = async ({ email, password, fullName, phone, role: userRole, location, skills, lat, lng }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                    role: userRole,
                    location: location,
                    skills: skills,
                    lat: lat,
                    lng: lng,
                },
            },
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setProfile(null);
        setRole(null);
        setIsAdmin(false);
    };

    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) throw error;
        return data;
    };

    const updatePassword = async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        return data;
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            role,
            isAdmin,
            loading,
            login,
            register,
            logout,
            resetPassword,
            updatePassword,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
