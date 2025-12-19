import type { PayloadRequest, TypedUser } from 'payload'
import type { SanitizedCollectionConfig } from 'payload'

type BaseAuthHookArgs = {
  req: PayloadRequest
  context: PayloadRequest['context']
  collection: SanitizedCollectionConfig
  user?: TypedUser
}

type AuthHook<TExtra extends object = {}> =
  (args: BaseAuthHookArgs & TExtra) => Promise<void> | void

export async function runAuthHooks<TExtra extends object = {}>(
  hooks: readonly AuthHook<TExtra>[] | undefined,
  args: BaseAuthHookArgs & TExtra,
): Promise<void> {
  if (!hooks?.length) return

  for (const hook of hooks) {
    await hook(args)
  }
}
