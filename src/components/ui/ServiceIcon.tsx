import { Home, Package, Trash2, Truck, Warehouse } from "lucide-react";
import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

const map = {
  truck: Truck,
  trash: Trash2,
  home: Home,
  package: Package,
  warehouse: Warehouse,
} as const;

export default function ServiceIcon({
  name,
  className,
  strokeWidth = 1.7,
}: {
  name: Service["icon"];
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = map[name];
  return <Icon aria-hidden="true" className={cn("size-6", className)} strokeWidth={strokeWidth} />;
}
