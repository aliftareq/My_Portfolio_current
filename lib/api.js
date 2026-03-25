export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProjects() {
  const res = await fetch(`${API_URL}/projects`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export async function getProjectBySlug(slug) {
  const res = await fetch(`${API_URL}/projects/slug/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }

  return res.json();
}