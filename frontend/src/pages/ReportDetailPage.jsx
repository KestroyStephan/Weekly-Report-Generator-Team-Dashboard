import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsApi } from '../api/reportsApi';
import { projectsApi } from '../api/projectsApi';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import ReportForm from '../components/report/ReportForm';
import VersionHistoryPanel from '../components/report/VersionHistoryPanel';
import ReviewPanel from '../components/review/ReviewPanel';
import Button from '../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useUIStore();

  const [report, setReport] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        const [repData, projData] = await Promise.all([
          reportsApi.getReportById(id),
          projectsApi.getProjects()
        ]);
        setReport(repData);
        setProjects(projData);
      } catch (err) {
        console.error("Error loading report detail:", err);
        addToast("Failed to load report detail", "error");
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handleReviewSubmit = async (reviewData) => {
    setIsReviewing(true);
    try {
      const updated = await reportsApi.reviewReport(id, reviewData);
      setReport(updated);
      addToast(
        reviewData.action === 'approve'
          ? 'Report approved successfully!'
          : 'Correction request sent back to team member.',
        'success'
      );
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to complete review', 'error');
    } finally {
      setIsReviewing(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading report detail...</div>;
  }

  if (!report) {
    return (
      <div style={{
        padding: '40px 24px',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-card-border)',
        maxWidth: '600px',
        margin: '32px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>Report Not Found</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          The requested report could not be found or you do not have permission to view it.
        </p>
        <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Return to Previous Page
        </Button>
      </div>
    );
  }

  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const showReviewPanel = isManager && report.status === 'submitted';
  const reportId = report.id || report._id || id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Back to Reports List
        </Button>
      </div>

      <ReportForm
        report={report}
        projects={projects}
        onChange={setReport}
        isReadOnly={true}
      />

      {showReviewPanel && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <ReviewPanel
            report={report}
            onSubmitReview={handleReviewSubmit}
            isLoading={isReviewing}
          />
        </div>
      )}

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <VersionHistoryPanel reportId={reportId} currentVersion={report.version || 1} />
      </div>
    </div>
  );
}

