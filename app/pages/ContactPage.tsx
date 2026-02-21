'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, User, MessageSquare, FileText } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = '請填寫您的名字';
    if (!form.email.trim()) errs.email = '請填寫電子郵件';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '請填寫有效的電子郵件';
    if (!form.subject.trim()) errs.subject = '請填寫主旨';
    if (!form.message.trim()) errs.message = '請填寫訊息內容';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setErrors({});
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-green-400" />
          </div>
          <h2 className="text-2xl text-slate-100 mb-2">訊息已送出！</h2>
          <p className="text-slate-400 text-sm mb-6">
            感謝您的來信，我會盡快回覆您的 {form.email}
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            再寄一封
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-amber-400" />
          </div>
          <h1 className="text-2xl text-slate-100 mb-1">聯絡我</h1>
          <p className="text-slate-500 text-sm">有任何問題或合作意向，歡迎寄信給我</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">您的名字</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="您的名字"
                className={`w-full bg-slate-700/50 border rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                  errors.name ? 'border-red-500/60' : 'border-slate-600 focus:border-amber-500/60'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />{errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">電子郵件</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="your@email.com"
                className={`w-full bg-slate-700/50 border rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500/60' : 'border-slate-600 focus:border-amber-500/60'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />{errors.email}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">主旨</label>
            <div className="relative">
              <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={form.subject}
                onChange={e => handleChange('subject', e.target.value)}
                placeholder="訊息主旨"
                className={`w-full bg-slate-700/50 border rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                  errors.subject ? 'border-red-500/60' : 'border-slate-600 focus:border-amber-500/60'
                }`}
              />
            </div>
            {errors.subject && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />{errors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">訊息內容</label>
            <div className="relative">
              <MessageSquare size={14} className="absolute left-3 top-3.5 text-slate-500" />
              <textarea
                value={form.message}
                onChange={e => handleChange('message', e.target.value)}
                placeholder="請輸入您的訊息..."
                rows={5}
                className={`w-full bg-slate-700/50 border rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-500 text-sm resize-none focus:outline-none transition-colors ${
                  errors.message ? 'border-red-500/60' : 'border-slate-600 focus:border-amber-500/60'
                }`}
              />
            </div>
            {errors.message && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />{errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {loading ? '傳送中...' : '傳送訊息'}
          </button>
        </form>

        <p className="text-xs text-slate-600 text-center mt-4">
          * 這是示範功能，不會實際傳送電子郵件
        </p>
      </div>
    </div>
  );
}
