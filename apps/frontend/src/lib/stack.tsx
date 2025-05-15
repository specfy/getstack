import { extendedListTech } from '@stackhub/backend/dist/utils/stacks.js';
import {
  IconAppWindow,
  IconApps,
  IconBellRinging,
  IconBinaryTree2,
  IconBlockquote,
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
  IconMessage,
  IconNetwork,
  IconPackage,
  IconPackages,
  IconScan,
  IconServer,
  IconShield,
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

export interface CategoryDefinition {
  name: string;
  icon: Icon;
  description: string;
}
export const stackDefinition: Record<TechType, CategoryDefinition> = {
  ai: {
    name: 'AI',
    icon: IconSparkles,
    description: 'Artificial Intelligence and Machine Learning services, libraries, and platforms.',
  },
  analytics: {
    name: 'Analytics',
    icon: IconChartHistogram,
    description:
      'Tools and platforms for data collection, processing, and visualization to derive insights.',
  },
  api: {
    name: 'API',
    icon: IconCloudDataConnection,
    description:
      'Technologies and services for designing, building, and managing Application Programming Interfaces.',
  },
  app: {
    name: 'Software',
    icon: IconApps,
    description: 'General-purpose software applications, platforms, and utilities.',
  },
  auth: {
    name: 'Auth',
    icon: IconUsers,
    description:
      'Services and libraries for implementing user authentication and authorization securely.',
  },
  ci: {
    name: 'CI',
    icon: IconTestPipe,
    description:
      'Continuous Integration and Deployment tools for automating software build, test, and release pipelines.',
  },
  cloud: {
    name: 'Cloud',
    icon: IconCloud,
    description:
      'Cloud computing platforms providing scalable infrastructure, storage, and various managed services.',
  },
  db: {
    name: 'Database',
    icon: IconDatabase,
    description:
      'Relational, NoSQL, and other database systems for data storage, retrieval, and management.',
  },
  etl: {
    name: 'ETL',
    icon: IconTransform,
    description:
      'Tools and processes for Extracting, Transforming, and Loading data between systems.',
  },
  framework: {
    name: 'Framework',
    icon: IconStack2,
    description:
      'Software libraries and architectures providing a foundation for application development.',
  },
  hosting: {
    name: 'Hosting',
    icon: IconServer,
    description:
      'Services for hosting websites, applications, and backend infrastructure on servers.',
  },
  language: {
    name: 'Language',
    icon: IconCode,
    description: 'Programming languages used to write the codebase and associated tooling.',
  },
  messaging: {
    name: 'Messaging',
    icon: IconBroadcast,
    description:
      "Legacy or general messaging systems; consider 'Queue' or 'Notification' for specifics.",
  },
  monitoring: {
    name: 'Monitoring',
    icon: IconBug,
    description:
      'Tools for observing application performance, infrastructure health, and system logs.',
  },
  network: {
    name: 'Network',
    icon: IconNetwork,
    description: 'Networking infrastructure, protocols, and services like CDNs or load balancers.',
  },
  notification: {
    name: 'Notification',
    icon: IconBellRinging,
    description:
      'Services and platforms for dispatching alerts and notifications across various channels.',
  },
  queue: {
    name: 'Queue',
    icon: IconBinaryTree2,
    description: 'Message queuing systems for asynchronous task processing and communication.',
  },
  saas: {
    name: 'SaaS',
    icon: IconBrowser,
    description:
      'General Software-as-a-Service platforms not fitting into more specific categories.',
  },
  storage: {
    name: 'Storage',
    icon: IconPackages,
    description:
      'Solutions for data persistence, including object storage, block storage, and file systems.',
  },
  tool: {
    name: 'Tool',
    icon: IconTool,
    description: 'Development utilities, SDKs, and other auxiliary tools for software engineering.',
  },
  test: {
    name: 'Test Library',
    icon: IconTestPipe,
    description:
      'Libraries, frameworks, and tools specifically for writing and running software tests.',
  },
  ui: {
    name: 'UI Library',
    icon: IconAppWindow,
    description:
      'Frameworks and component libraries for building user interfaces and frontend experiences.',
  },
  payment: {
    name: 'Payment',
    icon: IconCreditCard,
    description:
      'Services and gateways for processing online payments and managing financial transactions.',
  },
  linter: {
    name: 'Linter',
    icon: IconScan,
    description:
      'Static analysis tools for enforcing code style, identifying errors, and improving code quality.',
  },
  collaboration: {
    name: 'Collaboration',
    icon: IconUsersGroup,
    description:
      'Platforms and tools facilitating teamwork, communication, and project management.',
  },
  orm: {
    name: 'ORM',
    icon: IconDatabaseEdit,
    description:
      'Object-Relational Mapping tools and query builders for database interaction in applications.',
  },
  communication: {
    name: 'Communication',
    icon: IconMessage,
    description:
      'Services and platforms for real-time or asynchronous communication, like chat or email APIs.',
  },
  package_manager: {
    name: 'Package Manager',
    icon: IconPackage,
    description:
      'Tools for managing software dependencies, libraries, and project packages efficiently.',
  },
  cms: {
    name: 'CMS',
    icon: IconBlockquote,
    description:
      'Content Management Systems for creating, managing, and modifying digital content for websites.',
  },
  crm: {
    name: 'CRM',
    icon: IconUsers,
    description:
      'Customer Relationship Management platforms for managing interactions and data with customers.',
  },
  security: {
    name: 'Security',
    icon: IconShield,
    description:
      'Tools, services, and platforms focused on application security, vulnerability scanning, and threat detection.',
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
  'analytics',

  // Events
  'notification',
  'communication',
  'collaboration',

  // Dev tools
  'orm',
  'tool',
  'package_manager',

  // Saas but well known
  'cms',
  'payment',
  'etl',

  // Saas but broader
  'saas',
  'api',
  'app',

  // Everything else
  'network',
  'crm',
  'security',

  // Deprecated
  'messaging',
];

export { listTech } from '@specfy/stack-analyser/dist/common/techs.generated.js';

export const listIndexed = {} as Record<AllowedKeys, ExtendedTechItem & TechItem>;
for (const tech of extendedListTech) {
  listIndexed[tech.key] = tech;
}
