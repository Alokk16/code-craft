// src/app/resources/page.tsx
import Link from 'next/link';

// We no longer need the imageUrl, so it has been removed from the data.
const recommendedBooks = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    description: 'Learn the principles of writing clean, maintainable, and robust code.',
    link: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/',
  },
  {
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas, Andrew Hunt',
    description: 'Provides practical advice for everything from career development to architectural techniques.',
    link: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    description: 'An essential guide to understanding the pros and cons of different data processing technologies.',
    link: 'https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/',
  },
  {
    title: 'Structure and Interpretation of Computer Programs (SICP)',
    author: 'Harold Abelson, Gerald Jay Sussman',
    description: 'A classic text that teaches fundamental principles of computation and programming.',
    link: 'https://mitpress.mit.edu/9780262543231/structure-and-interpretation-of-computer-programs/',
  },
  {
    title: 'Eloquent JavaScript, 3rd Edition',
    author: 'Marijn Haverbeke',
    description: 'A modern introduction to programming with a focus on JavaScript, available online for free.',
    link: 'https://eloquentjavascript.net/',
  },
  {
    title: 'You Don\'t Know JS Yet (Book Series)',
    author: 'Kyle Simpson',
    description: 'A deep dive into the core mechanisms of JavaScript, challenging you to truly understand the language.',
    link: 'https://github.com/getify/You-Dont-Know-JS',
  },
  {
    title: 'System Design Interview – An Insider\'s Guide',
    author: 'Alex Xu',
    description: 'A practical guide to preparing for system design interviews with a step-by-step framework.',
    link: 'https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/B08B3FWY3R',
  },
  {
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    description: 'Learn how to improve the design of existing code and enhance its maintainability.',
    link: 'https://martinfowler.com/books/refactoring.html',
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto max-w-7xl p-8 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Curated Developer Resources
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          A hand-picked list of books that will level up your skills as a software engineer.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recommendedBooks.map((book) => (
          <Link
            href={book.link}
            key={book.title}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/10"
          >
            <div>
              <h3 className="text-lg font-bold text-white">{book.title}</h3>
              <p className="mt-1 text-sm text-gray-400">by {book.author}</p>
              <p className="mt-4 text-sm text-gray-300">{book.description}</p>
            </div>
            <div className="mt-4 text-xs font-semibold text-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Read More &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}