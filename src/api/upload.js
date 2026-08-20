import supabase from "../services/supabase.js";

export async function uploadFile(file, bucket = 'pdfs', folder = '') {
  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  if (!userId) throw new Error("User not authenticated");

  const fileName = `${folder ? folder + '/' : ''}${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false
    })
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)
  
  // ⬅️ SAVE TO DATABASE — THIS WAS MISSING
  const { data: pdfRecord, error: dbError } = await supabase
    .from('pdfs')
    .insert({
      user_id: userId,
      file_name: file.name,
      file_url: publicUrl,
      file_path: data.path,
      summary: '',
      flashcards: '',
      quiz: '',
    })
    .select()
    .single();

  if (dbError) {
    console.error('Database insert error:', dbError);
    throw new Error('Failed to save PDF record: ' + dbError.message);
  }

  return { path: data.path, url: publicUrl, record: pdfRecord }
}

export async function deleteFile(path, bucket = 'pdfs') {
  // Also delete from database
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // Delete from storage
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error

  // Delete from database
  if (userId) {
    await supabase
      .from('pdfs')
      .delete()
      .eq('file_path', path)
      .eq('user_id', userId);
  }
  
  return true
}

export async function listFiles(bucket = 'pdfs', folder = '') {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder)
  
  if (error) throw error
  return data
}