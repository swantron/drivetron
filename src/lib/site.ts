export const SITE_URL = "https://drivetron.app";
export const SITE_NAME = "Drivetron";
/** Questions, corrections to a state's rules, and data deletion requests. */
export const CONTACT_EMAIL = "support@drivetron.app";

/** Open Graph and Twitter tags for a public page, so shared links preview with a title and icon. */
export function socialMeta(title: string, description: string, path: string) {
  const image = { url: "/icons/icon-512x512.png", width: 512, height: 512, alt: SITE_NAME };
  return {
    openGraph: { type: "website" as const, siteName: SITE_NAME, title, description, url: path, images: [image] },
    twitter: { card: "summary" as const, title, description, images: [image.url] },
  };
}
