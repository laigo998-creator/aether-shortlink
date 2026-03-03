import { redirect } from '@sveltejs/kit';
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

const redis = new Redis({
  url: env.SECRET_KV_URL,
  token: env.SECRET_KV_TOKEN,
});

export async function load({ params }) {
  console.log('🟢 load called with slug:', params.slug);
  const slug = params.slug;
  const targetUrl = await redis.get(slug);
  console.log('🔵 targetUrl from Redis:', targetUrl);

  if (targetUrl && typeof targetUrl === 'string') {
    console.log('🟠 redirecting to:', targetUrl);
    throw redirect(302, targetUrl);
  } else {
    console.log('🟡 no target found, returning 404');
    return {
      status: 404,
      slug,
      message: 'Short link not found'
    };
  }
}
