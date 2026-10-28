import { redirect } from "next/navigation";

// Older single-apartment links: same checkout, one apartment in the list.
export default async function BookOne({ params, searchParams }: { params: Promise<{ lang: string; slug: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { lang, slug } = await params;
  const q = await searchParams;
  redirect(`/${lang}/book?apts=${slug}&in=${q.in ?? ""}&out=${q.out ?? ""}&guests=${q.guests ?? 2}`);
}
