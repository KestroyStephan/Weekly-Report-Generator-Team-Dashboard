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
import { LayoutDashboard, UserCheck } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin';
  const [activeView, setActiveView] = useState(isManagerOrAdmin ? 'manager' : 'member');

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
      if (!isManagerOrAdmin && activeView === 'manager') return;
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
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [activeView, isManagerOrAdmin]);

  const handleFilterChange = (key, val) => {
    if (key === 'reset') {
      setFilters({});
    } else {
      setFilters((prev) => ({ ...prev, [key]: val }));
    }
  };

  // If user is a member, render Member Dashboard directly
  if (!isManagerOrAdmin || activeView === 'member') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* View Switcher Bar for Managers */}
        {isManagerOrAdmin && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942' }}>
                Dashboard View:
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                Viewing your personal member dashboard
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              backgroundColor: '#F1F5F9',
              borderRadius: '12px',
              padding: '4px'
            }}>
              <button
                onClick={() => setActiveView('manager')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: '#64748B'
                }}
              >
                <LayoutDashboard size={15} />
                Team Manager View
              </button>

              <button
                onClick={() => setActiveView('member')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                  color: '#0D8A6A',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                }}
              >
                <UserCheck size={15} />
                My Member View
              </button>
            </div>
          </div>
        )}

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
      
      {/* View Switcher Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '12px 20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942' }}>
            Dashboard View:
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            Viewing overall team performance & analytics
          </span>
        </div>

        <div style={{
          display: 'inline-flex',
          backgroundColor: '#F1F5F9',
          borderRadius: '12px',
          padding: '4px'
        }}>
          <button
            onClick={() => setActiveView('manager')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: '#FFFFFF',
              color: '#0D8A6A',
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
            }}
          >
            <LayoutDashboard size={15} />
            Team Manager View
          </button>

          <button
            onClick={() => setActiveView('member')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: '#64748B'
            }}
          >
            <UserCheck size={15} />
            My Member View
          </button>
        </div>
      </div>

      {/* Top Filter Toolbar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        members={members}
        projects={projects}
      />

      {/* Top 5 KPI Summary Cards */}
      <SummaryCards summary={summary} membersCount={members.length} />

      {/* Charts Row 1: 3 Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        <TeamSubmissionTrendChart data={tasksTrend} />
        <ReportStatusDistributionChart summary={summary} />
        <BlockersByProjectChart projects={workloadByProject.length > 0 ? workloadByProject : projects} />
      </div>

      {/* Content Row 2: Team Member Progress (Full View) + Recent Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1fr)',
        gap: '20px'
      }}>
        <div style={{ minWidth: 0 }}>
          <TeamMemberProgressTable members={members} statusByMember={statusByMember} />
        </div>
        <div style={{ minWidth: 0 }}>
          <RecentActivityFeed activities={activities} />
        </div>
      </div>

    </div>
  );
}
