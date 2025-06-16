import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const authRoutes = ['/login', '/register', '/forgot-password'];

const getUserRole = (token: string | undefined): string | null => {
  if (!token) return null;
  try {
    const decoded = jwt.decode(token) as { role?: string } | null;
    return decoded?.role ?? null;
  } catch (error) {
    console.error('[AUTH] Failed to decode token:', error);
    return null;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  const userRole = getUserRole(token);

  // Nếu đang ở trang auth rồi đã login => redirect dashboard
  const isAuthRoute = authRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Phân quyền admin: chỉ admin được vào folder /admin/*
  const isAdminRoute = pathname.startsWith('/admin/');
  if (isAdminRoute) {
    if (!token || userRole !== 'Admin') {
      // Chặn user không phải admin hoặc chưa login
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Phân quyền staff: chỉ staff được vào //*
  const isEmployeeRoute = pathname.startsWith('/staff/');
  if (isEmployeeRoute) {
    if (!token || userRole !== 'Employee') {  
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Nếu user là Staff mà vào trang không phải /staff → redirect về /staff
  if (!isEmployeeRoute && userRole === 'Employee' && !pathname.startsWith('/staff/')) {
    return NextResponse.redirect(new URL('/staff/dashboard', request.url));
  }

  // Nếu user là Admin mà vào trang không phải /admin → redirect về /admin
  if (!isAdminRoute && userRole === 'Admin' && !pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Trường hợp user khác (không staff, không admin) hoặc chưa login cho phép truy cập bình thường
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts|assets).*)'],
};
