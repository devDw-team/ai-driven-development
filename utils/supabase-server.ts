import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 기본 Supabase 클라이언트 생성
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseKey);
};

// Clerk 인증이 적용된 Supabase 클라이언트 생성
export const createAuthenticatedSupabaseClient = async () => {
  const clerk = await auth();
  
  if (!clerk.userId) {
    throw new Error('Unauthorized access');
  }

  const clerkToken = await clerk.getToken({ template: 'supabase' });

  return createClient(
    supabaseUrl,
    supabaseKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
          'apikey': supabaseKey,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}; 