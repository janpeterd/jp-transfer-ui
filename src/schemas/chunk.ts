import { z } from 'zod'

export const chunkSchema = z.object({
  fileId: z.number(),
  chunkIndex: z.number(),
  chunkSize: z.number(),
  chunkChecksum: z.string().length(40)
})
