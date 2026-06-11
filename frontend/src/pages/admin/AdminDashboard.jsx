import { useState } from 'react'
import { Users, BookOpen, DollarSign, TrendingUp, Download, Activity } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Button from '../../components/ui/Button'
import { PageHeader, PageCard, StatMetric, TabBar } from '@/components'
import clsx from 'clsx'
import { useTranslation } from '@/i18n'

const monthlyData = []
const recentActivity = []
const activityDot = { booking: 'bg-primary-300', update: 'bg-slate-400', review: 'bg-amber-400', join: 'bg-emerald-400', complete: 'bg-blue-400', apply: 'bg-primary-300' }
const subjectData = []

const AdminDashboard = () => {
  const [metric, setMetric] = useState('students')
  const { t } = useTranslation()

  const kpis = [
    { label: t('adminDash.totalStudents'), value: '—', change: '', icon: Users, tone: 'primary' },
    { label: t('adminDash.activeTeachers'), value: '—', change: '', icon: BookOpen, tone: 'success' },
    { label: t('adminDash.monthlyRevenue'), value: '—', change: '', icon: DollarSign, tone: 'primary' },
    { label: t('adminDash.sessionRate'), value: '—', change: '', icon: TrendingUp, tone: 'warning' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('adminDash.hello')}
        subtitle={t('adminDash.subtitle')}
        action={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            {t('adminDash.exportReport')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <StatMetric key={kpi.label} label={kpi.label} value={kpi.value} change={kpi.change} icon={kpi.icon} tone={kpi.tone} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <PageCard className="lg:col-span-2" padding>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="font-bold text-slate-800">{t('adminDash.platformGrowth')}</h2>
            <TabBar
              tabs={[
                { id: 'students', label: t('adminDash.students') },
                { id: 'mentors', label: t('adminDash.mentors') },
                { id: 'revenue', label: t('adminDash.revenue') },
              ]}
              active={metric}
              onChange={setMetric}
            />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Area type="monotone" dataKey={metric} stroke="#f43f5e" strokeWidth={2.5} fill="url(#dashGrad)" dot={false} activeDot={{ r: 5, fill: '#e11d48' }} />
            </AreaChart>
          </ResponsiveContainer>
        </PageCard>

        <PageCard padding>
          <h2 className="font-bold text-slate-800 mb-5">{t('adminDash.subjectFocus')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="sessions" fill="#f43f5e" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PageCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <PageCard padding={false} className="overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-500" />
              <h2 className="font-bold text-slate-800 text-sm">{t('adminDash.recentActivity')}</h2>
            </div>
            <button type="button" className="text-xs text-primary-600 font-medium hover:underline">{t('adminDash.viewAll')}</button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-4 hover:bg-slate-50/50 transition-colors">
                <span className={clsx('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', activityDot[a.type])} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-800">{a.user}</span> {a.action}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard>
            <h3 className="font-bold text-slate-800 mb-4 text-sm">{t('adminDash.platformStats')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('adminDash.totalSessions'), value: '1,291', sub: t('adminDash.thisMonth') },
                { label: t('adminDash.communities'), value: '42', sub: t('adminDash.createdToday') },
                { label: t('adminDash.avgRating'), value: '4.8★', sub: t('adminDash.acrossMentors') },
                { label: t('adminDash.completionRate'), value: '87%', sub: t('adminDash.vsLastMonth') },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-lg font-black text-slate-800">{s.value}</p>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
          </PageCard>

          <PageCard variant="brand" className="text-white" padding>
            <h3 className="font-bold mb-1">{t('adminDash.pendingActions')}</h3>
            <p className="text-primary-100 text-xs mb-4">{t('adminDash.pendingSubtitle')}</p>
            <div className="space-y-2.5">
              {[
                { label: t('adminDash.mentorApps'), count: 3 },
                { label: t('adminDash.disputes'), count: 2 },
                { label: t('adminDash.contentReview'), count: 8 },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between">
                  <span className="text-sm text-primary-100">{p.label}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">{p.count}</span>
                </div>
              ))}
            </div>
          </PageCard>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
