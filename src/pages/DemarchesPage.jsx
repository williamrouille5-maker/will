import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useData } from '../hooks/useData'
import Badge from '../components/ui/Badge'

function ProcedureCard({ procedure }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-4 text-left flex items-start justify-between gap-3 active:bg-surface transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-1">
            <span className="font-semibold text-text text-sm">{procedure.title}</span>
            {procedure.priority === 'urgent' && <Badge variant="urgent">Urgent</Badge>}
            {procedure.priority === 'high' && <Badge variant="high">Important</Badge>}
          </div>
          <p className="text-xs text-muted leading-snug">{procedure.summary}</p>
          {procedure.deadline && (
            <p className="text-xs font-medium text-demarches mt-1">⏰ {procedure.deadline}</p>
          )}
        </div>
        {open ? (
          <ChevronUp size={18} className="text-muted flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown size={18} className="text-muted flex-shrink-0 mt-0.5" />
        )}
      </button>

      {open && (
        <div className="border-t border-border px-4 py-4 flex flex-col gap-4">
          {procedure.steps.map((step) => (
            <div key={step.order} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-demarches-light flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-demarches">{step.order}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-text text-sm mb-0.5">{step.title}</div>
                <p className="text-xs text-muted leading-relaxed mb-2">{step.description}</p>
                {step.documents?.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {step.documents.map((doc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-muted">
                        <span className="text-demarches">📄</span>
                        {doc}
                      </div>
                    ))}
                  </div>
                )}
                {step.duration && (
                  <span className="inline-block mt-1.5 text-xs text-muted bg-surface px-2 py-0.5 rounded-full">
                    ⏱ {step.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DemarchesPage() {
  const { data, loading } = useData('demarches')

  if (loading) {
    return (
      <div className="px-4 py-5 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-border/40 h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  const procedures = data?.procedures || []

  return (
    <div className="px-4 py-5 flex flex-col gap-3">
      <div className="bg-demarches-light rounded-2xl px-4 py-3">
        <p className="text-sm text-text font-medium">
          📋 Clique sur une démarche pour voir les étapes détaillées.
        </p>
      </div>
      {procedures.map((proc) => (
        <ProcedureCard key={proc.id} procedure={proc} />
      ))}
    </div>
  )
}
