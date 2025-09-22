import { NextResponse } from 'next/server'

// Route désactivée en production: le schéma actuel ne correspond pas et cette importation
// n'est pas requise pour le déploiement. On renvoie 503 pour éviter des builds cassés.
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Import multi-marques désactivé sur ce déploiement' },
    { status: 503 }
  )
}
