import { useState } from 'react'
import { Activity, AlertCircle, CheckCircle, Clock, Download, RefreshCw, Server, Shield, Wifi, Database } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import clsx from 'clsx'

const systemHealth = [
  { label: 'API Server', status: 'operational', uptime: '99.98%', icon: Server },
  { label: 'Database', status: 'operational', uptime: '99.95%', icon: Database },
  { label: 'WebSocket', status: 'degraded', uptime: '98.2%', icon: Wifi },
  { label: 'Auth Service', status: 'operational', uptime: '99.99%', icon: Shield },
]

const activityLog = []
const responseTimeData = []

const typeConfig = {
  info: { badge: 'info', icon: <Activity className="w-3.5 h-3.5 text-slate-500" />, row: 'hover:bg-slate-50/50' },
  success: { badge: 'success', icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />, row: 'hover:bg-emerald-50/30' },
  warning: { badge: 'warning', icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />, row: 'hover:bg-amber-50/30' },
  danger: { badge: 'danger', icon: <AlertCircle className="w-3.5 h-3.5 text-red-400" />, row: 'hover:bg-red-50/30' },
}

const healthColor = { operational: 'text-emerald-600 bg-emerald-50', degraded: 'text-amber-600 bg-amber-50', down: 'text-red-600 bg-red-50' }

const SystemReports = () => {
  const [filter, setFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200) }
  const filtered = activityLog.filter(a => filter === 'all' || a.type === filter)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Reports & Activity</h1>
          <p className="text-slate-500 text-sm mt-0.5">Live monitoring and event logs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={refresh}>
            <RefreshCw className={clsx('w-4 h-4', refreshing && 'animate-spin')} />Refresh
          </Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemHealth.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-slate-100 rounded-xl"><s.icon className="w-4.5 h-4.5 text-slate-600" style={{ width: 18, height: 18 }} /></div>
              <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', healthColor[s.status])}>{s.status}</span>
            </div>
            <p className="font-bold text-slate-800">{s.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">Uptime {s.uptime}</p>
          </div>
        ))}
      </div>

      {/* Response time chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
        <h2 className="font-bold text-slate-800 mb-5">Response Times (24h)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={responseTimeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="ms" />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Line type="monotone" dataKey="api" stroke="#64748b" strokeWidth={2} dot={false} name="API" />
            <Line type="monotone" dataKey="db" stroke="#c07888" strokeWidth={2} dot={false} name="Database" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-500 rounded" /><span className="text-xs text-slate-500">API Latency</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary-500 rounded" /><span className="text-xs text-slate-500">DB Latency</span></div>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 mr-auto">
            <Activity className="w-4 h-4 text-primary-500" />
            <h2 className="font-bold text-slate-800 text-sm">Event Log</h2>
          </div>
          <div className="flex gap-1 bg-slate-100 p-0.5 rounded-xl">
            {['all', 'info', 'success', 'warning', 'danger'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all', filter === f ? 'bg-white text-slate-800 shadow' : 'text-slate-500')}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.map((item) => (
            <div key={item.id} className={clsx('flex items-start gap-4 p-4 transition-colors', typeConfig[item.type].row)}>
              <div className="mt-0.5">{typeConfig[item.type].icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-700">{item.event}</p>
                  <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{item.user}</p>
              </div>
              <Badge variant={typeConfig[item.type].badge} size="sm">{item.type}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemReports
