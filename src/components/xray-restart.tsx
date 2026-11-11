import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restartXray } from "@/lib/xray-restart";

export function XrayRestart() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  return <div>
    <Button variant="outline" className="min-h-12 w-full" onClick={() => {
      try {
        restartXray();
        void navigate({ to: "/audit" });
      } catch { setError(true); }
    }}><RotateCcw aria-hidden="true" />Try X-Ray again</Button>
    {error && <p role="alert" className="mt-2 text-sm text-destructive">We couldn’t start a fresh X-Ray. Please try again.</p>}
  </div>;
}