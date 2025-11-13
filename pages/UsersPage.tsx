import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import Layout from '../components/Layout';
import { PlusIcon, UsersIcon, EyeIcon, PencilIcon, TrashIcon, WarningIcon, ClipboardIcon, PhoneIcon, CheckIcon, SearchIcon } from '../ui/Icons';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'CITIZEN' | 'AUTHORITY' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  invitedBy?: string;
}

interface UserFilters {
  search: string;
  role: 'all' | 'CITIZEN' | 'AUTHORITY' | 'ADMIN';
  status: 'all' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  sortBy: 'name' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Estados para formularios
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'CITIZEN' as User['role'],
    password: '',
    confirmPassword: '',
    sendInvitation: false
  });
  
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'CITIZEN' as User['role'],
    status: 'ACTIVE' as User['status']
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filtros y ordenamiento
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = filters.search === '' || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (filters.sortBy) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
          break;
        case 'updatedAt':
          valueA = new Date(a.updatedAt);
          valueB = new Date(b.updatedAt);
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return filters.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, filters]);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'AUTHORITY': return 'Autoridad';
      case 'CITIZEN': return 'Ciudadano';
      default: return role;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'INACTIVE': return 'Inactivo';
      case 'SUSPENDED': return 'Suspendido';
      case 'PENDING_VERIFICATION': return 'Pendiente';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#22C55E';
      case 'INACTIVE': return '#6B7280';
      case 'SUSPENDED': return '#EF4444';
      case 'PENDING_VERIFICATION': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#DC2626';
      case 'AUTHORITY': return '#F59E0B';
      case 'CITIZEN': return '#22C55E';
      default: return '#6B7280';
    }
  };

  const handleSort = (field: UserFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Funciones de validación
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCreateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!createForm.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!createForm.email.trim()) errors.email = 'El email es obligatorio';
    else if (!validateEmail(createForm.email)) errors.email = 'Email inválido';
    else if (users.some(u => u.email.toLowerCase() === createForm.email.toLowerCase())) {
      errors.email = 'Este email ya está registrado';
    }
    
    if (!createForm.password) errors.password = 'La contraseña es obligatoria';
    else if (createForm.password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres';
    
    if (createForm.password !== createForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editForm.name.trim()) errors.name = 'El nombre es obligatorio';
    if (!editForm.email.trim()) errors.email = 'El email es obligatorio';
    else if (!validateEmail(editForm.email)) errors.email = 'Email inválido';
    else if (selectedUser && editForm.email.toLowerCase() !== selectedUser.email.toLowerCase()) {
      // Solo validar duplicado si el email cambió
      if (users.some(u => u.email.toLowerCase() === editForm.email.toLowerCase())) {
        errors.email = 'Este email ya está registrado';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetCreateForm = () => {
    setCreateForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: 'CITIZEN',
      password: '',
      confirmPassword: '',
      sendInvitation: false
    });
    setFormErrors({});
  };

  const resetEditForm = () => {
    setEditForm({
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      role: 'CITIZEN',
      status: 'ACTIVE'
    });
    setFormErrors({});
  };

  const handleCreateUser = () => {
    resetCreateForm();
    setShowCreateModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
      status: user.status
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleCreateSubmit = async () => {
    if (!validateCreateForm()) return;

    setLoading(true);
    try {
      const response = await userService.createUser({
        name: createForm.name,
        email: createForm.email,
        role: createForm.role,
        phone: createForm.phone || undefined,
        address: createForm.address || undefined,
        sendInvitation: createForm.sendInvitation
      });

      if (response.success) {
        setShowCreateModal(false);
        resetCreateForm();
        loadUsers(); // Recargar la lista de usuarios
        alert('Usuario creado exitosamente');
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!validateEditForm()) return;

    setLoading(true);
    try {
      const response = await userService.updateUser(editForm.id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        status: editForm.status,
        phone: editForm.phone || undefined,
        address: editForm.address || undefined
      });

      if (response.success) {
        setShowEditModal(false);
        resetEditForm();
        loadUsers(); // Recargar la lista de usuarios
        alert('Usuario actualizado exitosamente');
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDeleteUser = (userToDelete: User) => {
    // Protección: no permitir eliminar al administrador activo
    if (userToDelete.id === user?.id) {
      alert('No puedes eliminar tu propia cuenta mientras estás conectado.');
      return;
    }
    
    // Protección: advertir si es el último administrador
    const adminCount = users.filter(u => u.role === 'ADMIN' && u.status === 'ACTIVE').length;
    if (userToDelete.role === 'ADMIN' && adminCount <= 1) {
      alert('No puedes eliminar al último administrador activo del sistema.');
      return;
    }
    
    setUserToDelete(userToDelete);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      alert(`Usuario ${userToDelete.name} eliminado exitosamente`);
      
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar el usuario. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: newStatus, updatedAt: new Date().toISOString() }
        : u
    ));
  };

  // Estadísticas
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    citizens: users.filter(u => u.role === 'CITIZEN').length,
    authorities: users.filter(u => u.role === 'AUTHORITY').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    pending: users.filter(u => u.status === 'PENDING_VERIFICATION').length
  };

  // Cargar usuarios reales de la base de datos
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(filters);
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        });
      } else {
        console.error('Error cargando usuarios:', response.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios cuando cambian los filtros
  useEffect(() => {
    loadUsers();
  }, [filters]);

  // Verificar permisos de administrador
  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Verificar permisos
  if (user?.role !== 'ADMIN') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', marginBottom: '16px' }}>
            Acceso Denegado
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>
            No tienes permisos para acceder a la gestión de usuarios.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="button"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
              Gestión de Usuarios
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0 0' }}>
              Administra usuarios del sistema y sus permisos
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '24px' }}>
        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F6FEB', marginBottom: '4px' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Usuarios</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#22C55E', marginBottom: '4px' }}>
              {stats.active}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Activos</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#22C55E', marginBottom: '4px' }}>
              {stats.citizens}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Ciudadanos</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>
              {stats.authorities}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Autoridades</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#DC2626', marginBottom: '4px' }}>
              {stats.admins}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Administradores</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>
              {stats.pending}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Pendientes</div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Primera fila - Búsqueda y botón crear */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '250px' }}>
                <SearchIcon size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  style={{
                    flex: '1',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <button
                onClick={handleCreateUser}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#22C55E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PlusIcon size={16} />
                Crear Usuario
              </button>
            </div>

            {/* Segunda fila - Filtros */}
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div>
                <label style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px',
                  display: 'block'
                }}>
                  Filtrar por Rol
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as any }))}
                  style={{
                    padding: '6px 10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="all">Todos los roles</option>
                  <option value="CITIZEN">Ciudadanos</option>
                  <option value="AUTHORITY">Autoridades</option>
                  <option value="ADMIN">Administradores</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginBottom: '4px',
                  display: 'block'
                }}>
                  Filtrar por Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                  style={{
                    padding: '6px 10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="all">Todos los estados</option>
                  <option value="ACTIVE">Activos</option>
                  <option value="INACTIVE">Inactivos</option>
                  <option value="SUSPENDED">Suspendidos</option>
                  <option value="PENDING_VERIFICATION">Pendientes</option>
                </select>
              </div>

              <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#6B7280' }}>
                Mostrando {filteredAndSortedUsers.length} de {users.length} usuarios
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  borderBottom: '2px solid #E5E7EB',
                  backgroundColor: '#F9FAFB'
                }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('name')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Usuario
                      {filters.sortBy === 'name' && (
                        <span style={{ fontSize: '12px' }}>
                          {filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Rol
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Estado
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('createdAt')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Fecha Creación
                      {filters.sortBy === 'createdAt' && (
                        <span style={{ fontSize: '12px' }}>
                          {filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('updatedAt')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Última Actualización
                      {filters.sortBy === 'updatedAt' && (
                        <span style={{ fontSize: '12px' }}>
                          {filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#6B7280'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}><UsersIcon size={48} /></div>
                      <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        Cargando usuarios...
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        Por favor, espera un momento.
                      </div>
                    </td>
                  </tr>
                ) : filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#6B7280'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}><UsersIcon size={48} /></div>
                      <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        No se encontraron usuarios
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        Intenta ajustar los filtros de búsqueda
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((user) => (
                    <tr key={user.id} style={{
                      borderBottom: '1px solid #E5E7EB',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1F2937',
                            marginBottom: '2px'
                          }}>
                            {user.name}
                            {!user.emailVerified && (
                              <span style={{
                                marginLeft: '8px',
                                fontSize: '12px',
                                color: '#F59E0B'
                              }}>
                                <WarningIcon size={14} />
                              </span>
                            )}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#6B7280'
                          }}>
                            {user.email}
                          </div>
                          {user.phone && (
                            <div style={{
                              fontSize: '12px',
                              color: '#9CA3AF'
                            }}>
                              <PhoneIcon size={14} /> {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: `${getRoleColor(user.role)}20`,
                          color: getRoleColor(user.role)
                        }}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: `${getStatusColor(user.status)}20`,
                            color: getStatusColor(user.status),
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="ACTIVE">Activo</option>
                          <option value="INACTIVE">Inactivo</option>
                          <option value="SUSPENDED">Suspendido</option>
                          <option value="PENDING_VERIFICATION">Pendiente</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: '13px', color: '#6B7280' }}>
                          {new Date(user.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: '13px', color: '#6B7280' }}>
                          {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleViewDetails(user)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#F3F4F6',
                              color: '#374151',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                            title="Ver detalles"
                          >
                            <EyeIcon size={14} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#1F6FEB',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                            title="Editar usuario"
                          >
                            <PencilIcon size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#EF4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                            title="Eliminar usuario"
                            disabled={user.id === user?.id} // No permitir eliminar a sí mismo
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && userToDelete && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              maxWidth: '400px',
              width: '90%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}><WarningIcon size={24} /></span>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0
                }}>
                  Confirmar Eliminación
                </h3>
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.name}</strong>?
                <br />
                Esta acción no se puede deshacer.
              </p>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: '#6B7280',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteUser}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar Usuario
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles del usuario */}
        {showDetailsModal && selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0
                }}>
                  Detalles del Usuario
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#6B7280'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                    Nombre Completo
                  </label>
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>{selectedUser.name}</div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                    Correo Electrónico
                  </label>
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>
                    {selectedUser.email}
                    {selectedUser.emailVerified ? (
                      <span style={{ marginLeft: '8px', color: '#22C55E', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><CheckIcon size={14} /> Verificado</span>
                    ) : (
                      <span style={{ marginLeft: '8px', color: '#F59E0B', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><WarningIcon size={14} /> No verificado</span>
                    )}
                  </div>
                </div>

                {selectedUser.phone && (
                  <div>
                    <label style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                      Teléfono
                    </label>
                    <div style={{ fontSize: '14px', color: '#1F2937' }}>{selectedUser.phone}</div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                    Rol
                  </label>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: `${getRoleColor(selectedUser.role)}20`,
                    color: getRoleColor(selectedUser.role)
                  }}>
                    {getRoleDisplayName(selectedUser.role)}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                    Estado
                  </label>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: `${getStatusColor(selectedUser.status)}20`,
                    color: getStatusColor(selectedUser.status)
                  }}>
                    {getStatusDisplayName(selectedUser.status)}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                    Fecha de Registro
                  </label>
                  <div style={{ fontSize: '14px', color: '#1F2937' }}>
                    {new Date(selectedUser.createdAt).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {selectedUser.updatedAt && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Última actualización:</span>
                    <span>{new Date(selectedUser.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: '#6B7280',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditUser(selectedUser);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1F6FEB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Editar Usuario
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de creación de usuario */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0
                }}>
                  Crear Nuevo Usuario
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#6B7280'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateSubmit(); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ingresa el nombre completo"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${formErrors.name ? '#EF4444' : '#D1D5DB'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {formErrors.name && (
                      <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="usuario@ejemplo.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${formErrors.email ? '#EF4444' : '#D1D5DB'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {formErrors.email && (
                      <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="555-0123 (opcional)"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={createForm.address}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Ej: Calle Principal 123, Ciudad"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Rol *
                    </label>
                    <select
                      value={createForm.role}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="CITIZEN">Ciudadano</option>
                      <option value="AUTHORITY">Autoridad</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Contraseña Temporal *
                    </label>
                    <input
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${formErrors.password ? '#EF4444' : '#D1D5DB'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {formErrors.password && (
                      <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                        {formErrors.password}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Confirmar Contraseña *
                    </label>
                    <input
                      type="password"
                      value={createForm.confirmPassword}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Repite la contraseña"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${formErrors.confirmPassword ? '#EF4444' : '#D1D5DB'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {formErrors.confirmPassword && (
                      <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                        {formErrors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <div style={{
                    backgroundColor: '#F9FAFB',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ClipboardIcon size={14} /> <strong>Nota:</strong> El usuario recibirá un email para verificar su cuenta y podrá cambiar su contraseña en el primer acceso.
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '24px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      color: '#6B7280',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: loading ? '#9CA3AF' : '#22C55E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Creando...
                      </>
                        ) : (
                      <>
                        <PlusIcon size={14} />
                        Crear Usuario
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de edición de usuario */}
        {showEditModal && selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1F2937',
                  margin: 0
                }}>
                  Editar Usuario
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#6B7280'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ingresa el nombre completo"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${formErrors.name ? '#EF4444' : '#D1D5DB'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {formErrors.name && (
                      <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Correo Electrónico *
                      {selectedUser.emailVerified && (
                        <span style={{ fontSize: '12px', color: '#22C55E', marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <CheckIcon size={12} /> Verificado
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="usuario@ejemplo.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${formErrors.email ? '#EF4444' : '#D1D5DB'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      disabled={selectedUser.emailVerified}
                    />
                    {formErrors.email && (
                      <span style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'block' }}>
                        {formErrors.email}
                      </span>
                    )}
                    {selectedUser.emailVerified && (
                      <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', display: 'block' }}>
                        El email no se puede modificar porque ya está verificado
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="555-0123 (opcional)"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Ej: Calle Principal 123, Ciudad"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px', display: 'block' }}>
                      Rol *
                    </label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      disabled={selectedUser.id === user?.id} // No permitir cambiar su propio rol
                    >
                      <option value="CITIZEN">Ciudadano</option>
                      <option value="AUTHORITY">Autoridad</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                    {selectedUser.id === user?.id && (
                      <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', display: 'block' }}>
                        No puedes cambiar tu propio rol
                      </span>
                    )}
                  </div>

                  <div style={{
                    backgroundColor: '#F9FAFB',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ClipboardIcon size={14} /> <strong>Nota:</strong> Para cambiar la contraseña, el usuario debe usar la opción "Olvidé mi contraseña" en el login.
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '24px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'transparent',
                      color: '#6B7280',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: loading ? '#9CA3AF' : '#1F6FEB',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckIcon size={14} />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;