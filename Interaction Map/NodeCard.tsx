import React, { forwardRef } from 'react';
import { SchemaNode, NodeType } from './types';
import { MessageSquare, Code, Palette, Server, Music, PenTool, Box } from 'lucide-react';

interface NodeCardProps {
  node: SchemaNode;
  onSelect: (node: SchemaNode) => void;
  onUpdate: (id: string, field: 'title' | 'description', value: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
  isSelected: boolean;
  style?: React.CSSProperties;
}

const icons = {
  [NodeType.MINDSET]: MessageSquare,
  [NodeType.CODING]: Code,
  [NodeType.CREATIVE]: Palette,
  [NodeType.MUSIC]: Music,
  [NodeType.DESIGN]: PenTool,
  [NodeType.INFRA]: Server,
};

export const NodeCard = forwardRef<HTMLDivElement, NodeCardProps>(({ 
  node, 
  onSelect, 
  onUpdate, 
  onDragStart, 
  isSelected, 
  style, 
}, ref) => {
  const Icon = icons[node.type] || Box;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return; 
    }
    onSelect(node);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  return (
      <div
      ref={ref}
      style={style}
      onClick={handleCardClick}
      className={`absolute w-80 flex flex-col overflow-hidden group
        backdrop-blur-xl transition-all duration-500 border border-white/20 rounded-3xl
        ${isSelected ? 'bg-white/80 shadow-[0_20px_40px_-10px_rgba(139,92,246,0.2)] scale-105 z-50' : 'bg-white/40 hover:bg-white/60 shadow-lg border-white/40 z-10'}
      `}
    >
      <div 
        className={`h-8 w-full cursor-grab active:cursor-grabbing flex items-center justify-between px-4 border-b border-black/5 ${isSelected ? 'bg-purple-500/10 text-purple-600' : 'bg-transparent text-gray-400'}`}
        onMouseDown={(e) => onDragStart(e, node.id)}
      >
          <div className="flex gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div></div>
          <div className="text-[10px] font-mono uppercase font-bold opacity-70">{node.type}</div>
      </div>
      <div className="p-5 flex flex-col h-full">
          <div className="flex items-start gap-3 mb-4">
          <div className="mt-1 text-purple-500"><Icon className="w-5 h-5" /></div>
          <div className="flex-1 min-w-0">
              <input type="text" value={node.title} onClick={handleInputClick} onChange={(e) => onUpdate(node.id, 'title', e.target.value)} className="bg-transparent w-full focus:outline-none mb-1 text-slate-800 font-sans font-bold"/>
              <div className="text-[10px] uppercase tracking-wider opacity-60 text-slate-500 font-medium">{node.timeEstimate}</div>
          </div>
        </div>
        <textarea value={node.description} onClick={handleInputClick} onChange={(e) => onUpdate(node.id, 'description', e.target.value)} className="bg-transparent w-full resize-none focus:outline-none h-16 text-sm leading-relaxed mb-4 text-slate-500 font-medium"/>
      </div>
    </div>
  );
});

NodeCard.displayName = 'NodeCard';