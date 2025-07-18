import { extendedListTech } from '@getstack/backend/dist/utils/stacks.js';
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
  IconCodeDots,
  IconCreditCard,
  IconDatabase,
  IconDatabaseEdit,
  IconFrame,
  IconIcons,
  IconInputCheck,
  IconLayout,
  IconMap,
  IconMessage,
  IconNetwork,
  IconPackage,
  IconPackages,
  IconRobot,
  IconScan,
  IconServer,
  IconSettingsCode,
  IconShield,
  IconSitemap,
  IconSparkles,
  IconStopwatch,
  IconTestPipe,
  IconTool,
  IconTransform,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';

import type { ExtendedTechItem } from '@getstack/backend/dist/utils/stacks.js';
import type { AllowedKeys, TechItem, TechType } from '@specfy/stack-analyser';
import type { Icon } from '@tabler/icons-react';

export interface CategoryDefinition {
  name: string;
  icon: Icon;
  description: string;
  keyword: string;
}
export const categories: Record<TechType, CategoryDefinition> = {
  ai: {
    name: 'AI',
    icon: IconSparkles,
    description: 'Artificial Intelligence and Machine Learning services, libraries, and platforms.',
    keyword: 'ai llm',
  },
  analytics: {
    name: 'Analytics',
    icon: IconChartHistogram,
    description:
      'Tools and platforms for data collection, processing, and visualization to derive insights.',
    keyword: 'analytics',
  },
  api: {
    name: 'API',
    icon: IconCloudDataConnection,
    description:
      'Technologies and services for designing, building, and managing Application Programming Interfaces.',
    keyword: 'api rest',
  },
  app: {
    name: 'Software',
    icon: IconApps,
    description: 'General-purpose software applications, platforms, and utilities.',
    keyword: 'app software application',
  },
  auth: {
    name: 'Auth',
    icon: IconUsers,
    description:
      'Services and libraries for implementing user authentication and authorization securely.',
    keyword: 'auth authentication authorization',
  },
  ci: {
    name: 'CI',
    icon: IconTestPipe,
    description:
      'Continuous Integration and Deployment tools for automating software build, test, and release pipelines.',
    keyword: 'ci cd continuous integration continuous deployment',
  },
  cloud: {
    name: 'Cloud',
    icon: IconCloud,
    description:
      'Cloud computing platforms providing scalable infrastructure, storage, and various managed services.',
    keyword: 'cloud computing infrastructure',
  },
  db: {
    name: 'Database',
    icon: IconDatabase,
    description:
      'Relational, NoSQL, and other database systems for data storage, retrieval, and management.',
    keyword: 'db database relational nosql',
  },
  etl: {
    name: 'ETL',
    icon: IconTransform,
    description:
      'Tools and processes for Extracting, Transforming, and Loading data between systems.',
    keyword: 'etl extract transform load',
  },
  framework: {
    name: 'Framework',
    icon: IconFrame,
    description:
      'Software libraries and architectures providing a foundation for application development.',
    keyword: 'framework library',
  },
  hosting: {
    name: 'Hosting',
    icon: IconServer,
    description:
      'Services for hosting websites, applications, and backend infrastructure on servers.',
    keyword: 'hosting website application backend infrastructure',
  },
  language: {
    name: 'Language',
    icon: IconCode,
    description: 'Programming languages used to write the codebase and associated tooling.',
    keyword: 'language programming code',
  },
  messaging: {
    name: 'Messaging',
    icon: IconBroadcast,
    description:
      "Legacy or general messaging systems; consider 'Queue' or 'Notification' for specifics.",
    keyword: '',
  },
  monitoring: {
    name: 'Monitoring',
    icon: IconBug,
    description:
      'Tools for observing application performance, infrastructure health, and system logs.',
    keyword: 'monitoring performance health system logs',
  },
  network: {
    name: 'Network',
    icon: IconNetwork,
    description: 'Networking infrastructure, protocols, and services like CDNs or load balancers.',
    keyword: 'network infrastructure protocols services cdn load balancer',
  },
  notification: {
    name: 'Notification',
    icon: IconBellRinging,
    description:
      'Services and platforms for dispatching alerts and notifications across various channels.',
    keyword: 'notification alert alerting email sms push webhook',
  },
  queue: {
    name: 'Queue',
    icon: IconBinaryTree2,
    description: 'Message queuing systems for asynchronous task processing and communication.',
    keyword: 'queue message queuing task processing communication',
  },
  saas: {
    name: 'SaaS',
    icon: IconBrowser,
    description:
      'General Software-as-a-Service platforms not fitting into more specific categories.',
    keyword: 'saas software as a service platform',
  },
  storage: {
    name: 'Storage',
    icon: IconPackages,
    description:
      'Solutions for data persistence, including object storage, block storage, and file systems.',
    keyword: 'storage data persistence object block file system',
  },
  tool: {
    name: 'Tool',
    icon: IconTool,
    description: 'Development utilities, SDKs, and other auxiliary tools for software engineering.',
    keyword: 'tool sdk dev',
  },
  test: {
    name: 'Test Library',
    icon: IconTestPipe,
    description:
      'Libraries, frameworks, and tools specifically for writing and running software tests.',
    keyword: 'test library unit integration e2e',
  },
  ui: {
    name: 'UI Library',
    icon: IconAppWindow,
    description:
      'Frameworks and component libraries for building user interfaces and frontend experiences.',
    keyword: 'ui library component',
  },
  payment: {
    name: 'Payment',
    icon: IconCreditCard,
    description:
      'Services and gateways for processing online payments and managing financial transactions.',
    keyword: 'payment gateway',
  },
  linter: {
    name: 'Linter',
    icon: IconScan,
    description:
      'Static analysis tools for enforcing code style, identifying errors, and improving code quality.',
    keyword: 'linter static analysis code style error improvement',
  },
  collaboration: {
    name: 'Collaboration',
    icon: IconUsersGroup,
    description:
      'Platforms and tools facilitating teamwork, communication, and project management.',
    keyword: 'collaboration teamwork communication project management',
  },
  orm: {
    name: 'ORM',
    icon: IconDatabaseEdit,
    description:
      'Object-Relational Mapping tools and query builders for database interaction in applications.',
    keyword: 'orm object relational mapping query builder db database',
  },
  communication: {
    name: 'Communication',
    icon: IconMessage,
    description:
      'Services and platforms for real-time or asynchronous communication, like chat or email APIs.',
    keyword: 'communication real-time asynchronous chat email',
  },
  package_manager: {
    name: 'Package Manager',
    icon: IconPackage,
    description:
      'Tools for managing software dependencies, libraries, and project packages efficiently.',
    keyword: 'package manager project dependency',
  },
  cms: {
    name: 'CMS',
    icon: IconBlockquote,
    description:
      'Content Management Systems for creating, managing, and modifying digital content for websites.',
    keyword: 'cms content management system website blog documentation docs',
  },
  crm: {
    name: 'CRM',
    icon: IconUsers,
    description:
      'Customer Relationship Management platforms for managing interactions and data with customers.',
    keyword: 'crm customer relationship management',
  },
  security: {
    name: 'Security',
    icon: IconShield,
    description:
      'Tools, services, and platforms focused on application security, vulnerability scanning, and threat detection.',
    keyword: 'security application security vulnerability scanning threat detection',
  },
  automation: {
    name: 'Automation',
    icon: IconRobot,
    description: 'Tools and services for automating tasks and workflows. ',
    keyword: 'automation task workflow cron job',
  },
  runtime: {
    name: 'Runtime',
    icon: IconStopwatch,
    description: 'Execution environments that compile and run code.',
    keyword: 'runtime application process execution environment interpreter compiler',
  },
  ui_framework: {
    name: 'UI Framework',
    icon: IconLayout,
    description:
      'Frameworks and component libraries for building user interfaces and frontend experiences.',
    keyword: 'ui framework component',
  },
  iac: {
    name: 'IaC',
    icon: IconSettingsCode,
    description: 'Infrastructure as Code tools for managing infrastructure and services.',
    keyword: 'iac infrastructure as code',
  },
  maps: {
    name: 'Maps',
    icon: IconMap,
    description: 'Maps and geospatial services for location-based applications.',
    keyword: 'maps geospatial location based application',
  },
  iconset: {
    name: 'Icon Library',
    icon: IconIcons,
    description: 'Icon libraries for building user interfaces and frontend experiences.',
    keyword: 'iconset icon library',
  },
  builder: {
    name: 'Builder',
    icon: IconCodeDots,
    description: 'Tools for building, compiling or transpiling code',
    keyword: 'builder bundler compiler transpiler',
  },
  ssg: {
    name: 'Static Site Generator',
    icon: IconSitemap,
    description: 'Static Site Generators for building user interfaces, blogs, documentation, etc.',
    keyword: 'ssg static site generator',
  },
  validation: {
    name: 'Data Validation',
    icon: IconInputCheck,
    description: 'Validation tools for input data, schemas, etc.',
    keyword: 'validation schema validation',
  },
};

