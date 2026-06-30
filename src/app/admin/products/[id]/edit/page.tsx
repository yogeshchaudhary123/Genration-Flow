import React from "react";
import prisma from "@/lib/db/prisma";
import { EditProductForm } from "@/components/admin/EditProductForm";
import { redirect } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="animate-fade-in-up">
      <EditProductForm product={product} />
    </div>
  );
}
