"use client";

import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { ProjectDialog } from "@/components/project-dialog";
import { NotionProject } from "@/lib/notion-projects";

export default function AboutPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<NotionProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projectsData = await response.json();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectClick = (projectSlug: string) => {
    setSelectedProject(projectSlug);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Profile Section */}
        <div className="mb-12">
          <div className="flex items-start gap-12">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                김정환
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                백엔드 공부중인 대딩이
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                여기는 제 소개하는 칸 입니다. 대딩이 2학년이고요 열심히
                공부중이고 이것저것 하면서 이것저것 저것저것 매끈매끈한
                매끈매끄나핟!
              </p>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  북한
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/d5br5"
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="mailto:ehgud456456@naver.com"
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/in/doh-kim"
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Work Experience
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg border p-6 text-card-foreground">
              <div className="flex flex-col space-y-1.5 mb-3">
                <div className="flex flex-col items-start justify-between gap-1 gap-x-2 text-base sm:flex-row sm:items-center">
                  <h3 className="text-lg font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      취업하고싶어요
                    </a>
                  </h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    Upcoming
                  </div>
                </div>
                <div className="text-muted-foreground text-pretty text-sm">
                  흠 Spring Boot로... 열심히 공부 중 입니당
                </div>
              </div>
              <div className="mt-7 font-semibold leading-none print:text-[12px]">
                주요 업무
              </div>
              <ul className="mt-4 list-disc space-y-2 text-sm">
                <li className="ml-5 text-muted-foreground">백엔드 개발 공부</li>
                <li className="ml-5 text-muted-foreground">Spring Boot 학습</li>
              </ul>
            </div>

            <div className="rounded-lg border p-6 text-card-foreground">
              <div className="flex flex-col space-y-1.5 mb-3">
                <div className="flex flex-col items-start justify-between gap-1 gap-x-2 text-base sm:flex-row sm:items-center">
                  <h3 className="text-lg font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      아데나 소프트웨어
                    </a>
                  </h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    2023 - 2025
                  </div>
                </div>
                <div className="text-muted-foreground text-pretty text-sm">
                  Web Front-end Developer
                </div>
              </div>
              <div className="mt-7 font-semibold leading-none print:text-[12px]">
                주요 업무
              </div>
              <ul className="mt-4 list-disc space-y-2 text-sm">
                <li className="ml-5 text-muted-foreground">웹 프론트엔드 개발</li>
                <li className="ml-5 text-muted-foreground">사용자 인터페이스 구현</li>
              </ul>
            </div>

            <div className="rounded-lg border p-6 text-card-foreground">
              <div className="flex flex-col space-y-1.5 mb-3">
                <div className="flex flex-col items-start justify-between gap-1 gap-x-2 text-base sm:flex-row sm:items-center">
                  <h3 className="text-lg font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      취업하고싶어요
                    </a>
                  </h3>
                  <div className="text-sm tabular-nums text-gray-500">
                    여긴 일한 기간
                  </div>
                </div>
                <div className="text-muted-foreground text-pretty text-sm">
                  직무!
                </div>
              </div>
              <div className="mt-7 font-semibold leading-none print:text-[12px]">
                주요 업무
              </div>
              <ul className="mt-4 list-disc space-y-2 text-sm">
                <li className="ml-5 text-muted-foreground">업무 내용 1</li>
                <li className="ml-5 text-muted-foreground">업무 내용 2</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Education
          </h2>
          <div className="flex min-h-0 flex-col gap-y-3">
            <div className="space-y-3">
              <div className="rounded-lg border p-6 text-card-foreground">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex flex-col items-start justify-between gap-1 gap-x-2 text-base sm:flex-row sm:items-center">
                    <div className="text-lg font-semibold leading-none">
                      부천대학교
                    </div>
                    <div className="text-sm tabular-nums text-gray-500">
                      2022 ~ ing
                    </div>
                  </div>
                  <div className="text-pretty text-muted-foreground mt-2 text-base print:text-[12px]">
                    컴퓨터 소프트웨어학과
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {["HTML", "CSS", "JavaScript", "Next.js"].map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="flex min-h-0 flex-col gap-y-3 print-force-new-page scroll-mb-16">
          <h2 className="text-2xl font-bold">
            Projects
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
              <span className="ml-2">프로젝트 로딩 중...</span>
            </div>
          ) : (
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
          )}
        </section>
      </div>
      
      {/* Project Detail Dialog */}
      <ProjectDialog 
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        projectSlug={selectedProject}
      />
    </div>
  );
}
