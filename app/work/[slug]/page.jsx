import Link from "next/link";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { getProjectBySlug } from "../../../lib/api";
import ProjectGallery from "../../../components/main/ProjectGallery";

export default async function ProjectDetailsPage({ params }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-white text-xl">
        Project not found.
      </div>
    );
  }

  return (
    <section className="min-h-[80vh] py-16 xl:py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <p className="text-accent uppercase tracking-[4px] text-sm font-medium">
              {project.category}
            </p>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
              {project.title}
            </h1>

            <p className="max-w-3xl text-white/70 text-base md:text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <div className="xl:col-span-2">
              <ProjectGallery
                title={project.title}
                mainImage={project.mainImage}
                gallery={project.gallery}
              />
            </div>

            <div className="xl:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 h-fit sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Project Info</h2>

                <div className="space-y-5">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Category</p>
                    <p className="text-lg font-medium capitalize">
                      {project.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/50 text-sm mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/50 text-sm mb-2">Slug</p>
                    <p className="text-white/80">{project.slug}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-primary font-medium hover:bg-accent-hover transition-all"
                      >
                        Live Demo <BsArrowUpRight />
                      </Link>
                    )}

                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:border-accent hover:text-accent transition-all"
                      >
                        GitHub <BsGithub />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              About this project
            </h2>
            <p className="text-white/70 leading-relaxed text-base md:text-lg">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}