import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // Extrair informações de usuário dos headers (injetados pelo middleware)
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role');
  
  if (!userId || !userRole) {
    return NextResponse.json(null);
  }
  
  try {
    // Opcional: Você pode buscar mais informações do usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true 
      }
    });
    
    if (!user) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    return NextResponse.json(null);
  }
}