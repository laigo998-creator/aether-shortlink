import { redirect } from '@sveltejs/kit';
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

const redis = new Redis({
  url: env.SECRET_KV_URL,
  token: env.SECRET_KV_TOKEN,
});

export async function load({ params }) {
  const slug = params.slug;
  const targetUrl = await redis.get(slug);

  if (targetUrl && typeof targetUrl === 'string') {
    // 如果找到目标 URL，立即重定向
    throw redirect(302, targetUrl);
  } else {
    // 如果没找到，返回 404 或显示错误页面
    // 这里可以返回一个对象，让页面显示错误信息
    return {
      status: 404,
      error: new Error('Short link not found')
    };
  }
}
