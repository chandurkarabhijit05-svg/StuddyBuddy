import supabase from "../services/supabase.js";

export async function uploadFile(file, bucket = 'pdfs', folder = '') {
  const fileName = `${folder ? folder + '/' : ''}${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  
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
  
  return { path: data.path, url: publicUrl }
}

export async function deleteFile(path, bucket = 'pdfs') {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
  return true
}

export async function listFiles(bucket = 'pdfs', folder = '') {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder)
  
  if (error) throw error
  return data
}