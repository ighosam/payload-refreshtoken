import type {
  PayloadRequest,
  CollectionAfterRefreshHook,
  SanitizedCollectionConfig,
} from 'payload'
import jwt from 'jsonwebtoken'

export async function runAfterRefreshHooks({
  req,
  token,
  collectionSlug,
}: {
  req: PayloadRequest
  token: string
  collectionSlug: string
}) {
  const collection = req.payload.collections[collectionSlug]
  if (!collection) return

  const decoded = jwt.decode(token) as { exp?: number }
  if (!decoded?.exp) return

  const hooks =
    (collection.config.hooks?.afterRefresh ?? []) as CollectionAfterRefreshHook[]

  for (const hook of hooks) {
    await hook({
      token,
      exp: decoded.exp,
      req,
      context: req.context,
      collection: collection.config as unknown as SanitizedCollectionConfig,
    })
  }
}
