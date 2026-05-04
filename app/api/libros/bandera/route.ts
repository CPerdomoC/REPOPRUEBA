import { NextResponse } from "next/server";

type WikipediaSearchResponse = {
  query?: {
    search?: Array<{ title: string }>;
  };
};

type WikipediaParseResponse = {
  parse?: {
    text?: { "*": string };
  };
};

const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";
const OPEN_LIBRARY_TIMEOUT_MS = 8000;

const fetchJsonSafe = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(OPEN_LIBRARY_TIMEOUT_MS),
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const normalizeImageUrl = (url: string) => {
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http")) return url;
  return `https://en.wikipedia.org${url}`;
};

const extractFlagFromHtml = (html: string): string | null => {
  const infobox = html.match(/<table[^>]*class="[^"]*infobox[^"]*"[\s\S]*?<\/table>/i)?.[0];
  const htmlToSearch = infobox || html;

  const flagImageMatch = htmlToSearch.match(/<img[^>]+alt="([^"]*flag[^"]*)"[^>]+src="([^"]+)"/i);
  if (flagImageMatch) {
    return normalizeImageUrl(flagImageMatch[2]);
  }

  const firstImageMatch = htmlToSearch.match(/<img[^>]+src="([^"]+)"/i);
  if (firstImageMatch) {
    return normalizeImageUrl(firstImageMatch[1]);
  }

  return null;
};

const findCountryFlagUrl = async (pais: string): Promise<string | null> => {
  const searchUrl = new URL(WIKIPEDIA_API);
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("list", "search");
  searchUrl.searchParams.set("srsearch", pais);
  searchUrl.searchParams.set("srlimit", "1");
  searchUrl.searchParams.set("utf8", "1");
  searchUrl.searchParams.set("origin", "*");

  const searchData = await fetchJsonSafe<WikipediaSearchResponse>(searchUrl.toString());
  const title = searchData?.query?.search?.[0]?.title ?? pais;

  const parseUrl = new URL(WIKIPEDIA_API);
  parseUrl.searchParams.set("action", "parse");
  parseUrl.searchParams.set("format", "json");
  parseUrl.searchParams.set("page", title);
  parseUrl.searchParams.set("prop", "text");
  parseUrl.searchParams.set("utf8", "1");
  parseUrl.searchParams.set("origin", "*");

  const parseData = await fetchJsonSafe<WikipediaParseResponse>(parseUrl.toString());
  const pageHtml = parseData?.parse?.text?.["*"] ?? "";
  return extractFlagFromHtml(pageHtml);
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pais?: string };
    const pais = body.pais?.trim();

    if (!pais) {
      return NextResponse.json({ flagUrl: null }, { status: 400 });
    }

    const flagUrl = await findCountryFlagUrl(pais);
    return NextResponse.json({ flagUrl });
  } catch (error) {
    console.error("Error en /api/libros/bandera:", error);
    return NextResponse.json({ flagUrl: null });
  }
}
