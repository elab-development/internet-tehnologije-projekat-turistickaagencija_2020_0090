<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Arrangement;

class AgentClientUsersSeeder extends Seeder
{
    /**
     * Seeduje nekoliko agent i client korisnika radi demonstracije dashboarda
     */
    public function run(): void
    {
        $agents = [
            ['name' => 'Agent Ana', 'email' => 'agent1@example.com'],
            ['name' => 'Agent Marko', 'email' => 'agent2@example.com'],
        ];

        $clients = [
            ['name' => 'Klijent Jovana', 'email' => 'client1@example.com'],
            ['name' => 'Klijent Nikola', 'email' => 'client2@example.com'],
            ['name' => 'Klijent Petar', 'email' => 'client3@example.com'],
        ];

        foreach ($agents as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make('lozinka123'),
                    'role' => 'agent',
                ]
            );
        }

        foreach ($clients as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make('lozinka123'),
                    'role' => 'client',
                ]
            );
        }

        // Raspodela postojećih aranžmana agentima (naizmenično)
        $agentIds = User::where('role', 'agent')->pluck('id')->all();
        if (!empty($agentIds)) {
            $i = 0;
            Arrangement::query()->orderBy('id')->chunk(100, function ($chunk) use (&$i, $agentIds) {
                foreach ($chunk as $arr) {
                    $arr->agent_id = $agentIds[$i % count($agentIds)];
                    $arr->save();
                    $i++;
                }
            });
        }
    }
}
