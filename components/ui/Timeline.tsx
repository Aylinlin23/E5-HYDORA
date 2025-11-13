import React from 'react';
import Typography from '../../ui/Typography';

const Timeline = ({ children }) => {
  return (
    <div className="timeline">
      {children}
    </div>
  );
};

Timeline.Item = ({ icon, iconColor, title, subtitle, content }) => {
  return (
    <div className="timeline-item">
      <div 
        className="timeline-icon"
        style={{ backgroundColor: iconColor }}
      >
        {icon}
      </div>
      
      <div className="timeline-content">
        <div className="timeline-header">
          <Typography variant="h4" className="timeline-title">
            {title}
          </Typography>
          <Typography variant="caption" color="secondary" className="timeline-subtitle">
            {subtitle}
          </Typography>
        </div>
        
        {content && (
          <Typography variant="body" className="timeline-description">
            {content}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Timeline; 
