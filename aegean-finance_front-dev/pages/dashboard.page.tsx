import React from 'react';
import { LandDashboard } from '../src/modules/landDashboard';
import { MainLayout } from '../src/layouts/MainLayout';
export default function DashboardPage() {
  return <LandDashboard />;
}

DashboardPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
