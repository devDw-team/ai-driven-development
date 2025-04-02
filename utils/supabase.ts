import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export function getImageUrl(filePath: string): string {
  return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
}

export async function uploadImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error('이미지 업로드 중 오류가 발생했습니다.');
  }

  return filePath;
}

export async function deleteImage(filePath: string): Promise<void> {
  const { error: deleteError } = await supabase.storage
    .from('images')
    .remove([filePath]);

  if (deleteError) {
    throw new Error('이미지 삭제 중 오류가 발생했습니다.');
  }
} 