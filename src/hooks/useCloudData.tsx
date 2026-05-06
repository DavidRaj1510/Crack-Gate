import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { StudyEntry } from "@/components/StudyTimer";

type ProgressMap = Record<string, boolean>;

type Ctx = {
  loaded: boolean;
  progress: ProgressMap;
  toggleTopic: (topicId: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  studyLog: StudyEntry[];
  addStudyEntry: (e: StudyEntry) => Promise<void>;
};

const CloudCtx = createContext<Ctx>({
  loaded: false, progress: {}, toggleTopic: async () => {}, resetProgress: async () => {},
  studyLog: [], addStudyEntry: async () => {},
});

export function CloudDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [studyLog, setStudyLog] = useState<StudyEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setProgress({}); setStudyLog([]); setLoaded(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [p, l] = await Promise.all([
        supabase.from("user_progress").select("topic_id, done").eq("user_id", user.id),
        supabase.from("study_log").select("date, subject, topic, minutes").eq("user_id", user.id).order("date", { ascending: true }),
      ]);
      if (cancelled) return;
      const map: ProgressMap = {};
      (p.data ?? []).forEach((r: any) => { if (r.done) map[r.topic_id] = true; });
      setProgress(map);
      setStudyLog((l.data ?? []) as StudyEntry[]);
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const toggleTopic = useCallback(async (topicId: string) => {
    if (!user) return;
    const next = !progress[topicId];
    setProgress((p) => ({ ...p, [topicId]: next }));
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
    await supabase.from("user_progress").delete().eq("user_id", user.id);
  }, [user]);

  const addStudyEntry = useCallback(async (e: StudyEntry) => {
    if (!user) return;
    setStudyLog((prev) => [...prev, e]);
    await supabase.from("study_log").insert({ ...e, user_id: user.id });
  }, [user]);

  return (
    <CloudCtx.Provider value={{ loaded, progress, toggleTopic, resetProgress, studyLog, addStudyEntry }}>
      {children}
    </CloudCtx.Provider>
  );
}

export const useCloudData = () => useContext(CloudCtx);