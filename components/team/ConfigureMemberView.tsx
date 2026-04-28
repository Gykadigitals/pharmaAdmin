'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

// 🛡️ Local SVG Icon Components to ensure stability and prevent ReferenceErrors
const Zap = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const Trash2 = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const Search = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const Plus = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const MapPin = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const Smartphone = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
);
const ShieldCheck = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);
const RefreshCcw = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
);
const UserPlus = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
);
const ChevronDown = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const ChevronUp = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="18 15 12 9 6 15"></polyline></svg>
);
const ChevronRight = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>
);
const Calendar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const DollarSign = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const History = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline><path d="M3.3 7a9 9 0 1 1-1.3 5h3"></path></svg>
);
const X = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const LayoutDashboard = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
);
const Users = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const Activity = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
const BriefcaseIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
const TrendingUp = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const Clock = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const FileText = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const UserIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const Camera = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);
const Mail = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const AlertCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
const Loader2 = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
);
const CheckCircle2 = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

import { PERMISSION_GROUPS } from '@/constant/permissions';
import {
  useGetRolesQuery,
  useGetRolesWithUsersQuery,
  useDeleteRoleMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation
} from '../../store/api/rolesApi';
import { useCreateUserMutation } from '../../store/api/userApi';

// Sub-components
import { TagInput } from './TagInput';
import { DeploymentSummary } from './configure/DeploymentSummary';
import { IdentitySection } from './configure/IdentitySection';
import { RoleMappingSection } from './configure/RoleMappingSection';
import { CompensationSection } from './configure/CompensationSection';
import { PerformanceSection } from './configure/PerformanceSection';

// ─── Types/Constants ────────────────────────────────────────────────────────

interface SalaryComponent { id: number; label: string; value: number; }
interface SalaryRevision {
  id: number;
  effectiveFrom: string;
  label: string;
  designation?: string;
  components: SalaryComponent[];
}
interface MonthTarget { [month: string]: string; }
interface YearTarget { year: string; targets: MonthTarget; }

const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const currentYear = new Date().getFullYear();
const makeEmptyTargets = (): MonthTarget =>
  Object.fromEntries(MONTHS_SHORT.map(m => [m, '']));

// ─── Orchestrator Component ─────────────────────────────────────────────────

