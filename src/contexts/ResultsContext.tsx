import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type DocStatus = 'approved' | 'corrections' | 'pending';

export type DocumentRecord = {
  id: number;
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

const initialDocs: DocumentRecord[] = [
  { id: 1, name: 'Rent_Agreement_v2.pdf', status: 'approved', score: 94, date: 'Mar 25, 2026', type: 'Property' },
  { id: 2, name: 'FIR_Complaint.pdf', status: 'corrections', score: 67, date: 'Mar 24, 2026', type: 'Criminal' },
  { id: 3, name: 'NDA_Draft.docx', status: 'pending', score: null, date: 'Mar 23, 2026', type: 'Business' },
  { id: 4, name: 'Power_of_Attorney.pdf', status: 'approved', score: 88, date: 'Mar 22, 2026', type: 'Personal' },
  { id: 5, name: 'Sale_Deed_Plot42.pdf', status: 'corrections', score: 72, date: 'Mar 20, 2026', type: 'Property' },
  { id: 6, name: 'Employment_Contract.pdf', status: 'approved', score: 91, date: 'Mar 18, 2026', type: 'Business' },
];

const initialActivity = [40, 65, 55, 80, 70, 90, 60, 85, 75, 95, 50, 78];

export const ResultsProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    try {
      const raw = localStorage.getItem('results.documents');
      if (raw) return JSON.parse(raw) as DocumentRecord[];
    } catch (e) {
      // ignore
    }
    return initialDocs;
  });

  const [activity, setActivity] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem('results.activity');
      if (raw) return JSON.parse(raw) as number[];
    } catch (e) {
      // ignore
    }
    return initialActivity;
  });

  useEffect(() => {
    try {
      localStorage.setItem('results.documents', JSON.stringify(documents));
      localStorage.setItem('results.activity', JSON.stringify(activity));
    } catch (e) {
      // ignore
    }
  }, [documents, activity]);

  const addDocument = (d: DocumentRecord) => {
    setDocuments((prev) => [d, ...prev]);
    // update activity: shift and add based on score (or 50 if null)
    const value = d.score !== null && d.score !== undefined ? Math.max(0, Math.min(100, d.score)) : 50;
    setActivity((prev) => {
      const next = [value, ...prev].slice(0, 12);
      return next;
    });
  };

  const clearDocuments = () => {
    setDocuments([]);
    setActivity([]);
  };

  return (
    <ResultsContext.Provider value={{ documents, activity, addDocument, clearDocuments }}>
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
