import { Customer } from "@/types";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "totalPurchases",
    header: "Total Purchases",
    cell: (row: Customer) => `$${row.totalPurchases.toFixed(2)}`,
  },
  {
    accessorKey: "lastPurchase",
    header: "Last Purchase",
    cell: (row: Customer) => new Date(row.lastPurchase).toLocaleDateString(),
  },
];

export const data: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    totalPurchases: 1250.5,
    lastPurchase: new Date("2024-03-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    totalPurchases: 875.25,
    lastPurchase: new Date("2024-03-14"),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    totalPurchases: 2100.75,
    lastPurchase: new Date("2024-03-13"),
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    totalPurchases: 450.0,
    lastPurchase: new Date("2024-03-12"),
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    totalPurchases: 1875.25,
    lastPurchase: new Date("2024-03-11"),
  },
];
