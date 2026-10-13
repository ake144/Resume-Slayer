'use client';

import { useState, useEffect } from "react";
import {
    Settings,
    User,
    Bell,
    KeyRound,
    Palette,
    Zap,
    ChevronRight,
    LogOut,
    Save,
    Eye,
    EyeOff,
    Copy,
    Check,
    Trash2,
    Plus,
    Briefcase,
    GraduationCap,
    Sparkles,
    FileArchive,
    Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import axios from "axios";
import { api } from "@/lib/api";
import { getApiKey, clearAuth } from "@/utils/common";
import { EducationEntry, SkillEntry, WorkHistoryEntry } from "@/utils/types";

function EntrySection<T extends { id: string }>({
    title, icon: Icon, entries, loading, onDelete, renderEntry, addForm,
}: {
    title: string;
    icon: LucideIcon;
    entries: T[];
    loading: boolean;
    onDelete: (id: string) => void;
    renderEntry: (entry: T) => React.ReactNode;
    addForm: React.ReactNode;
}) {
    return (
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <Icon className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">{title}</h2>
            </div>
            {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
            ) : entries.length === 0 ? (
                <p className="text-sm text-gray-500">None added yet.</p>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <div key={entry.id} className="flex items-start justify-between gap-4 p-4 bg-[#111] border border-gray-800 rounded-xl">
                            <div className="flex-1">{renderEntry(entry)}</div>
                            <button onClick={() => onDelete(entry.id)} className="text-gray-500 hover:text-red-400 flex-shrink-0 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {addForm}
        </div>
    );
}

function WorkHistorySection() {
    const [entries, setEntries] = useState<WorkHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ company: "", job_title: "", start_date: "", end_date: "", description: "" });

    const load = () => api.listWorkHistory().then(setEntries).catch(console.error).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!form.company || !form.job_title || !form.start_date) return;
        await api.createWorkHistory({
            company: form.company,
            job_title: form.job_title,
            location: null,
            start_date: form.start_date,
            end_date: form.end_date || null,
            description: form.description || null,
        });
        setForm({ company: "", job_title: "", start_date: "", end_date: "", description: "" });
        setShowForm(false);
        load();
    };

    return (
        <EntrySection
            title="Work History"
            icon={Briefcase}
            entries={entries}
            loading={loading}
            onDelete={(id) => api.deleteWorkHistory(id).then(load)}
            renderEntry={(e) => (
                <div>
                    <p className="text-white font-semibold text-sm">{e.job_title} · {e.company}</p>
                    <p className="text-gray-500 text-xs mt-1">{e.start_date} — {e.end_date || "Present"}</p>
                    {e.description && <p className="text-gray-400 text-xs mt-2">{e.description}</p>}
                </div>
            )}
            addForm={
                showForm ? (
                    <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <input value={form.company} onChange={(ev) => setForm({ ...form, company: ev.target.value })} placeholder="Company" className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                            <input value={form.job_title} onChange={(ev) => setForm({ ...form, job_title: ev.target.value })} placeholder="Job Title" className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                            <input type="date" value={form.start_date} onChange={(ev) => setForm({ ...form, start_date: ev.target.value })} className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                            <input type="date" value={form.end_date} onChange={(ev) => setForm({ ...form, end_date: ev.target.value })} placeholder="End date (blank = current)" className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                        </div>
                        <textarea value={form.description} onChange={(ev) => setForm({ ...form, description: ev.target.value })} placeholder="Description (optional)" className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none" rows={2} />
                        <div className="flex gap-2">
                            <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Save</button>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold">
                        <Plus className="w-4 h-4" /> Add work history
                    </button>
                )
            }
        />
    );
}

