import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { StudyEntry } from "@/components/StudyTimer";

type ProgressMap = Record<string, boolean>;
type ProgressEntry = { topic_id: string; date: string }; // YYYY-MM-DD when completed

type Ctx = {
  loaded: boolean;
  progress: ProgressMap;
  progressEntries: ProgressEntry[];
  toggleTopic: (topicId: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  studyLog: StudyEntry[];
  addStudyEntry: (e: StudyEntry) => Promise<void>;
};

const CloudCtx = createContext<Ctx>({
  loaded: false, progress: {}, progressEntries: [], toggleTopic: async () => {}, resetProgress: async () => {},
  studyLog: [], addStudyEntry: async () => {},
});

export function CloudDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [studyLog, setStudyLog] = useState<StudyEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setProgress({}); setProgressEntries([]); setStudyLog([]); setLoaded(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [p, l] = await Promise.all([
        supabase.from("user_progress").select("topic_id, done, updated_at").eq("user_id", user.id),
        supabase.from("study_log").select("date, subject, topic, minutes").eq("user_id", user.id).order("date", { ascending: true }),
      ]);
      if (cancelled) return;
      const map: ProgressMap = {};
      const entries: ProgressEntry[] = [];
      (p.data ?? []).forEach((r: any) => {
        if (r.done) {
          map[r.topic_id] = true;
          const d = r.updated_at ? new Date(r.updated_at) : new Date();
          entries.push({ topic_id: r.topic_id, date: d.toISOString().slice(0, 10) });
        }
      });
      setProgress(map);
      setProgressEntries(entries);
      setStudyLog((l.data ?? []) as StudyEntry[]);
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const toggleTopic = useCallback(async (topicId: string) => {
    if (!user) return;
    const next = !progress[topicId];
    setProgress((p) => ({ ...p, [topicId]: next }));
    const today = new Date().toISOString().slice(0, 10);
    if (next) {
      setProgressEntries((prev) => [...prev.filter((e) => e.topic_id !== topicId), { topic_id: topicId, date: today }]);
    } else {
      setProgressEntries((prev) => prev.filter((e) => e.topic_id !== topicId));
    }
    if (next) {
      await supabase.from("user_progress").upsert(
        { user_id: user.id, topic_id: topicId, done: true, updated_at: new Date().toISOString() },
        { onConflict: "user_id,topic_id" },
      );
    } else {
      await supabase.from("user_progress").delete().eq("user_id", user.id).eq("topic_id", topicId);
    }
  }, [user, progress]);

  const resetProgress = useCallback(async () => {
    if (!user) return;
    setProgress({});
    setProgressEntries([]);
    await supabase.from("user_progress").delete().eq("user_id", user.id);
  }, [user]);

  const addStudyEntry = useCallback(async (e: StudyEntry) => {
    if (!user) return;
    setStudyLog((prev) => [...prev, e]);
    await supabase.from("study_log").insert({ ...e, user_id: user.id });
  }, [user]);

  return (
    <CloudCtx.Provider value={{ loaded, progress, progressEntries, toggleTopic, resetProgress, studyLog, addStudyEntry }}>
      {children}
    </CloudCtx.Provider>
  );
}

export const useCloudData = () => useContext(CloudCtx);