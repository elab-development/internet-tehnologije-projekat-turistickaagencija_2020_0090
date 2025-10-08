<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
    
        $request->validate([
            'file' => 'required|image|max:4096',
        ]);

        $path = $request->file('file')->store('uploads', 'public');
        $url = asset('storage/'.$path);

        return response()->json(['url' => $url, 'path' => $path]);
    }
}