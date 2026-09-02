import React, { useState, useEffect } from 'react';
import { reportsApi } from '../api/reportsApi';
import { projectsApi } from '../api/projectsApi';
import { getWeekRange } from '../utils/dateHelpers';
import { useUIStore } from '../store/uiStore';
import ReportForm from '../components/report/ReportForm';
import VersionHistoryPanel from '../components/report/VersionHistoryPanel';

export default function MyReportPage() {
  const [report, setReport] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useUIStore();

  const weekRange = getWeekRange();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const projData = await projectsApi.getProjects();
        setProjects(projData);

        // Get or initialize current week draft
        const reportData = await reportsApi.createReport({
          week_start_date: weekRange.week_start_date,
          week_end_date: weekRange.week_end_date
        });
        setReport(reportData);
      } catch (err) {
        console.error("Error loading current report:", err);
        addToast("Failed to load current week report", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveDraft = async () => {
    if (!report) return;
    setIsSaving(true);
    try {
      const updated = await reportsApi.updateReport(report.id, {
        project_id: report.project_id,
        content: report.content
      });
      setReport(updated);
      addToast("Draft saved successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to save draft", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!report) return;
    setIsSubmitting(true);
    try {
      // First save content updates
      await reportsApi.updateReport(report.id, {
        project_id: report.project_id,
        content: report.content
      });
      // Then trigger submit action
      const submitted = await reportsApi.submitReport(report.id);
      setReport(submitted);
      addToast("Report submitted successfully for manager review!", "success");
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to submit report", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading weekly report...</div>;
  }

  const isReadOnly = report?.status === 'approved' || report?.status === 'submitted';

  return (
    <div>
      <ReportForm
        report={report}
        projects={projects}
        onChange={setReport}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        isReadOnly={isReadOnly}
      />
      {report && <VersionHistoryPanel reportId={report.id} currentVersion={report.version} />}
    </div>
  );
}
