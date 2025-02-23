import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (row: Product) => `$${row.price.toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row: Product) => (
      <Badge variant={row.status === "In Stock" ? "default" : "destructive"}>
        {row.status}
      </Badge>
    ),
  },
];

export const data: Product[] = [
  {
    id: "1",
    name: "Organic Bananas",
    category: "Fruits",
    price: 2.99,
    stock: 150,
    status: "In Stock",
  },
  {
    id: "2",
    name: "Whole Milk",
    category: "Dairy",
    price: 4.49,
    stock: 75,
    status: "In Stock",
  },
  {
    id: "3",
    name: "Sourdough Bread",
    category: "Bakery",
    price: 5.99,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "4",
    name: "Fresh Salmon",
    category: "Seafood",
    price: 12.99,
    stock: 25,
    status: "In Stock",
  },
  {
    id: "5",
    name: "Organic Eggs",
    category: "Dairy",
    price: 6.99,
    stock: 100,
    status: "In Stock",
  },
];
