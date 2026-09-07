import React, { useState, useEffect } from 'react';
import MemberSummaryCards from '../components/dashboard/member/MemberSummaryCards';
import ThisWeekReportBanner from '../components/dashboard/member/ThisWeekReportBanner';
import MyGoalsWidget from '../components/dashboard/member/MyGoalsWidget';
import RecentTasksWidget from '../components/dashboard/member/RecentTasksWidget';
import BlockersWidget from '../components/dashboard/member/BlockersWidget';
import RecentReportsWidget from '../components/dashboard/member/RecentReportsWidget';
import MotivationalQuoteCard from '../components/dashboard/member/MotivationalQuoteCard';
import { reportsApi } from '../api/reportsApi';
import { getWeekRange } from '../utils/dateHelpers';

export default function MemberDashboardPage() {
  const [currentReport, setCurrentReport] = useState(null);
  const [reportsHistory, setReportsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekRange = getWeekRange();

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [repData, historyData] = await Promise.all([
          reportsApi.createReport({
            week_start_date: weekRange.week_start_date,
            week_end_date: weekRange.week_end_date
          }).catch(() => null),
          reportsApi.getReports().catch(() => [])
        ]);

        setCurrentReport(repData);
        setReportsHistory(historyData);
      } catch (err) {
        console.error("Error loading member dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

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
        Loading Personal Member Dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top 4 Member Summary KPI Cards */}
      <MemberSummaryCards currentReport={currentReport} />

      {/* Row 1: This Week's Report Stepper Banner + My Goals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ flex: '1.4 1 500px' }}>
          <ThisWeekReportBanner currentReport={currentReport} />
        </div>
        <div style={{ flex: '1 1 340px' }}>
          <MyGoalsWidget currentReport={currentReport} />
        </div>
      </div>

      {/* Row 2: Recent Tasks + Blockers & Challenges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ flex: '1.2 1 450px' }}>
          <RecentTasksWidget currentReport={currentReport} />
        </div>
        <div style={{ flex: '1 1 340px' }}>
          <BlockersWidget currentReport={currentReport} />
        </div>
      </div>

      {/* Row 3: Recent Reports + Motivational Quote Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ flex: '1.6 1 550px' }}>
          <RecentReportsWidget reportsHistory={reportsHistory} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <MotivationalQuoteCard />
        </div>
      </div>

    </div>
  );
}
