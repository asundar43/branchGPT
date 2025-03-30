import { tool } from 'ai';
import { z } from 'zod';

// Function to strip HTML tags and decode HTML entities
function stripHtml(html: string): string {
  // First decode HTML entities
  const decoded = html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // Then remove HTML tags
  return decoded.replace(/<[^>]*>/g, '');
}

interface SearchResult {
  title: string;
  description: string;
  url: string;
}

export const webSearch = tool({
  description: 'Search the web for current information using Brave Search API',
  parameters: z.object({
    query: z.string().describe('The search query'),
    count: z.number().optional().describe('Number of results to return (default: 5)'),
  }),
  execute: async ({ query, count = 5 }) => {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': process.env.BRAVE_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.statusText}`);
    }

    const searchData = await response.json();
    
    // Format the results in a more readable way and strip HTML
    const formattedResults = searchData.web?.results?.map((result: any) => ({
      title: stripHtml(result.title),
      description: stripHtml(result.description),
      url: result.url,
    })) || [];

    // Return a clean display string and the full data
    return {
      display: 'Web search completed successfully.',
      data: formattedResults.map((result: SearchResult) => 
        `[${result.title}](${result.url})\n${result.description}`
      ).join('\n\n') || 'No results found.'
    };
  },
}); 