"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectSlug: string | null;
}

interface NotionProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tech_stack: string[];
  status: string;
  date_range: string;
  featured_image?: string;
}

// API 호출 함수
const fetchProjectContent = async (slug: string): Promise<NotionProject | null> => {
  try {
    const response = await fetch(`/api/projects/${slug}`);
    if (!response.ok) {
      throw new Error('Project not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const ProjectDialog: React.FC<ProjectDialogProps> = ({ 
  isOpen, 
  onClose, 
  projectSlug 
}) => {
  const [project, setProject] = useState<NotionProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && projectSlug) {
      const loadProject = async () => {
        setLoading(true);
        setError(null);
        try {
          const projectData = await fetchProjectContent(projectSlug);
          setProject(projectData);
        } catch (err) {
          setError('프로젝트를 불러오는데 실패했습니다.');
          console.error('Error loading project:', err);
        } finally {
          setLoading(false);
        }
      };

      loadProject();
    }
  }, [isOpen, projectSlug]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">로딩 중...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64 text-red-500">
          {error}
        </div>
      );
    }

    if (!project) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          프로젝트를 찾을 수 없습니다.
        </div>
      );
    }

    return (
      <div className="prose prose-gray dark:prose-invert max-w-none project-content">
        {/* 프로젝트 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {project.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {project.date_range}
          </p>
          {project.description && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {project.description}
            </p>
          )}
          
          {/* 기술 스택 */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notion 컨텐츠 */}
        <div className="overflow-hidden">
          <ReactMarkdown
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <div className="overflow-x-auto rounded-md">
                    <SyntaxHighlighter
                      style={tomorrow as any}
                      language={match[1]}
                      PreTag="div"
                      wrapLongLines={true}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={`${className} px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm`}>
                    {children}
                  </code>
                );
              },
              p: ({ children }) => (
                <p className="mb-4 leading-7">
                  {children}
                </p>
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              pre: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm">
                    {children}
                  </pre>
                </div>
              ),
              img: ({ src, alt }) => (
                <img 
                  src={src} 
                  alt={alt} 
                  className="max-w-full h-auto rounded-lg my-4"
                />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse">
                    {children}
                  </table>
                </div>
              )
            }}
          >
            {project.content}
          </ReactMarkdown>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            프로젝트 상세 정보
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};