import React, { useState } from 'react';
import './gameRules.css';

const GameRules = () => {
  const pages = [
    '/files/王权试炼-1.png',
    '/files/王权试炼-2.png',
    '/files/王权试炼-3.png',
    '/files/王权试炼-4.png',
    '/files/王权试炼-5.png',
  ];

  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="gamerule-container">
      <h2 className="gamerule-header">游戏规则手册</h2>

      <img
        className="gamerule-image"
        src={pages[currentPage]}
        alt={`Page ${currentPage + 1}`}
        draggable={false}
      />

      <div className="gamerule-controls">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="gamerule-btn"
        >
          上一页
        </button>

        <span className="gamerule-page-info">
          第 {currentPage + 1} / {pages.length} 页
        </span>

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, pages.length - 1))}
          disabled={currentPage === pages.length - 1}
          className="gamerule-btn"
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default GameRules;
