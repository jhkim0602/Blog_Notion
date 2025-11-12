import { Metadata } from "next";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "About - KJH's Dev Log",
  description: "정환이의 개발 여정을 소개합니다.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8 shadow-sm">
          <div className="flex items-start gap-12">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                김정환
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Spring Boot 전문가를 향해 열심히 공부중인 김정환 학생 입니다.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  인천, 대한민국
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/jhkim0602"
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="mailto:your-email@example.com"
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-gray-200 dark:border-gray-700 shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Work Experience
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  프리랜서
                </a>
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">2023 - Present</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
              풀스택 개발자
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Notion API를 활용한 개인 블로그 개발 및 운영</span>
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Next.js와 TypeScript를 사용한 현대적인 웹 애플리케이션 구축</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Education
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  컴퓨터공학과
                </a>
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">2021 - Present</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              자료구조, 알고리즘, 운영체제, 네트워크 등 기초 지식 학습
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Skills
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Java",
                    "Spring Boot",
                    "Node.js",
                    "Python",
                    "MySQL",
                    "PostgreSQL",
                    "Redis",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Tailwind CSS",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">DevOps & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {["Docker", "AWS", "Git", "GitHub Actions"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Projects
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Notion Blog
                    </a>
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Active</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Notion API를 활용한 개인 블로그. Next.js와 TypeScript로 구현.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    Next.js
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    Notion API
                  </span>
                </div>
              </div>

              <div className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">
                    <a
                      href="https://www.acmicpc.net/user/jhkim030602"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      알고리즘 문제 해결
                    </a>
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Active</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  백준, 프로그래머스 등을 통한 지속적인 문제 해결 능력 향상
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                    Algorithm
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                    Data Structure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}