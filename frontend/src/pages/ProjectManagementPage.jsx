import React, { useState, useEffect, useMemo, useRef } from 'react';
import { projectsApi } from '../api/projectsApi';
import { usersApi } from '../api/usersApi';
import { useUIStore } from '../store/uiStore';
import ProjectTable, { STATUS_CONFIG } from '../components/projects/ProjectTable';
import ConfirmModal from '../components/common/ConfirmModal';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import {
  Plus,
  Search,
  Filter,
  FolderKanban,
  Activity,
  Clock,
  PauseCircle,
  CheckCircle2,
  Archive,
  Info,
  X,
  ChevronDown,
  Check
} from 'lucide-react';

// Custom Attractive Status Filter Dropdown Component
function StatusFilterDropdown({ statusFilter, setStatusFilter, metrics }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterOptions = [
    { id: 'all', label: 'All Projects', count: metrics.total, color: '#0F2942', icon: Filter },
    { id: 'active', label: 'Active', count: metrics.active, color: '#059669', icon: Activity },
    { id: 'in_progress', label: 'In Progress', count: metrics.inProgress, color: '#0284C7', icon: Clock },
    { id: 'on_hold', label: 'On Hold', count: metrics.onHold, color: '#D97706', icon: PauseCircle },
    { id: 'completed', label: 'Completed', count: metrics.completed, color: '#4F46E5', icon: CheckCircle2 },
    { id: 'archived', label: 'Archived', count: metrics.archived, color: '#64748B', icon: Archive }
  ];

  const selectedOpt = filterOptions.find((o) => o.id === statusFilter) || filterOptions[0];
  const SelectedIcon = selectedOpt.icon;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          borderRadius: '14px',
          border: isOpen ? '1.5px solid #0D8A6A' : '1.5px solid #CBD5E1',
          backgroundColor: isOpen ? '#FFFFFF' : '#F8FAFC',
          color: '#0F2942',
          fontSize: '0.9375rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 0 4px rgba(13, 138, 106, 0.12)' : '0 1px 2px rgba(0,0,0,0.03)',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
        onMouseOver={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#94A3B8';
          }
        }}
        onMouseOut={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SelectedIcon size={17} color={selectedOpt.color} style={{ strokeWidth: 2.2 }} />
          <span style={{ color: '#64748B', fontWeight: '500' }}>Filter:</span>
          <strong style={{ color: selectedOpt.color }}>{selectedOpt.label}</strong>
        </div>

        <span style={{
          fontSize: '0.75rem',
          fontWeight: '800',
          padding: '2px 8px',
          borderRadius: '9999px',
          backgroundColor: '#F1F5F9',
          color: selectedOpt.color,
          border: `1px solid ${selectedOpt.color}30`
        }}>
          {selectedOpt.count}
        </span>

        <ChevronDown
          size={16}
          color="#64748B"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        />
      </button>

      {/* Floating Filter Menu Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          minWidth: '250px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(0,0,0,0.04)',
          padding: '8px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '6px 12px 4px 12px'
          }}>
            Select Status Filter
          </div>

          {filterOptions.map((opt) => {
            const isSelectedOpt = statusFilter === opt.id;
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isSelectedOpt ? '#ECFDF5' : 'transparent',
                  color: isSelectedOpt ? '#065F46' : '#334155',
                  fontSize: '0.875rem',
                  fontWeight: isSelectedOpt ? '700' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  if (!isSelectedOpt) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseOut={(e) => {
                  if (!isSelectedOpt) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <OptIcon size={16} color={opt.color} style={{ strokeWidth: isSelectedOpt ? 2.5 : 2 }} />
                  <span>{opt.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: isSelectedOpt ? '#0D8A6A' : '#F1F5F9',
                    color: isSelectedOpt ? '#FFFFFF' : '#64748B'
                  }}>
                    {opt.count}
                  </span>
                  {isSelectedOpt && <Check size={16} color="#0D8A6A" style={{ strokeWidth: 2.5 }} />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToast } = useUIStore();

  const loadData = async () => {
    setLoading(true);
    try {
      const [projData, usersData] = await Promise.all([
        projectsApi.getProjects(),
        usersApi.getUsers().catch(() => [])
      ]);
      setProjects(projData);
      setMembers(usersData);
    } catch (err) {
      addToast("Failed to load projects list", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Metrics & Counts
  const metrics = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => (p.status || 'active').toLowerCase() === 'active').length;
    const inProgress = projects.filter((p) => (p.status || '').toLowerCase() === 'in_progress').length;
    const onHold = projects.filter((p) => (p.status || '').toLowerCase() === 'on_hold').length;
    const completed = projects.filter((p) => (p.status || '').toLowerCase() === 'completed').length;
    const archived = projects.filter((p) => (p.status || '').toLowerCase() === 'archived').length;

    return { total, active, inProgress, onHold, completed, archived };
  }, [projects]);

  // Filter Projects by Search and Status
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (proj.name && proj.name.toLowerCase().includes(q)) ||
        (proj.description && proj.description.toLowerCase().includes(q));

      const projStatus = (proj.status || 'active').toLowerCase();
      const matchesStatus = statusFilter === 'all' || projStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setStatus('active');
    setAssignedMembers([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description || '');
    setStatus((proj.status || 'active').toLowerCase());
    setAssignedMembers(proj.assigned_members || []);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Project name is required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProject) {
        const id = editingProject.id || editingProject._id;
        await projectsApi.updateProject(id, { name, description, status, assigned_members: assignedMembers });
        addToast("Project updated successfully!", "success");
      } else {
        await projectsApi.createProject({ name, description, status, assigned_members: assignedMembers });
        addToast("Project created successfully!", "success");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      addToast(err.response?.data?.detail || "Operation failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (proj) => {
    const id = proj.id || proj._id;
    setDeleteConfirm({ isOpen: true, id, name: proj.name });
  };

  const confirmDeleteProject = async () => {
    if (!deleteConfirm.id) return;
    setIsDeleting(true);
    try {
      await projectsApi.deleteProject(deleteConfirm.id);
      addToast(`Project "${deleteConfirm.name}" deleted successfully`, "success");
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
      loadData();
    } catch (err) {
      addToast("Failed to delete project", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Search & Filter Toolbar Controls Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '20px 24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 12px 32px -6px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Search + Custom Status Dropdown Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 480px', flexWrap: 'wrap' }}>
            {/* Live Search Input */}
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
              <Search size={18} color="#0D8A6A" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by name or description..."
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 46px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  color: '#0F2942',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0D8A6A';
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.boxShadow = '0 0 0 4px rgba(13, 138, 106, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CBD5E1';
                  e.target.style.backgroundColor = '#F8FAFC';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Custom Status Filter Dropdown */}
            <StatusFilterDropdown
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              metrics={metrics}
            />
          </div>

          {/* Primary Action Button */}
          <Button variant="primary" icon={Plus} onClick={handleOpenCreateModal}>
            Add New Project
          </Button>
        </div>
      </div>

      {/* Main Projects Table */}
      {loading ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
          color: '#64748B',
          border: '1px solid #E2E8F0'
        }}>
          Loading workspace projects...
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          onEdit={handleOpenEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action will remove the project from the directory.`}
        type="danger"
        confirmText="Delete Project"
        cancelText="Cancel"
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        isLoading={isDeleting}
      />

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project Details" : "Create New Project"}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input
            label="Project Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Client Mobile Portal"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the key deliverables, goals, or scope..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#0F2942',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0D8A6A';
                e.target.style.boxShadow = '0 0 0 3px rgba(13, 138, 106, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#CBD5E1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942' }}>
              Project Status & Phase
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'active', label: '🟢 Active - Live ongoing development' },
                { value: 'in_progress', label: '🔵 In Progress - Active sprint execution' },
                { value: 'on_hold', label: '🟡 On Hold - Temporarily paused' },
                { value: 'completed', label: '🟣 Completed - Finished & delivered' },
                { value: 'archived', label: '⚪ Archived - Inactive historical record' }
              ]}
            />
            {STATUS_CONFIG[status] && (
              <div style={{
                fontSize: '0.8125rem',
                color: STATUS_CONFIG[status].color,
                backgroundColor: STATUS_CONFIG[status].bgColor,
                padding: '8px 12px',
                borderRadius: '10px',
                border: `1px solid ${STATUS_CONFIG[status].borderColor}`,
                marginTop: '4px',
                fontWeight: '500'
              }}>
                <strong>Status Definition:</strong> {STATUS_CONFIG[status].meaning}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F2942' }}>
              Assign Team Members
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '12px',
              border: '1.5px solid #CBD5E1',
              borderRadius: '12px',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {members.map(member => {
                const memberId = member.id || member._id;
                const isAssigned = assignedMembers.includes(memberId);
                return (
                  <label key={memberId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: isAssigned ? '#ECFDF5' : '#F1F5F9',
                    border: isAssigned ? '1px solid #10B981' : '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: isAssigned ? '600' : '500',
                    color: isAssigned ? '#065F46' : '#475569',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="checkbox"
                      checked={isAssigned}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignedMembers([...assignedMembers, memberId]);
                        } else {
                          setAssignedMembers(assignedMembers.filter(id => id !== memberId));
                        }
                      }}
                      style={{ margin: 0, accentColor: '#10B981' }}
                    />
                    {member.name}
                  </label>
                );
              })}
              {members.length === 0 && (
                <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>No team members available</span>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Selected members will be able to submit reports for this project.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
