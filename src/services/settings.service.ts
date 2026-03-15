import { supabase } from '@/lib/supabase';
import { ServiceResponse } from '@/types/database';
import { platformSettingsSchema, PlatformSettingsInput } from '@/lib/validation/settings.schema';

export const getPlatformSettings = async (): Promise<ServiceResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getPlatformSettings:', error.message);
    return { data: null, error: error.message };
  }
};

export const updatePlatformSettings = async (
  data: Partial<PlatformSettingsInput>
): Promise<ServiceResponse<any>> => {
  try {
    // 1. Validate partial data
    const validation = platformSettingsSchema.partial().safeParse(data);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    const { data: result, error } = await supabase
      .from('platform_settings')
      .update({
        ...validation.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'default')
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in updatePlatformSettings:', error.message);
    return { data: null, error: error.message };
  }
};
