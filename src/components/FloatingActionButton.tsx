import { MdChat } from 'react-icons/md';
import Link from 'next/link';

const FloatingActionButton = () => {
  return (
    <Link href="/new-chat">
      <button className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
        <MdChat size={24} />
      </button>
    </Link>
  );
};

export default FloatingActionButton;