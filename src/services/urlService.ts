import { supabase } from "../supabase";
import { generateShortCode } from "../utils/shortId";

export interface UrlData {
    id?: string;
    originalUrl: string;
    shortCode: string;
    userId: string;
    clicks: number;
    createdAt: any;
    title?: string;
}

export const getAllUrls = async (): Promise<UrlData[]> => {
    const { data, error } = await supabase
        .from('urls')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(mapUrlData);
};

export const createShortUrl = async (originalUrl: string, userId: string, customCode?: string, title?: string): Promise<string> => {
    const shortCode = customCode || generateShortCode();
    
    // Check collision
    const { data: existing } = await supabase
        .from('urls')
        .select('short_code')
        .eq('short_code', shortCode)
        .single();
    
    if (existing) {
        throw new Error("Short code already exists. Please try another.");
    }

    const { error } = await supabase
        .from('urls')
        .insert({
            original_url: originalUrl,
            short_code: shortCode,
            user_id: userId,
            title: title || "",
            clicks: 0
        });

    if (error) {
        console.error("Supabase Create Error:", error.message, error.details || error.hint || error);
        throw error;
    }

    return shortCode;
};

export const getUserUrls = async (userId: string): Promise<UrlData[]> => {
    const { data, error } = await supabase
        .from('urls')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(mapUrlData);
};

export const getUrlByShortCode = async (shortCode: string): Promise<UrlData | null> => {
    const { data, error } = await supabase
        .from('urls')
        .select('*')
        .eq('short_code', shortCode)
        .single();
    
    if (error || !data) return null;

    return mapUrlData(data);
};

export const incrementClicks = async (id: string) => {
    // Note: This is not atomic without an RPC, but sufficient for MVP
    // Ideally use: await supabase.rpc('increment_clicks', { row_id: id })
    
    // Fetch current clicks
    const { data } = await supabase.from('urls').select('clicks').eq('id', id).single();
    if (data) {
        await supabase
            .from('urls')
            .update({ clicks: (data.clicks || 0) + 1 })
            .eq('id', id);
    }
};

export const deleteShortUrl = async (id: string) => {
    const { error } = await supabase
        .from('urls')
        .delete()
        .eq('id', id);
        
    if (error) throw error;
};

// Helper to map DB snake_case to TS camelCase
const mapUrlData = (data: any): UrlData => ({
    id: data.id,
    originalUrl: data.original_url,
    shortCode: data.short_code,
    userId: data.user_id,
    clicks: data.clicks,
    createdAt: data.created_at,
    title: data.title
});
