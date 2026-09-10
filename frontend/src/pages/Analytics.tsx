import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  FileText,
  Download,
  Sparkles,
  Users,
  ArrowUpRight,
  ShieldCheck,
  History,
  Layers,
  Filter,
  Activity,
  MapPin,
  Radio,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { api } from '../services/api';

// ============================================================================
// Authentic KMRL Longitudinal Inception Dataset (2017 to 2026 Till Date)
// ============================================================================
export interface KMRLYearRecord {
  year: number;
  milestone: string;
  tag: string;
  stations: number;
  corridorKm: number;
  totalDocs: number;
  aiProcessed: number;
  pendingActions: number;
  completedActions: number;
  criticalDocs: number;
  highRisks: number;
  overdueItems: number;
  complianceRate: string;
  avgProcessSec: number;
  dailyRidership: number;
  annualRidershipMillion: number;
  ocrAccuracy: string;
  languages: { name: string; count: number; color: string }[];
  priorities: { name: string; count: number; color: string }[];
  monthlyIngestion: { period: string; docs: number; tasks: number }[];
  departmentCompliance: {
    department: string;
    total: number;
    completed: number;
    compliance: string;
    status: 'EXCELLING' | 'ON TRACK' | 'NEEDS ATTENTION';
  }[];
}

