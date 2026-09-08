import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { dashboardApi } from '../api/dashboardApi';
import { usersApi } from '../api/usersApi';
import { projectsApi } from '../api/projectsApi';

import MemberDashboardPage from './MemberDashboardPage';
import FilterBar from '../components/dashboard/FilterBar';
import SummaryCards from '../components/dashboard/SummaryCards';
import TeamSubmissionTrendChart from '../components/dashboard/TeamSubmissionTrendChart';
import ReportStatusDistributionChart from '../components/dashboard/ReportStatusDistributionChart';
import BlockersByProjectChart from '../components/dashboard/BlockersByProjectChart';
import TeamMemberProgressTable from '../components/dashboard/TeamMemberProgressTable';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';

  const [summary, setSummary] = useState({});
  const [tasksTrend, setTasksTrend] = useState([]);
  const [statusByMember, setStatusByMember] = useState([]);
  const [workloadByProject, setWorkloadByProject] = useState([]);
  const [hoursByType, setHoursByType] = useState([]);
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!isManagerOrAdmin) return;
      setLoading(true);
      try {
        const [
          sumData,
          trendData,
          statusData,
          workloadData,
          hoursData,
          actData,
          userData,
          projData
        ] = await Promise.all([
          dashboardApi.getSummary().catch(() => ({})),
          dashboardApi.getTasksTrend().catch(() => []),
          dashboardApi.getStatusByMember().catch(() => []),
          dashboardApi.getWorkloadByProject().catch(() => []),
          dashboardApi.getHoursByType().catch(() => []),
          dashboardApi.getActivityFeed().catch(() => []),
          usersApi.getUsers().catch(() => []),
          projectsApi.getProjects().catch(() => [])
        ]);

        setSummary(sumData);
        setTasksTrend(trendData);
        setStatusByMember(statusData);
        setWorkloadByProject(workloadData);
        setHoursByType(hoursData);
        setActivities(actData);
        setMembers(userData);
        setProjects(projData);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [isManagerOrAdmin]);

  const handleFilterChange = (key, val) => {
    if (key === 'reset') {
      setFilters({});
    } else {
      setFilters((prev) => ({ ...prev, [key]: val }));
    }
  };

  if (!isManagerOrAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <MemberDashboardPage />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        padding: '64px',
        textAlign: 'center',
        color: '#64748B',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0'
      }}>
        Loading Manager Analytics Dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        members={members}
        projects={projects}
      />

      <SummaryCards summary={summary} membersCount={members.length} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        <TeamSubmissionTrendChart data={tasksTrend} />
        <ReportStatusDistributionChart summary={summary} />
        <BlockersByProjectChart projects={workloadByProject.length > 0 ? workloadByProject : projects} />
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <TeamMemberProgressTable members={members} statusByMember={statusByMember} projects={projects} />
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <RecentActivityFeed activities={activities} />
      </div>
    </div>
  );
}
