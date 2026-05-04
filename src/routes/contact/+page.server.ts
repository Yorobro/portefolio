import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { useCases, hashIp } from '$lib/composition-root';
import { ContactMessageRejectedError } from '$domain/errors/ContactMessageRejectedError';
import { InvalidEmailError } from '$domain/errors/InvalidEmailError';

const formSchema = z.object({
  email: z.string().min(1).max(320),
  name: z.string().min(1).max(120),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  // Honeypot — must be empty
  website: z.string().max(0).optional().default(''),
});

export const actions: Actions = {
  default: async ({ request, getClientAddress }) => {
    const data = Object.fromEntries(await request.formData());
    const parsed = formSchema.safeParse(data);
    if (!parsed.success) {
      return fail(400, { error: 'Champs invalides.', values: data });
    }
    if (parsed.data.website.length > 0) {
      // Bot detected — pretend success
      return { success: true };
    }
    const ipHash = hashIp(getClientAddress() ?? 'unknown');
    const r = await useCases.submitContactMessage({
      email: parsed.data.email,
      name: parsed.data.name,
      subject: parsed.data.subject,
      message: parsed.data.message,
      ipHash,
    });
    if (!r.ok) {
      if (r.error instanceof InvalidEmailError) {
        return fail(400, { error: 'Email invalide.', values: data });
      }
      if (r.error instanceof ContactMessageRejectedError) {
        if (r.error.reason === 'rate-limited') {
          return fail(429, { error: 'Trop de messages, réessaye plus tard.', values: data });
        }
        return fail(400, { error: r.error.message, values: data });
      }
      return fail(500, { error: 'Erreur serveur. Réessaye plus tard.', values: data });
    }
    return { success: true, emailDelivered: r.value.emailDelivered };
  },
};
