import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { Database } from './interface';

export default createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string,
);
