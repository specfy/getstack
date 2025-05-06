import { extendedListTech } from '@stackhub/backend/dist/utils/stacks.js';
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
  IconCreditCard,
  IconDatabase,
  IconDatabaseEdit,
  IconNetwork,
  IconPackages,
  IconScan,
  IconServer,
  IconSparkles,
  IconStack2,
  IconTestPipe,
  IconTool,
  IconTransform,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';

import type { AllowedKeys, TechItem, TechType } from '@specfy/stack-analyser';
import type { ExtendedTechItem } from '@stackhub/backend/dist/utils/stacks.js';
import type { Icon } from '@tabler/icons-react';

export const stackDefinition: Record<TechType, { name: string; icon: Icon; description: string }> =
  {
    ai: {
      name: 'AI',
      icon: IconSparkles,
      description: 'AI and machine learning tools and services.',
    },
    analytics: {
      name: 'Analytics',
      icon: IconChartHistogram,
      description: 'Tools for data analysis and business intelligence.',
    },
    api: {
      name: 'API',
      icon: IconCloudDataConnection,
      description: 'Services and tools for building and managing APIs.',
    },
    app: {
      name: 'Software',
      icon: IconApps,
      description: 'General software applications and platforms.',
    },
    auth: {
      name: 'Auth',
      icon: IconUsers,
      description: 'Authentication and authorization services.',
    },
    ci: {
      name: 'CI',
      icon: IconTestPipe,
      description: 'Continuous Integration and Continuous Deployment tools.',
    },
    cloud: {
      name: 'Cloud',
      icon: IconCloud,
      description: 'Cloud computing platforms and services.',
    },
    db: {
      name: 'Database',
      icon: IconDatabase,
      description: 'Databases and data storage solutions.',
    },
    etl: {
      name: 'ETL',
      icon: IconTransform,
      description: 'Extract, Transform, Load processes and tools.',
    },
    framework: {
      name: 'Framework',
      icon: IconStack2,
      description: 'Software frameworks for application development.',
    },
    hosting: {
      name: 'Hosting',
      icon: IconServer,
      description: 'Web and application hosting services.',
    },
    language: {
      name: 'Language',
      icon: IconCode,
      description: 'Programming languages used in the stack.',
    },
    messaging: {
      name: 'Messaging',
      icon: IconBroadcast,
      description: 'Messaging systems and services.',
    },
    monitoring: {
      name: 'Monitoring',
      icon: IconBug,
      description: 'Application and infrastructure monitoring tools.',
    },
    network: {
      name: 'Network',
      icon: IconNetwork,
      description: 'Networking components and services.',
    },
    notification: {
      name: 'Notification',
      icon: IconBellRinging,
      description: 'Services for sending notifications.',
    },
    queue: { name: 'Queue', icon: IconBinaryTree2, description: 'Message queue systems.' },
    saas: { name: 'SaaS', icon: IconBrowser, description: 'Software as a Service platforms.' },
    storage: {
      name: 'Storage',
      icon: IconPackages,
      description: 'Data storage solutions like object storage.',
    },
    tool: { name: 'Tool', icon: IconTool, description: 'Development tools and utilities.' },
    test: {
      name: 'Test Library',
      icon: IconTestPipe,
      description: 'Libraries and frameworks for testing software.',
    },
    ui: {
      name: 'UI Library',
      icon: IconAppWindow,
      description: 'User Interface libraries and frameworks.',
    },
    payment: {
      name: 'Payment',
      icon: IconCreditCard,
      description: 'Payment processing services and platforms.',
    },
    linter: {
      name: 'Linter',
      icon: IconScan,
      description: 'Code quality tools and linters.',
    },
    collaboration: {
      name: 'Collaboration',
      icon: IconUsersGroup,
      description: 'Collaboration tools and platforms.',
    },
    orm: {
      name: 'ORM',
      icon: IconDatabaseEdit,
      description: 'ORM and database query builder tools.',
    },
  };

export const stackOrder: TechType[] = [
  // Popular
  'language',
  'db',
  'ai',

  // Tools
  'cloud',
  'framework',
  'queue',

  // Store
  'storage',
  'hosting',
  'monitoring',

  // CI
  'ci',
  'test',
  'linter',

  // UI
  'auth',
  'ui',

  // Events
  'analytics',
  'notification',
  'collaboration',

  // Other stuff
  'payment',
  'etl',
  'orm',

  'tool',
  'saas',
  'api',

  'app',
  'network',

  // Deprecated
  'messaging',
];

export { listTech } from '@specfy/stack-analyser/dist/common/techs.generated.js';

export const listIndexed = {} as Record<AllowedKeys, ExtendedTechItem & TechItem>;
for (const tech of extendedListTech) {
  listIndexed[tech.key] = tech;
}
