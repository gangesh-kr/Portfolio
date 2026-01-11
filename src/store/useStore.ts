import { create } from 'zustand';

interface Project {
    id: number;
    title: string;
    description: string;
    timeline: string;
    role: string;
}

interface State {
    activeProject: Project | null;
    setActiveProject: (project: Project | null) => void;
}

export const useStore = create<State>((set) => ({
    activeProject: null,
    setActiveProject: (project) => set({ activeProject: project }),
}));

// Mock Data for now
export const PROJECTS: Project[] = [
    { id: 0, title: "NEURAL_INTERFACE", description: "Brain-Computer Interface Dashboard", timeline: "2024", role: "Lead Engineer" },
    { id: 1, title: "QUANTUM_FINANCE", description: "HFT Visualizer in WebGL", timeline: "2023", role: "Frontend Architect" },
    { id: 2, title: "CYBER_SECURITY", description: "Threat map and penetration testing tools", timeline: "2025", role: "Fullstack" },
    { id: 3, title: "SMART_CITY", description: "IoT Traffic Management System", timeline: "2024", role: "UX Developer" },
    { id: 4, title: "ORBITAL_STATION", description: "NASA Space Apps Challenge Winner", timeline: "2023", role: "Solo Dev" },
];
