import type { CollectionConfig } from 'payload'

/**
 * Auth users: public signup (customer), first user becomes admin.
 * Admins can manage all users in Payload; others only see/update self via REST.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      /** Set in `beforeChange` for public signup so field validation runs before hooks can run. */
      required: false,
      defaultValue: ['customer'],
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      access: {
        create: ({ req }) => Boolean(req.user),
        read: () => true,
        update: ({ req }) =>
          Boolean(
            req.user &&
              Array.isArray((req.user as { roles?: string[] }).roles) &&
              (req.user as { roles?: string[] }).roles?.includes('admin'),
          ),
      },
    },
  ],
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false
      const roles = (user as { roles?: string[] }).roles
      if (Array.isArray(roles) && roles.includes('admin')) return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      const roles = (user as { roles?: string[] }).roles
      if (Array.isArray(roles) && roles.includes('admin')) return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      const roles = (user as { roles?: string[] }).roles
      return Boolean(Array.isArray(roles) && roles.includes('admin'))
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create' || req.user) return data
        try {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            req,
            overrideAccess: true,
          })
          if (totalDocs === 0) {
            return { ...data, roles: ['admin'] }
          }
        } catch {
          /* count failed — still create as customer */
        }
        return { ...data, roles: ['customer'] }
      },
    ],
  },
}
