import type { Metadata } from 'next'
import { SettingsPanel } from '@/components/settings/SettingsPanel'

export const metadata: Metadata = {
  title: 'Settings',
}

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Protocol configuration and network connection settings.
        </p>
      </div>
      <SettingsPanel />
    </div>
  )
}
