<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
   
    public function users(Request $request): JsonResponse
    {
        $role = $request->query('role'); 
        $q = $request->query('q'); // pretraga po imenu/email-u

        $query = User::query();
        if ($role) {
            $query->where('role', $role);
        }
        if ($q) {
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%$q%")
                  ->orWhere('email', 'like', "%$q%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json($users);
    }

    
    public function activities(Request $request): JsonResponse
    {
        $userId = $request->query('user_id');
        $type = $request->query('type');
        $q = $request->query('q');

        $query = UserActivity::with('user');
        if ($userId) {
            $query->where('user_id', $userId);
        }
        if ($type) {
            $query->where('activity_type', $type);
        }
        if ($q) {
            $query->where('activity_data', 'like', "%$q%");
        }

        $activities = $query->latest()->paginate(20);
        return response()->json($activities);
    }

    public function createUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,agent,client',
        ]);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);
        return response()->json($user, 201);
    }


    public function updateUser(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'password' => 'nullable|string|min:6', 
            'role' => 'sometimes|required|in:admin,agent,client',
        ]);


        if (array_key_exists('password', $validated) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);  
        }
        $user->update($validated);
        return response()->json($user);
    }

    
    public function deleteUser(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
