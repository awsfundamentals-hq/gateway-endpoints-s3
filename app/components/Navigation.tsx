import Image from 'next/image';

export default function Navigation() {
  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 bg-[#242E41]">
      <a href="https://awsfundamentals.com/newsletter" target="_blank" rel="noopener noreferrer">
        <Image src="/awsf/logo.png" alt="Logo" width={60} height={60} />
      </a>
      <div id="title" className="flex items-center mx-auto">
        <Image src="/awsf/service-logo.svg" alt="Service Logo" width={60} height={60} className="mx-2 rounded-full shadow-md" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Title</h1>
          <p className="text-sm font-semibold text-gray-300">Subtitle</p>
        </div>
      </div>
      <a
        href="{{AWS_SERVICE_CONSOLE_URL}}"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#4B6AED] text-white px-4 py-2 rounded-md shadow-md flex items-center"
      >
        <Image src="/awsf/bookmark.svg" alt="Bookmark" width={20} height={20} className="mr-2" />
        Open Console
      </a>
    </nav>
  );
}
