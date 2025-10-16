<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD', 'password');

        $user = User::firstOrNew(['email' => $email]);
        $user->name = $user->name ?: 'Admin';
        $user->password = Hash::make($password);
        $user->role = 'admin';
        $user->save();
    }
}