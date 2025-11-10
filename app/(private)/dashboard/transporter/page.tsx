"use client"

import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"

import TransporterDashboard from './TransporterDashboard';

export default function TransporterPage() {
  return <TransporterDashboard />;
}
