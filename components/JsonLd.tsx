// Renders a JSON-LD structured-data block. Search engines read this to
// understand the page (Organization, Course, Article, FAQ, breadcrumbs) and
// can surface rich results. Server component — emitted straight into the HTML.
//
// The JSON is trusted, build-time content (never user input), so
// dangerouslySetInnerHTML is safe here; we still escape "<" to keep the script
// tag from being closed early by any stray markup in the data.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
