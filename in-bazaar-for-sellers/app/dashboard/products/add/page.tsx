"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productService } from "@/services/product";

interface ProductFormData {
  name: string;
  url: string;
  description: string;
  price: string;
  stoploss: string;
  measurementValue: string;
  measurementUnit: string;
  categoryId: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    url: "",
    description: "",
    price: "",
    stoploss: "",
    measurementValue: "1",
    measurementUnit: "piece",
    categoryId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCategoryId = async (categoryType: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/seller/category/${categoryType}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }
      const data = await response.json();
      return data.id;
    } catch (error) {
      throw new Error("Failed to fetch category ID");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const categoryId = await fetchCategoryId(formData.categoryId);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stoploss: parseFloat(formData.stoploss),
        categoryId: categoryId,
        measuringUnit: `${formData.measurementValue} ${formData.measurementUnit}`,
      };
      await productService.createProduct(productData);
      router.push("/dashboard/inventory");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Product Image URL</label>
          <Input
            name="url"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Stop Loss</label>
            <Input
              type="number"
              name="stoploss"
              value={formData.stoploss}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Measurement</label>
          <div className="flex gap-2">
            <Input
              type="number"
              name="measurementValue"
              value={formData.measurementValue}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className="w-24"
              required
            />
            <Select
              value={formData.measurementUnit}
              onValueChange={(value) =>
                handleSelectChange("measurementUnit", value)
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piece">piece</SelectItem>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="l">l</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="dozen">dozen</SelectItem>
                <SelectItem value="pack">pack</SelectItem>
                <SelectItem value="box">box</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleSelectChange("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Groceries">Groceries</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Kids">Kids</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
