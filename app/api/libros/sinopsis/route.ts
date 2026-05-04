import { NextResponse } from "next/server";
import { franc } from "franc";
import { iso6393To1 } from "iso-639-3";

type OpenLibrarySearchDoc = {
  key?: string;
  title?: string;
  first_sentence?: string | { value?: string } | Array<string | { value?: string }>;
  author_name?: string[];
};

type OpenLibrarySearchResponse = {
  docs?: OpenLibrarySearchDoc[];
};

type OpenLibraryWorkResponse = {
  description?: string | { value?: string };
};

const OPEN_LIBRARY_TIMEOUT_MS = 8000;
const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";
const TITLE_ALIASES: Record<string, string[]> = {
  "si esto es un hombre": ["se questo e un uomo", "if this is a man"],
};

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

const normalizeDescription = (
  value: OpenLibraryWorkResponse["description"] | OpenLibrarySearchDoc["first_sentence"],
): string | null => {
  if (!value) return null;

  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string" && item.trim()) return item.trim();
      if (typeof item === "object" && item?.value?.trim()) return item.value.trim();
    }
    return null;
  }

  if (typeof value === "object" && value.value?.trim()) {
    return value.value.trim();
  }

  return null;
};

const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const buildSearchUrl = (title: string, author?: string): string => {
  const searchUrl = new URL(`${OPEN_LIBRARY_BASE_URL}/search.json`);
  searchUrl.searchParams.set("title", title);
  if (author) {
    searchUrl.searchParams.set("author", author);
  }
  searchUrl.searchParams.set("limit", "5");
  return searchUrl.toString();
};

const getSynopsisFromDoc = async (doc?: OpenLibrarySearchDoc): Promise<string | null> => {
  if (!doc) return null;
  const fromSearch = normalizeDescription(doc.first_sentence);
  if (fromSearch) return fromSearch;
  if (!doc.key) return null;

  const workData = await fetchJsonSafe<OpenLibraryWorkResponse>(
    `${OPEN_LIBRARY_BASE_URL}${doc.key}.json`,
  );
  if (!workData) return null;
  return normalizeDescription(workData.description);
};

const detectLanguage = (text: string): string => {
  const lang3 = franc(text);
  if (lang3 === 'und') return 'en'; // Undetermined, assume English
  return iso6393To1[lang3] || 'en';
};

const translateText = async (text: string, targetLang: string): Promise<string | null> => {
  if (targetLang === 'en') return text; // No need to translate
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      }),
      signal: AbortSignal.timeout(10000), // 10s timeout
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.translatedText || null;
  } catch {
    return null;
  }
};

const findSynopsisFromOpenLibrary = async (
  titulo: string,
  autor: string,
): Promise<string | null> => {
  const normalizedTitle = normalizeText(titulo);
  const normalizedAuthor = normalizeText(autor);

  const titleCandidates = Array.from(
    new Set([titulo, normalizeText(titulo), ...(TITLE_ALIASES[normalizedTitle] ?? [])]),
  ).filter((item) => item.length > 0);

  const searches: Array<{ title: string; author?: string }> = [];
  for (const titleCandidate of titleCandidates) {
    searches.push({ title: titleCandidate, author: autor });
    searches.push({ title: titleCandidate });
  }

  for (const search of searches) {
    const searchData = await fetchJsonSafe<OpenLibrarySearchResponse>(
      buildSearchUrl(search.title, search.author),
    );
    const docs = searchData?.docs ?? [];
    if (docs.length === 0) continue;

    const rankedDocs = [...docs].sort((a, b) => {
      const aAuthor = normalizeText(a.author_name?.[0] ?? "");
      const bAuthor = normalizeText(b.author_name?.[0] ?? "");
      const aScore = aAuthor.includes(normalizedAuthor) ? 1 : 0;
      const bScore = bAuthor.includes(normalizedAuthor) ? 1 : 0;
      return bScore - aScore;
    });

    for (const doc of rankedDocs) {
      const synopsis = await getSynopsisFromDoc(doc);
      if (synopsis) {
        const titleLang = detectLanguage(titulo);
        const translatedSynopsis = await translateText(synopsis, titleLang);
        return translatedSynopsis || synopsis; // Fallback to original if translation fails
      }
    }
  }

  // Búsqueda adicional: buscar libros del autor para encontrar títulos originales
  const authorSearchUrl = new URL(`${OPEN_LIBRARY_BASE_URL}/search.json`);
  authorSearchUrl.searchParams.set("author", autor);
  authorSearchUrl.searchParams.set("limit", "20");
  const authorSearchData = await fetchJsonSafe<OpenLibrarySearchResponse>(authorSearchUrl.toString());
  if (authorSearchData?.docs) {
    const matchingTitles = authorSearchData.docs
      .filter(doc => {
        const docAuthor = normalizeText(doc.author_name?.[0] ?? "");
        return docAuthor.includes(normalizedAuthor) || normalizedAuthor.includes(docAuthor);
      })
      .filter(doc => doc.title && (
        normalizeText(doc.title).includes(normalizedTitle) ||
        normalizedTitle.includes(normalizeText(doc.title))
      ))
      .map(doc => doc.title!)
      .filter(title => !titleCandidates.some(candidate => normalizeText(candidate) === normalizeText(title)));

    for (const originalTitle of matchingTitles.slice(0, 5)) { // Limitar a 5 para no sobrecargar
      const searchData = await fetchJsonSafe<OpenLibrarySearchResponse>(buildSearchUrl(originalTitle, autor));
      const docs = searchData?.docs ?? [];
      const rankedDocs = [...docs].sort((a, b) => {
        const aAuthor = normalizeText(a.author_name?.[0] ?? "");
        const bAuthor = normalizeText(b.author_name?.[0] ?? "");
        const aScore = aAuthor.includes(normalizedAuthor) ? 1 : 0;
        const bScore = bAuthor.includes(normalizedAuthor) ? 1 : 0;
        return bScore - aScore;
      });
      for (const doc of rankedDocs) {
        const synopsis = await getSynopsisFromDoc(doc);
        if (synopsis) {
          const titleLang = detectLanguage(titulo);
          const translatedSynopsis = await translateText(synopsis, titleLang);
          return translatedSynopsis || synopsis;
        }
      }
    }
  }

  return null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { titulo?: string; autor?: string };
    const titulo = body.titulo?.trim();
    const autor = body.autor?.trim();

    if (!titulo || !autor) {
      return NextResponse.json(
        { error: "Debes enviar `titulo` y `autor`." },
        { status: 400 },
      );
    }

    const synopsis = await findSynopsisFromOpenLibrary(titulo, autor);
    return NextResponse.json({ sinopsis: synopsis, source: "openlibrary" });
  } catch (error) {
    console.error("Error en /api/libros/sinopsis:", error);
    return NextResponse.json(
      { sinopsis: null, source: "openlibrary" },
    );
  }
}
