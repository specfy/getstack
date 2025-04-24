import { listTech } from '@specfy/stack-analyser/dist/common/techs.generated';
import {
  IconAppWindow,
  IconApps,
  IconBellRinging,
  IconBinaryTree2,
  IconBroadcast,
  IconBrowser,
  IconBug,
  IconChartHistogram,
  IconCloud,
  IconCloudDataConnection,
  IconCode,
  IconDatabase,
  IconNetwork,
  IconPackages,
  IconServer,
  IconSparkles,
  IconStack2,
  IconTestPipe,
  IconTool,
  IconTransform,
  IconUsers,
} from '@tabler/icons-react';

import type { TechItem, TechType } from '@specfy/stack-analyser';
import type { Icon } from '@tabler/icons-react';

export const stackDefinition: Record<TechType, { name: string; icon: Icon }> = {
  ai: { name: 'AI', icon: IconSparkles },
  analytics: { name: 'Analytics', icon: IconChartHistogram },
  api: { name: 'API', icon: IconCloudDataConnection },
  app: { name: 'Software', icon: IconApps },
  auth: { name: 'Auth', icon: IconUsers },
  ci: { name: 'CI', icon: IconTestPipe },
  cloud: { name: 'Cloud', icon: IconCloud },
  db: { name: 'Database', icon: IconDatabase },
  etl: { name: 'ETL', icon: IconTransform },
  framework: { name: 'Framework', icon: IconStack2 },
  hosting: { name: 'Hosting', icon: IconServer },
  language: { name: 'Language', icon: IconCode },
  messaging: { name: 'Messaging', icon: IconBroadcast },
  monitoring: { name: 'Monitoring', icon: IconBug },
  network: { name: 'Network', icon: IconNetwork },
  notification: { name: 'Notification', icon: IconBellRinging },
  queue: { name: 'Queue', icon: IconBinaryTree2 },
  saas: { name: 'SaaS', icon: IconBrowser },
  storage: { name: 'Storage', icon: IconPackages },
  tool: { name: 'Tool', icon: IconTool },
  test: { name: 'Test Library', icon: IconTestPipe },
  ui: { name: 'UI Library', icon: IconAppWindow },
};

export const supportedArray = listTech;

export const supportedIndexed: Record<string, TechItem> = {};
for (const tech of Object.values(supportedArray)) {
  supportedIndexed[tech.key] = tech;
}
