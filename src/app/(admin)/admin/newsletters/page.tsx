import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Newsletter from '@/models/Newsletter';
import { Mail, Users, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const metadata: Metadata = { title: 'Newsletter Subscribers | Admin' };
export const dynamic = 'force-dynamic';

export default async function NewsletterAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');

  await dbConnect();

  const [total, active, recent] = await Promise.all([
    Newsletter.countDocuments(),
    Newsletter.countDocuments({ status: 'active' }),
    Newsletter.find({ status: 'active' })
      .sort({ subscribedAt: -1 })
      .limit(50)
      .lean(),
  ]);

  // Group by source
  const bySource = await Newsletter.aggregate([
    { $group: { _id: '$source', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your email subscriber list</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
          <Mail size={15} />
          Email Collection Only
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Subscribers', value: total, icon: Users, color: 'blue' },
          { label: 'Active Subscribers', value: active, icon: TrendingUp, color: 'green' },
          { label: 'Unsubscribed', value: total - active, icon: Mail, color: 'gray' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <stat.icon size={18} className={
                stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : 'text-gray-500'
              } />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscribers table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Subscribers</h2>
            <span className="text-xs text-gray-400">Showing latest 50</span>
          </div>

          {recent.length === 0 ? (
            <div className="py-16 text-center">
              <Mail size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No subscribers yet</p>
              <p className="text-gray-400 text-sm mt-1">The newsletter signup form is live on your blog pages.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recent.map((sub: any) => (
                <div key={sub._id.toString()} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 text-sm font-bold uppercase">
                      {sub.email[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{sub.email}</p>
                      <p className="text-xs text-gray-400 truncate">
                        via <span className="font-mono">{sub.source || 'unknown'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      sub.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={11} />
                      {format(new Date(sub.subscribedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sources breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Signup Sources</h2>
          </div>
          <div className="p-4 space-y-3">
            {bySource.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
            ) : (
              bySource.map((src: any) => (
                <div key={src._id} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-gray-600 truncate">{src._id || 'unknown'}</p>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.round((src.count / (total || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0">{src.count}</span>
                </div>
              ))
            )}
          </div>

          {/* Info box */}
          <div className="mx-4 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-amber-800 mb-1">📝 Email Sending</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Emails are stored only. To send newsletters, integrate with Mailchimp, Resend, or SendGrid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
