import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { commentService } from '../../services/api';
import Typography from '../../ui/Typography';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const CommentSection = ({ reportId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [reportId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getComments(reportId);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await commentService.addComment(reportId, {
        content: newComment.trim()
      });

      if (response.success) {
        setComments(prev => [response.data, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId, replyContent) => {
    try {
      const response = await commentService.addReply(reportId, parentId, {
        content: replyContent
      });

      if (response.success) {
        // Actualizar la lista de comentarios con la nueva respuesta
        setComments(prev => 
          prev.map(comment => 
            comment.id === parentId 
              ? { ...comment, replies: [...(comment.replies || []), response.data] }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return time.toLocaleDateString();
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      citizen: 'var(--color-primary)',
      authority: 'var(--color-warning)',
      admin: 'var(--color-error)'
    };

    const roleLabels = {
      citizen: 'Ciudadano',
      authority: 'Autoridad',
      admin: 'Administrador'
    };

    return (
      <span 
        className="role-badge"
        style={{ backgroundColor: roleColors[role] || 'var(--color-text-secondary)' }}
      >
        {roleLabels[role] || role}
      </span>
    );
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = (e) => {
      e.preventDefault();
      if (!replyContent.trim()) return;

      handleReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    };

    return (
      <div className={`comment-item ${isReply ? 'reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-author">
            <div className="author-avatar">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="author-info">
              <Typography variant="body" className="author-name">
                {comment.author.name}
              </Typography>
              {getRoleBadge(comment.author.role)}
            </div>
          </div>
          <Typography variant="caption" color="secondary" className="comment-time">
            {formatTime(comment.createdAt)}
          </Typography>
        </div>

        <div className="comment-content">
          <Typography variant="body" className="comment-text">
            {comment.content}
          </Typography>
        </div>

        {!isReply && (
          <div className="comment-actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Responder
            </Button>
          </div>
        )}

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="reply-textarea"
              rows="3"
            />
            <div className="reply-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={!replyContent.trim()}
              >
                Responder
              </Button>
            </div>
          </form>
        )}

        {/* Respuestas */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-container">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comment-section">
      <div className="section-header">
        <Typography variant="h3" className="section-title">
          Comentarios ({comments.length})
        </Typography>
      </div>

      {/* Formulario de nuevo comentario */}
      <Card className="comment-form-card">
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="form-header">
            <div className="user-info">
              <div className="user-avatar">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="user-details">
                <Typography variant="body" className="user-name">
                  {user?.name || 'Usuario'}
                </Typography>
                {getRoleBadge(user?.role)}
              </div>
            </div>
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="comment-textarea"
            rows="4"
            disabled={submitting}
          />

          <div className="form-actions">
            <Button
              variant="primary"
              type="submit"
              disabled={!newComment.trim() || submitting}
              loading={submitting}
            >
              {submitting ? 'Publicando...' : 'Publicar comentario'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Lista de comentarios */}
      <div className="comments-list">
        {loading ? (
          <div className="loading-comments">
            <div className="loading-spinner"></div>
            <Typography variant="body" color="secondary">
              Cargando comentarios...
            </Typography>
          </div>
        ) : comments.length === 0 ? (
          <div className="empty-comments">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <Typography variant="body" color="secondary">
              No hay comentarios aÃºn. Â¡SÃ© el primero en comentar!
            </Typography>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection; 
