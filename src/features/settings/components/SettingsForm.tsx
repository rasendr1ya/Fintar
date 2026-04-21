"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateProfile } from "../actions";
import { logoutUser } from "@/features/auth/actions";

interface SettingsFormProps {
  initialUsername: string | null;
  initialEmail: string | undefined;
}

export function SettingsForm({ initialUsername, initialEmail }: SettingsFormProps) {
  const [username, setUsername] = useState(initialUsername || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("username", username);

    const result = await updateProfile(formData);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Account Settings */}
      <section className="bg-white p-6 rounded-2xl border-2 border-border">
        <h2 className="text-xl font-bold text-text mb-4">Account Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-muted mb-1">Email</label>
            <input 
              type="email" 
              value={initialEmail || ""} 
              disabled 
              className="w-full p-3 rounded-xl border-2 border-border bg-gray-100 text-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-muted mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm font-bold ${message.type === "success" ? "bg-success/10 text-success" : "bg-hearts/10 text-hearts"}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || username === initialUsername}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </section>

      {/* Preferences (Mock) */}
      <section className="bg-white p-6 rounded-2xl border-2 border-border">
        <h2 className="text-xl font-bold text-text mb-4">Preferences</h2>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-text">Sound Effects</p>
                    <p className="text-sm text-muted">Play sounds during lessons</p>
                </div>
                <div className="w-12 h-6 bg-success rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-text">Haptic Feedback</p>
                    <p className="text-sm text-muted">Vibrate on mistakes</p>
                </div>
                <div className="w-12 h-6 bg-success rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
            </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white p-6 rounded-2xl border-2 border-border">
        <h2 className="text-xl font-bold text-hearts mb-4">Danger Zone</h2>
        <Button 
            onClick={() => logoutUser()} 
            className="w-full bg-red-100 text-hearts border-red-200 hover:bg-red-200 hover:border-red-300"
        >
            Sign Out
        </Button>
      </section>
    </div>
  );
}