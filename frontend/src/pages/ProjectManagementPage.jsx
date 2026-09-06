import React, { useState, useEffect } from 'react';
import { projectsApi } from '../api/projectsApi';
import { useUIStore } from '../store/uiStore';
import ProjectTable from '../components/projects/ProjectTable';
import ConfirmModal from '../components/common/ConfirmModal';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { Plus } from 'lucide-react';

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useUIStore();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getProjects();
      setProjects(data);
    } catch (err) {
      addToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description || '');
    setStatus(proj.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await projectsApi.updateProject(editingProject.id, { name, description, status });
        addToast("Project updated successfully!", "success");
      } else {
        await projectsApi.createProject({ name, description });
        addToast("Project created successfully!", "success");
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      addToast(err.response?.data?.detail || "Operation failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (proj) => {
    setDeleteConfirm({ isOpen: true, id: proj.id || proj._id, name: proj.name });
  };

  const confirmDeleteProject = async () => {
    if (!deleteConfirm.id) return;
    setIsDeleting(true);
    try {
      await projectsApi.deleteProject(deleteConfirm.id);
      addToast(`Project "${deleteConfirm.name}" deleted successfully`, "success");
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
      loadProjects();
    } catch (err) {
      addToast("Failed to delete project", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>Projects Directory</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Manage active team projects and deliverables</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenCreateModal}>
          Add New Project
        </Button>
      </div>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Loading projects...</div>
      ) : (
        <ProjectTable
          projects={projects}
          onEdit={handleOpenEditModal}
          onDelete={(id) => {
            const target = projects.find(p => p.id === id || p._id === id);
            openDeleteModal(target || { id, name: 'this project' });
          }}
        />
      )}

      {/* Delete Confirmation Popup Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? Active tasks and member associations may be affected.`}
        type="danger"
        confirmText="Delete Project"
        cancelText="Cancel"
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        isLoading={isDeleting}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Create New Project"}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Project Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Customer Portal Migration"
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key objectives and scope..."
          />
          {editingProject && (
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'archived', label: 'Archived' }
              ]}
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
