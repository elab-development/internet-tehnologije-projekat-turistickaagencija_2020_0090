<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Destination::query();
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%$q%")
                  ->orWhere('country', 'like', "%$q%");
            });
        }
        $perPage = (int) $request->input('per_page', 15);
        $perPage = $perPage > 0 && $perPage <= 100 ? $perPage : 15;
        return response()->json($query->orderBy('name')->paginate($perPage));
    }

    public function create()
    {
        return view('destinations.create');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url'
        ]);

        $destination = Destination::create($validated);
        return response()->json($destination, 201);
    }

    public function show(Destination $destination): JsonResponse
    {
        return response()->json($destination->load('arrangements'));
    }

    public function edit(Destination $destination)
    {
        return view('destinations.edit', compact('destination'));
    }

    public function update(Request $request, Destination $destination): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'country' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url'
        ]);

        $destination->update($validated);
        return response()->json($destination);
    }

    public function destroy(Destination $destination): JsonResponse
    {
        $destination->delete();
        return response()->json(null, 204);
    }

    public function search(Request $request)
    {
        $query = $request->get('query');
        
        return Destination::where('name', 'like', "%{$query}%")
            ->orWhere('country', 'like', "%{$query}%")
            ->select('id', 'name', 'country')
            ->limit(5)
            ->get();
    }
}
