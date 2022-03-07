import prisma from "./PrismaClient";

export async function createItem(args: {
  name: string;
  price: number;
  description: string;
  picture: string;
  brandId: number;
  sellerId: number;
  promoted?: boolean;
  salePrice?: number;
  totalQuantity?: number;
}) {
  return await prisma.item.create({
    data: {
      name: args.name,
      price: args.price,
      description: args.description,
      picture: args.picture,
      promoted: args.promoted,
      salePrice: args.salePrice,
      totalQuantity: args.totalQuantity,
      seller: {
        connect: { id: args.sellerId },
      },
      brand: {
        connect: { id: args.brandId },
      },
    },
  });
}

export async function updateItem(args: {
  itemId: number;
  name?: string;
  price?: number;
  description?: string;
  picture?: string;
  promoted?: boolean;
  salePrice?: number;
  totalQuantity?: number;
}) {
  return await prisma.item.update({
    where: {
      id: args.itemId,
    },
    data: {
      name: args.name,
      price: args.price,
      description: args.description,
      picture: args.picture,
      promoted: args.promoted,
      salePrice: args.salePrice,
      totalQuantity: args.totalQuantity,
    },
  });
}

export async function deleteItem(args: { id: number }) {
  return prisma.item.delete({
    where: { id: args.id },
  });
}

export async function itemById(args: { id: number }) {
  return prisma.item.findUnique({
    where: { id: args.id },
  });
}

export async function itemByName(args: { name: string }) {
  return prisma.item.findMany({
    where: {
      name: {
        contains: args.name,
        mode: "insensitive",
      },
    },
  });
}

export async function itemBySeller(args: { id: number }) {
  return prisma.item.findMany({
    where: {
      sellerId: {
        equals: args.id,
      },
    },
  });
}

export async function itemByBrand(args: { id: number }) {
  return prisma.item.findMany({
    where: {
      brandId: {
        equals: args.id,
      },
    },
  });
}

export async function findItems(args: { name?: string; sellerId?: number; brandId?: number }) {
  return prisma.item.findMany({
    where: {
      name: {
        contains: args.name,
        mode: "insensitive",
      },
      brandId: {
        equals: args.brandId,
      },
      sellerId: {
        equals: args.brandId,
      },
    },
  });
}

export async function allItems() {
  return await prisma.item.findMany();
}