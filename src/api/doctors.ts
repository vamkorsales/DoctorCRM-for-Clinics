import { supabase } from '../supabaseClient';
import { apiWrapper } from '../utils/apiWrapper';

export async function fetchDoctors() {
  return apiWrapper(async () => await supabase.from('doctors').select('*').order('created_at', { ascending: false }), 'fetchDoctors');
}

export async function addDoctor(doctor: any) {
  return apiWrapper(async () => await supabase.from('doctors').insert([doctor]).select(), 'addDoctor').then(data => (data && data[0]) || undefined);
}

export async function updateDoctor(id: any, updates: any) {
  return apiWrapper(async () => await supabase.from('doctors').update(updates).eq('id', id).select(), 'updateDoctor').then(data => (data && data[0]) || undefined);
}

export async function deleteDoctor(id: any) {
  return apiWrapper(async () => await supabase.from('doctors').delete().eq('id', id), 'deleteDoctor').then(() => true);
}

export function mapDoctorFromSupabase(d: any) {
  return {
    ...d,
    firstName: d.first_name ?? '',
    lastName: d.last_name ?? '',
    profilePhoto: d.profile_photo ?? '',
    specialization: d.specialization ?? '',
    email: d.email ?? '',
    phone: d.phone ?? '',
    createdAt: d.created_at ?? '',
    updatedAt: d.updated_at ?? '',
  };
} 