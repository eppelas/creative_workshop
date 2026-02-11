import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SCHEMA_NODES } from './constants';
import { SchemaNode } from './types';
import { NodeCard } from './NodeCard';
import { DetailDrawer } from './DetailDrawer';
import { WobblyArrow } from './WobblyArrow';
import { CustomCursor } from './CustomCursor';
import { RotateCcw } from 'lucide-react';

const INITIAL_OFFSET_X = 100;
const INITIAL_OFFSET_Y = 150;
const GRID_X_SPACING = 380; 
const GRID_Y_SPACING = 320;
const STORAGE_KEY = 'interaction_map_nodes_v1';

export const InteractionMap: React.FC = () => {
  const [nodes, setNodes] = useState<SchemaNode[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn(e); }
    return SCHEMA_NODES.map(node => ({
      ...node,
      posX: INITIAL_OFFSET_X + (node.x || 0) * GRID_X_SPACING + (Math.random() * 10 - 5),
      posY: INITIAL_OFFSET_Y + (node.y || 0) * GRID_Y_SPACING + (Math.random() * 10 - 5)
    }));
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  }, [nodes]);

  const [selectedNode, setSelectedNode] = useState<SchemaNode | null>(null);
  const [scale, setScale] = useState(0.85); 
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    setDraggedNodeId(id);
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !draggedNodeId) return;
    const deltaX = e.movementX / scale;
    const deltaY = e.movementY / scale;

    setNodes(prev => prev.map(node => {
      if (node.id === draggedNodeId) {
        return { ...node, posX: (node.posX || 0) + deltaX, posY: (node.posY || 0) + deltaY };
      }
      return node;
    }));
  }, [isDragging, draggedNodeId, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedNodeId(null);
  }, []);

  const handleUpdateNode = (id: string, field: 'title' | 'description', value: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).getAttribute('data-bg') === 'true') {
      setSelectedNode(null);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setScale(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.2), 3));
      }
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const arrows = nodes.flatMap(sourceNode => {
    if (!sourceNode.connections) return [];
    return sourceNode.connections.map(targetId => {
      const targetNode = nodes.find(n => n.id === targetId);
      if (!targetNode) return null;
      const cardWidth = 320; 
      const cardHeight = 200; 
      return (
        <WobblyArrow 
          key={`${sourceNode.id}-${targetId}`}
          startX={(sourceNode.posX || 0) + cardWidth/2}
          startY={(sourceNode.posY || 0) + cardHeight/2}
          endX={(targetNode.posX || 0) + cardWidth/2}
          endY={(targetNode.posY || 0) + cardHeight/2}
        />
      );
    }).filter(Boolean);
  });

  return (
    <div className="w-full h-full min-h-screen relative font-sans selection:bg-purple-500 selection:text-white cursor-none bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-800 overflow-hidden">
      <CustomCursor />
      
      <main 
        ref={containerRef}
        className="absolute inset-0 overflow-auto cursor-none"
        onClick={handleBackgroundClick} 
        data-bg="true"
      >
        <div 
          className="relative min-w-[3500px] min-h-[3000px] w-full h-full transform-origin-top-left transition-transform duration-75 ease-linear"
          style={{ transform: `scale(${scale})` }}
          data-bg="true"
        >
          <div className="absolute inset-0 pointer-events-none z-0">
            {arrows}
          </div>

          {nodes.map(node => (
            <NodeCard 
              key={node.id}
              node={node}
              isSelected={selectedNode?.id === node.id}
              onSelect={setSelectedNode}
              onUpdate={handleUpdateNode}
              onDragStart={handleDragStart}
              style={{ transform: `translate(${node.posX}px, ${node.posY}px)` }}
            />
          ))}
        </div>
      </main>

      {/* Reset Control */}
      <div className="fixed bottom-8 right-8 z-50">
          <button 
             onClick={() => {
               if(window.confirm('Reset Layout?')) {
                 localStorage.removeItem(STORAGE_KEY);
                 window.location.reload();
               }
             }}
             className="p-3 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 transition-colors shadow-lg backdrop-blur-sm"
             title="Reset Layout"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
      </div>

      <DetailDrawer 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
};