import Link from 'next/link';

const ChatListItem = ({ friendId, currentUserId, name, lastMessage, time, avatar }: { friendId: string, currentUserId: string, name: string, lastMessage: string, time: string, avatar: string }) => {
  const chatId = [friendId, currentUserId].sort().join('-');

  return (
    <Link href={`/chat/${chatId}`}>
      <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
          <p className="text-gray-600 truncate">{lastMessage}</p>
        </div>
      </div>
    </Link>
  );
};

export default ChatListItem;