export default function ConfigureMemberView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const step = view === 'create' ? 1 : 2;

  const handleSetStep = (newStep: number) => {
    const newView = newStep === 1 ? 'create' : 'create-user';
    router.push(`/team?view=${newView}`);
  };

  // ── Step 1: Role Configuration State ──────────────────────────────────────
  const [roleName, setRoleName] = useState('');
  const [roleStatus, setRoleStatus] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery();
  const dbRoles = rolesData?.roles || [];

  const [deleteRoleMutation] = useDeleteRoleMutation();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const togglePermission = (key: string) => {
    setSelectedPermissions(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const handleSaveRole = async () => {
    try {
      const payload = { name: roleName, permissions: selectedPermissions, isActive: roleStatus };
      if (editingRoleId) {
        await updateRole({ id: editingRoleId, ...payload }).unwrap();
        alert('Role updated successfully!');
      } else {
        await createRole(payload).unwrap();
        alert('Role created successfully!');
        handleSetStep(2);
      }
      setEditingRoleId(null);
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await deleteRoleMutation(id).unwrap();
      alert('Role deleted successfully');
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete role');
    }
  };

  // ── Step 2: Basic Identity (Form Hook) ──────────────────────────────────
  const { register, watch, setValue, trigger, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '', designation: '', email: '', password: '',
      empId: '', dailyAllowance: 250, selectedRoleId: ''
    }
  });

  const fullName = watch('fullName');
  const designation = watch('designation');
  const email = watch('email');
  const empId = watch('empId');
  const dailyAllowance = watch('dailyAllowance');
  const selectedRoleId = watch('selectedRoleId');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [stations, setStations] = useState<string[]>([]);
  const [subAreas, setSubAreas] = useState<string[]>([]);

  const [managerType, setManagerType] = useState<'own' | 'others'>('own');
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const { data: managerList = [], isLoading: isLoadingManagers } = useGetRolesWithUsersQuery();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 2 && !selectedRoleId) {
      const initialRole = dbRoles.find(r => r.name === roleName);
      if (initialRole) setValue('selectedRoleId', initialRole._id);
    }
  }, [step, dbRoles, roleName, selectedRoleId, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ── Step 3: Salary Revisions ───────────────────────────────────────────
  const [salaryRevisions, setSalaryRevisions] = useState<SalaryRevision[]>([
    {
      id: 1,
      effectiveFrom: `${currentYear}-04`,
      label: `FY ${currentYear}-${String(currentYear + 1).slice(-2)} Initial`,
      components: [
        { id: 1, label: 'Basic Salary', value: 0 },
        { id: 2, label: 'House Rent Allowance (HRA)', value: 0 },
        { id: 3, label: 'Provident Fund (PF)', value: 0 },
      ]
    }
  ]);
  const [expandedRevision, setExpandedRevision] = useState<number>(1);
  const [newCompLabel, setNewCompLabel] = useState('');
  const [newCompValue, setNewCompValue] = useState('');

  const activeRevision = salaryRevisions.find(r => r.id === expandedRevision) ?? salaryRevisions[salaryRevisions.length - 1];
  const activeTotalComp = activeRevision?.components.reduce((a, c) => a + c.value, 0) ?? 0;

  const updateSalaryComp = (revId: number, compId: number, val: number) => {
    setSalaryRevisions(prev => prev.map(r =>
      r.id === revId
        ? { ...r, components: r.components.map(c => c.id === compId ? { ...c, value: val } : c) }
        : r
    ));
  };

  const addSalaryComponent = () => {
    if (!newCompLabel.trim() || !newCompValue) return;
    setSalaryRevisions(prev => prev.map(r =>
      r.id === expandedRevision
        ? { ...r, components: [...r.components, { id: Date.now(), label: newCompLabel.trim(), value: parseFloat(newCompValue) }] }
        : r
    ));
    setNewCompLabel(''); setNewCompValue('');
  };

  const removeSalaryComponent = (compId: number) => {
    setSalaryRevisions(prev => prev.map(r => {
      if (r.id !== expandedRevision) return r;
      const comp = r.components.find(c => c.id === compId);
      if (comp && ['Basic Salary', 'House Rent Allowance (HRA)', 'Provident Fund (PF)'].includes(comp.label)) {
        return r; // Block deletion of core components
      }
      return { ...r, components: r.components.filter(c => c.id !== compId) };
    }));
  };

  const addSalaryRevision = () => {
    const newId = Date.now();
    setSalaryRevisions(prev => [...prev, {
      id: newId,
      effectiveFrom: `${currentYear}-04`,
      label: `FY ${currentYear}-${String(currentYear + 1).slice(-2)} Revision`,
      components: [...prev[prev.length - 1].components]
    }]);
    setExpandedRevision(newId);
  };

  // ── Step 4: Performance Targets ─────────────────────────────────────────
  const [yearTargets, setYearTargets] = useState<YearTarget[]>([
    { year: `FY ${currentYear}-${String(currentYear + 1).slice(-2)}`, targets: makeEmptyTargets() }
  ]);
  const [activeTargetYear, setActiveTargetYear] = useState(0);

  const updateMonthTarget = (yearIdx: number, month: string, val: string) => {
    setYearTargets(prev => {
      const copy = [...prev];
      copy[yearIdx] = { ...copy[yearIdx], targets: { ...copy[yearIdx].targets, [month]: val } };
      return copy;
    });
  };

  const addNewYear = () => {
    const lastYear = parseInt(yearTargets[yearTargets.length - 1].year.match(/\d+/)?.[0] || '0');
    const nextYear = lastYear + 1;
    setYearTargets(prev => [...prev, {
      year: `FY ${nextYear}-${String(nextYear + 1).slice(-2)}`,
      targets: makeEmptyTargets()
    }]);
    setActiveTargetYear(yearTargets.length);
  };

  // ── Deployment Submissions ─────────────────────────────────────────────
  const handleCreateEmployee = async () => {
    const isValid = await trigger();
    if (!isValid || stations.length === 0 || subAreas.length === 0) {
      setToast({ message: 'Please fill all required fields and assign territories.', type: 'error' });
      return;
    }
    try {
      const payload = {
        name: fullName, email: email.toLowerCase(), roleId: selectedRoleId,
        employeeId: empId, designation, photo: profileImage,
        salaryRevisions,
        targets: yearTargets.map(yt => ({
          year: parseInt(yt.year.match(/\d+/)?.[0] || '0'),
          targets: Object.entries(yt.targets).map(([month, val]) => ({ month, target: parseFloat(val) || 0 }))
        })),
        managerType, managerId: managerType === 'own' ? null : selectedManagerId,
        stations, subAreas, dailyAllowance: Number(dailyAllowance)
      };
      await createUser(payload).unwrap();
      setToast({ message: 'Personnel deployed successfully!', type: 'success' });
      setTimeout(() => router.push('/team'), 2000);
    } catch (err: any) {
      setToast({ message: err?.data?.message || 'Deployment failed', type: 'error' });
    }
  };

  // ── Render Modes ─────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <div className="min-h-full flex flex-col bg-slate-50/30">
        <div className="flex-1 lg:overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 lg:py-10 pb-24 lg:pb-32 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 lg:p-10 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Infrastructure</h1>
                <p className="text-xs text-slate-400 font-medium italic mt-1">Manage organizational roles and authorization levels</p>
              </div>
              <button
                onClick={() => handleSetStep(2)}
                className="group flex items-center gap-4 bg-indigo-600 text-white px-6 py-4 rounded-[22px] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
              >
                Skip to Direct Deployment <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-4 space-y-8">
                <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-20 -mt-20" />
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"><ShieldCheck size={24} /></div>
                      <h2 className="text-xl font-black tracking-tight">{editingRoleId ? 'Modify Node' : 'Initialize Node'}</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="group/input">
                        <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-2 mb-2 block">Role Label</label>
                        <input
                          value={roleName} onChange={(e) => setRoleName(e.target.value)}
                          placeholder="e.g. Area Sales Manager"
                          className="w-full bg-slate-800/50 border border-slate-700 outline-none rounded-[24px] px-8 py-5 text-sm font-bold focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSaveRole}
                      className="w-full bg-white text-indigo-600 py-6 rounded-[28px] font-black text-xs uppercase tracking-extra-widest transition-all hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/10"
                    >
                      {editingRoleId ? 'Synchronize Node' : 'Finalize & Deploy'}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-200/30">
                  <div className="flex items-center justify-between mb-8 px-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Permissions Layer</h3>
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase text-center">{selectedPermissions.length} Active</div>
                  </div>
                  <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {PERMISSION_GROUPS.map((group) => (
                      <div key={group.title} className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 font-bold">{group.title}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {group.permissions.map((p) => {
                            const isSelected = selectedPermissions.includes(p.key);
                            return (
                              <div
                                key={p.key} onClick={() => togglePermission(p.key)}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all cursor-pointer group ${isSelected ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50'}`}
                              >
                                <span className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-emerald-900' : 'text-slate-500'}`}>{p.label}</span>
                                {isSelected && <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={10} /></div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="xl:col-span-8 space-y-8">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 p-8 lg:p-10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-extra-widest">Global Roles Architecture</h3>
                    <RefreshCcw size={14} className={`text-slate-300 transition-all ${isLoadingRoles ? 'animate-spin' : 'cursor-pointer hover:text-indigo-600'}`} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoadingRoles ? (
                      [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[32px] animate-pulse" />)
                    ) : (
                      dbRoles.map((role) => (
                        <div key={role._id} className="bg-slate-50 border border-slate-100 rounded-[36px] p-6 group hover:translate-y-[-4px] hover:shadow-2xl transition-all duration-300 hover:bg-white hover:border-indigo-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"><ShieldCheck size={18} /></div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => { setEditingRoleId(role._id); setRoleName(role.name); setSelectedPermissions(role.permissions || []); }} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><History size={14} /></button>
                              <button onClick={() => handleDeleteRole(role._id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 uppercase">{role.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 mt-2">{role.permissions?.length || 0} Permissions Active</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Final Data Resolution ─────────────────────────────────────────────
  const activeRoleLabel = dbRoles.find((r: any) => r._id === selectedRoleId)?.name || roleName || 'UNASSIGNED ROLE';

  // ── Manager Resolution ───────────────────────────────────────────────
  const selectedManagerName = managerType === 'own'
    ? 'Self Managed (HQ)'
    : managerList.flatMap((g: any) => g.users).find((u: any) => u._id === selectedManagerId)?.name || 'Direct HQ Reporting';

  // ── Main Personnel Deployment View ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row lg:overflow-hidden">
      <DeploymentSummary
        fullName={fullName} roleName={activeRoleLabel} email={email} dailyAllowance={dailyAllowance}
        stations={stations} subAreas={subAreas} activeTotalComp={activeTotalComp} totalLeave={0}
        profileImage={profileImage} onImageClick={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef} handleImageUpload={handleImageUpload}
        managerName={selectedManagerName}
      />

      <div className="flex-1 lg:overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 lg:py-10 pb-24 lg:pb-36 custom-scrollbar bg-white">
        <div className="w-full lg:max-w-4xl mx-auto space-y-12 sm:space-y-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Create User</h1>
              <p className="text-[10px] sm:text-sm text-slate-400 font-medium italic mt-2">Professional identity for the <span className="text-indigo-600 font-black">{activeRoleLabel}</span> label</p>
            </div>
          </div>

          <IdentitySection register={register} errors={errors} />

          <section className="space-y-8 border-t border-slate-50 pt-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white"><BriefcaseIcon size={24} /></div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Regional Deployment & Territories</h2>
            </div>
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <TagInput
                  label="Assigned Deployment Stations" tags={stations}
                  onAdd={v => setStations([...stations, v])} onRemove={i => setStations(stations.filter((_, idx) => idx !== i))}
                  placeholder="e.g. Hyderabad" color="blue"
                />
                <TagInput
                  label="Active Operation Territories" tags={subAreas}
                  onAdd={v => setSubAreas([...subAreas, v])} onRemove={i => setSubAreas(subAreas.filter((_, idx) => idx !== i))}
                  placeholder="e.g. Uppal" color="teal"
                />
              </div>
              <RoleMappingSection
                dbRoles={dbRoles} selectedRoleId={selectedRoleId}
                setValue={setValue} watch={watch}
                managerType={managerType} setManagerType={setManagerType}
                selectedManagerId={selectedManagerId} setSelectedManagerId={setSelectedManagerId}
                managerList={managerList} isLoadingManagers={isLoadingManagers}
              />
            </div>
          </section>

          <CompensationSection
            salaryRevisions={salaryRevisions} expandedRevision={expandedRevision}
            setExpandedRevision={setExpandedRevision} updateSalaryComp={updateSalaryComp}
            addSalaryComponent={addSalaryComponent} removeSalaryComponent={removeSalaryComponent}
            addSalaryRevision={addSalaryRevision} newCompLabel={newCompLabel} setNewCompLabel={setNewCompLabel}
            newCompValue={newCompValue} setNewCompValue={setNewCompValue}
            register={register} errors={errors}
          />

          <PerformanceSection
            yearTargets={yearTargets} activeTargetYear={activeTargetYear}
            setActiveTargetYear={setActiveTargetYear} updateMonthTarget={updateMonthTarget}
            addNewYear={addNewYear} MONTHS_SHORT={MONTHS_SHORT}
          />

          <div className="flex items-center gap-6 pt-10">
            <button
              onClick={handleCreateEmployee}
              disabled={isCreatingUser}
              className={`flex-1 ${isCreatingUser ? 'bg-indigo-400' : 'bg-indigo-600 hover:scale-[1.02]'} text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3`}
            >
              {isCreatingUser ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>

          {/* 🍞 Toast Notification */}
          {toast && (
            <div className={`fixed bottom-10 right-10 animate-in slide-in-from-right-10 duration-500 z-50 flex items-center gap-4 px-8 py-5 rounded-3xl shadow-2xl border ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100"><X size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
