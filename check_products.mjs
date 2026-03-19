import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function check() {
    const { data: p, error } = await supabase.from('products').select('*');
    if (error) console.error("Error:", error);
    console.log(`Total products physically in Database: ${p?.length}`);
    console.log(p?.[p.length - 1]); // the last entered product
}
check();
