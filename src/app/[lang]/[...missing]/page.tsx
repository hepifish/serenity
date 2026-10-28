import { notFound } from "next/navigation";

// Any unknown path under a language lands here, so it gets the localized
// not-found page inside the site's layout instead of Next's bare default.
export default function Missing() {
  notFound();
}
