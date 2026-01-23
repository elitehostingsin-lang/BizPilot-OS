import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    try {
        const { data: { user } } = await supabase.auth.getUser()

        // Protected routes
        if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Auth routes
        if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    } catch (error) {
        console.error('Middleware error:', error)
        // If we can't check auth, better to be safe and let the request proceed 
        // OR redirect to login if it's a dashboard route
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup'],
}
