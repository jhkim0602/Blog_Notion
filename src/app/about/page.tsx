import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { NotionProject, fetchProjects } from "@/lib/notion-projects";
import AboutClient from "@/components/features/about-profile-section";
import Image from "next/image";
import type { AboutContent } from "@/types/about.types";
import fs from "fs";
import path from "path";

async function getProjects(): Promise<NotionProject[]> {
  const projects = await fetchProjects();
  return projects;
}

function getAboutContent(): AboutContent {
  const filePath = path.join(process.cwd(), "src", "data", "about-content.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as AboutContent;
}

export const revalidate = 60; // 60초 캐싱

export default async function AboutPage() {
  const projects = await getProjects();
  const content = getAboutContent();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Profile Section */}
        <div className="mb-12">
          <div className="flex items-start gap-12">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {content.profile.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {content.profile.title}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {content.profile.bio}
              </p>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {content.profile.location}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={content.profile.social.github}
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${content.profile.social.email}`}
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href={content.profile.social.linkedin}
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-2 border-gray-100 dark:border-gray-700">
                <Image
                  src={content.profile.avatar}
                  alt={`${content.profile.name} 프로필 사진`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Work Experience
          </h2>

          <div className="space-y-6">
            {content.workExperience.map((work, index) => (
              <div key={index} className="rounded-lg border p-6 text-card-foreground">
                <div className="flex flex-col space-y-1.5 mb-3">
                  <div className="flex flex-col items-start justify-between gap-1 gap-x-2 text-base sm:flex-row sm:items-center">
                    <h3 className="text-lg font-semibold">
                      <a
                        href={work.companyUrl}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {work.company}
                      </a>
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {work.period}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-pretty text-sm">
                    {work.position}
                  </div>
                </div>
                <div className="mt-7 font-semibold leading-none print:text-[12px]">
                  주요 업무
                </div>
                <ul className="mt-4 list-disc space-y-2 text-sm">
                  {work.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="ml-5 text-muted-foreground">
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Education
          </h2>
          <div className="flex min-h-0 flex-col gap-y-3">
            <div className="space-y-3">
              {content.education.map((edu, index) => (
                <div key={index} className="rounded-lg border p-6 text-card-foreground">
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex flex-col items-start justify-between gap-1 gap-x-2 text-base sm:flex-row sm:items-center">
                      <div className="text-lg font-semibold leading-none">
                        {edu.school}
                      </div>
                      <div className="text-sm tabular-nums text-gray-500">
                        {edu.period}
                      </div>
                    </div>
                    <div className="text-pretty text-muted-foreground mt-2 text-base print:text-[12px]">
                      {edu.major}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects - 클라이언트 컴포넌트로 분리 */}
        <AboutClient projects={projects} />
      </div>
    </div>
  );
}
