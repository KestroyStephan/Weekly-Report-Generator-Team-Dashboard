import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { usersApi } from '../api/usersApi';
import { projectsApi } from '../api/projectsApi';
import SummaryCards from '../components/dashboard/SummaryCards';
import TasksTrendChart from '../components/dashboard/TasksTrendChart';
import StatusByMemberChart from '../components/dashboard/StatusByMemberChart';
import WorkloadByProjectChart from '../components/dashboard/WorkloadByProjectChart';
import HoursByTypeChart from '../components/dashboard/HoursByTypeChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import FilterBar from '../components/dashboard/FilterBar';

export default function DashboardPage() {
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
          dashboardApi.getSummary(),
          dashboardApi.getTasksTrend(),
          dashboardApi.getStatusByMember(),
          dashboardApi.getWorkloadByProject(),
          dashboardApi.getHoursByType(),
          dashboardApi.getActivityFeed(),
          usersApi.getUsers(),
          projectsApi.getProjects()
        ]);

        setSummary(sumData);
        setTasksTrend(trendData);
        setStatusByMember(statusData);
        setWorkloadByProject(workloadData);
        setHoursByType(hoursData);
        setActivities(actData);
        setMembers(userData);
        setProjects(projData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleFilterChange = (key, val) => {
    if (key === 'reset') {
      setFilters({});
    } else {
      setFilters((prev) => ({ ...prev, [key]: val }));
    }
  };

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading analytics dashboard...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        members={members}
        projects={projects}
      />

      <SummaryCards summary={summary} projects={projects} />

      {/* Charts Grid Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        <TasksTrendChart data={tasksTrend} />
        <StatusByMemberChart data={statusByMember} />
      </div>

      {/* Charts Grid Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        <WorkloadByProjectChart data={workloadByProject} />
        <HoursByTypeChart data={hoursByType} />
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={activities} />
    </div>
  );
}
