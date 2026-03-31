import ProjectDetailsClient from "../../../../components/main/ProjectDetailsClient";

export default function ProjectDetailsPage({ params }) {
  return (
    <ProjectDetailsClient
      serviceSlug={params.serviceSlug}
      projectSlug={params.projectSlug}
    />
  );
}
