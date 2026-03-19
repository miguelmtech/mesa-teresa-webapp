import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

// To alter table from JS without a postgres connection string, we can't use regular query.
// Wait, supabase client cannot run DDL like ALTER TABLE via the REST API!
// It will throw an error since it only supports CRUD.
