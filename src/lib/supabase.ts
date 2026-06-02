import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pcofeherglidociqohqr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2ZlaGVyZ2xpZG9jaXFvaHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzk5ODQsImV4cCI6MjA5NDc1NTk4NH0._dNew0i6IAp1rH44wqKT_sPFTkufUixt48dRmJxDKU8'

const isBrowser = typeof window !== 'undefined';

const customStorage = {
  getItem: (key: string) => {
    return isBrowser ? window.sessionStorage.getItem(key) : null;
  },
  setItem: (key: string, value: string) => {
    if (isBrowser) {
      window.sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (isBrowser) {
      window.sessionStorage.removeItem(key);
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage
  }
})
