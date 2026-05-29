'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath, unstable_cache } from 'next/cache'
import { nanoid } from 'nanoid'
import { CACHE_TIME } from '@/constants/common'
import { ROUTES } from '@/constants/routes'

export async function getAllManagers() {
  const { data, error } = await supabaseAdmin
    .from('manager')
    .select('*')
    .order('create_at', { ascending: false })

  if (error) {
    console.error('getManagers error:', error)
    return []
  }
  return data
}

export async function upsertManager(payload: any) {
  try {
    const isEditing = !!payload.uid
    const uid = isEditing ? payload.uid : nanoid(8)
    const now = new Date().toISOString()

    const data = {
      ...payload,
      uid,
      update_at: now,
      ...(isEditing ? {} : { create_at: now })
    }

    const { error } = await supabaseAdmin
      .from('manager')
      .upsert(data)

    if (error) throw error

    revalidatePath(ROUTES.SUPER_ADMIN.HOME)


    return { success: true }
  } catch (err: any) {
    console.error('upsertManager error:', err)
    return { success: false, message: err.message }
  }
}

export async function deleteManager(uid: string) {
  const { error } = await supabaseAdmin
    .from('manager')
    .delete()
    .eq('uid', uid)

  if (error) {
    console.error('deleteManager error:', error)
    return { success: false, message: error.message }
  }
  revalidatePath(ROUTES.SUPER_ADMIN.HOME)
  return { success: true }
}

export const getNotifyProcedures = unstable_cache(
  async () => {
    const { data, error } = await supabaseAdmin
      .from('line_notify_procedure')
      .select('*')
      .order('create_at', { ascending: false })

    if (error) {
      console.error('getNotifyProcedures error:', error)
      return []
    }

    return data
  },
  ['line_notify_procedure'],
  {
    revalidate: CACHE_TIME,
    tags: ['line_notify_procedure']
  }
)

export async function uploadLogo(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file provided')

    // Ensure the bucket exists
    const { data: buckets, error: getBucketsError } = await supabaseAdmin.storage.listBuckets()
    if (getBucketsError) throw getBucketsError

    const hasLogosBucket = buckets?.some((b: any) => b.name === 'logos')
    if (!hasLogosBucket) {
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket('logos', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/*']
      })
      if (createBucketError) throw createBucketError
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `logos/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabaseAdmin.storage
      .from('logos')
      .upload(filePath, buffer, {
        contentType: file.type,
        duplex: 'half'
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('logos')
      .getPublicUrl(filePath)

    return { success: true, publicUrl }
  } catch (err: any) {
    console.error('uploadLogo error:', err)
    return { success: false, message: err.message }
  }
}
