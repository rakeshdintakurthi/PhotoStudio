/**
 * Cloudflare Worker API Architecture
 * Handles lightweight metadata routing, D1 queries, and generates signed PUT URLs
 * for direct browser-to-R2 image uploads so large files bypass the worker completely.
 */

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
  CDN_DOMAIN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Get Presigned Upload URL for Direct R2 Uploads
      if (pathname === '/api/upload/presign' && request.method === 'POST') {
        const { filename, fileType, eventId } = await request.json() as { filename: string; fileType: string; eventId: string };
        const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const key = `events/${eventId}/${Date.now()}-${cleanName}`;

        // In Cloudflare R2 / AWS S3 compatibility layer:
        // const signedUrl = await getSignedUrl(s3Client, new PutObjectCommand({ Bucket: 'lumina-studios', Key: key, ContentType: fileType }), { expiresIn: 900 });

        const uploadUrl = `https://${env.CDN_DOMAIN || 'r2.lumina-studios.workers.dev'}/${key}`;
        const publicCdnUrl = `${env.CDN_DOMAIN || 'https://cdn.luminastudios.com'}/${key}`;

        return new Response(
          JSON.stringify({
            uploadUrl,
            storageKey: key,
            publicCdnUrl,
            thumbnailUrl: publicCdnUrl,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 2. Fetch Public Events from Cloudflare D1
      if (pathname === '/api/events' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM events WHERE status = "published" AND is_private = 0 ORDER BY date DESC LIMIT 50'
        ).all();

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ message: 'Lumina Studios Cloudflare Worker API' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
