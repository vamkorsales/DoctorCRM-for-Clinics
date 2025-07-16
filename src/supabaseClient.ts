import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfcpsmbhrbgtdafjimwp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmY3BzbWJocmJndGRhZmppbXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjUyOTgsImV4cCI6MjA2NzEwMTI5OH0.DxbPL0zSLdwTB7baca-ddU11BpNR03oV6ywHu8451vg';

export const supabase = createClient(supabaseUrl, supabaseKey); 