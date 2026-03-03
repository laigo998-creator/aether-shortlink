import { json } from '@sveltejs/kit'
import { Redis } from "@upstash/redis"
import { env } from "$env/dynamic/private"

const redis = new Redis({
    url: env.SECRET_KV_URL,
    token: env.SECRET_KV_TOKEN,
})

var errormessage:string

export async function POST( {request} ) {
    const { slug } = await request.json()

    const url:string | null = await redis.get(slug)
    console.log('got url: '+ url)

    return(json({status:'OK', link:url}))

}


export async function GET({ url }) {
  const slug = url.searchParams.get('slug');
  if (!slug) {
    return json({ status: 'error', message: 'missing slug' }, { status: 400 });
  }
  const targetUrl = await redis.get(slug);
  return json({ status: 'OK', link: targetUrl });
}
