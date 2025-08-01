import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductSearchParams {
  page: number;
  limit: number;
  search?: string;
  sortBy: 'name' | 'lastModTime' | 'createdAt' | 'price';
  sortOrder: 'asc' | 'desc';
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    const params: ProductSearchParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100), // Max 100
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'lastModTime',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc'
    };

    const skip = (params.page - 1) * params.limit;

    // Search filter (SQLite compatible)
    const where: any = {};
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      where.OR = [
        { name: { contains: searchTerm } },
        { id: { contains: params.search } }, // Unas product ID (exact match)
        { sku: { contains: searchTerm } }
      ];
    }

    // Count total products
    const total = await prisma.unasProduct.count({ where });

    // Fetch products with pagination
    const products = await prisma.unasProduct.findMany({
      where,
      skip,
      take: params.limit,
      orderBy: {
        [params.sortBy === 'price' ? 'priceGross' : 
         params.sortBy === 'createdAt' ? 'syncedAt' : 
         params.sortBy]: params.sortOrder
      },
      select: {
        id: true, // This is the Unas product ID
        name: true,
        sku: true,
        priceNet: true,
        priceGross: true,
        state: true,
        stock: true,
        lastModTime: true,
        syncedAt: true,
        updatedAt: true,
        allCategories: true,
        imageUrl: true
      }
    });

    // Format products for frontend compatibility
    const formattedProducts = products.map(product => ({
      ...product,
      unasId: product.id, // Map id to unasId for frontend compatibility
      price: product.priceGross, // Use gross price as main price
      status: product.state, // Map state to status for frontend compatibility
      categories: product.allCategories || [], // allCategories is already JSON, no need to parse
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
      createdAt: product.syncedAt, // Map syncedAt to createdAt for frontend compatibility
      // Convert Unix timestamp to ISO date string
      lastModTime: product.lastModTime ? new Date(parseInt(product.lastModTime) * 1000).toISOString() : product.lastModTime
    }));

    const totalPages = Math.ceil(total / params.limit);

    return NextResponse.json({
      success: true,
      data: {
        products: formattedProducts,
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages,
          hasNext: params.page < totalPages,
          hasPrev: params.page > 1
        }
      }
    });

  } catch (error) {
    console.error('Product list fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    await prisma.unasProduct.delete({
      where: { id: productId } // id is the Unas product ID
    });

    return NextResponse.json({
      success: true,
      message: 'Termék törölve'
    });

  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
}