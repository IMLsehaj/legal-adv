import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

export type DocStatus = 'approved' | 'corrections' | 'pending';

export type DocumentRecord = {
  _id?: string;
  id?: number;
  name: string;
  status: DocStatus;
  score: number | null;
  date: string; // display date
  type: string;
};

type ResultsContextValue = {
  documents: DocumentRecord[];
  activity: number[]; // percentage bars for recent activity
  addDocument: (d: DocumentRecord) => void;
  clearDocuments: () => void;
};

const ResultsContext = createContext<ResultsContextValue | undefined>(undefined);

const initialDocs: DocumentRecord[] = [];

const initialActivity: number[] = [];

export const ResultsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocs);
  const [activity, setActivity] = useState<number[]>(initialActivity);

  // Load the specific user's data when they log in
  useEffect(() => {
    if (user) {
      try {
        const rawDocs = localStorage.getItem(`results.documents.${user._id}`);
        setDocuments(rawDocs ? JSON.parse(rawDocs) : initialDocs);

        const rawAct = localStorage.getItem(`results.activity.${user._id}`);
        setActivity(rawAct ? JSON.parse(rawAct) : initialActivity);
      } catch (e) {
        setDocuments(initialDocs);
        setActivity(initialActivity);
      }
    } else {
      // Clear the dashboard when the user logs out
      setDocuments([]);
      setActivity([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`results.documents.${user._id}`, JSON.stringify(documents));
        localStorage.setItem(`results.activity.${user._id}`, JSON.stringify(activity));
      } catch (e) {
        // ignore
      }
    }
  }, [documents, activity, user]);

  const addDocument = useCallback((d: DocumentRecord) => {
    setDocuments((prev) => [d, ...prev]);
    // update activity: append to the end for left-to-right chronological display
    const value = d.score !== null && d.score !== undefined ? Math.max(0, Math.min(100, d.score)) : 50;
    setActivity((prev) => {
      const next = [...prev, value].slice(-12);
      return next;
    });
  }, []);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
    setActivity([]);
  }, []);

  const contextValue = useMemo(
    () => ({ documents, activity, addDocument, clearDocuments }),
    [documents, activity, addDocument, clearDocuments]
  );

  return (
    <ResultsContext.Provider value={contextValue}>
      {children}
    </ResultsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useResults = () => {
  const ctx = useContext(ResultsContext);
  if (!ctx) throw new Error('useResults must be used within ResultsProvider');
  return ctx;
};

export default ResultsContext;
