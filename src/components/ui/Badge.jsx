import clsx from 'clsx'

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-surface text-muted border border-border',
        variant === 'primary' && 'bg-primary-light text-primary',
        variant === 'urgent' && 'bg-red-50 text-red-600',
        variant === 'high' && 'bg-orange-50 text-orange-600',
        className
      )}
    >
      {children}
    </span>
  )
}