function EducationSection() {
    const [entries, setEntries] = useState<EducationEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ institution: "", degree: "", field_of_study: "" });

    const load = () => api.listEducation().then(setEntries).catch(console.error).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!form.institution) return;
        await api.createEducation({
            institution: form.institution,
            degree: form.degree || null,
            field_of_study: form.field_of_study || null,
            start_date: null,
            end_date: null,
            gpa: null,
            description: null,
        });
        setForm({ institution: "", degree: "", field_of_study: "" });
        setShowForm(false);
        load();
    };

    return (
        <EntrySection
            title="Education"
            icon={GraduationCap}
            entries={entries}
            loading={loading}
            onDelete={(id) => api.deleteEducation(id).then(load)}
            renderEntry={(e) => (
                <div>
                    <p className="text-white font-semibold text-sm">{e.institution}</p>
                    <p className="text-gray-500 text-xs mt-1">{[e.degree, e.field_of_study].filter(Boolean).join(", ")}</p>
                </div>
            )}
            addForm={
                showForm ? (
                    <div className="space-y-3 pt-2">
                        <input value={form.institution} onChange={(ev) => setForm({ ...form, institution: ev.target.value })} placeholder="Institution" className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                        <div className="grid grid-cols-2 gap-3">
                            <input value={form.degree} onChange={(ev) => setForm({ ...form, degree: ev.target.value })} placeholder="Degree" className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                            <input value={form.field_of_study} onChange={(ev) => setForm({ ...form, field_of_study: ev.target.value })} placeholder="Field of Study" className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Save</button>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold">
                        <Plus className="w-4 h-4" /> Add education
                    </button>
                )
            }
        />
    );
}

function SkillsSection() {
    const [entries, setEntries] = useState<SkillEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const load = () => api.listSkills().then(setEntries).catch(console.error).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!name.trim()) return;
        setError("");
        try {
            await api.createSkill({ name: name.trim(), category: null, proficiency: null });
            setName("");
            setShowForm(false);
            load();
        } catch (e) {
            const detail = axios.isAxiosError(e) ? e.response?.data?.detail : undefined;
            setError(detail || "Failed to add skill");
        }
    };

    return (
        <EntrySection
            title="Skills"
            icon={Sparkles}
            entries={entries}
            loading={loading}
            onDelete={(id) => api.deleteSkill(id).then(load)}
            renderEntry={(e) => <p className="text-white font-semibold text-sm">{e.name}</p>}
            addForm={
                showForm ? (
                    <div className="space-y-3 pt-2">
                        {error && <p className="text-red-400 text-xs">{error}</p>}
                        <div className="flex gap-2">
                            <input value={name} onChange={(ev) => setName(ev.target.value)} placeholder="Skill name" className="flex-1 bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                            <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Save</button>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold">
                        <Plus className="w-4 h-4" /> Add skill
                    </button>
                )
            }
        />
    );
}