export const categoryOrder: TechType[] = [
  // Popular
  'language',
  'db',
  'ai',

  // UI
  'ui_framework',
  'framework',
  'ui',

  // Tools
  'cloud',
  'iac',
  'storage',

  // Store
  'queue',
  'monitoring',
  'hosting',

  // CI
  'ci',
  'test',
  'linter',

  // Events
  'notification',
  'communication',
  'collaboration',

  'orm',
  'auth',
  'analytics',

  // Dev tools
  'package_manager',
  'runtime',
  'tool',

  'validation',
  'builder',

  // Saas but well known
  'cms',
  'ssg',
  'etl',

  // Saas but broader
  'automation',
  'saas',
  'app',

  'iconset',
  'payment',
  'maps',

  // Everything else
  'network',
  'crm',
  'security',

  // Deprecated
  'api',
  'messaging',
];

export const categoryGroup: { name: string; categories: TechType[]; description: string }[] = [
  {
    name: 'Highlight',
    description: 'The most popular categories',
    categories: ['language', 'db', 'ai'],
  },

  {
    name: 'Infrastructure',
    description: 'Most popular infrastructure and services for hosting and managing applications',
    categories: ['cloud', 'iac', 'storage', 'queue', 'monitoring', 'hosting'],
  },

  {
    name: 'UI & App',
    description: 'Most popular libraries, and tools for building website and user interfaces',
    categories: ['ui_framework', 'framework', 'ui', 'iconset', 'ssg', 'auth', 'cms', 'maps'],
  },

  {
    name: 'Data Libraries',
    description: 'Most popular libraries for data manipulation and validation',
    categories: ['orm', 'validation', 'automation'],
  },

  {
    name: 'Dev tools',
    description: 'Most popular tools for development',
    categories: ['runtime', 'package_manager', 'builder', 'tool'],
  },

  {
    name: 'CI',
    description: 'Most popular CI/CD tools for automating workflows',
    categories: ['ci', 'test', 'linter'],
  },

  {
    name: 'SaaS',
    description: 'Most popular SaaS tools for building applications',
    categories: [
      'analytics',
      'collaboration',
      'communication',
      'saas',
      'payment',
      'etl',
      'crm',
      'api',
    ],
  },

  {
    name: 'Others',
    description: 'Everything else',
    categories: ['app', 'security', 'network'],
  },
];

export const listIndexed = {} as Record<AllowedKeys, ExtendedTechItem & TechItem>;
for (const tech of extendedListTech) {
  listIndexed[tech.key] = tech;
}

export const listCategories = Object.entries(categories).map((v) => {
  return { key: v[0], ...v[1] };
});

export { extendedListTech } from '@getstack/backend/dist/utils/stacks.js';
