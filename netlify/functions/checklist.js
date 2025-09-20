const { createClient } = require('@supabase/supabase-js')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: 'ok' }
  }

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase.from('claims').select('item, claimed')
    if (error) return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) }
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ rows: data }) }
  }

  if (event.httpMethod === 'POST') {
    try {
      const { item, claimed } = JSON.parse(event.body || '{}')
      if (!item) return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'item required' }) }
      const { error } = await supabase.from('claims').upsert({ item, claimed: !!claimed }, { onConflict: 'item' })
      if (error) throw error
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) }
    } catch (e) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: e.message }) }
    }
  }

  return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' }
}