function ResumeVersionsSection() {
    const [versions, setVersions] = useState<Awaited<ReturnType<typeof api.listResumeVersions>>>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        api.listResumeVersions().then(setVersions).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleDownload = async (id: string, filename: string | null, title: string) => {
        setDownloading(id);
        try {
            const blob = await api.downloadResumeVersion(id);
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename || `${title}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <FileArchive className="w-5 h-5 text-blue-400" />
                <div>
                    <h2 className="text-lg font-bold text-white">Resume versions</h2>
                    <p className="text-xs text-gray-500 mt-1">Every uploaded resume remains available as career evidence.</p>
                </div>
            </div>
            {loading ? <p className="text-sm text-gray-500">Loading...</p> : versions.length === 0 ? (
                <p className="text-sm text-gray-500">No versioned resumes yet. Upload one from Slay Mode.</p>
            ) : (
                <div className="space-y-3">
                    {versions.map((version) => (
                        <div key={version.id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-[#111] p-4">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">{version.title}</p>
                                <p className="mt-1 text-xs text-gray-500">{version.filename || "Text resume"} · {new Date(version.created_at).toLocaleDateString()}</p>
                                <p className="mt-1 text-[11px] text-emerald-400">{version.parser_status} · evidence snapshot</p>
                            </div>
                            {version.filename && (
                                <button
                                    onClick={() => handleDownload(version.id, version.filename, version.title)}
                                    disabled={downloading === version.id}
                                    className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-blue-500 hover:text-white disabled:opacity-50"
                                >
                                    <Download className="h-4 w-4" /> {downloading === version.id ? "..." : "Download"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function EvidenceSection() {
    const [entries, setEntries] = useState<Awaited<ReturnType<typeof api.listEvidence>>>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ evidence_type: "accomplishment", title: "", description: "", verified: false });

    const load = () => api.listEvidence().then(setEntries).catch(console.error).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!form.title.trim() || !form.description.trim()) return;
        await api.createEvidence({
            ...form,
            title: form.title.trim(),
            description: form.description.trim(),
            source: "user_entered",
            source_resume_version_id: null,
        });
        setForm({ evidence_type: "accomplishment", title: "", description: "", verified: false });
        setShowForm(false);
        load();
    };

    return (
        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-blue-400" /><div><h2 className="text-lg font-bold text-white">Career evidence</h2><p className="text-xs text-gray-500 mt-1">Add real accomplishments the agent can safely reuse.</p></div></div>
                <span className="text-xs text-gray-500">{entries.filter((entry) => entry.verified).length} verified</span>
            </div>
            {loading ? <p className="text-sm text-gray-500">Loading...</p> : entries.length === 0 ? <p className="text-sm text-gray-500">No evidence added yet.</p> : (
                <div className="space-y-3">{entries.map((entry) => <div key={entry.id} className="rounded-xl border border-gray-800 bg-[#111] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-white">{entry.title}</p><p className="mt-1 text-[11px] uppercase tracking-wider text-gray-500">{entry.evidence_type} · {entry.source}</p></div><span className={entry.verified ? "text-xs text-emerald-400" : "text-xs text-amber-400"}>{entry.verified ? "Verified" : "Needs verification"}</span></div><p className="mt-3 text-sm leading-5 text-gray-400">{entry.description}</p><button onClick={() => api.deleteEvidence(entry.id).then(load)} className="mt-3 text-xs text-gray-600 hover:text-red-400">Remove</button></div>)}</div>
            )}
            {showForm ? <div className="space-y-3 border-t border-gray-800 pt-4"><div className="grid grid-cols-2 gap-3"><select value={form.evidence_type} onChange={(event) => setForm({ ...form, evidence_type: event.target.value })} className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"><option value="accomplishment">Accomplishment</option><option value="project">Project</option><option value="certification">Certification</option><option value="portfolio">Portfolio</option></select><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Evidence title" className="bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" /></div><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What did you do? Include measurable results when you can verify them." rows={3} className="w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none" /><label className="flex items-center gap-2 text-xs text-gray-400"><input type="checkbox" checked={form.verified} onChange={(event) => setForm({ ...form, verified: event.target.checked })} /> I verify this information is accurate</label><div className="flex gap-2"><button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Save evidence</button><button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2">Cancel</button></div></div> : <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold"><Plus className="w-4 h-4" /> Add career evidence</button>}
        </div>
    );
}

function CareerPreferencesSection() {
    const [preferences, setPreferences] = useState<Awaited<ReturnType<typeof api.getCareerPreferences>> | null>(null);
    const [roles, setRoles] = useState<Awaited<ReturnType<typeof api.listTargetRoles>>>([]);
    const [roleName, setRoleName] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        Promise.all([api.getCareerPreferences(), api.listTargetRoles()])
            .then(([nextPreferences, nextRoles]) => { setPreferences(nextPreferences); setRoles(nextRoles); })
            .catch(console.error);
    }, []);

    const toggleValue = (field: "work_modes" | "employment_types", value: string) => {
        if (!preferences) return;
        const values = preferences[field] || [];
        setPreferences({ ...preferences, [field]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value] });
    };

    const savePreferences = async () => {
        if (!preferences) return;
        const next = await api.updateCareerPreferences({
            work_modes: preferences.work_modes,
            employment_types: preferences.employment_types,
            preferred_locations: preferences.preferred_locations,
            minimum_salary: preferences.minimum_salary,
            salary_currency: preferences.salary_currency,
            willing_to_relocate: preferences.willing_to_relocate,
            visa_sponsorship_required: preferences.visa_sponsorship_required,
        });
        setPreferences(next);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const addRole = async () => {
        if (!roleName.trim()) return;
        const role = await api.createTargetRole({ role_name: roleName.trim(), priority: roles.length + 1 });
        setRoles([...roles, role]);
        setRoleName("");
    };

    if (!preferences) return <div className="rounded-2xl border border-gray-800/50 bg-[#0a0a0c] p-6 text-sm text-gray-500">Loading career preferences...</div>;

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-gray-800/50 bg-[#0a0a0c] p-6 space-y-5">
                <div className="border-b border-gray-800 pb-4"><h2 className="text-lg font-bold text-white">Career preferences</h2><p className="mt-1 text-xs text-gray-500">These constraints will guide future job discovery and matching.</p></div>
                <div><p className="mb-2 text-sm font-medium text-gray-300">Work mode</p><div className="flex flex-wrap gap-2">{["remote", "hybrid", "onsite"].map((value) => <button key={value} onClick={() => toggleValue("work_modes", value)} className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize ${preferences.work_modes?.includes(value) ? "border-blue-500 bg-blue-500/10 text-blue-300" : "border-gray-700 text-gray-500"}`}>{value}</button>)}</div></div>
                <div><p className="mb-2 text-sm font-medium text-gray-300">Employment type</p><div className="flex flex-wrap gap-2">{[{ value: "full_time", label: "Full time" }, { value: "part_time", label: "Part time" }, { value: "contract", label: "Contract" }].map((item) => <button key={item.value} onClick={() => toggleValue("employment_types", item.value)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${preferences.employment_types?.includes(item.value) ? "border-blue-500 bg-blue-500/10 text-blue-300" : "border-gray-700 text-gray-500"}`}>{item.label}</button>)}</div></div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3"><input value={preferences.preferred_locations?.join(", ") || ""} onChange={(event) => setPreferences({ ...preferences, preferred_locations: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="Preferred locations, comma separated" className="md:col-span-2 rounded-lg border border-gray-700 bg-[#111] px-3 py-2 text-sm text-white" /><input type="number" value={preferences.minimum_salary || ""} onChange={(event) => setPreferences({ ...preferences, minimum_salary: event.target.value ? Number(event.target.value) : null })} placeholder="Minimum salary" className="rounded-lg border border-gray-700 bg-[#111] px-3 py-2 text-sm text-white" /></div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2"><label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={preferences.willing_to_relocate || false} onChange={(event) => setPreferences({ ...preferences, willing_to_relocate: event.target.checked })} /> Willing to relocate</label><label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={preferences.visa_sponsorship_required || false} onChange={(event) => setPreferences({ ...preferences, visa_sponsorship_required: event.target.checked })} /> Visa sponsorship required</label></div>
                <div className="flex justify-end"><button onClick={savePreferences} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">{saved ? "Saved" : "Save preferences"}</button></div>
            </div>
            <div className="rounded-2xl border border-gray-800/50 bg-[#0a0a0c] p-6 space-y-5"><div className="border-b border-gray-800 pb-4"><h2 className="text-lg font-bold text-white">Target roles</h2><p className="mt-1 text-xs text-gray-500">Rank the roles your agent should prioritize.</p></div><div className="flex gap-2"><input value={roleName} onChange={(event) => setRoleName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addRole()} placeholder="e.g. Senior Frontend Engineer" className="flex-1 rounded-lg border border-gray-700 bg-[#111] px-3 py-2 text-sm text-white" /><button onClick={addRole} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Add role</button></div><div className="space-y-2">{roles.map((role, index) => <div key={role.id} className="flex items-center justify-between rounded-lg border border-gray-800 bg-[#111] px-4 py-3"><span className="text-sm text-white"><span className="mr-3 text-xs text-gray-600">{index + 1}</span>{role.role_name}</span><button onClick={() => api.deleteTargetRole(role.id).then(() => setRoles(roles.filter((item) => item.id !== role.id)))} className="text-xs text-gray-600 hover:text-red-400">Remove</button></div>)}</div></div>
        </div>
    );
}

export default function SettingsPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("profile");
    const [saved, setSaved] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    const [profile, setProfile] = useState({
        fullName: "",
        contactEmail: "",
        location: "",
        summary: "",
    });

    const [notifications, setNotifications] = useState({
        slayComplete: true,
        weeklyDigest: false,
        newFeatures: true,
        tips: true,
    });

    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const [apiKeyCopied, setApiKeyCopied] = useState(false);
    const apiKey = getApiKey();

    useEffect(() => {
        api.getProfile()
            .then((p) => {
                setProfile({
                    fullName: p.full_name || "",
                    contactEmail: p.contact_email || "",
                    location: p.location || "",
                    summary: p.summary || "",
                });
            })
            .catch(console.error)
            .finally(() => setProfileLoading(false));
    }, []);

    const handleSave = async () => {
        try {
            await api.updateProfile({
                full_name: profile.fullName,
                contact_email: profile.contactEmail,
                location: profile.location,
                summary: profile.summary,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = () => {
        clearAuth();
        router.push("/login");
    };

    const handleCopyKey = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            setApiKeyCopied(true);
            setTimeout(() => setApiKeyCopied(false), 2000);
        }
    };

    const sections = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "api-key", label: "API Key", icon: KeyRound },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500 max-w-5xl">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-gray-300" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                </div>
                <p className="text-gray-400 text-sm">Manage your account preferences and configuration.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Nav */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-3 space-y-1">
                        {sections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s.id
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <s.icon className="w-4 h-4" />
                                    {s.label}
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeSection === s.id ? "rotate-90" : ""}`} />
                            </button>
                        ))}

                        <div className="pt-2 mt-2 border-t border-gray-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {activeSection === "profile" && (
                        <>
                            <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-lg font-bold text-white">Profile Information</h2>
                                </div>

                                {profileLoading ? (
                                    <p className="text-sm text-gray-500">Loading...</p>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profile.fullName}
                                                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                                                <input
                                                    type="email"
                                                    value={profile.contactEmail}
                                                    onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                                                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={profile.location}
                                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                                    placeholder="New York, USA"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Summary</label>
                                                <textarea
                                                    value={profile.summary}
                                                    onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                                                    rows={3}
                                                    className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
                                                    placeholder="A short professional summary..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                                            >
                                                <Save className="w-4 h-4" />
                                                {saved ? "Saved!" : "Save Changes"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <WorkHistorySection />
                            <EducationSection />
                            <SkillsSection />
                            <ResumeVersionsSection />
                            <EvidenceSection />
                            <CareerPreferencesSection />
                        </>
                    )}

                    {activeSection === "notifications" && (
                        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                                <Bell className="w-5 h-5 text-purple-400" />
                                <h2 className="text-lg font-bold text-white">Notifications</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { key: "slayComplete", label: "Slay Complete", desc: "Get notified when your resume optimization finishes." },
                                    { key: "weeklyDigest", label: "Weekly Digest", desc: "Receive a weekly summary of your job search activity." },
                                    { key: "newFeatures", label: "New Features", desc: "Be the first to know about new tools and features." },
                                    { key: "tips", label: "ATS Tips", desc: "Receive expert tips to improve your match score." },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-start justify-between p-4 rounded-xl bg-[#111] border border-gray-800">
                                        <div>
                                            <p className="text-white font-medium text-sm">{item.label}</p>
                                            <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${notifications[item.key as keyof typeof notifications] ? "bg-blue-600" : "bg-gray-700"
                                                }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === "api-key" && (
                        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                                <KeyRound className="w-5 h-5 text-green-400" />
                                <h2 className="text-lg font-bold text-white">Your API Key</h2>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                                <div className="relative">
                                    <input
                                        type={apiKeyVisible ? "text" : "password"}
                                        value={apiKey || ""}
                                        readOnly
                                        className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 pr-24 text-white text-sm font-mono focus:outline-none"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            onClick={() => setApiKeyVisible(!apiKeyVisible)}
                                            className="p-2 text-gray-500 hover:text-gray-300"
                                        >
                                            {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button onClick={handleCopyKey} className="p-2 text-gray-500 hover:text-gray-300">
                                            {apiKeyCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                                <p className="text-yellow-400 text-xs font-medium">
                                    This key cannot be recovered or rotated. If you lose it, you&apos;ll need to register a new account.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeSection === "appearance" && (
                        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                                <Palette className="w-5 h-5 text-pink-400" />
                                <h2 className="text-lg font-bold text-white">Appearance</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-400">Theme &amp; Accent Color</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Dark", bg: "bg-[#050505]", accent: "border-gray-700 text-gray-300", active: true },
                                        { label: "Darker", bg: "bg-black", accent: "border-gray-800 text-gray-400", active: false },
                                        { label: "Midnight", bg: "bg-[#02041a]", accent: "border-indigo-900 text-indigo-300", active: false },
                                    ].map((theme) => (
                                        <div
                                            key={theme.label}
                                            className={`${theme.bg} border ${theme.accent} rounded-xl p-4 cursor-pointer relative overflow-hidden ${theme.active ? "ring-2 ring-blue-500" : "hover:border-gray-600"} transition-all`}
                                        >
                                            <div className="w-full h-6 rounded bg-gray-800/50 mb-2" />
                                            <div className="w-3/4 h-3 rounded bg-gray-700/50" />
                                            <p className={`mt-3 text-xs font-medium ${theme.accent.includes("text") ? "" : "text-gray-400"}`}>{theme.label}</p>
                                            {theme.active && (
                                                <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-blue-400 text-xs font-medium">
                                        <Zap className="w-3.5 h-3.5" />
                                        More theme options coming in the Pro plan.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
