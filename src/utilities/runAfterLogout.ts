import type {
  PayloadRequest,
  CollectionAfterLogoutHook,
  SanitizedCollectionConfig,
} from 'payload'

export async function runAfterLogoutHooks({
  req,
  collectionSlug,
}: {
  req: PayloadRequest
  collectionSlug: string
}) {
  const collection = req.payload.collections[collectionSlug]
  if (!collection) return

  const hooks =
    (collection.config.hooks?.afterLogout ?? []) as CollectionAfterLogoutHook[]

  for (const hook of hooks) {
    await hook({
      req,
      context: req.context,
      collection: collection.config as unknown as SanitizedCollectionConfig,
    })
  }
}
