<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Nije prijavljen'], 401);
        }
        if (! in_array($user->role, $roles, true)) {
            return response()->json(['message' => 'Zabranjen pristup'], 403);
        }
        return $next($request);
    }
}