"use client";

import { useState } from "react";
import { ProjectDialog } from "@/components/project-dialog";
import { NotionProject } from "@/lib/notion-projects";

interface AboutClientProps {
  projects: NotionProject[];
}

export default function AboutClient({ projects }: AboutClientProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProjectClick = (projectSlug: string) => {
    setSelectedProject(projectSlug);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      {/* Projects */}
      <section className="flex min-h-0 flex-col gap-y-3 print-force-new-page scroll-mb-16">
        <h2 className="text-2xl font-bold">
          Projects
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 print:grid-cols-3 print:gap-2">
          {projects.map((project) => (
            <button 
              key={project.id}
              type="button" 
              aria-haspopup="dialog" 
              aria-expanded="false" 
              data-state="closed"
              onClick={() => handleProjectClick(project.slug)}
              className="w-full h-full"
            >
              <div className="rounded-lg border text-card-foreground flex h-full flex-col overflow-hidden p-4 text-left hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col space-y-1.5">
                  <div>
                    <h3 className="font-semibold tracking-tight flex items-center gap-1.5 text-base">
                      {project.title}
                      <div className="size-1 rounded-full bg-green-500"></div>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{project.date_range}</p>
                    <p className="text-sm text-muted-foreground mb-1 mt-3">{project.description}</p>
                  </div>
                </div>
                <div className="text-pretty text-sm text-muted-foreground mt-auto flex">
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.tech_stack.map((tech, index) => (
                      <div 
                        key={index}
                        className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-nowrap border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/60 px-1.5 py-0.5 print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
      
      {/* Project Detail Dialog */}
      <ProjectDialog 
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        projectSlug={selectedProject}
      />
    </>
  );
}