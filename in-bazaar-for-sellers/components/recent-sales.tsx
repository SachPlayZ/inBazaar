import { Sale } from "@/services/sales";
import { formatDate } from "@/lib/utils";

interface RecentSalesProps {
  sales: Sale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.product.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {sale.buyer.name} • {formatDate(sale.createdAt)}
            </p>
          </div>
          <div className="ml-auto font-medium">₹{sale.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
