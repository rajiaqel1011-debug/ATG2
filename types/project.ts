export type ProjectCategory = "pumping" | "well" | "epc" | "offgrid";
export type ProjectStatus = "completed" | "in_progress";

export interface Project {
  id: string;
  category: ProjectCategory;
  categoryLabel: string;
  img: string;
  type: string;
  title: string;
  cap: string;
  loc: string;
  year: string;
  status: ProjectStatus;
  statusLabel: string;
  desc: string;
  specs: string[];
}
