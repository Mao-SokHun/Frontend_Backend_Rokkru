import { useState } from 'react'
import { Search, Plus, MoreHorizontal, CheckCircle, XCircle, Edit, Trash2, Download, Users } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { PageScaffold, PageCard, StatMetric, DataTable } from '@/components'
import clsx from 'clsx'

const allUsers = []

const statusConfig = { active: { variant: 'success', label: 'Active' }, inactive: { variant: 'neutral', label: 'Inactive' }, pending: { variant: 'warning', label: 'Pending' } }
const roleConfig = { student: { variant: 'primary', label: 'Student' }, mentor: { variant: 'info', label: 'Teacher' } }

const UserManagement = () => {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionMenu, setActionMenu] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 8

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" online={row.status === 'active'} />
          <div>
            <p className="font-semibold text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => <Badge variant={roleConfig[row.role].variant} size="sm">{roleConfig[row.role].label}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={statusConfig[row.status].variant} size="sm" dot>{statusConfig[row.status].label}</Badge>,
    },
    { key: 'sessions', label: 'Sessions', render: (row) => <span className="font-semibold">{row.sessions}</span> },
    { key: 'joined', label: 'Joined', render: (row) => <span className="text-slate-400 text-xs">{row.joined}</span> },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setActionMenu(actionMenu === row.id ? null : row.id)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {actionMenu === row.id && (
            <div
              className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10"
              onMouseLeave={() => setActionMenu(null)}
            >
              <button type="button" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <Edit className="w-3.5 h-3.5 text-slate-400" />Edit User
              </button>
              <button type="button" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                {row.status === 'active' ? <XCircle className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                {row.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button type="button" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" />Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <PageScaffold
        title="User Management"
        subtitle={`${allUsers.length} total users · ${allUsers.filter((u) => u.status === 'active').length} active`}
        action={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm"><Download className="w-4 h-4" />Export</Button>
            <Button variant="primary" size="sm"><Plus className="w-4 h-4" />Add User</Button>
          </div>
        }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMetric label="All Users" value={String(allUsers.length)} icon={Users} tone="primary" />
        <StatMetric label="Students" value={String(allUsers.filter((u) => u.role === 'student').length)} icon={Users} tone="success" />
        <StatMetric label="Teachers" value={String(allUsers.filter((u) => u.role === 'mentor').length)} icon={Users} tone="info" />
        <StatMetric label="Pending" value={String(allUsers.filter((u) => u.status === 'pending').length)} icon={Users} tone="warning" />
      </div>

      <PageCard padding={false}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          <Input placeholder="Search name or email..." leftIcon={<Search className="w-4 h-4" />} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-56" />
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['all', 'student', 'mentor'].map((r) => (
              <button key={r} type="button" onClick={() => { setRoleFilter(r); setPage(1) }}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all', roleFilter === r ? 'bg-white text-slate-800 shadow' : 'text-slate-500')}>
                {r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['all', 'active', 'inactive', 'pending'].map((s) => (
              <button key={s} type="button" onClick={() => { setStatusFilter(s); setPage(1) }}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all', statusFilter === s ? 'bg-white text-slate-800 shadow' : 'text-slate-500')}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={paged}
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onPageChange={setPage}
        />
      </PageCard>
    </PageScaffold>
  )
}

export default UserManagement
