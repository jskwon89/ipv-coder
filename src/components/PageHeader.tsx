import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  icon?: React.ReactNode;
  iconBgClass?: string;
  iconTextClass?: string;
}

export default function PageHeader({ title, subtitle, breadcrumbs, action, icon, iconBgClass, iconTextClass }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-gray-300 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-300 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass || "bg-[#c49a2e]/10"} ${iconTextClass || "text-[#c49a2e]"}`}>
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
