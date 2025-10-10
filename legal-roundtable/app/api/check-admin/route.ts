import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    const isAdmin = adminEmails.includes(email);
    
    return NextResponse.json({ 
      isAdmin,
      adminEmails: isAdmin ? adminEmails : [] // 只有管理員才返回列表
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
