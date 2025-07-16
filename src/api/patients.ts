import { supabase } from '../supabaseClient';
import { apiWrapper } from '../utils/apiWrapper';

export async function fetchPatients() {
  return apiWrapper(async () => await supabase.from('patients').select('*').order('created_at', { ascending: false }), 'fetchPatients');
}

export async function addPatient(patient: any) {
  return apiWrapper(async () => await supabase.from('patients').insert([patient]).select(), 'addPatient').then(data => (data && data[0]) || undefined);
}

export async function updatePatient(id: any, updates: any) {
  return apiWrapper(async () => await supabase.from('patients').update(updates).eq('id', id).select(), 'updatePatient').then(data => (data && data[0]) || undefined);
}

export async function deletePatient(id: any) {
  return apiWrapper(async () => await supabase.from('patients').delete().eq('id', id), 'deletePatient').then(() => true);
} 