import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — The Sales Clinic" },
      { name: "description", content: "The Sales Clinic services." },
      { property: "og:title", content: "Services — The Sales Clinic" },
      { property: "og:description", content: "The Sales Clinic services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-7xl items-center px-6 py-24 md:px-10">
      <h1 className="font-display text-5xl font-bold md:text-8xl">Services</h1>
    </main>
  );
}