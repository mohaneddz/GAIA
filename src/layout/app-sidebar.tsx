"use client"

interface User {
	id: string;
	email?: string | undefined | null;
	app_metadata?: {
		display_name?: string;
		role?: string;
		status?: string;
		department?: string;
	};
	user_metadata?: {
		display_name?: string;
		image?: string;
		department?: string;
		status?: string;
		role?: string;
	};
}

import * as React from "react"
import { useState } from "react"
import {
  Stethoscope,
  Brain,
  HeartPulse,
  Microscope,
  Pill,
  Radiation,
  Sparkles,
  Home,
  Cog,
  User
} from "lucide-react"

import { NavMain } from "@/layout/nav-main"
import { NavUser } from "@/layout/nav-user"
import { NavTools } from "@/layout/nav-tools"
import {
  Sidebar,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Dr. Mustapha",
    email: "mustapha.ouali@gmail.com",
    avatar: "/images/logo.png",
  },
  navMain: [
    {
      title: "General Medicine",
      url: "#",
      icon: Stethoscope,
      items: [
        {
          title: "Treatment Recommendations",
          url: "/dashboard/general/treatment",
        },
        {
          title: "Blood Analysis",
          url: "/dashboard/general/blood-analysis",
        },
      ],
    },
    {
      title: "Cardiology",
      url: "#",
      icon: HeartPulse,
      items: [
        {
          title: "ECG Interpretation (AI)",
          url: "/dashboard/cardiology/ecg-ai",
        },
        {
          title: "Heart Risk Prediction",
          url: "/dashboard/cardiology/risk-prediction",
        },
        {
          title: "Imaging Utility",
          url: "/dashboard/cardiology/imaging",
        },
      ],
    },
    {
      title: "Pulmonology",
      url: "#",
      icon: Pill,
      items: [
        {
          title: "Heart Risk Prediction",
          url: "/dashboard/pulmonology/risk-prediction",
        },
        {
          title: "Imaging Utility",
          url: "/dashboard/pulmonology/imaging",
        },
      ],
    },
    {
      title: "Radiology",
      url: "#",
      icon: Radiation,
      items: [
        {
          title: "X-ray / MRI Analysis (AI)",
          url: "/dashboard/radiology/ai-imaging",
        },
      ],
    },
    {
      title: "Neurology",
      url: "#",
      icon: Brain,
      items: [
        {
          title: "EEG Pattern Recognition",
          url: "/dashboard/neurology/eeg-ai",
        },
        {
          title: "Brain Scan Analyzer",
          url: "/dashboard/neurology/scan-analyzer",
        },
        {
          title: "Cognitive Assessment Tools",
          url: "/dashboard/neurology/ai-cognition",
        },
      ],
    },
    {
      title: "Pathology",
      url: "#",
      icon: Microscope,
      items: [
        {
          title: "Cell Image Classifier",
          url: "/dashboard/pathology/cell-classification",
        },
        {
          title: "Report Summarizer (AI)",
          url: "/dashboard/pathology/report-summary",
        },
        {
          title: "Specimen Tracker",
          url: "/dashboard/pathology/specimen",
        },
      ],
    },
  ],
  tools: [
    {
      name: "Ask GAIA",
      url: "/chat",
      icon: Sparkles,
    },
    {
      name: "Patient Search",
      url: "/patients",
      icon: User,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: Cog,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  const [user] = useState({
    name: "Mustapha OUALI",
    email: "mustapha.ouali@gmail.com",
    avatar: "/images/logo.png",
    id: "",
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <a className="flex items-center gap-2 cursor-pointer" href="/">
            <img src='/images/logo.png' alt='' width={40} height={40} />
            {state === "expanded" && (
              <span className="text-2xl w-full truncate font-black" style={{ background: 'linear-gradient(to bottom, #052c6b, #0747c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GAIA</span>
            )}
          </a>
          <button>
            <a href="/">
              <Home className="h-4 w-4" />
            </a>
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTools tools={data.tools} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
