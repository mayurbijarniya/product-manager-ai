import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../hooks/useTheme';

interface MessageContentProps {
  content: string;
}

export const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const { isDark } = useTheme();

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={isDark ? oneDark : oneLight}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-light-surface dark:bg-dark-surface px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-xl border border-light-border dark:border-dark-border shadow-light dark:shadow-dark">
                <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-light-surface dark:bg-dark-surface">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="bg-white dark:bg-dark-primary divide-y divide-light-border dark:divide-dark-border">
                {children}
              </tbody>
            );
          },
          tr({ children }) {
            return (
              <tr className="hover:bg-light-surface dark:hover:bg-dark-surface transition-colors duration-150">
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-3 text-left text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider border-b border-light-border dark:border-dark-border">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-3 text-sm text-light-text-primary dark:text-dark-text-primary whitespace-nowrap">
                {children}
              </td>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4 mt-6 first:mt-0">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-3 mt-6 first:mt-0">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2 mt-4 first:mt-0">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2 mt-3 first:mt-0">
                {children}
              </h4>
            );
          },
          p({ children }) {
            return (
              <p className="text-light-text-primary dark:text-dark-text-primary mb-3 leading-relaxed">
                {children}
              </p>
            );
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-inside space-y-1 mb-4 text-light-text-primary dark:text-dark-text-primary ml-4">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside space-y-1 mb-4 text-light-text-primary dark:text-dark-text-primary ml-4">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className="text-light-text-primary dark:text-dark-text-primary">
                {children}
              </li>
            );
          },
          strong({ children }) {
            return (
              <strong className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {children}
              </strong>
            );
          },
          em({ children }) {
            return (
              <em className="italic text-light-text-secondary dark:text-dark-text-secondary">
                {children}
              </em>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary-600 dark:border-primary-400 pl-4 italic text-light-text-secondary dark:text-dark-text-secondary my-4 bg-light-surface dark:bg-dark-surface py-2 rounded-r-lg">
                {children}
              </blockquote>
            );
          },
          hr() {
            return (
              <hr className="my-6 border-light-border dark:border-dark-border" />
            );
          },
          a({ href, children }) {
            return (
              <a 
                href={href} 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};