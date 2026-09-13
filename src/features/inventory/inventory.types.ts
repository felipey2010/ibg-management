export const itemConditions = ["NEW", "GOOD", "FAIR", "DAMAGED", "UNUSABLE"] as const;
export type ItemCondition = (typeof itemConditions)[number];
export type MovementType = "ENTRY" | "REMOVAL" | "ADJUSTMENT";
export interface InventoryOption {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}
export interface InventoryMovement {
  id: string;
  type: MovementType;
  quantity: string;
  previous_quantity: string;
  resulting_quantity: string;
  reason: string | null;
  created_at: string;
}
export interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  storage_location_id: string | null;
  quantity: string;
  minimum_quantity: string;
  unit: string;
  condition: ItemCondition;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  inventory_categories: InventoryOption | null;
  storage_locations: InventoryOption | null;
  inventory_movements?: InventoryMovement[];
}
export interface InventoryPage {
  data: InventoryItem[];
  pagination: { page: number; limit: number; total: number };
}
export interface InventoryOptions {
  categories: InventoryOption[];
  locations: InventoryOption[];
}
export const conditionLabels: Record<ItemCondition, string> = {
  NEW: "Novo",
  GOOD: "Bom",
  FAIR: "Regular",
  DAMAGED: "Danificado",
  UNUSABLE: "Inutilizável",
};
export const movementLabels: Record<MovementType, string> = {
  ENTRY: "Entrada",
  REMOVAL: "Saída",
  ADJUSTMENT: "Ajuste",
};
