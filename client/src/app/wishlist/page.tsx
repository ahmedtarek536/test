import { getWishlist } from "@/api/wishlistAPI";
import ProductCard from "@/components/Products/ProductCard";
import ProductsWishlist from "@/components/Products/ProductsWishlist";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/solid";
import { cookies } from "next/headers";
import React from "react";

export default async function Wishlist() {
  const token = (await cookies()).get("auth-token-ecommerce")?.value;

  if (!token) {
    return <ProductsWishlist products={[]} />;
  }

  const products = await getWishlist(token);

  return <ProductsWishlist products={products?.data} />;
}
