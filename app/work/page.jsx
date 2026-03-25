import { getProjects } from "../../lib/api";
import WorkClient from "../../components/main/WorkClient";

export default async function WorkPage() {
  const response = await getProjects();
  const projects = response.data || [];

  return <WorkClient projects={projects} />;
}