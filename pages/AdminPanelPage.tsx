import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { reportService } from '../services/api';
import MainNavigation from '../components/MainNavigation';

const AdminPanelPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    reportsByStatus: {
      pending: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // En un entorno real, aquÃ­ se harÃ­an las llamadas al API
      // Por ahora simulamos los datos
      const mockUsers = [
        { id: '1', name: 'Juan PÃ©rez', email: 'juan@hydora.com', role: 'CITIZEN', status: 'active', createdAt: '2024-01-15' },
        { id: '2', name: 'MarÃ­a GarcÃ­a', email: 'maria@hydora.com', role: 'AUTHORITY', status: 'active', createdAt: '2024-01-10' },
        { id: '3', name: 'Carlos LÃ³pez', email: 'carlos@hydora.com', role: 'CITIZEN', status: 'active', createdAt: '2024-01-20' },
        { id: '4', name: 'Ana MartÃ­nez', email: 'ana@hydora.com', role: 'AUTHORITY', status: 'inactive', createdAt: '2024-01-05' },
      ];

      const mockReports = [
        { id: '1', status: 'PENDING', priority: 'HIGH' },
        { id: '2', status: 'IN_PROGRESS', priority: 'MEDIUM' },
        { id: '3', status: 'RESOLVED', priority: 'LOW' },
        { id: '4', status: 'REJECTED', priority: 'URGENT' },
        { id: '5', status: 'PENDING', priority: 'MEDIUM' },
      ];

      setUsers(mockUsers);
      setReports(mockReports);

      // Calcular estadÃ­sticas
      const reportsByStatus = {
        pending: mockReports.filter(r => r.status === 'PENDING').length,
        inProgress: mockReports.filter(r => r.status === 'IN_PROGRESS').length,
        resolved: mockReports.filter(r => r.status === 'RESOLVED').length,
        rejected: mockReports.filter(r => r.status === 'REJECTED').length,
      };

      setStats({
        totalUsers: mockUsers.length,
        totalReports: mockReports.length,
        reportsByStatus,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      // En un entorno real, aquÃ­ se harÃ­a la llamada al API
      console.log(`Changing user ${userId} role to ${newRole}`);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      alert('Rol actualizado exitosamente');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error al actualizar el rol del usuario');
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      // En un entorno real, aquÃ­ se harÃ­a la llamada al API
      console.log(`Changing user ${userId} status to ${newStatus}`);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));

      alert('Estado del usuario actualizado exitosamente');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error al actualizar el estado del usuario');
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'AUTHORITY':
        return 'Autoridad';
      case 'CITIZEN':
        return 'Ciudadano';
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'role-admin';
      case 'AUTHORITY':
        return 'role-authority';
      case 'CITIZEN':
        return 'role-citizen';
      default:
        return 'role-default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'status-default';
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <MainNavigation />
        <div className="page-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando panel de administraciÃ³n...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <MainNavigation />
      
      <div className="page-content">
        <div className="page-wrapper">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-text">
                <h1 className="page-title">Panel de AdministraciÃ³n</h1>
                <p className="page-subtitle">
                  Gestiona usuarios y monitorea el sistema
                </p>
              </div>
            </div>
          </div>

          {/* EstadÃ­sticas */}
          <div className="admin-stats-section">
            <h3 className="section-title">Resumen del Sistema</h3>
            
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-number">{stats.totalUsers}</div>
                <div className="admin-stat-label">Usuarios Totales</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-number">{stats.totalReports}</div>
                <div className="admin-stat-label">Reportes Totales</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-number">{stats.reportsByStatus.pending}</div>
                <div className="admin-stat-label">Pendientes</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-number">{stats.reportsByStatus.resolved}</div>
                <div className="admin-stat-label">Resueltos</div>
              </div>
            </div>
          </div>

          {/* GestiÃ³n de Usuarios */}
          <div className="users-section">
            <h3 className="section-title">GestiÃ³n de Usuarios</h3>
            
            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <div className="user-avatar">
                      <span className="avatar-text">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="user-details">
                      <h4 className="user-name">{user.name}</h4>
                      <p className="user-email">{user.email}</p>
                      <div className="user-meta">
                        <span className={`user-role ${getRoleColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                        <span className={`user-status ${getStatusColor(user.status)}`}>
                          {getStatusDisplayName(user.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="user-actions">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="action-button edit"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal de ediciÃ³n de usuario */}
          {selectedUser && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Editar Usuario</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="modal-close"
                  >
                    Ã—
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Rol</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                      className="form-input"
                    >
                      <option value="CITIZEN">Ciudadano</option>
                      <option value="AUTHORITY">Autoridad</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select
                      value={selectedUser.status}
                      onChange={(e) => handleUserStatusChange(selectedUser.id, e.target.value)}
                      className="form-input"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="modal-button secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="modal-button primary"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage; 
