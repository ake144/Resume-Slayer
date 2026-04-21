'use client';

import { useState, useEffect } from "react";
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Zap,
    ChevronRight,
    LogOut,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("profile");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        profession: "",
        location: "",
    });

    const [notifications, setNotifications] = useState({
        slayComplete: true,
        weeklyDigest: false,
        newFeatures: true,
        tips: true,
    });

    const [passwords, setPasswords] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    // Load stored user info
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
        // Could decode JWT here to get email; for now pre-fill with stored data
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
            try {
                setProfile(JSON.parse(storedProfile));
            } catch {/* ignore */ }
        }
    }, [router]);

    const handleSave = () => {
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("resume-storage");
        router.push("/login");
    };

    const sections = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
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
                <div className="lg:col-span-3">
                    {activeSection === "profile" && (
                        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                                <User className="w-5 h-5 text-blue-400" />
                                <h2 className="text-lg font-bold text-white">Profile Information</h2>
                            </div>

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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Profession / Target Role</label>
                                    <input
                                        type="text"
                                        value={profile.profession}
                                        onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                                        className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="Senior Full-Stack Engineer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={profile.location}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                        className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="New York, USA"
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
                        </div>
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
                                    { key: "tips", label: "ATS Tips", desc: "Receive expert tips to improve your ATS score." },
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

                    {activeSection === "security" && (
                        <div className="bg-[#0a0a0c] border border-gray-800/50 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                                <Shield className="w-5 h-5 text-green-400" />
                                <h2 className="text-lg font-bold text-white">Security</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={passwords.current}
                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                            className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 pr-12 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwords.newPass}
                                            onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                            className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 pr-12 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="pt-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                                <p className="text-yellow-400 text-xs font-medium">
                                    ⚠️ Password changes require a backend endpoint — connect to <code className="bg-yellow-500/10 px-1 rounded">/api/auth/change-password</code> to enable this.
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
