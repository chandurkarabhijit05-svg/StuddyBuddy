import supabase from "../services/supabase.js";

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function markAsRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
  
  if (error) throw error
  return true
}

export async function createNotification({ userId, title, message, type = 'info' }) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_id: userId, title, message, type }])
    .select()
  
  if (error) throw error
  return data[0]
}