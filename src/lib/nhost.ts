import { NhostClient } from '@nhost/nhost-js';

// Check if we have valid Nhost configuration
const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN;
const region = import.meta.env.VITE_NHOST_REGION;

// If no valid configuration is provided, we'll use a mock mode
const hasValidConfig = subdomain && region && 
  subdomain !== 'your-subdomain' && 
  region !== 'your-region';

const nhost = new NhostClient({
  subdomain: hasValidConfig ? subdomain : 'demo',
  region: hasValidConfig ? region : 'us-east-1',
});

export { nhost, hasValidConfig };