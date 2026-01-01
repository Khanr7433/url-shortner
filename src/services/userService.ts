import { supabase } from "../supabase";

export interface UserProfile {
    uid: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: any;
}

export const createUserProfile = async (uid: string, email: string) => {
    // Check if exists first to avoid duplicates if trigger worked
    const { data } = await supabase.from('profiles').select('id').eq('id', uid).single();
    if (data) return;

    const { error } = await supabase.from('profiles').insert({
        id: uid,
        email: email,
        role: 'user'
    });

    if (error) {
        console.error("Error creating user profile:", error);
    }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

    if (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
    
    return {
        uid: data.id,
        email: data.email,
        role: data.role as 'admin' | 'user',
        createdAt: data.created_at
    };
};

export const getAllUsers = async (page: number = 1, limit: number = 10): Promise<{ data: UserProfile[], count: number }> => {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) throw error;

    const users = (data || []).map(user => ({
        uid: user.id,
        email: user.email,
        role: user.role as 'admin' | 'user',
        createdAt: user.created_at
    }));

    return { data: users, count: count || 0 };
};

export const getStats = async () => {
    const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
    const { count: urlsCount } = await supabase
        .from('urls')
        .select('*', { count: 'exact', head: true });

    return {
        totalUsers: usersCount || 0,
        totalUrls: urlsCount || 0,
        totalClicks: 0 // Aggregation is expensive in free tier Supabase without functions, defaulting to 0 for now or we can implement a separate query.
    };
};

export const updateUserRole = async (uid: string, role: 'admin' | 'user') => {
    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', uid);

    if (error) throw error;
};
