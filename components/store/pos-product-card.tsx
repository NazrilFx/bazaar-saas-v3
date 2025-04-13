"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

interface StorePOSProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onViewDetails: () => void;
}

export function StorePOSProductCard({
  product,
  onAddToCart,
  onViewDetails,
}: StorePOSProductCardProps) {
  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onViewDetails}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative bg-muted">
          <Image
            src={product.image || "/placeholder.svg?height=200&width=200"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <div className="w-full">
          <h3 className="font-medium truncate">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="font-bold">
              {product.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </p>
            <Button
              size="sm"
              className="h-8 w-8 rounded-full p-0 bg-store-primary hover:bg-store-secondary text-white"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                onAddToCart();
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