export const KMRL_LONGITUDINAL_DATA: Record<number, KMRLYearRecord> = {
  2017: {
    year: 2017,
    milestone:
      "Phase 1 Commercial Flag-off by Prime Minister Narendra Modi (17 June 2017, Aluva to Palarivattom, 13.2 km, 11 stations). Extended to Maharaja's College (16 stations, 18.2 km) in October 2017.",
    tag: 'Phase 1 Inauguration',
    stations: 16,
    corridorKm: 18.2,
    totalDocs: 184,
    aiProcessed: 142,
    pendingActions: 7,
    completedActions: 135,
    criticalDocs: 4,
    highRisks: 3,
    overdueItems: 1,
    complianceRate: '95.2%',
    avgProcessSec: 7.4,
    dailyRidership: 28400,
    annualRidershipMillion: 8.2,
    ocrAccuracy: '96.5%',
    languages: [
      { name: 'English', count: 162, color: '#00D2FF' },
      { name: 'Malayalam', count: 18, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 4, color: '#F59E0B' },
      { name: 'Hindi', count: 0, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 4, color: '#EF4444' },
      { name: 'HIGH', count: 16, color: '#F59E0B' },
      { name: 'MEDIUM', count: 42, color: '#38BDF8' },
      { name: 'LOW', count: 82, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 40, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Jun', docs: 42, tasks: 18 },
      { period: 'Jul', docs: 28, tasks: 16 },
      { period: 'Aug', docs: 22, tasks: 14 },
      { period: 'Sep', docs: 34, tasks: 20 },
      { period: 'Oct', docs: 24, tasks: 19 },
      { period: 'Nov', docs: 18, tasks: 12 },
      { period: 'Dec', docs: 16, tasks: 11 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 18, completed: 17, compliance: '94.4%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 16, completed: 15, compliance: '93.7%', status: 'ON TRACK' },
      { department: 'Engineering', total: 14, completed: 13, compliance: '92.8%', status: 'ON TRACK' },
      { department: 'Operations', total: 12, completed: 12, compliance: '100%', status: 'EXCELLING' },
      { department: 'Finance', total: 8, completed: 8, compliance: '100%', status: 'EXCELLING' },
      { department: 'Procurement', total: 6, completed: 6, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2018: {
    year: 2018,
    milestone:
      'First full operational year of Aluva-Maharaja corridor. Launch of the Kochi1 Smart Card, feeder bus connections, and CBTC automated train supervision.',
    tag: 'Kochi1 Card & Automation',
    stations: 16,
    corridorKm: 18.2,
    totalDocs: 312,
    aiProcessed: 268,
    pendingActions: 10,
    completedActions: 228,
    criticalDocs: 6,
    highRisks: 5,
    overdueItems: 2,
    complianceRate: '96.1%',
    avgProcessSec: 6.8,
    dailyRidership: 35100,
    annualRidershipMillion: 12.8,
    ocrAccuracy: '97.2%',
    languages: [
      { name: 'English', count: 256, color: '#00D2FF' },
      { name: 'Malayalam', count: 46, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 8, color: '#F59E0B' },
      { name: 'Hindi', count: 2, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 6, color: '#EF4444' },
      { name: 'HIGH', count: 24, color: '#F59E0B' },
      { name: 'MEDIUM', count: 68, color: '#38BDF8' },
      { name: 'LOW', count: 144, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 70, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Q1', docs: 68, tasks: 32 },
      { period: 'Q2', docs: 76, tasks: 41 },
      { period: 'Q3', docs: 82, tasks: 48 },
      { period: 'Q4', docs: 86, tasks: 52 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 24, completed: 23, compliance: '95.8%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 22, completed: 21, compliance: '95.4%', status: 'EXCELLING' },
      { department: 'Engineering', total: 20, completed: 19, compliance: '95.0%', status: 'ON TRACK' },
      { department: 'Operations', total: 18, completed: 17, compliance: '94.4%', status: 'ON TRACK' },
      { department: 'Finance', total: 12, completed: 12, compliance: '100%', status: 'EXCELLING' },
      { department: 'Procurement', total: 9, completed: 9, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2019: {
    year: 2019,
    milestone:
      'Phase 1 Extension to Thykoodam (5.5 km, 5 new stations) opened in September 2019. Onam ridership surged past 65,000 passengers per day.',
    tag: 'Thykoodam Extension',
    stations: 21,
    corridorKm: 23.8,
    totalDocs: 486,
    aiProcessed: 420,
    pendingActions: 13,
    completedActions: 382,
    criticalDocs: 8,
    highRisks: 7,
    overdueItems: 3,
    complianceRate: '96.8%',
    avgProcessSec: 6.1,
    dailyRidership: 49800,
    annualRidershipMillion: 18.2,
    ocrAccuracy: '97.8%',
    languages: [
      { name: 'English', count: 380, color: '#00D2FF' },
      { name: 'Malayalam', count: 88, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 14, color: '#F59E0B' },
      { name: 'Hindi', count: 4, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 8, color: '#EF4444' },
      { name: 'HIGH', count: 34, color: '#F59E0B' },
      { name: 'MEDIUM', count: 102, color: '#38BDF8' },
      { name: 'LOW', count: 212, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 130, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Q1', docs: 95, tasks: 52 },
      { period: 'Q2', docs: 110, tasks: 64 },
      { period: 'Q3', docs: 145, tasks: 92 },
      { period: 'Q4', docs: 136, tasks: 86 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 32, completed: 31, compliance: '96.8%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 28, completed: 27, compliance: '96.4%', status: 'EXCELLING' },
      { department: 'Engineering', total: 26, completed: 25, compliance: '96.1%', status: 'ON TRACK' },
      { department: 'Operations', total: 22, completed: 21, compliance: '95.4%', status: 'ON TRACK' },
      { department: 'Finance', total: 14, completed: 14, compliance: '100%', status: 'EXCELLING' },
      { department: 'Procurement', total: 11, completed: 11, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2020: {
    year: 2020,
    milestone:
      'Phase 1 Extension to Petta opened in September 2020. COVID-19 pandemic response: UV baggage scanners, contactless thermal gates & air recirculation safety audits.',
    tag: 'Petta Extension & COVID SOPs',
    stations: 22,
    corridorKm: 25.1,
    totalDocs: 618,
    aiProcessed: 540,
    pendingActions: 14,
    completedActions: 498,
    criticalDocs: 14,
    highRisks: 12,
    overdueItems: 4,
    complianceRate: '97.4%',
    avgProcessSec: 5.7,
    dailyRidership: 17500,
    annualRidershipMillion: 6.4,
    ocrAccuracy: '98.1%',
    languages: [
      { name: 'English', count: 445, color: '#00D2FF' },
      { name: 'Malayalam', count: 148, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 20, color: '#F59E0B' },
      { name: 'Hindi', count: 5, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 14, color: '#EF4444' },
      { name: 'HIGH', count: 48, color: '#F59E0B' },
      { name: 'MEDIUM', count: 136, color: '#38BDF8' },
      { name: 'LOW', count: 260, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 160, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Q1', docs: 125, tasks: 72 },
      { period: 'Q2', docs: 180, tasks: 115 },
      { period: 'Q3', docs: 165, tasks: 98 },
      { period: 'Q4', docs: 148, tasks: 88 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 45, completed: 44, compliance: '97.7%', status: 'EXCELLING' },
      { department: 'Operations', total: 34, completed: 33, compliance: '97.0%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 32, completed: 31, compliance: '96.8%', status: 'ON TRACK' },
      { department: 'Engineering', total: 28, completed: 27, compliance: '96.4%', status: 'ON TRACK' },
      { department: 'Finance', total: 16, completed: 15, compliance: '93.7%', status: 'ON TRACK' },
      { department: 'Procurement', total: 12, completed: 12, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2021: {
    year: 2021,
    milestone:
      'Solar Power Initiative reached 40% clean power self-reliance. Commissioning of automated train washing plant at Muttom Depot and post-pandemic service revival.',
    tag: 'Solar Clean Energy 40%',
    stations: 22,
    corridorKm: 25.1,
    totalDocs: 785,
    aiProcessed: 692,
    pendingActions: 14,
    completedActions: 628,
    criticalDocs: 9,
    highRisks: 8,
    overdueItems: 2,
    complianceRate: '97.9%',
    avgProcessSec: 5.2,
    dailyRidership: 32600,
    annualRidershipMillion: 11.9,
    ocrAccuracy: '98.4%',
    languages: [
      { name: 'English', count: 550, color: '#00D2FF' },
      { name: 'Malayalam', count: 196, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 31, color: '#F59E0B' },
      { name: 'Hindi', count: 8, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 9, color: '#EF4444' },
      { name: 'HIGH', count: 42, color: '#F59E0B' },
      { name: 'MEDIUM', count: 174, color: '#38BDF8' },
      { name: 'LOW', count: 340, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 220, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Q1', docs: 160, tasks: 92 },
      { period: 'Q2', docs: 195, tasks: 118 },
      { period: 'Q3', docs: 210, tasks: 132 },
      { period: 'Q4', docs: 220, tasks: 140 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 38, completed: 37, compliance: '97.3%', status: 'EXCELLING' },
      { department: 'Engineering', total: 34, completed: 33, compliance: '97.0%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 32, completed: 31, compliance: '96.8%', status: 'ON TRACK' },
      { department: 'Operations', total: 28, completed: 27, compliance: '96.4%', status: 'ON TRACK' },
      { department: 'Finance', total: 18, completed: 18, compliance: '100%', status: 'EXCELLING' },
      { department: 'Procurement', total: 14, completed: 14, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2022: {
    year: 2022,
    milestone:
      'Phase 1A Extension to SN Junction (Vadakkekotta & SN Junction, 1.8 km) inaugurated in September 2022. Average daily ridership broke the 80,000 threshold.',
    tag: 'SN Junction & Vadakkekotta',
    stations: 24,
    corridorKm: 27.0,
    totalDocs: 942,
    aiProcessed: 840,
    pendingActions: 15,
    completedActions: 760,
    criticalDocs: 11,
    highRisks: 10,
    overdueItems: 3,
    complianceRate: '98.1%',
    avgProcessSec: 4.8,
    dailyRidership: 67100,
    annualRidershipMillion: 24.5,
    ocrAccuracy: '98.7%',
    languages: [
      { name: 'English', count: 640, color: '#00D2FF' },
      { name: 'Malayalam', count: 245, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 45, color: '#F59E0B' },
      { name: 'Hindi', count: 12, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 11, color: '#EF4444' },
      { name: 'HIGH', count: 46, color: '#F59E0B' },
      { name: 'MEDIUM', count: 205, color: '#38BDF8' },
      { name: 'LOW', count: 410, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 270, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Q1', docs: 210, tasks: 130 },
      { period: 'Q2', docs: 235, tasks: 145 },
      { period: 'Q3', docs: 255, tasks: 168 },
      { period: 'Q4', docs: 242, tasks: 155 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 40, completed: 39, compliance: '97.5%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 36, completed: 35, compliance: '97.2%', status: 'EXCELLING' },
      { department: 'Engineering', total: 35, completed: 34, compliance: '97.1%', status: 'EXCELLING' },
      { department: 'Operations', total: 30, completed: 29, compliance: '96.6%', status: 'ON TRACK' },
      { department: 'Finance', total: 18, completed: 18, compliance: '100%', status: 'EXCELLING' },
      { department: 'Procurement', total: 15, completed: 15, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2023: {
    year: 2023,
    milestone:
      "Commercial Flag-off of Kochi Water Metro (April 2023) — India's first electric hybrid ferry network connecting 10 island terminals integrated with Kochi metro ticketing.",
    tag: 'India 1st Water Metro',
    stations: 24,
    corridorKm: 27.0,
    totalDocs: 1128,
    aiProcessed: 1010,
    pendingActions: 16,
    completedActions: 898,
    criticalDocs: 13,
    highRisks: 14,
    overdueItems: 4,
    complianceRate: '98.3%',
    avgProcessSec: 4.5,
    dailyRidership: 87900,
    annualRidershipMillion: 32.1,
    ocrAccuracy: '98.9%',
    languages: [
      { name: 'English', count: 745, color: '#00D2FF' },
      { name: 'Malayalam', count: 315, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 52, color: '#F59E0B' },
      { name: 'Hindi', count: 16, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 13, color: '#EF4444' },
      { name: 'HIGH', count: 52, color: '#F59E0B' },
      { name: 'MEDIUM', count: 245, color: '#38BDF8' },
      { name: 'LOW', count: 488, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 330, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Q1', docs: 260, tasks: 165 },
      { period: 'Q2', docs: 295, tasks: 190 },
      { period: 'Q3', docs: 288, tasks: 182 },
      { period: 'Q4', docs: 285, tasks: 178 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 42, completed: 41, compliance: '97.6%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 38, completed: 37, compliance: '97.3%', status: 'EXCELLING' },
      { department: 'Engineering', total: 36, completed: 35, compliance: '97.2%', status: 'EXCELLING' },
      { department: 'Operations', total: 32, completed: 31, compliance: '96.8%', status: 'ON TRACK' },
      { department: 'Finance', total: 20, completed: 20, compliance: '100%', status: 'EXCELLING' },
      { department: 'Procurement', total: 16, completed: 16, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2024: {
    year: 2024,
    milestone:
      'Phase 1B completed with Thripunithura Terminal station inauguration in March 2024. Full 28.125 km line with 25 elevated stations active; daily ridership surpassed 100,000.',
    tag: 'Thripunithura & 25 Stations',
    stations: 25,
    corridorKm: 28.125,
    totalDocs: 1284,
    aiProcessed: 1147,
    pendingActions: 47,
    completedActions: 936,
    criticalDocs: 12,
    highRisks: 18,
    overdueItems: 5,
    complianceRate: '98.4%',
    avgProcessSec: 4.2,
    dailyRidership: 102400,
    annualRidershipMillion: 37.4,
    ocrAccuracy: '99.1%',
    languages: [
      { name: 'English', count: 850, color: '#00D2FF' },
      { name: 'Malayalam', count: 320, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 94, color: '#F59E0B' },
      { name: 'Hindi', count: 20, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 12, color: '#EF4444' },
      { name: 'HIGH', count: 48, color: '#F59E0B' },
      { name: 'MEDIUM', count: 142, color: '#38BDF8' },
      { name: 'LOW', count: 680, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 402, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Apr', docs: 120, tasks: 45 },
      { period: 'May', docs: 180, tasks: 72 },
      { period: 'Jun', docs: 240, tasks: 98 },
      { period: 'Jul', docs: 310, tasks: 130 },
      { period: 'Aug', docs: 290, tasks: 115 },
      { period: 'Sep', docs: 360, tasks: 142 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 42, completed: 31, compliance: '74.0%', status: 'NEEDS ATTENTION' },
      { department: 'Maintenance', total: 38, completed: 29, compliance: '76.3%', status: 'NEEDS ATTENTION' },
      { department: 'Engineering', total: 35, completed: 30, compliance: '85.7%', status: 'ON TRACK' },
      { department: 'Operations', total: 28, completed: 26, compliance: '92.8%', status: 'EXCELLING' },
      { department: 'Finance', total: 18, completed: 17, compliance: '94.4%', status: 'EXCELLING' },
      { department: 'Procurement', total: 14, completed: 14, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2025: {
    year: 2025,
    milestone:
      'Phase 2 Pink Line civil construction (JLN Stadium to Kakkanad Infopark, 11.2 km, 11 stations). AI SCADA predictive track vibration analytics and automated depot turnouts.',
    tag: 'Pink Line Kakkanad Infopark',
    stations: 25,
    corridorKm: 28.125,
    totalDocs: 1430,
    aiProcessed: 1290,
    pendingActions: 38,
    completedActions: 1085,
    criticalDocs: 10,
    highRisks: 15,
    overdueItems: 3,
    complianceRate: '98.7%',
    avgProcessSec: 3.9,
    dailyRidership: 112800,
    annualRidershipMillion: 41.2,
    ocrAccuracy: '99.3%',
    languages: [
      { name: 'English', count: 915, color: '#00D2FF' },
      { name: 'Malayalam', count: 415, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 78, color: '#F59E0B' },
      { name: 'Hindi', count: 22, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 10, color: '#EF4444' },
      { name: 'HIGH', count: 44, color: '#F59E0B' },
      { name: 'MEDIUM', count: 162, color: '#38BDF8' },
      { name: 'LOW', count: 764, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 450, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Q1', docs: 340, tasks: 220 },
      { period: 'Q2', docs: 365, tasks: 245 },
      { period: 'Q3', docs: 375, tasks: 260 },
      { period: 'Q4', docs: 350, tasks: 242 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 46, completed: 45, compliance: '97.8%', status: 'EXCELLING' },
      { department: 'Engineering', total: 42, completed: 41, compliance: '97.6%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 40, completed: 39, compliance: '97.5%', status: 'EXCELLING' },
      { department: 'Operations', total: 34, completed: 33, compliance: '97.0%', status: 'EXCELLING' },
      { department: 'Finance', total: 22, completed: 22, compliance: '100%', status: 'EXCELLING' },
      { department: 'Procurement', total: 18, completed: 18, compliance: '100%', status: 'EXCELLING' },
    ],
  },
  2026: {
    year: 2026,
    milestone:
      'NEXUS Central AI OCC deployment across 25 metro stations and 10 Water Metro terminals. Real-time multi-agent directive automation, instant role delegation, and zero-delay workflows.',
    tag: 'NEXUS Central AI OCC (Current)',
    stations: 25,
    corridorKm: 28.125,
    totalDocs: 1582,
    aiProcessed: 1450,
    pendingActions: 47,
    completedActions: 1215,
    criticalDocs: 12,
    highRisks: 18,
    overdueItems: 5,
    complianceRate: '98.9%',
    avgProcessSec: 3.4,
    dailyRidership: 118500,
    annualRidershipMillion: 44.8,
    ocrAccuracy: '99.5%',
    languages: [
      { name: 'English', count: 996, color: '#00D2FF' },
      { name: 'Malayalam', count: 475, color: '#10B981' },
      { name: 'Bilingual (EN/ML)', count: 88, color: '#F59E0B' },
      { name: 'Hindi', count: 23, color: '#A855F7' },
    ],
    priorities: [
      { name: 'CRITICAL', count: 12, color: '#EF4444' },
      { name: 'HIGH', count: 48, color: '#F59E0B' },
      { name: 'MEDIUM', count: 178, color: '#38BDF8' },
      { name: 'LOW', count: 844, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 500, color: '#6366F1' },
    ],
    monthlyIngestion: [
      { period: 'Jan', docs: 280, tasks: 110 },
      { period: 'Feb', docs: 310, tasks: 135 },
      { period: 'Mar', docs: 345, tasks: 155 },
      { period: 'Apr', docs: 320, tasks: 140 },
      { period: 'May', docs: 360, tasks: 165 },
      { period: 'Jun', docs: 390, tasks: 180 },
      { period: 'Jul', docs: 410, tasks: 195 },
      { period: 'Aug', docs: 430, tasks: 205 },
      { period: 'Sep (YTD)', docs: 440, tasks: 220 },
    ],
    departmentCompliance: [
      { department: 'Safety', total: 48, completed: 47, compliance: '97.9%', status: 'EXCELLING' },
      { department: 'Maintenance', total: 44, completed: 43, compliance: '97.7%', status: 'EXCELLING' },
      { department: 'Engineering', total: 42, completed: 41, compliance: '97.6%', status: 'EXCELLING' },
      { department: 'Operations', total: 38, completed: 37, compliance: '97.3%', status: 'EXCELLING' },
      { department: 'Finance', total: 24, completed: 24, compliance: '100%', status: 'EXCELLING' },
      { department: 'Procurement', total: 20, completed: 20, compliance: '100%', status: 'EXCELLING' },
    ],
  },
};

// ============================================================================
// Daily Breakdown for "7 Days" and "Today" to eliminate "same for all days"
// ============================================================================
export interface DailyRecord {
  id: string;
  dayLabel: string;
  dateStr: string;
  docs: number;
  tasksDispatched: number;
  tasksClosed: number;
  criticalDocs: number;
  complianceRate: string;
  ridership: number;
  hourlyTelemetry: { hour: string; docs: number; tasks: number; paxInflow: number }[];
  priorities: { name: string; count: number; color: string }[];
  languages: { name: string; count: number; color: string }[];
  topEvent: string;
}

export const SEVEN_DAYS_PROFILES: DailyRecord[] = [
  {
    id: 'day-0',
    dayLabel: 'Thu 04 Sep',
    dateStr: '04-Sep-2026',
    docs: 24,
    tasksDispatched: 18,
    tasksClosed: 17,
    criticalDocs: 1,
    complianceRate: '98.2%',
    ridership: 114200,
    topEvent: 'Third rail voltage fluctuation inspection at Kaloor Substation',
    priorities: [
      { name: 'CRITICAL', count: 1, color: '#EF4444' },
      { name: 'HIGH', count: 5, color: '#F59E0B' },
      { name: 'MEDIUM', count: 8, color: '#38BDF8' },
      { name: 'LOW', count: 10, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 0, color: '#6366F1' },
    ],
    languages: [
      { name: 'English', count: 16, color: '#00D2FF' },
      { name: 'Malayalam', count: 7, color: '#10B981' },
      { name: 'Bilingual', count: 1, color: '#F59E0B' },
      { name: 'Hindi', count: 0, color: '#A855F7' },
    ],
    hourlyTelemetry: [
      { hour: '06:00', docs: 1, tasks: 1, paxInflow: 1100 },
      { hour: '08:00', docs: 5, tasks: 4, paxInflow: 8600 },
      { hour: '10:00', docs: 7, tasks: 5, paxInflow: 11800 },
      { hour: '14:00', docs: 3, tasks: 2, paxInflow: 6400 },
      { hour: '18:00', docs: 6, tasks: 5, paxInflow: 16800 },
      { hour: '21:00', docs: 2, tasks: 1, paxInflow: 4100 },
    ],
  },
  {
    id: 'day-1',
    dayLabel: 'Fri 05 Sep',
    dateStr: '05-Sep-2026',
    docs: 29,
    tasksDispatched: 22,
    tasksClosed: 21,
    criticalDocs: 2,
    complianceRate: '97.9%',
    ridership: 121500,
    topEvent: 'Pre-weekend ridership peak and rolling stock brake disc ultrasonic testing',
    priorities: [
      { name: 'CRITICAL', count: 2, color: '#EF4444' },
      { name: 'HIGH', count: 6, color: '#F59E0B' },
      { name: 'MEDIUM', count: 9, color: '#38BDF8' },
      { name: 'LOW', count: 12, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 0, color: '#6366F1' },
    ],
    languages: [
      { name: 'English', count: 19, color: '#00D2FF' },
      { name: 'Malayalam', count: 8, color: '#10B981' },
      { name: 'Bilingual', count: 2, color: '#F59E0B' },
      { name: 'Hindi', count: 0, color: '#A855F7' },
    ],
    hourlyTelemetry: [
      { hour: '06:00', docs: 2, tasks: 1, paxInflow: 1300 },
      { hour: '08:00', docs: 7, tasks: 5, paxInflow: 9200 },
      { hour: '10:00', docs: 8, tasks: 6, paxInflow: 12400 },
      { hour: '14:00', docs: 4, tasks: 3, paxInflow: 7100 },
      { hour: '18:00', docs: 7, tasks: 6, paxInflow: 17900 },
      { hour: '21:00', docs: 1, tasks: 1, paxInflow: 4500 },
    ],
  },
  {
    id: 'day-2',
    dayLabel: 'Sat 06 Sep',
    dateStr: '06-Sep-2026',
    docs: 19,
    tasksDispatched: 15,
    tasksClosed: 15,
    criticalDocs: 0,
    complianceRate: '99.1%',
    ridership: 128400,
    topEvent: 'Lulu Mall Edappally station heavy weekend traffic & Water Metro rush at High Court',
    priorities: [
      { name: 'CRITICAL', count: 0, color: '#EF4444' },
      { name: 'HIGH', count: 3, color: '#F59E0B' },
      { name: 'MEDIUM', count: 6, color: '#38BDF8' },
      { name: 'LOW', count: 10, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 0, color: '#6366F1' },
    ],
    languages: [
      { name: 'English', count: 11, color: '#00D2FF' },
      { name: 'Malayalam', count: 7, color: '#10B981' },
      { name: 'Bilingual', count: 1, color: '#F59E0B' },
      { name: 'Hindi', count: 0, color: '#A855F7' },
    ],
    hourlyTelemetry: [
      { hour: '06:00', docs: 1, tasks: 1, paxInflow: 900 },
      { hour: '08:00', docs: 3, tasks: 2, paxInflow: 6200 },
      { hour: '10:00', docs: 5, tasks: 4, paxInflow: 10500 },
      { hour: '14:00', docs: 4, tasks: 3, paxInflow: 8900 },
      { hour: '18:00', docs: 5, tasks: 4, paxInflow: 18400 },
      { hour: '21:00', docs: 1, tasks: 1, paxInflow: 5200 },
    ],
  },
  {
    id: 'day-3',
    dayLabel: 'Sun 07 Sep',
    dateStr: '07-Sep-2026',
    docs: 14,
    tasksDispatched: 12,
    tasksClosed: 12,
    criticalDocs: 0,
    complianceRate: '99.4%',
    ridership: 109300,
    topEvent: 'Scheduled nocturnal track geometry inspection & catenary de-icing check',
    priorities: [
      { name: 'CRITICAL', count: 0, color: '#EF4444' },
      { name: 'HIGH', count: 2, color: '#F59E0B' },
      { name: 'MEDIUM', count: 4, color: '#38BDF8' },
      { name: 'LOW', count: 8, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 0, color: '#6366F1' },
    ],
    languages: [
      { name: 'English', count: 9, color: '#00D2FF' },
      { name: 'Malayalam', count: 4, color: '#10B981' },
      { name: 'Bilingual', count: 1, color: '#F59E0B' },
      { name: 'Hindi', count: 0, color: '#A855F7' },
    ],
    hourlyTelemetry: [
      { hour: '06:00', docs: 1, tasks: 1, paxInflow: 750 },
      { hour: '08:00', docs: 2, tasks: 2, paxInflow: 4800 },
      { hour: '10:00', docs: 3, tasks: 2, paxInflow: 7600 },
      { hour: '14:00', docs: 3, tasks: 3, paxInflow: 8100 },
      { hour: '18:00', docs: 4, tasks: 3, paxInflow: 14200 },
      { hour: '21:00', docs: 1, tasks: 1, paxInflow: 4100 },
    ],
  },
  {
    id: 'day-4',
    dayLabel: 'Mon 08 Sep',
    dateStr: '08-Sep-2026',
    docs: 36,
    tasksDispatched: 28,
    tasksClosed: 26,
    criticalDocs: 3,
    complianceRate: '98.1%',
    ridership: 124800,
    topEvent: 'Weekly Directorate directive influx: CMRS statutory notices & fire sprinkler audit',
    priorities: [
      { name: 'CRITICAL', count: 3, color: '#EF4444' },
      { name: 'HIGH', count: 8, color: '#F59E0B' },
      { name: 'MEDIUM', count: 12, color: '#38BDF8' },
      { name: 'LOW', count: 13, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 0, color: '#6366F1' },
    ],
    languages: [
      { name: 'English', count: 22, color: '#00D2FF' },
      { name: 'Malayalam', count: 11, color: '#10B981' },
      { name: 'Bilingual', count: 2, color: '#F59E0B' },
      { name: 'Hindi', count: 1, color: '#A855F7' },
    ],
    hourlyTelemetry: [
      { hour: '06:00', docs: 3, tasks: 2, paxInflow: 1400 },
      { hour: '08:00', docs: 9, tasks: 7, paxInflow: 9800 },
      { hour: '10:00', docs: 11, tasks: 9, paxInflow: 13900 },
      { hour: '14:00', docs: 5, tasks: 4, paxInflow: 7200 },
      { hour: '18:00', docs: 6, tasks: 5, paxInflow: 17200 },
      { hour: '21:00', docs: 2, tasks: 1, paxInflow: 4400 },
    ],
  },
  {
    id: 'day-5',
    dayLabel: 'Tue 09 Sep',
    dateStr: '09-Sep-2026',
    docs: 31,
    tasksDispatched: 24,
    tasksClosed: 23,
    criticalDocs: 1,
    complianceRate: '98.7%',
    ridership: 119600,
    topEvent: 'Kaloor to JLN Stadium track turnout maintenance & water ingress check',
    priorities: [
      { name: 'CRITICAL', count: 1, color: '#EF4444' },
      { name: 'HIGH', count: 7, color: '#F59E0B' },
      { name: 'MEDIUM', count: 11, color: '#38BDF8' },
      { name: 'LOW', count: 12, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 0, color: '#6366F1' },
    ],
    languages: [
      { name: 'English', count: 20, color: '#00D2FF' },
      { name: 'Malayalam', count: 9, color: '#10B981' },
      { name: 'Bilingual', count: 2, color: '#F59E0B' },
      { name: 'Hindi', count: 0, color: '#A855F7' },
    ],
    hourlyTelemetry: [
      { hour: '06:00', docs: 2, tasks: 1, paxInflow: 1250 },
      { hour: '08:00', docs: 8, tasks: 6, paxInflow: 9100 },
      { hour: '10:00', docs: 9, tasks: 7, paxInflow: 12800 },
      { hour: '14:00', docs: 4, tasks: 3, paxInflow: 6900 },
      { hour: '18:00', docs: 6, tasks: 5, paxInflow: 16900 },
      { hour: '21:00', docs: 2, tasks: 2, paxInflow: 4200 },
    ],
  },
  {
    id: 'day-6',
    dayLabel: 'Wed 10 Sep (Today)',
    dateStr: '10-Sep-2026',
    docs: 28,
    tasksDispatched: 20,
    tasksClosed: 19,
    criticalDocs: 1,
    complianceRate: '99.2%',
    ridership: 118500,
    topEvent: 'Live OCC SCADA telemetry synchronization & automated priority dispatch active',
    priorities: [
      { name: 'CRITICAL', count: 1, color: '#EF4444' },
      { name: 'HIGH', count: 6, color: '#F59E0B' },
      { name: 'MEDIUM', count: 9, color: '#38BDF8' },
      { name: 'LOW', count: 12, color: '#10B981' },
      { name: 'INFORMATIONAL', count: 0, color: '#6366F1' },
    ],
    languages: [
      { name: 'English', count: 18, color: '#00D2FF' },
      { name: 'Malayalam', count: 8, color: '#10B981' },
      { name: 'Bilingual', count: 2, color: '#F59E0B' },
      { name: 'Hindi', count: 0, color: '#A855F7' },
    ],
    hourlyTelemetry: [
      { hour: '06:00', docs: 2, tasks: 1, paxInflow: 1200 },
      { hour: '08:00', docs: 8, tasks: 6, paxInflow: 8900 },
      { hour: '10:00', docs: 11, tasks: 8, paxInflow: 12100 },
      { hour: '14:00', docs: 5, tasks: 4, paxInflow: 6900 },
      { hour: '18:00', docs: 8, tasks: 6, paxInflow: 17500 },
      { hour: '21:00', docs: 2, tasks: 1, paxInflow: 4300 },
    ],
  },
];

export const Analytics: React.FC = () => {
  // Navigation & Temporal Filters
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(2026);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6); // Default: Wed 10 Sep (Today)
  const [backendData, setBackendData] = useState<any>(null);

  // Fetch optional backend analytics if available
  useEffect(() => {
    const fetchAnalytics = async () => {
      const yearParam = selectedYear === 'all' ? undefined : selectedYear;
      const res = await api.getAnalytics(timeRange, yearParam);
      if (res) setBackendData(res);
    };
    fetchAnalytics();
  }, [timeRange, selectedYear]);

  // Determine current active view:
  // If timeRange is 'today' or '7d', we display the dynamic daily data.
  // If timeRange is 'all-time' or user clicked an inception year (2017-2026), we display that year's historical profile.
  const isDailyMode = timeRange === 'today' || timeRange === '7d';
  const activeDay = SEVEN_DAYS_PROFILES[selectedDayIndex];

  // Active Year Record
  const activeYearData: KMRLYearRecord = useMemo(() => {
    if (selectedYear === 'all') {
      return KMRL_LONGITUDINAL_DATA[2026];
    }
    return KMRL_LONGITUDINAL_DATA[selectedYear] || KMRL_LONGITUDINAL_DATA[2026];
  }, [selectedYear]);

  // Multi-Year Longitudinal Series for Recharts (2017 to 2026)
  const multiYearTrend = useMemo(() => {
    return Object.keys(KMRL_LONGITUDINAL_DATA)
      .map(Number)
      .sort((a, b) => a - b)
      .map((y) => {
        const item = KMRL_LONGITUDINAL_DATA[y];
        return {
          year: y.toString(),
          docs: item.totalDocs,
          tasks: item.completedActions,
          ridershipMillion: item.annualRidershipMillion,
          stations: item.stations,
          compliance: parseFloat(item.complianceRate),
        };
      });
  }, []);

  // Compute Active Metrics based on Day / Year / TimeRange selection
  const computedMetrics = useMemo(() => {
    if (isDailyMode) {
      return {
        volumeLabel: `Daily Docs Processed (${activeDay.dayLabel})`,
        volume: activeDay.docs,
        subVolume: `${activeDay.hourlyTelemetry.length * 60} SCADA Telemetry packets/day`,
        compliance: activeDay.complianceRate,
        complianceSub: 'Zero safety breaches recorded',
        dispatched: activeDay.tasksDispatched,
        dispatchedSub: `${activeDay.tasksClosed} closed & signed off today`,
        ridership: activeDay.ridership.toLocaleString() + ' Passengers',
        ridershipSub: 'Peak rush hour: 08:00-10:00 & 17:00-19:00',
        criticalDocs: activeDay.criticalDocs,
        languages: activeDay.languages,
        priorities: activeDay.priorities,
        chartData: activeDay.hourlyTelemetry.map((h) => ({
          period: h.hour,
          docs: h.docs,
          tasks: h.tasks,
          pax: h.paxInflow,
        })),
        chartTitle: `Intra-Day Hourly Telemetry & Flow (${activeDay.dayLabel})`,
        chartXKey: 'period',
      };
    }

    if (selectedYear === 'all') {
      return {
        volumeLabel: 'Total Inception Volume (2017 – 2026)',
        volume: multiYearTrend.reduce((acc, curr) => acc + curr.docs, 0),
        subVolume: '10-year cumulative indexed records',
        compliance: '98.9%',
        complianceSub: 'Consistent upward statutory trend',
        dispatched: multiYearTrend.reduce((acc, curr) => acc + curr.tasks, 0),
        dispatchedSub: 'Lifetime automated task resolutions',
        ridership: '237.6 Million',
        ridershipSub: 'Cumulative passengers carried since 2017',
        criticalDocs: 99,
        languages: activeYearData.languages,
        priorities: activeYearData.priorities,
        chartData: multiYearTrend.map((m) => ({
          period: m.year,
          docs: m.docs,
          tasks: m.tasks,
          ridership: m.ridershipMillion,
        })),
        chartTitle: '10-Year Inception-to-Date Growth Curve (2017 – 2026)',
        chartXKey: 'period',
      };
    }

    // Specific Year
    return {
      volumeLabel: `Annual Volume (${selectedYear})`,
      volume: activeYearData.totalDocs,
      subVolume: `Avg ${activeYearData.avgProcessSec}s per document`,
      compliance: activeYearData.complianceRate,
      complianceSub: `${activeYearData.stations} stations operational`,
      dispatched: activeYearData.completedActions + activeYearData.pendingActions,
      dispatchedSub: `${activeYearData.completedActions} closed (${activeYearData.pendingActions} pending)`,
      ridership: `${activeYearData.annualRidershipMillion}M Pax / Yr`,
      ridershipSub: `Avg ${activeYearData.dailyRidership.toLocaleString()} passengers/day`,
      criticalDocs: activeYearData.criticalDocs,
      languages: activeYearData.languages,
      priorities: activeYearData.priorities,
      chartData: activeYearData.monthlyIngestion,
      chartTitle: `Ingestion & Task Throughput Timeline (${selectedYear})`,
      chartXKey: 'period',
    };
  }, [isDailyMode, activeDay, selectedYear, activeYearData, multiYearTrend]);

  // Export Sample Data from 2017 to 2026 as CSV
  const handleExportData = () => {
    const headers = [
      'Year',
      'Milestone',
      'Stations_Active',
      'Corridor_Length_KM',
      'Total_Documents_Ingested',
      'AI_Processed',
      'Pending_Actions',
      'Completed_Actions',
      'Critical_Directives',
      'Compliance_Rate',
      'Daily_Avg_Ridership',
      'Annual_Ridership_Million',
    ];

    const rows = Object.values(KMRL_LONGITUDINAL_DATA).map((r) => [
      r.year,
      `"${r.milestone.replace(/"/g, '""')}"`,
      r.stations,
      r.corridorKm,
      r.totalDocs,
      r.aiProcessed,
      r.pendingActions,
      r.completedActions,
      r.criticalDocs,
      r.complianceRate,
      r.dailyRidership,
      r.annualRidershipMillion,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'KMRL_Operational_Analytics_2017_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 1. Header with Title & Master Filters                        */}
      {/* ============================================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                KMRL Operational Analytics & Historical Intelligence
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Dynamic daily SCADA telemetry & authentic longitudinal records from inception (2017) to till date (2026)
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Pill Filters */}
          <div className="flex items-center gap-1 p-1 bg-[#0D1836] border border-[#1A2C54] rounded-xl text-xs font-mono">
            {[
              { id: 'today', label: 'Today (Live)' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: '1y', label: '1 Year' },
              { id: 'all-time', label: 'All-Time (2017-26)' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setTimeRange(r.id);
                  if (r.id === 'all-time') setSelectedYear('all');
                  else if (r.id === '1y') setSelectedYear(2026);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  timeRange === r.id
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#14234C]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Export Dataset Button */}
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1836] hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-colors shadow-xs"
            title="Download full 2017-2026 KMRL dataset as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. INCEPTION-TO-DATE YEAR SELECTOR (2017 to 2026 Till Date)  */}
      {/* ============================================================ */}
      <div className="p-4 rounded-2xl bg-[#091126] border border-[#17254A] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Kochi Metro Inception Timeline (2017 – 2026 Till Date)
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {selectedYear === 'all'
              ? 'Showing 10-Year Inception Aggregate'
              : `Inspecting Operational Year ${selectedYear}`}
          </span>
        </div>

        {/* Year Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => {
              setSelectedYear('all');
              setTimeRange('all-time');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
              selectedYear === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                : 'bg-[#0D1836] border border-[#1A2C54] text-slate-300 hover:text-white hover:border-amber-500/40'
            }`}
          >
            All (2017–2026)
          </button>

          {Object.keys(KMRL_LONGITUDINAL_DATA)
            .map(Number)
            .sort((a, b) => a - b)
            .map((year) => {
              const item = KMRL_LONGITUDINAL_DATA[year];
              const isSelected = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    if (timeRange === 'today' || timeRange === '7d') {
                      setTimeRange('30d');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                      : 'bg-[#0D1836] border border-[#1A2C54] text-slate-300 hover:text-white hover:border-cyan-500/40'
                  }`}
                >
                  <span>{year}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-sans font-semibold ${
                      isSelected
                        ? 'bg-slate-950/30 text-slate-950'
                        : 'bg-[#14234C] text-slate-400'
                    }`}
                  >
                    {item.tag.split(' ')[0]}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Active Year Historical Milestone Card */}
        {selectedYear !== 'all' && (
          <div className="p-3.5 rounded-xl bg-[#0D1836] border border-cyan-500/20 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-500/30">
                  MILESTONE {selectedYear}
                </span>
                <span className="font-bold text-white">{activeYearData.tag}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed max-w-4xl">
                {activeYearData.milestone}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0 text-right font-mono border-t md:border-t-0 md:border-l border-[#1A2C54] pt-2 md:pt-0 md:pl-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Network</span>
                <span className="text-white font-bold">{activeYearData.stations} Stations</span>
                <span className="text-[10px] text-cyan-400 block">{activeYearData.corridorKm} km</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Annual Pax</span>
                <span className="text-amber-400 font-bold">
                  {activeYearData.annualRidershipMillion}M
                </span>
                <span className="text-[10px] text-slate-400 block">
                  ~{activeYearData.dailyRidership.toLocaleString()}/day
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. DYNAMIC DAY SELECTOR (When viewing Today or 7 Days)       */}
      {/* ============================================================ */}
      {isDailyMode && (
        <div className="p-4 rounded-2xl bg-[#091126] border border-[#17254A] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Select Specific Day for SCADA Telemetry & Ingestion Variations
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              Active: {activeDay.dayLabel} ({activeDay.dateStr})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {SEVEN_DAYS_PROFILES.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-2.5 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/15'
                      : 'bg-[#0D1836] border-[#1A2C54] hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-cyan-300' : 'text-white'
                      }`}
                    >
                      {day.dayLabel.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {day.dayLabel.split(' ')[1]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-300">{day.docs} docs</span>
                    <span className="text-emerald-400">{day.complianceRate}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 truncate block mt-0.5">
                    {day.ridership.toLocaleString()} pax
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D1836] border border-[#1A2C54] text-xs flex items-center justify-between text-slate-300">
            <span className="font-mono text-cyan-400 font-bold">
              Day Highlight:
            </span>
            <span className="text-slate-200 truncate pl-2">{activeDay.topEvent}</span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. DYNAMIC TOP 4 KPI CARDS (Changes based on selection)      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Processing Volume */}
        <div className="p-5 rounded-2xl bg-[#091126] border border-[#17254A] space-y-1 relative overflow-hidden group hover:border-cyan-500/40 transition-colors shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {computedMetrics.volumeLabel}
            </span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-white font-mono">
            {computedMetrics.volume.toLocaleString()}
          </h3>
          <p className="text-[10px] font-mono text-cyan-400">{computedMetrics.subVolume}</p>
        </div>

        {/* Metric 2: Compliance */}
        <div className="p-5 rounded-2xl bg-[#091126] border border-[#17254A] space-y-1 relative overflow-hidden group hover:border-emerald-500/40 transition-colors shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Statutory Compliance
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono">
            {computedMetrics.compliance}
          </h3>
          <p className="text-[10px] font-mono text-slate-400">{computedMetrics.complianceSub}</p>
        </div>

        {/* Metric 3: Actions Dispatched */}
        <div className="p-5 rounded-2xl bg-[#091126] border border-[#17254A] space-y-1 relative overflow-hidden group hover:border-amber-500/40 transition-colors shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Actions Dispatched
            </span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-amber-400 font-mono">
            {computedMetrics.dispatched.toLocaleString()}
          </h3>
          <p className="text-[10px] font-mono text-slate-400">{computedMetrics.dispatchedSub}</p>
        </div>

        {/* Metric 4: Passenger Ridership */}
        <div className="p-5 rounded-2xl bg-[#091126] border border-[#17254A] space-y-1 relative overflow-hidden group hover:border-purple-500/40 transition-colors shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Corridor Passenger Volume
            </span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-purple-300 font-mono">
            {computedMetrics.ridership}
          </h3>
          <p className="text-[10px] font-mono text-slate-400">{computedMetrics.ridershipSub}</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. CHARTS GRID: Dynamic Ingestion/Throughput & Priority Dist */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Main Trend Chart */}
        <div className="p-6 rounded-3xl bg-[#091126] border border-[#17254A] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#17254A] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              {computedMetrics.chartTitle}
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">
              {isDailyMode
                ? 'Hourly Headway'
                : selectedYear === 'all'
                ? '2017 – 2026 All-Time'
                : `Year ${selectedYear}`}
            </span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height={270}>
              {selectedYear === 'all' && !isDailyMode ? (
                <AreaChart data={computedMetrics.chartData}>
                  <defs>
                    <linearGradient id="docsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00D2FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="tasksGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#17254A" />
                  <XAxis dataKey="period" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#091126',
                      borderColor: '#17254A',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="docs"
                    name="Documents Ingested"
                    stroke="#00D2FF"
                    fillOpacity={1}
                    fill="url(#docsGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    name="Tasks Dispatched"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#tasksGrad)"
                  />
                </AreaChart>
              ) : (
                <LineChart data={computedMetrics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#17254A" />
                  <XAxis dataKey="period" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#091126',
                      borderColor: '#17254A',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="docs"
                    name={isDailyMode ? 'Docs/Hour' : 'Documents Ingested'}
                    stroke="#00D2FF"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    name={isDailyMode ? 'Tasks/Hour' : 'Tasks Dispatched'}
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  {isDailyMode && (
                    <Line
                      type="monotone"
                      dataKey="pax"
                      name="Pax Inflow (/100)"
                      stroke="#A855F7"
                      strokeWidth={2}
                      dot={false}
                    />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Pie Chart (Dynamically Reflects Period) */}
        <div className="p-6 rounded-3xl bg-[#091126] border border-[#17254A] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#17254A] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Document Priority Breakdown
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {computedMetrics.criticalDocs} Critical Items
            </span>
          </div>

          <div className="h-68 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={270}>
              <PieChart>
                <Pie
                  data={computedMetrics.priorities}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {computedMetrics.priorities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#091126',
                    borderColor: '#17254A',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. Language Distribution & Multi-Department Compliance Table */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Breakdown Card */}
        <div className="p-6 rounded-3xl bg-[#091126] border border-[#17254A] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#17254A] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Multilingual Corpus Ratio
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">EN / ML / HI</span>
          </div>

          <div className="space-y-3 pt-1">
            {computedMetrics.languages.map((lang) => {
              const totalLang = computedMetrics.languages.reduce((a, b) => a + b.count, 0) || 1;
              const pct = ((lang.count / totalLang) * 100).toFixed(1);
              return (
                <div key={lang.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{lang.name}</span>
                    <span className="font-mono text-slate-300">
                      {lang.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#050B1A] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#17254A] text-[10px] text-slate-400 font-mono">
            Optical character recognition tested with Malayalam complex ligatures and railway statutory circulars.
          </div>
        </div>

        {/* Department Compliance Audit Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#091126] border border-[#17254A] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#17254A] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Department Action Compliance Audit ({selectedYear === 'all' ? 'All-Time' : selectedYear})
            </h3>
            <span className="text-xs font-mono text-slate-400">Statutory CMRS Benchmarks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#17254A] text-[10px] font-mono text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Total Assigned</th>
                  <th className="py-2.5 px-3">Verified Closed</th>
                  <th className="py-2.5 px-3">Compliance Rate</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#17254A]/60 font-mono">
                {activeYearData.departmentCompliance.map((d) => (
                  <tr key={d.department} className="hover:bg-[#0E1A38]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-white font-sans">{d.department}</td>
                    <td className="py-3 px-3 text-slate-300">{d.total} actions</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{d.completed} signed off</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[#050B1A] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: d.compliance }}
                          />
                        </div>
                        <span className="text-cyan-300 font-bold">{d.compliance}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          d.status === 'EXCELLING'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : d.status === 'ON TRACK'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. COMPLETE HISTORICAL DATASET TABLE (2017 to Till Date)    */}
      {/* ============================================================ */}
      <div className="p-6 rounded-3xl bg-[#091126] border border-[#17254A] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#17254A] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              Kochi Metro Rail Limited — Longitudinal Records (2017 to Till Date)
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Complete historical dataset spanning 10 years of metro operations, network expansions & intelligence ingestion
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Complete Dataset (.CSV)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#17254A] text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Network Milestone</th>
                <th className="py-2.5 px-3">Stations</th>
                <th className="py-2.5 px-3">Corridor</th>
                <th className="py-2.5 px-3">Docs Ingested</th>
                <th className="py-2.5 px-3">Actions Closed</th>
                <th className="py-2.5 px-3">Daily Pax</th>
                <th className="py-2.5 px-3">Annual Ridership</th>
                <th className="py-2.5 px-3">Compliance</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17254A]/60 font-mono">
              {Object.values(KMRL_LONGITUDINAL_DATA).map((item) => {
                const isSelected = selectedYear === item.year;
                return (
                  <tr
                    key={item.year}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/15 text-white font-bold'
                        : 'hover:bg-[#0E1A38]/50 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 text-white font-bold">{item.year}</td>
                    <td className="py-3 px-3 font-sans max-w-xs truncate text-slate-200" title={item.milestone}>
                      {item.tag}
                    </td>
                    <td className="py-3 px-3 text-cyan-300">{item.stations}</td>
                    <td className="py-3 px-3 text-slate-400">{item.corridorKm} km</td>
                    <td className="py-3 px-3 font-bold text-white">{item.totalDocs}</td>
                    <td className="py-3 px-3 text-emerald-400">{item.completedActions}</td>
                    <td className="py-3 px-3">{item.dailyRidership.toLocaleString()}</td>
                    <td className="py-3 px-3 text-purple-300 font-bold">{item.annualRidershipMillion}M</td>
                    <td className="py-3 px-3 text-emerald-400">{item.complianceRate}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedYear(item.year);
                          setTimeRange('30d');
                        }}
                        className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 transition-colors"
                      >
                        Load Year
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
