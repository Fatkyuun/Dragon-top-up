import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pcofeherglidociqohqr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2ZlaGVyZ2xpZG9jaXFvaHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzk5ODQsImV4cCI6MjA5NDc1NTk4NH0._dNew0i6IAp1rH44wqKT_sPFTkufUixt48dRmJxDKU8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
