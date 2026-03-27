export interface OrgNode {
  id: string;
  label: string;
  role?: string;
  imageUrl?: string;
  description?: string;
  tooltip?: string;
  type: 'root' | 'vp' | 'executive' | 'coordinator' | 'lead' | 'team';
  area?: 'engenharia' | 'qa' | 'processos' | 'suporte' | 'dados' | 'infra' | 'design' | 'produto';
  domain?: string;
  products?: string[];
  isTransversal?: boolean;
  isArea?: boolean;
  children?: OrgNode[];
}
