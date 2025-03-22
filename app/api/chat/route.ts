import { OpenAIStream, StreamingTextResponse } from '@/lib/openai';
import { auth } from '@/app/(auth)/auth';
import { hasActiveSubscription } from '@/lib/db/queries';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Check subscription status
    const hasSubscription = await hasActiveSubscription(session.user.id);
    if (!hasSubscription) {
      return NextResponse.json(
        { error: 'Subscription required', redirect: '/pricing' },
        { status: 403 }
      );
    }

    const { messages } = await req.json();

    // Create chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 