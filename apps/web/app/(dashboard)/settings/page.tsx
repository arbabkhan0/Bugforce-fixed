import { Settings2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Account</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and workspace preferences.
        </p>
      </div>

      <Card className="flex flex-col items-center gap-4 py-14 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-muted">
          <Settings2 size={26} className="text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold">Settings coming soon</p>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">
            Profile preferences are available through the API and will appear here as the workspace
            grows.
          </p>
        </div>
      </Card>
    </div>
  );
}
