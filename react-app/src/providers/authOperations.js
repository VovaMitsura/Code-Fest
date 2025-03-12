import dotenv from 'dotenv';
import supabase from './supabase.js';

dotenv.config();
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log(supabaseUrl, supabaseKey);
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

// User-specific data operations
const userOperations = {
  // Get the current user
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user: ', error);
      return null;
    }
    return user;
  },
  getUserData: async (tableName) => {
    const user = await userOperations.getCurrentUser();
    if (!user) {
      console.error('No user found');
      return null;
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      console.error('Error getting user data: ', error);
      return null;
    }
    return data;
  },
};

export default userOperations;
