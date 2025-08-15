import { NhostClient } from '@nhost/nhost-js';

export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || 'yvmegydgacgqiqxlffrr',
  region: import.meta.env.VITE_NHOST_REGION || 'ap-south-1',
});
