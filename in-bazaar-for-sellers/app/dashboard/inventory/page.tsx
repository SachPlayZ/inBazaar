"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
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
    stock: 25,
    status: "In Stock",
  },
  {
    id: "4",
    name: "Ground Beef",
    category: "Meat",
    price: 8.99,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "5",
    name: "Fresh Salmon",
    category: "Seafood",
    price: 15.99,
    stock: 12,
    status: "In Stock",
  },
  {
    id: "6",
    name: "Organic Eggs",
    category: "Dairy",
    price: 6.49,
    stock: 48,
    status: "In Stock",
  },
];

export default function InventoryPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
