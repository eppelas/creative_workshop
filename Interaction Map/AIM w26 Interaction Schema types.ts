export enum NodeType {
  MINDSET = 'MINDSET',
  CODING = 'CODING',
  CREATIVE = 'CREATIVE', // Image/Video
  MUSIC = 'MUSIC',
  DESIGN = 'DESIGN', // UI/Vector/3D
  INFRA = 'INFRA'
}

export interface ToolMeta {
  name: string;
  category?: string;
  url?: string;
  description: string;
  bestFor?: string;
  pros?: string;
  cons?: string;
  tags?: string[];
}

export interface SchemaNode {
  id: string;
  title: string;
  description: string;
  type: NodeType;
  tags?: string[];
  tools?: string[]; // Simple list for card preview
  toolDetails?: ToolMeta[]; // Detailed data for the drawer
  timeEstimate?: string;
  x?: number; 
  y?: number; 
  posX?: number; 
  posY?: number; 
  connections?: string[]; 
  details?: string;
}