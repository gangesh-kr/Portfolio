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

export const PROJECTS: Project[] = [
    { id: 0, title: "BARG-AI", description: "India's first AI-powered Universal Commerce Platform — a WhatsApp-native AI shopping assistant for real-time cross-platform price comparison and order automation across Amazon, Flipkart, Blinkit, Zepto, and 10+ platforms.", timeline: "2025 – Present", role: "Founder & Product Architect" },
    { id: 1, title: "BCG_PLATFORM", description: "Boilerplate code generation platform for customizable Three.js-powered 3D model viewer apps, supporting React, Angular, Express.js, NestJS with multi-format support including .glb, .stl, and .drc files.", timeline: "2025", role: "SDE @ AMC Bridge" },
    { id: 2, title: "CONSTRUCTION_3D", description: "Web app for creating mechanical assemblies from prefabricated aluminum extrusions in 3D, featuring real-time BOM calculation, automated fastener placement, snapping validation, and STEP file export.", timeline: "2025", role: "SDE @ AMC Bridge" },
    { id: 3, title: "OTISHEALTH", description: "FHIR-compliant healthcare web application for a leading US client serving 50,000+ users, built on a microservices monorepo architecture with MySQL and GCP.", timeline: "2022 – 2024", role: "Consultant Software Developer" },
    { id: 4, title: "ENTERPRISE_HRMS", description: "End-to-end HRMS and CRM platform with 6 core modules — dashboards, task management, ticketing, onboarding, and examination systems — eliminating 70% paperwork across HR operations.", timeline: "2024 – 2025", role: "Full Stack Engineer" },
];
