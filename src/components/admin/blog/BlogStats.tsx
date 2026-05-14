import { FileText, FilePlus, Bot, Trash2 } from 'lucide-react';

interface BlogStatsProps {
  stats: {
    published: number;
    drafts: number;
    aiPending: number;
    trash: number;
  };
}

export default function BlogStats({ stats }: BlogStatsProps) {
  const items = [
    {
      label: 'Published',
      value: stats.published,
      icon: FileText,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Drafts',
      value: stats.drafts,
      icon: FilePlus,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'AI Pending Review',
      value: stats.aiPending,
      icon: Bot,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Trash',
      value: stats.trash,
      icon: Trash2,
      color: 'bg-gray-100 text-gray-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-lg ${item.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
