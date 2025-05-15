import { listTech } from '@specfy/stack-analyser/dist/common/techs.generated.js';

import type { AllowedKeys, TechItem } from '@specfy/stack-analyser';

export const colors: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] = [
  'hsl(200.66deg 52.14% 77.06%)',
  'hsl(204.16deg 70.62% 41.37%)',
  'hsl(91.76deg 57.05% 70.78%)',
  'hsl(116.38deg 56.86% 40%)',
  'hsl(0.61deg 92.45% 79.22%)',
  'hsl(359.4deg 79.45% 49.61%)',
  'hsl(33.8deg 97.26% 71.37%)',
  'hsl(29.88deg 100% 50%)',
  'hsl(280deg 30.51% 76.86%)',
  'hsl(269.03deg 43.26% 42.16%)',
  'hsl(60deg 100% 80%)',
  'hsl(21.46deg 63.13% 42.55%)',
];

export interface ExtendedTechItem {
  website?: string;
  github?: string;
  iconURL?: string;
  description?: string;
}

export type TechItemWithExtended = ExtendedTechItem & TechItem;

// Hardcode the website URL for each entry
const extendedInfo: Record<AllowedKeys, ExtendedTechItem> = {
  adminer: {
    website: 'https://www.adminer.org/',
    github: 'vrana/adminer',
    description: 'Fully featured database management tool written in PHP.',
  },
  adobe: {
    website: 'https://www.adobe.com/',
    description:
      'Software company that provides a range of products and services for the creation, management, and distribution of digital content.',
  },
  adobecommercecloud: {
    website: 'https://business.adobe.com/products/commerce/magento/cloud.html',
    github: 'magento/magento-cloud',
    description: 'Cloud-based e-commerce platform, formerly Magento.',
  },
  adyen: {
    website: 'https://www.adyen.com/',
    description: 'Global payment platform for businesses.',
  },
  airbyte: {
    website: 'https://airbyte.com/',
    github: 'airbytehq/airbyte',
    description: 'Open-source data integration platform.',
  },
  airtable: {
    website: 'https://www.airtable.com/',
    description: 'Cloud collaboration platform combining spreadsheet and database features.',
  },
  algolia: {
    website: 'https://www.algolia.com/',
    description: 'Site search and discovery platform for websites and mobile apps.',
  },
  alibabacloud: {
    website: 'https://www.alibabacloud.com/',
    description: 'Cloud computing services provider, a subsidiary of Alibaba Group.',
  },
  alpinejs: {
    website: 'https://alpinejs.dev/',
    github: 'alpinejs/alpine',
    description: 'Minimalist JavaScript framework for composing behavior directly in markup.',
  },
  amplitude: {
    website: 'https://amplitude.com/',
    description: 'Product analytics platform for web and mobile applications.',
  },
  angular: {
    website: 'https://angular.io/',
    github: 'angular/angular',
    description:
      'Platform and framework for building single-page client applications using HTML and TypeScript.',
  },
  ansible: {
    website: 'https://www.ansible.com/',
    github: 'ansible/ansible',
    description:
      'Open-source software provisioning, configuration management, and application-deployment tool.',
  },
  anthropic: {
    website: 'https://www.anthropic.com/',
    description:
      'AI safety and research company focused on building reliable, interpretable, and steerable AI systems.',
  },
  apache_airflow: {
    website: 'https://airflow.apache.org/',
    github: 'apache/airflow',
    description:
      'Open-source platform to programmatically author, schedule, and monitor workflows.',
  },
  apache_cassandra: {
    website: 'https://cassandra.apache.org/_/index.html',
    github: 'apache/cassandra',
    description:
      'Distributed NoSQL database management system designed for high availability and scalability.',
  },
  apache_couchdb: {
    website: 'https://couchdb.apache.org/',
    github: 'apache/couchdb',
    description:
      'NoSQL document database that uses JSON for documents, and JavaScript for MapReduce queries.',
  },
  apache_flink: {
    website: 'https://flink.apache.org/',
    github: 'apache/flink',
    description:
      'Open-source framework for stateful computations over unbounded and bounded data streams.',
  },
  apache_hadoop: {
    website: 'https://hadoop.apache.org/',
    github: 'apache/hadoop',
    description:
      'Framework for distributed storage and processing of large datasets across clusters of computers.',
  },
  apache_hive: {
    website: 'https://hive.apache.org/',
    github: 'apache/hive',
    description:
      'Data warehouse software facilitating reading, writing, and managing large datasets residing in distributed storage using SQL.',
  },
  apache_iceberg: {
    website: 'https://iceberg.apache.org/',
    github: 'apache/iceberg',
    description:
      'Open table format for huge analytic datasets, enabling complex data management on data lakes.',
  },
  apache_kafka: {
    website: 'https://kafka.apache.org/',
    github: 'apache/kafka',
    description:
      'Distributed event streaming platform capable of handling trillions of events a day.',
  },
  apache_solr: {
    website: 'https://solr.apache.org/',
    github: 'apache/solr',
    description: 'Open-source enterprise search platform built on Apache Lucene.',
  },
  apache_spark: {
    website: 'https://spark.apache.org/',
    github: 'apache/spark',
    description:
      'Unified analytics engine for large-scale data processing, with built-in modules for streaming, SQL, machine learning and graph processing.',
  },
  apache_storm: {
    website: 'https://storm.apache.org/',
    github: 'apache/storm',
    description: 'Distributed real-time computation system for processing streams of data.',
  },
  apache_thrift: {
    website: 'https://thrift.apache.org/',
    github: 'apache/thrift',
    description:
      'Software framework for scalable cross-language services development, combining a software stack with a code generation engine.',
  },
  apiplatform: {
    website: 'https://api-platform.com/',
    github: 'api-platform/api-platform',
    description:
      'PHP framework for building API-driven projects, with support for hypermedia and Linked Data.',
  },
  appveyor: {
    website: 'https://www.appveyor.com/',
    description: 'Hosted continuous integration service for Windows, Linux, and macOS.',
  },
  assemble: {
    website: 'http://assemble.io/',
    github: 'assemble/assemble',
    description:
      'Static site generator for Node.js, often used for creating project documentation and blogs.',
  },
  astro: {
    website: 'https://astro.build/',
    github: 'withastro/astro',
    description:
      'Web framework for building fast, content-focused websites with any UI framework or none at all.',
  },
  atlasgo: {
    website: 'https://atlasgo.io/',
    github: 'ariga/atlas',
    description:
      'Database schema management tool using a declarative approach for managing and migrating database schemas.',
  },
  'atlassian.bitbucket': {
    website: 'https://bitbucket.org/',
    description: 'Git-based source code repository hosting service.',
  },
  'atlassian.confluence': {
    website: 'https://www.atlassian.com/software/confluence',
    description: 'Content collaboration tool for teams to create, share, and discuss work.',
  },
  'atlassian.jira': {
    website: 'https://www.atlassian.com/software/jira',
    description: 'Issue tracking and project management software.',
  },
  'atlassian.opsgenie': {
    website: 'https://www.atlassian.com/software/opsgenie',
    description: 'Incident management platform for operating always-on services.',
  },
  'atlassian.trello': {
    website: 'https://trello.com/',
    description: 'Web-based, Kanban-style, list-making application.',
  },
  atlassian: {
    website: 'https://www.atlassian.com/',
    description:
      'Company developing products for software developers, project managers, and content management.',
  },
  auth0: {
    website: 'https://auth0.com/',
    description: 'Platform for authentication, authorization, and user management.',
  },
  'aws.amplifyhosting': {
    website: 'https://aws.amazon.com/amplify/hosting/',
    description: 'Service for hosting full-stack serverless web apps with continuous deployment.',
  },
  'aws.apigateway': {
    website: 'https://aws.amazon.com/api-gateway/',
    description:
      'Service for creating, publishing, maintaining, monitoring, and securing APIs at any scale.',
  },
  'aws.athena': {
    website: 'https://aws.amazon.com/athena/',
    description: 'Interactive query service to analyze data in Amazon S3 using standard SQL.',
  },
  'aws.bedrock': {
    website: 'https://aws.amazon.com/bedrock/',
    description:
      'Service for building and scaling generative AI applications with foundation models.',
  },
  'aws.cloudformation': {
    website: 'https://aws.amazon.com/cloudformation/',
    description: 'Service for modeling and setting up Amazon Web Services resources.',
  },
  'aws.cloudfront': {
    website: 'https://aws.amazon.com/cloudfront/',
    description: 'Content delivery network (CDN) offering low latency and high transfer speeds.',
  },
  'aws.cloudsearch': {
    website: 'https://aws.amazon.com/cloudsearch/',
    description: 'Managed search service in the cloud for websites and applications.',
  },
  'aws.cloudwatch': {
    website: 'https://aws.amazon.com/cloudwatch/',
    description: 'Monitoring and observability service for AWS resources and applications.',
  },
  'aws.codebuild': {
    website: 'https://aws.amazon.com/codebuild/',
    description:
      'Fully managed continuous integration service that compiles source code, runs tests, and produces software packages.',
  },
  'aws.documentdb': {
    website: 'https://aws.amazon.com/documentdb/',
    description: 'Managed NoSQL database service compatible with MongoDB.',
  },
  'aws.dynamodb': {
    website: 'https://aws.amazon.com/dynamodb/',
    description:
      'Key-value and document database that delivers single-digit millisecond performance at any scale.',
  },
  'aws.ebs': {
    website: 'https://aws.amazon.com/ebs/',
    description: 'Block storage service for use with Amazon EC2 instances.',
  },
  'aws.ec2': {
    website: 'https://aws.amazon.com/ec2/',
    description: 'Service providing secure, resizable compute capacity in the cloud.',
  },
  'aws.ecr': {
    website: 'https://aws.amazon.com/ecr/',
    description: 'Managed container image registry service.',
  },
  'aws.ecs': {
    website: 'https://aws.amazon.com/ecs/',
    description: 'Highly scalable, high-performance container orchestration service.',
  },
  'aws.efs': {
    website: 'https://aws.amazon.com/efs/',
    description: 'Scalable file storage for use with Amazon EC2 instances.',
  },
  'aws.eks': {
    website: 'https://aws.amazon.com/eks/',
    description:
      'Managed Kubernetes service to run Kubernetes on AWS without needing to install or maintain your own Kubernetes control plane.',
  },
  'aws.elasticache': {
    website: 'https://aws.amazon.com/elasticache/',
    description: 'Managed in-memory caching service compatible with Redis or Memcached.',
  },
  'aws.fargate': {
    website: 'https://aws.amazon.com/fargate/',
    description:
      'Serverless compute engine for containers that works with both Amazon ECS and EKS.',
  },
  'aws.glacier': {
    website: 'https://aws.amazon.com/glacier/',
    description:
      'Secure, durable, and low-cost storage service for data archiving and long-term backup.',
  },
  'aws.glue': {
    website: 'https://aws.amazon.com/glue/',
    description: 'Fully managed extract, transform, and load (ETL) service.',
  },
  'aws.kafka': {
    website: 'https://aws.amazon.com/msk/',
    description:
      'Managed service for Apache Kafka to build and run applications that use Kafka to process streaming data.',
  },
  'aws.kinesis': {
    website: 'https://aws.amazon.com/kinesis/',
    description: 'Service for collecting, processing, and analyzing real-time, streaming data.',
  },
  'aws.kms': {
    website: 'https://aws.amazon.com/kms/',
    description:
      'Managed service for creating and controlling encryption keys used to encrypt data.',
  },
  'aws.lambda': {
    website: 'https://aws.amazon.com/lambda/',
    description:
      'Serverless compute service that runs code in response to events and automatically manages the underlying compute resources.',
  },
  'aws.lightsail': {
    website: 'https://aws.amazon.com/lightsail/',
    description:
      'Easy-to-use cloud platform that offers virtual private servers (VPS), SSD-based storage, data transfer, and more.',
  },
  'aws.memorydb': {
    website: 'https://aws.amazon.com/memorydb/',
    description:
      'Redis-compatible, durable, in-memory database service for ultra-fast performance.',
  },
  'aws.mq': {
    website: 'https://aws.amazon.com/amazon-mq/',
    description: 'Managed message broker service for Apache ActiveMQ and RabbitMQ.',
  },
  'aws.neptune': {
    website: 'https://aws.amazon.com/neptune/',
    description: 'Fast, reliable, fully managed graph database service.',
  },
  'aws.opensearch': {
    website: 'https://aws.amazon.com/opensearch-service/',
    description: 'Managed service for OpenSearch, an open-source search and analytics engine.',
  },
  'aws.polly': {
    website: 'https://aws.amazon.com/polly/',
    description: 'Service that turns text into lifelike speech.',
  },
  'aws.rds': {
    website: 'https://aws.amazon.com/rds/',
    description:
      'Managed relational database service for MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server.',
  },
  'aws.redshift': {
    website: 'https://aws.amazon.com/redshift/',
    description:
      'Fast, fully managed data warehouse that makes it simple and cost-effective to analyze all your data.',
  },
  'aws.rekognition': {
    website: 'https://aws.amazon.com/rekognition/',
    description: 'Service that makes it easy to add image and video analysis to applications.',
  },
  'aws.s3': {
    website: 'https://aws.amazon.com/s3/',
    description:
      'Object storage service offering industry-leading scalability, data availability, security, and performance.',
  },
  'aws.sagemaker': {
    website: 'https://aws.amazon.com/sagemaker/',
    description:
      'Fully managed service for building, training, and deploying machine learning (ML) models.',
  },
  'aws.secretsmanager': {
    website: 'https://aws.amazon.com/secrets-manager/',
    description:
      'Service for managing, retrieving, and rotating database credentials, API keys, and other secrets.',
  },
  'aws.ses': {
    website: 'https://aws.amazon.com/ses/',
    description:
      'Cloud-based email sending service designed to help digital marketers and application developers send marketing, notification, and transactional emails.',
  },
  'aws.sfn': {
    website: 'https://aws.amazon.com/step-functions/',
    description:
      'Serverless function orchestrator that makes it easy to sequence AWS Lambda functions and multiple AWS services into business-critical applications.',
  },
  'aws.sns': {
    website: 'https://aws.amazon.com/sns/',
    description:
      'Fully managed pub/sub messaging service for microservices, distributed systems, and serverless applications.',
  },
  'aws.sqs': {
    website: 'https://aws.amazon.com/sqs/',
    description:
      'Fully managed message queuing service for decoupling and scaling microservices, distributed systems, and serverless applications.',
  },
  'aws.timestream': {
    website: 'https://aws.amazon.com/timestream/',
    description: 'Fast, scalable, and serverless time series database service.',
  },
  'aws.translate': {
    website: 'https://aws.amazon.com/translate/',
    description:
      'Neural machine translation service for translating text to and from a variety of languages.',
  },
  aws: {
    website: 'https://aws.amazon.com/',
    description:
      'Comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.',
  },
  'azure.aks': {
    website: 'https://azure.microsoft.com/en-us/products/kubernetes-service/',
    description:
      'Managed Kubernetes service for deploying and managing containerized applications.',
  },
  'azure.ci': {
    website: 'https://azure.microsoft.com/en-us/products/devops/pipelines/',
    description:
      'Cloud service by Azure DevOps for building, testing, and deploying code with CI/CD, also known as Azure Pipelines.',
  },
  'azure.cosmosdb': {
    website: 'https://azure.microsoft.com/en-us/products/cosmos-db/',
    description: 'Globally distributed, multi-model database service.',
  },
  'azure.functions': {
    website: 'https://azure.microsoft.com/en-us/products/functions/',
    description:
      'Serverless compute service to run event-triggered code without managing infrastructure.',
  },
  'azure.mariadb': {
    website: 'https://azure.microsoft.com/en-us/products/mariadb/',
    description: 'Managed MariaDB database service for app development and deployment.',
  },
  'azure.mysql': {
    website: 'https://azure.microsoft.com/en-us/products/mysql/',
    description: 'Managed MySQL database service for app development and deployment.',
  },
  'azure.openai': {
    website: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service/',
    description:
      "Service providing access to OpenAI's powerful language models like GPT-3, Codex, and DALL·E.",
  },
  'azure.postgres': {
    website: 'https://azure.microsoft.com/en-us/products/postgresql/',
    description: 'Managed PostgreSQL database service for app development and deployment.',
  },
  'azure.redis': {
    website: 'https://azure.microsoft.com/en-us/products/cache/',
    description: 'Managed Redis cache service providing fast, scalable data storage.',
  },
  'azure.sql': {
    website: 'https://azure.microsoft.com/en-us/products/azure-sql/database/',
    description: 'Family of managed, secure, and intelligent SQL database services.',
  },
  'azure.staticwebapps': {
    website: 'https://azure.microsoft.com/en-us/products/app-service/static/',
    description:
      'Service for building and deploying static web apps with streamlined CI/CD from code to global high availability.',
  },
  'azure.storage': {
    website: 'https://azure.microsoft.com/en-us/products/storage/',
    description: 'Scalable and secure cloud storage for data, apps, and workloads.',
  },
  azure: {
    website: 'https://azure.microsoft.com/',
    description:
      'Cloud computing service created by Microsoft for building, testing, deploying, and managing applications and services through Microsoft-managed data centers.',
  },
  bash: {
    website: 'https://www.gnu.org/software/bash/',
    description:
      'Unix shell and command language written by Brian Fox for the GNU Project as a free software replacement for the Bourne shell.',
  },
  betterstack: {
    website: 'https://betterstack.com/',
    description: 'Platform for better observability, logging, and incident management.',
  },
  bigcommerce: {
    website: 'https://www.bigcommerce.com/',
    description: 'SaaS e-commerce platform for businesses of all sizes.',
  },
  blackfire: {
    website: 'https://blackfire.io/',
    description: 'Performance testing and profiling tool for PHP applications.',
  },
  blitzjs: {
    website: 'https://blitzjs.com/',
    github: 'blitz-js/blitz',
    description: 'Fullstack React framework built on Next.js, inspired by Ruby on Rails.',
  },
  bootstrap: {
    website: 'https://getbootstrap.com/',
    github: 'twbs/bootstrap',
    description:
      'Open-source CSS framework directed at responsive, mobile-first front-end web development.',
  },
  box: {
    website: 'https://www.box.com/',
    description: 'Cloud content management and file sharing service for businesses.',
  },
  brevo: {
    website: 'https://www.brevo.com/',
    description: 'All-in-one CRM suite for marketing, sales, and customer communication.',
  },
  browserstack: {
    website: 'https://www.browserstack.com/',
    description: 'Cloud web and mobile testing platform.',
  },
  bytebase: {
    website: 'https://www.bytebase.com/',
    github: 'bytebase/bytebase',
    description: 'Database CI/CD and schema migration tool for teams.',
  },
  c: {
    website: 'https://en.wikipedia.org/wiki/C_(programming_language)',
    description:
      'General-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion.',
  },
  caddy: {
    website: 'https://caddyserver.com/',
    github: 'caddyserver/caddy',
    description: 'Extensible, cross-platform, open-source web server written in Go.',
  },
  celery: {
    website: 'https://docs.celeryq.dev/',
    github: 'celery/celery',
    description: 'Asynchronous task queue/job queue based on distributed message passing.',
  },
  checkov: {
    website: 'https://www.checkov.io/',
    github: 'bridgecrewio/checkov',
    description:
      'Static code analysis tool for scanning infrastructure as code files for misconfigurations.',
  },
  chef: {
    website: 'https://www.chef.io/',
    github: 'chef/chef',
    description:
      'Configuration management tool for dealing with machine setup on physical servers, virtual machines and in the cloud.',
  },
  circleci: {
    website: 'https://circleci.com/',
    description: 'Continuous integration and delivery platform.',
  },
  cirrusci: {
    website: 'https://cirrus-ci.org/',
    description:
      'Continuous integration service designed for speed and scalability, particularly for open-source projects.',
  },
  clerk: {
    website: 'https://clerk.com/',
    description: 'Authentication and user management platform for modern web applications.',
  },
  clickhouse: {
    website: 'https://clickhouse.com/',
    github: 'ClickHouse/ClickHouse',
    description:
      'Open-source column-oriented database management system for online analytical processing (OLAP).',
  },
  clicksend: {
    website: 'https://www.clicksend.com/',
    description:
      'Business communication platform offering SMS, email, voice, and direct mail services.',
  },
  'cloudbees.codeship': {
    website: 'https://www.cloudbees.com/products/codeship',
    description: 'Continuous integration and delivery platform by CloudBees.',
  },
  cloudbees: {
    website: 'https://www.cloudbees.com/',
    description: 'Company providing enterprise Jenkins and DevOps solutions.',
  },
  'cloudflare.pages': {
    website: 'https://pages.cloudflare.com/',
    description: 'JAMstack platform for frontend developers to build and deploy websites.',
  },
  'cloudflare.workers': {
    website: 'https://workers.cloudflare.com/',
    description:
      'Serverless execution environment for creating new applications or augmenting existing ones without configuring or maintaining infrastructure.',
  },
  cloudflare: {
    website: 'https://www.cloudflare.com/',
    description:
      'Web infrastructure and website security company providing content delivery network services, DDoS mitigation, Internet security, and distributed domain name server services.',
  },
  cockroachdb: {
    website: 'https://www.cockroachlabs.com/',
    github: 'cockroachdb/cockroach',
    description:
      'Cloud-native, distributed SQL database providing high availability, strong consistency, and horizontal scalability for modern applications.',
  },
  codeclimate: {
    website: 'https://codeclimate.com/',
    description:
      'Automated code review and quality analysis platform helping developers ship better software, faster.',
  },
  codecov: {
    website: 'https://about.codecov.io/',
    description:
      'Code coverage tool providing insights into test coverage for software projects, integrating with CI/CD pipelines.',
  },
  codesandboxci: {
    website: 'https://codesandbox.io/ci',
    description:
      'Cloud-based development environment focused on rapid web application development and prototyping with CI features.',
  },
  cohereai: {
    website: 'https://cohere.com/',
    description:
      'AI platform providing access to advanced large language models for tasks like generation, classification, and embedding.',
  },
  commercetools: {
    website: 'https://commercetools.com/',
    description:
      'Headless commerce platform providing APIs for building custom e-commerce experiences across various touchpoints.',
  },
  consul: {
    website: 'https://www.consul.io/',
    github: 'hashicorp/consul',
    description:
      'Service mesh solution providing service discovery, configuration, and segmentation across distributed systems.',
  },
  contentful: {
    website: 'https://www.contentful.com/',
    description:
      'Composable content platform enabling businesses to create, manage, and deliver digital experiences across channels.',
  },
  convexdb: {
    website: 'https://www.convex.dev/',
    github: 'get-convex/convex',
    description:
      'Backend-as-a-Service platform with a reactive data model, simplifying full-stack web development.',
  },
  couchbase: {
    website: 'https://www.couchbase.com/',
    description:
      'Distributed NoSQL cloud database for business-critical applications, offering versatility and performance.',
  },
  coveralls: {
    website: 'https://coveralls.io/',
    description:
      'Web service to help track code coverage over time, and ensure that all new code is covered.',
  },
  cplusplus: {
    website: 'https://isocpp.org/',
    description:
      'High-performance, general-purpose programming language known for system programming, game development, and complex applications.',
  },
  cratedb: {
    website: 'https://cratedb.com/',
    github: 'crate/crate',
    description:
      'Distributed SQL database for managing machine data and IoT, optimized for real-time analytics on large datasets.',
  },
  crowdin: {
    website: 'https://crowdin.com/',
    description:
      'Cloud-based localization management platform for teams to translate and adapt software, websites, and documentation.',
  },
  csharp: {
    website: 'https://dotnet.microsoft.com/en-us/languages/csharp',
    description:
      'Modern, object-oriented, and type-safe programming language developed by Microsoft, widely used for .NET applications.',
  },
  css: {
    website: 'https://www.w3.org/Style/CSS/',
    description:
      'Style sheet language used for describing the presentation of a document written in a markup language like HTML.',
  },
  cypressci: {
    website: 'https://www.cypress.io/',
    github: 'cypress-io/cypress',
    description:
      'JavaScript-based end-to-end testing framework enabling developers to write tests for web applications directly in the browser.',
  },
  d3js: {
    website: 'https://d3js.org/',
    github: 'd3/d3',
    description:
      'JavaScript library for manipulating documents based on data, enabling powerful data visualization and interaction on the web.',
  },
  dart: {
    website: 'https://dart.dev/',
    github: 'dart-lang/sdk',
    description:
      'Client-optimized programming language for fast apps on any platform, developed by Google and used with Flutter.',
  },
  databricks: {
    website: 'https://www.databricks.com/',
    description:
      'Unified data analytics platform combining data engineering, data science, machine learning, and business analytics.',
  },
  datadog: {
    website: 'https://www.datadoghq.com/',
    description:
      'Monitoring and analytics platform for cloud-scale applications, providing visibility across infrastructure, applications, and logs.',
  },
  dataiku: {
    website: 'https://www.dataiku.com/',
    description:
      'Collaborative data science platform for teams to build, deploy, and monitor AI and analytics applications.',
  },
  datastax: {
    website: 'https://www.datastax.com/',
    description:
      'Company providing enterprise-grade Apache Cassandra solutions and a multi-cloud data platform.',
  },
  datocms: {
    website: 'https://www.datocms.com/',
    description:
      'API-first headless CMS for building modern websites and applications with flexible content management.',
  },
  deepseek: {
    website: 'https://www.deepseek.com/',
    description:
      'AI research company focusing on developing advanced language models and AI technologies.',
  },
  deferrun: {
    website: 'https://www.defer.run/',
    description:
      'Service for easily offloading background jobs and tasks in serverless and traditional applications.',
  },
  deno: {
    website: 'https://deno.land/',
    github: 'denoland/deno',
    description:
      'Secure runtime for JavaScript and TypeScript, built on V8 and Rust, aiming for modern developer productivity.',
  },
  denodeploy: {
    website: 'https://deno.com/deploy',
    description:
      'Distributed system for running JavaScript, TypeScript, and WebAssembly at the edge, close to users.',
  },
  dependabot: {
    website: 'https://github.com/dependabot',
    github: 'dependabot/dependabot-core',
    description:
      'Automated dependency updating tool integrated into GitHub, helping keep projects secure and up-to-date.',
  },
  digitalocean: {
    website: 'https://www.digitalocean.com/',
    description:
      'Cloud infrastructure provider offering virtual servers (Droplets), managed Kubernetes, and object storage solutions.',
  },
  discord: {
    website: 'https://discord.com/',
    description:
      'Communication platform for creating communities, offering voice, video, and text chat for various interests.',
  },
  discourse: {
    website: 'https://www.discourse.org/',
    github: 'discourse/discourse',
    description:
      'Open-source platform for community discussion, often used for forums, mailing lists, and chat rooms.',
  },
  docker: {
    website: 'https://www.docker.com/',
    github: 'moby/moby',
    description:
      'Platform for developing, shipping, and running applications in containers, enabling consistent environments.',
  },
  doctrinephp: {
    website: 'https://www.doctrine-project.org/',
    github: 'doctrine/orm',
    description:
      'Set of PHP libraries primarily focused on providing an object-relational mapper (ORM) and database abstraction layer.',
  },
  docusaurus: {
    website: 'https://docusaurus.io/',
    github: 'facebook/docusaurus',
    description:
      'Static site generator optimized for creating documentation websites, built with React and Markdown.',
  },
  docusign: {
    website: 'https://www.docusign.com/',
    description:
      'Platform for electronic signatures and agreement lifecycle management, facilitating secure digital transactions.',
  },
  droneci: {
    website: 'https://www.drone.io/',
    github: 'drone/drone',
    description:
      'Self-service continuous integration and delivery platform built on container technology for simplicity and scalability.',
  },
  dropbox: {
    website: 'https://www.dropbox.com/',
    description:
      'File hosting service offering cloud storage, file synchronization, personal cloud, and client software.',
  },
  drupal: {
    website: 'https://www.drupal.org/',
    github: 'drupal/drupal',
    description:
      'Open-source content management system (CMS) for building websites, applications, and digital experiences.',
  },
  duckdb: {
    website: 'https://duckdb.org/',
    github: 'duckdb/duckdb',
    description:
      'In-process analytical data management system, designed for speed and ease of use in analytical tasks.',
  },
  dynatrace: {
    website: 'https://www.dynatrace.com/',
    description:
      'Software intelligence platform providing observability, AIOps, and application security for modern cloud environments.',
  },
  elasticcloud: {
    website: 'https://www.elastic.co/cloud/',
    description:
      'Managed Elasticsearch and Kibana service, offering search, observability, and security solutions.',
  },
  elasticsearch: {
    website: 'https://www.elastic.co/elasticsearch/',
    github: 'elastic/elasticsearch',
    description:
      'Distributed, RESTful search and analytics engine capable of addressing a growing number of use cases.',
  },
  electron: {
    website: 'https://www.electronjs.org/',
    github: 'electron/electron',
    description:
      'Framework for creating native desktop applications with web technologies like JavaScript, HTML, and CSS.',
  },
  eleventy: {
    website: 'https://www.11ty.dev/',
    github: '11ty/eleventy',
    description:
      'Simpler static site generator, working with data in various formats to produce HTML, CSS, and JavaScript.',
  },
  elixir: {
    website: 'https://elixir-lang.org/',
    github: 'elixir-lang/elixir',
    description:
      'Dynamic, functional language designed for building scalable and maintainable applications, running on the Erlang VM.',
  },
  emberjs: {
    website: 'https://emberjs.com/',
    github: 'emberjs/ember.js',
    description:
      'Productive, battle-tested JavaScript framework for building modern web applications with a focus on convention over configuration.',
  },
  equinix: {
    website: 'https://www.equinix.com/',
    description:
      'Global digital infrastructure company providing data centers, interconnection services, and colocation solutions.',
  },
  esbuild: {
    website: 'https://esbuild.github.io/',
    github: 'evanw/esbuild',
    description:
      'Extremely fast JavaScript bundler and minifier, aiming for significantly improved build times.',
  },
  eslint: {
    website: 'https://eslint.org/',
    github: 'eslint/eslint',
    description:
      'Pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript code.',
  },
  expodev: {
    website: 'https://expo.dev/',
    description:
      'Platform for building universal React applications, simplifying development for iOS, Android, and web.',
  },
  expojs: {
    website: 'https://expo.dev/',
    github: 'expo/expo',
    description:
      'Open-source platform for making universal native apps with React that run on Android, iOS, and the web.',
  },
  express: {
    website: 'https://expressjs.com/',
    github: 'expressjs/express',
    description:
      'Minimalist and flexible Node.js web application framework, providing a robust set of features for web and mobile applications.',
  },
  fabric: {
    website: 'http://www.fabfile.org/',
    github: 'fabric/fabric',
    description:
      'Python library and command-line tool for streamlining the use of SSH for application deployment or systems administration tasks.',
  },
  facebook: {
    website: 'https://about.facebook.com/',
    description:
      'Social networking service and technology company connecting people and building communities globally.',
  },
  fastify: {
    website: 'https://fastify.dev/',
    github: 'fastify/fastify',
    description:
      'Fast and low overhead web framework for Node.js, focused on providing the best developer experience with the least overhead.',
  },
  fastly: {
    website: 'https://www.fastly.com/',
    description:
      'Edge cloud platform providing content delivery, edge compute, security, and observability services for fast digital experiences.',
  },
  figma: {
    website: 'https://www.figma.com/',
    description:
      'Collaborative interface design tool, enabling teams to design, prototype, and gather feedback in one place.',
  },
  'firebase.firestore': {
    website: 'https://firebase.google.com/',
    description:
      'NoSQL document database within Firebase for storing and syncing data for client- and server-side development.',
  },
  firebase: {
    website: 'https://firebase.google.com/',
    description:
      'Mobile and web application development platform by Google, providing tools for building, improving, and growing apps.',
  },
  flyio: {
    website: 'https://fly.io/',
    description:
      'Platform for running full stack applications and databases close to users worldwide, leveraging edge computing.',
  },
  flyway: {
    website: 'https://flywaydb.org/',
    github: 'redgate-oss/flyway',
    description:
      'Open-source database migration tool that favors simplicity and convention over configuration for version control for your database.',
  },
  gatsby: {
    website: 'https://www.gatsbyjs.com/',
    github: 'gatsbyjs/gatsby',
    description:
      'React-based open-source framework for creating fast websites and apps, using a content mesh approach.',
  },
  'gcp.aiplatform': {
    website: 'https://cloud.google.com/vertex-ai',
    description:
      'Unified machine learning platform by Google Cloud for building, deploying, and managing ML models.',
  },
  'gcp.appengine': {
    website: 'https://cloud.google.com/appengine',
    description:
      'Platform for building scalable web applications and mobile backends on Google Cloud, supporting various languages.',
  },
  'gcp.artifactregistry': {
    website: 'https://cloud.google.com/artifact-registry',
    description:
      'Universal package manager for storing and managing artifacts like Docker images and language packages on Google Cloud.',
  },
  'gcp.bigquery': {
    website: 'https://cloud.google.com/bigquery',
    description:
      'Serverless, highly scalable, and cost-effective multicloud data warehouse by Google Cloud for analytics.',
  },
  'gcp.bigtable': {
    website: 'https://cloud.google.com/bigtable',
    description:
      'Petabyte-scale, fully managed NoSQL database service by Google Cloud, ideal for large analytical and operational workloads.',
  },
  'gcp.cloudbuild': {
    website: 'https://cloud.google.com/build',
    description:
      'Service by Google Cloud for building software quickly across all languages, with continuous integration and delivery.',
  },
  'gcp.cloudrun': {
    website: 'https://cloud.google.com/run',
    description:
      'Managed compute platform by Google Cloud for running stateless containers invokable via web requests or Pub/Sub events.',
  },
  'gcp.containerregistry': {
    website: 'https://cloud.google.com/container-registry',
    description:
      'Private Docker image storage on Google Cloud, being replaced by Artifact Registry, for CI/CD pipelines.',
  }, // Being replaced by Artifact Registry
  'gcp.dataflow': {
    website: 'https://cloud.google.com/dataflow',
    description:
      'Fully managed stream and batch data processing service by Google Cloud, for reliable and expressive data pipelines.',
  },
  'gcp.dataproc': {
    website: 'https://cloud.google.com/dataproc',
    description:
      'Managed Spark and Hadoop service by Google Cloud for batch processing, querying, streaming, and machine learning.',
  },
  'gcp.datastore': {
    website: 'https://cloud.google.com/datastore',
    description:
      'Highly scalable NoSQL database by Google Cloud for web and mobile applications, now Firestore in Datastore mode.',
  }, // Now Firestore in Datastore mode
  'gcp.dialogflow': {
    website: 'https://cloud.google.com/dialogflow',
    description:
      'Conversational AI platform by Google Cloud for building natural and rich conversational experiences.',
  },
  'gcp.dns': {
    website: 'https://cloud.google.com/dns',
    description:
      'Scalable, reliable, and managed authoritative Domain Name System (DNS) service running on Google Cloud infrastructure.',
  },
  'gcp.functions': {
    website: 'https://cloud.google.com/functions',
    description:
      'Serverless compute platform by Google Cloud for creating event-driven applications that run code in response to events.',
  },
  'gcp.gce': {
    website: 'https://cloud.google.com/compute',
    description:
      "Virtual machines running in Google Cloud's data centers, providing scalable compute power.",
  },
  'gcp.gcs': {
    website: 'https://cloud.google.com/storage',
    description:
      'Unified object storage service by Google Cloud for storing and accessing data from anywhere.',
  },
  'gcp.gke': {
    website: 'https://cloud.google.com/kubernetes-engine',
    description:
      'Managed Kubernetes service by Google Cloud for deploying, managing, and scaling containerized applications.',
  },
  'gcp.kms': {
    website: 'https://cloud.google.com/kms',
    description:
      'Cloud-hosted key management service by Google Cloud for managing cryptographic keys for cloud services.',
  },
  'gcp.language': {
    website: 'https://cloud.google.com/natural-language',
    description:
      'Cloud Natural Language API by Google Cloud for deriving insights from unstructured text using machine learning.',
  },
  'gcp.logging': {
    website: 'https://cloud.google.com/logging',
    description:
      'Centralized log management service by Google Cloud for storing, searching, analyzing, and alerting on log data.',
  },
  'gcp.maps': {
    website: 'https://developers.google.com/maps',
    description:
      'Platform providing APIs and SDKs for maps, routes, and places, enabling location-based experiences.',
  },
  'gcp.memorystore': {
    website: 'https://cloud.google.com/memorystore',
    description:
      'Fully managed in-memory data store service by Google Cloud for Redis and Memcached, delivering ultra-low latency.',
  },
  'gcp.pubsub': {
    website: 'https://cloud.google.com/pubsub',
    description:
      'Real-time messaging service by Google Cloud for sending and receiving messages between independent applications.',
  },
  'gcp.secretmanager': {
    website: 'https://cloud.google.com/secret-manager',
    description:
      'Service by Google Cloud for storing API keys, passwords, certificates, and other sensitive data securely.',
  },
  'gcp.spanner': {
    website: 'https://cloud.google.com/spanner',
    description:
      'Fully managed, mission-critical, relational database service by Google Cloud offering transactional consistency at global scale.',
  },
  'gcp.speech': {
    website: 'https://cloud.google.com/speech-to-text',
    description:
      'Speech-to-Text API by Google Cloud for converting audio to text by applying powerful neural network models.',
  },
  'gcp.sql': {
    website: 'https://cloud.google.com/sql',
    description:
      'Fully managed relational database service by Google Cloud for MySQL, PostgreSQL, and SQL Server.',
  },
  'gcp.tasks': {
    website: 'https://cloud.google.com/tasks',
    description:
      'Managed service by Google Cloud for enqueuing and executing asynchronous tasks, with features like rate limiting and retries.',
  },
  'gcp.translate': {
    website: 'https://cloud.google.com/translate',
    description:
      'Cloud Translation API by Google Cloud for dynamically translating text between thousands of language pairs.',
  },
  'gcp.vision': {
    website: 'https://cloud.google.com/vision',
    description:
      'Cloud Vision API by Google Cloud for deriving insights from images with machine learning models.',
  },
  gcp: {
    website: 'https://cloud.google.com/',
    description:
      'Suite of cloud computing services by Google, running on the same infrastructure that Google uses internally for its end-user products.',
  },
  geminiai: {
    website: 'https://gemini.google.com/',
    description:
      'Family of multimodal AI models developed by Google, capable of understanding and generating text, code, images, and more.',
  },
  ghost: {
    website: 'https://ghost.org/',
    github: 'TryGhost/Ghost',
    description:
      'Open-source publishing platform for professional bloggers, writers, and journalists, focusing on content creation.',
  },
  gitbook: {
    website: 'https://www.gitbook.com/',
    description:
      'Modern documentation platform where teams can document everything from products to internal knowledge bases and APIs.',
  },
  gitguardian: {
    website: 'https://www.gitguardian.com/',
    description:
      'DevOps security platform for detecting and remediating secrets in source code throughout the software development lifecycle.',
  },
  'github.actions': {
    website: 'https://github.com/features/actions',
    github: 'actions/runner',
    description:
      'CI/CD platform by GitHub for automating software workflows, including build, test, and deployment, directly from repositories.',
  },
  'github.pages': {
    website: 'https://pages.github.com/',
    github: 'github/pages-gem',
    description:
      'Static site hosting service by GitHub that takes HTML, CSS, and JavaScript files straight from a repository.',
  },
  github: {
    website: 'https://github.com/',
    github: 'github/roadmap',
    description:
      'Web-based platform for version control using Git, primarily used for software development and source code hosting.',
  }, // Using roadmap as a placeholder public repo
  'gitlab.ci': {
    website: 'https://docs.gitlab.com/ee/ci/',
    description:
      'Continuous Integration/Continuous Delivery (CI/CD) features integrated within the GitLab platform for automating software pipelines.',
  },
  'github.codeql': {
    website: 'https://codeql.github.com/',
    description:
      'Semantic code analysis engine by GitHub for finding vulnerabilities in codebases using queries.',
  },
  gitlab: {
    website: 'https://about.gitlab.com/',
    github: 'gitlab-org/gitlab',
    description:
      'Complete DevOps platform delivered as a single application, from project planning and source code management to CI/CD and monitoring.',
  },
  goacmelego: {
    website: 'https://go-acme.github.io/lego/',
    github: 'go-acme/lego',
    description:
      "Go library and command-line tool for managing TLS certificates using the ACME protocol (Let's Encrypt).",
  },
  golang: {
    website: 'https://go.dev/',
    github: 'golang/go',
    description:
      'Statically typed, compiled programming language designed at Google, known for simplicity, efficiency, and concurrency features.',
  },
  golangcilint: {
    website: 'https://golangci-lint.run/',
    github: 'golangci/golangci-lint',
    description:
      'Fast Go linters runner, aggregating multiple linters to analyze Go source code for style and correctness.',
  },
  googleanalytics: {
    website: 'https://analytics.google.com/',
    description:
      'Web analytics service by Google that tracks and reports website traffic, user behavior, and conversions.',
  },
  gradio: {
    website: 'https://www.gradio.app/',
    github: 'gradio-app/gradio',
    description:
      'Python library for building and sharing machine learning web apps with simple interfaces, often for demos.',
  },
  grafana: {
    website: 'https://grafana.com/',
    github: 'grafana/grafana',
    description:
      'Open-source platform for monitoring and observability, allowing querying, visualizing, alerting on, and understanding metrics.',
  },
  gridsome: {
    website: 'https://gridsome.org/',
    github: 'gridsome/gridsome',
    description:
      'Vue.js-powered static site generator for building fast, modern websites and PWAs that are SEO-friendly.',
  },
  groq: {
    website: 'https://groq.com/',
    description:
      'Company developing inference solutions for AI and machine learning, focusing on high-speed processing with Language Processing Units (LPUs).',
  },
  haproxy: {
    website: 'https://www.haproxy.org/',
    github: 'haproxy/haproxy',
    description:
      'Free, open-source software providing high availability, load balancing, and proxying for TCP and HTTP-based applications.',
  },
  hashicorp_vault: {
    website: 'https://www.vaultproject.io/',
    github: 'hashicorp/vault',
    description:
      'Tool for securely accessing secrets, such as API keys, passwords, or certificates, through a unified interface.',
  },
  healthchecksio: {
    website: 'https://healthchecks.io/',
    github: 'healthchecks/healthchecks',
    description:
      'Simple and effective cron job monitoring service that alerts when background jobs or services fail silently.',
  },
  helm: {
    website: 'https://helm.sh/',
    github: 'helm/helm',
    description:
      'Package manager for Kubernetes, helping define, install, and upgrade complex Kubernetes applications using charts.',
  },
  heroku: {
    website: 'https://www.heroku.com/',
    description:
      'Cloud platform as a service (PaaS) supporting several programming languages for deploying and managing applications.',
  },
  hexojs: {
    website: 'https://hexo.io/',
    github: 'hexojs/hexo',
    description:
      'Fast, simple, and powerful blog framework powered by Node.js, for creating static websites and blogs.',
  },
  hotjar: {
    website: 'https://www.hotjar.com/',
    description:
      'Product experience insights tool providing behavior analytics and feedback data to understand website and app users.',
  },
  html: {
    website: 'https://html.spec.whatwg.org/',
    description:
      'Standard markup language for documents designed to be displayed in a web browser, forming the basic structure of web pages.',
  },
  httpd: {
    website: 'https://httpd.apache.org/',
    github: 'apache/httpd',
    description:
      'Apache HTTP Server, a widely used open-source web server software known for its power and flexibility.',
  },
  hubspot: {
    website: 'https://www.hubspot.com/',
    description:
      'CRM platform with software and support to help businesses grow, covering marketing, sales, and customer service.',
  },
  huggingface: {
    website: 'https://huggingface.co/',
    description:
      'Community and data science platform providing tools for building, training, and deploying machine learning models, especially NLP.',
  },
  hugo: {
    website: 'https://gohugo.io/',
    github: 'gohugoio/hugo',
    description:
      'Fast and flexible static site generator written in Go, optimized for speed and ease of use.',
  },
  hyperdx: {
    website: 'https://hyperdx.io/',
    github: 'hyperdxio/hyperdx',
    description:
      'Open source observability platform unifying session replay, logs, metrics, traces, and errors for full-stack monitoring.',
  },
  hypertune: {
    website: 'https://hypertune.com/',
    github: 'hypertune/hypertune',
    description:
      'Type-safe feature flag and A/B testing platform for modern development workflows, built with a focus on developer experience.',
  },
  ibmcloud: {
    website: 'https://www.ibm.com/cloud',
    description:
      'Suite of cloud computing services from IBM offering platform as a service, software as a service, and infrastructure as a service.',
  },
  iftt: {
    website: 'https://ifttt.com/',
    description:
      'Web service that creates chains of simple conditional statements, called applets, to automate tasks between different apps and services.',
  },
  influxdb: {
    website: 'https://www.influxdata.com/',
    github: 'influxdata/influxdb',
    description:
      'Open-source time series database optimized for fast, high-availability storage and retrieval of time series data.',
  },
  intercom: {
    website: 'https://www.intercom.com/',
    description:
      'Customer communications platform for businesses to engage with customers through targeted messages, chat, and email.',
  },
  intuit: {
    website: 'https://www.intuit.com/',
    description:
      'Financial software company known for products like QuickBooks, TurboTax, and Mint, aimed at individuals and small businesses.',
  },
  java: {
    website: 'https://www.java.com/',
    github: 'openjdk/jdk',
    description:
      'Widely-used, class-based, object-oriented programming language designed for portability across platforms.',
  },
  javascript: {
    website: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    description:
      'High-level, interpreted programming language that conforms to the ECMAScript specification, essential for web development.',
  },
  jekyll: {
    website: 'https://jekyllrb.com/',
    github: 'jekyll/jekyll',
    description:
      'Simple, blog-aware, static site generator written in Ruby, transforming plain text into static websites and blogs.',
  },
  jenkins: {
    website: 'https://www.jenkins.io/',
    github: 'jenkinsci/jenkins',
    description:
      'Open-source automation server for building, testing, and deploying software, with a vast ecosystem of plugins.',
  },
  jest: {
    website: 'https://jestjs.io/',
    github: 'jestjs/jest',
    description:
      'Delightful JavaScript testing framework with a focus on simplicity, offering features like mocking and code coverage.',
  },
  joomla: {
    website: 'https://www.joomla.org/',
    github: 'joomla/joomla-cms',
    description:
      'Open-source content management system (CMS) for publishing web content, used for websites and online applications.',
  },
  k6: {
    website: 'https://k6.io/',
    github: 'grafana/k6',
    description:
      'Open-source load testing tool for developers and testers to verify system performance and reliability.',
  },
  kentico: {
    website: 'https://kentico.com/',
    description:
      'Digital experience platform (DXP) offering content management, e-commerce, and online marketing capabilities.',
  },
  kibana: {
    website: 'https://www.elastic.co/kibana/',
    github: 'elastic/kibana',
    description:
      'Open-source data visualization and exploration tool for Elasticsearch, providing interactive charts and dashboards.',
  },
  klarna: {
    website: 'https://www.klarna.com/',
    description:
      'Global payments and shopping service providing smart payment options for e-commerce and retail.',
  },
  klaviyo: {
    website: 'https://www.klaviyo.com/',
    description:
      'Marketing automation platform focused on email and SMS for e-commerce businesses to personalize customer communication.',
  },
  koa: {
    website: 'https://koajs.com/',
    github: 'koajs/koa',
    description:
      'Smaller, more expressive, and more robust foundation for web applications and APIs, built by the Express team.',
  },
  koalaanalytics: {
    website: 'https://getkoala.com/',
    description:
      'Sales intelligence platform using AI to identify buyer intent, qualify accounts, and manage engagement.',
  },
  kong: {
    website: 'https://konghq.com/',
    github: 'Kong/kong',
    description:
      'API gateway and platform for managing, securing, and connecting APIs and microservices across hybrid and multi-cloud environments.',
  },
  kotlin: {
    website: 'https://kotlinlang.org/',
    github: 'JetBrains/kotlin',
    description:
      'Statically typed programming language for modern multiplatform applications, interoperable with Java and Android.',
  },
  koyeb: {
    website: 'https://www.koyeb.com/',
    description:
      'Serverless platform for deploying global applications and APIs quickly, with built-in CI/CD and auto-scaling.',
  },
  kubernetes: {
    website: 'https://kubernetes.io/',
    github: 'kubernetes/kubernetes',
    description:
      'Open-source system for automating deployment, scaling, and management of containerized applications.',
  },
  lago: {
    website: 'https://www.getlago.com/',
    github: 'getlago/lago',
    description:
      'Open-source metering and usage-based billing API, designed for SaaS companies to implement flexible pricing.',
  },
  laravel: {
    website: 'https://laravel.com/',
    github: 'laravel/laravel',
    description:
      'PHP web application framework with expressive, elegant syntax, aiming to make development enjoyable and creative.',
  },
  launchdarkly: {
    website: 'https://launchdarkly.com/',
    description:
      'Feature management platform enabling teams to deliver and control software features with flags and experimentation.',
  },
  lemonsqueezy: {
    website: 'https://www.lemonsqueezy.com/',
    description:
      'Platform for selling digital products, subscriptions, and software licenses, handling payments and SaaS metrics.',
  },
  libsql: {
    website: 'https://turso.tech/',
    github: 'libsql/libsql',
    description:
      'Open-source fork of SQLite, often used with TursoDB, for building embedded and edge database applications.',
  }, // Associated with Turso
  lighthouse: {
    website: 'https://developer.chrome.com/docs/lighthouse/',
    github: 'GoogleChrome/lighthouse',
    description:
      'Open-source, automated tool for improving the quality of web pages, auditing performance, accessibility, and SEO.',
  },
  linear: {
    website: 'https://linear.app/',
    description:
      'Issue tracking and project management tool designed for high-performance software teams with a focus on speed.',
  },
  liquibase: {
    website: 'https://www.liquibase.org/',
    github: 'liquibase/liquibase',
    description:
      'Open-source database schema change management solution enabling tracking, managing, and applying database changes.',
  },
  logrocket: {
    website: 'https://logrocket.com/',
    description:
      'Frontend monitoring and product analytics solution, replaying user sessions to help debug issues and understand usage.',
  },
  logsnag: {
    website: 'https://logsnag.com/',
    description:
      'Event tracking and notification service for developers to monitor app activity and receive real-time updates.',
  },
  logstash: {
    website: 'https://www.elastic.co/logstash/',
    github: 'elastic/logstash',
    description:
      'Open-source data collection engine with real-time pipelining capabilities for ingesting data from various sources.',
  },
  magento: {
    website: 'https://business.adobe.com/products/commerce/magento/magento-open-source.html',
    description:
      'Open-source e-commerce platform, now part of Adobe Commerce, offering rich features and customization.',
  }, // Now Adobe Commerce / Magento Open Source
  mailchimp: {
    website: 'https://mailchimp.com/',
    description:
      'All-in-one marketing platform for small businesses, known for email marketing and automation services.',
  },
  mailgun: {
    website: 'https://www.mailgun.com/',
    description:
      'Email automation service for developers, providing APIs for sending, receiving, and tracking emails.',
  },
  mailhog: {
    website: 'https://github.com/mailhog/MailHog',
    github: 'mailhog/MailHog',
    description:
      'Email testing tool with a fake SMTP server, allowing developers to capture and view emails during development.',
  },
  mailjet: {
    website: 'https://www.mailjet.com/',
    description:
      'Email marketing and transactional email service for sending, tracking, and delivering emails at scale.',
  },
  mariadb: {
    website: 'https://mariadb.org/',
    github: 'MariaDB/server',
    description:
      'Community-developed, commercially supported fork of the MySQL relational database management system.',
  },
  matomo: {
    website: 'https://matomo.org/',
    github: 'matomo-org/matomo',
    description:
      'Open-source web analytics platform providing detailed reports on website traffic and user behavior with data ownership.',
  },
  mattermost: {
    website: 'https://mattermost.com/',
    github: 'mattermost/mattermost',
    description:
      'Open-source collaboration platform for teams, offering secure messaging, file sharing, and workflow automation.',
  },
  meilisearch: {
    website: 'https://www.meilisearch.com/',
    github: 'meilisearch/meilisearch',
    description:
      'Fast, open-source, and typo-tolerant search engine for integrating search into applications and websites.',
  },
  meilisearchcloud: {
    website: 'https://cloud.meilisearch.com/',
    description:
      'Fully managed cloud hosting service for Meilisearch, simplifying deployment and maintenance of the search engine.',
  },
  memcached: {
    website: 'https://memcached.org/',
    github: 'memcached/memcached',
    description:
      'High-performance, distributed memory object caching system, generic in nature, but intended for use in speeding up dynamic web applications.',
  },
  meteorjs: {
    website: 'https://www.meteor.com/',
    github: 'meteor/meteor',
    description:
      'Full-stack JavaScript platform for developing modern web and mobile applications with real-time capabilities.',
  },
  milvusdb: {
    website: 'https://milvus.io/',
    github: 'milvus-io/milvus',
    description:
      'Open-source vector database built for AI applications, enabling similarity search and analysis of large-scale vector datasets.',
  },
  mistralai: {
    website: 'https://mistral.ai/',
    description:
      'AI company focused on developing open and efficient generative AI models and tools for developers.',
  },
  mithriljs: {
    website: 'https://mithril.js.org/',
    github: 'MithrilJS/mithril.js',
    description:
      'Minimalist JavaScript framework for building single-page applications, known for its small size and performance.',
  },
  mixpanel: {
    website: 'https://mixpanel.com/',
    description:
      'Product analytics platform for tracking user interactions within web and mobile applications to understand behavior.',
  },
  mongodb: {
    website: 'https://www.mongodb.com/',
    description:
      'Source-available cross-platform document-oriented database program, classified as a NoSQL database program.',
  },
  mongodbatlas: {
    website: 'https://www.mongodb.com/cloud/atlas',
    description:
      'Fully-managed cloud database service for MongoDB, offering automated scaling, backups, and security features.',
  },
  mongoexpress: {
    website: 'https://github.com/mongo-express/mongo-express',
    github: 'mongo-express/mongo-express',
    description:
      'Web-based MongoDB admin interface written with Node.js, Express, and Bootstrap for managing MongoDB databases.',
  },
  mysql: {
    website: 'https://www.mysql.com/',
    github: 'mysql/mysql-server',
    description:
      'Open-source relational database management system (RDBMS) widely used for web applications and data storage.',
  },
  nango: {
    website: 'https://www.nango.dev/',
    github: 'NangoHQ/nango',
    description:
      'Open-source platform for integrating with third-party APIs, handling authentication, and syncing data reliably.',
  },
  nats: {
    website: 'https://nats.io/',
    github: 'nats-io/nats-server',
    description:
      'Simple, high-performance open-source messaging system for cloud-native applications, IoT, and microservices.',
  },
  neo4j: {
    website: 'https://neo4j.com/',
    github: 'neo4j/neo4j',
    description:
      'Native graph database platform optimized for storing, querying, and analyzing connected data.',
  },
  neondb: {
    website: 'https://neon.tech/',
    github: 'neondatabase/neon',
    description:
      'Serverless PostgreSQL platform offering autoscaling, branching, and instant database provisioning for developers.',
  },
  nestjs: {
    website: 'https://nestjs.com/',
    github: 'nestjs/nest',
    description:
      'Framework for building efficient, scalable Node.js server-side applications, using progressive JavaScript and TypeScript.',
  },
  netlify: {
    website: 'https://www.netlify.com/',
    description:
      'Platform for building and deploying modern web projects, offering CI/CD, serverless functions, and global edge network.',
  },
  newrelic: {
    website: 'https://newrelic.com/',
    description:
      'Observability platform providing application performance monitoring (APM), infrastructure monitoring, and log management.',
  },
  nextcloud: {
    website: 'https://nextcloud.com/',
    github: 'nextcloud/server',
    description:
      'Open-source, self-hosted file sync and share platform, offering collaboration tools and data privacy.',
  },
  nextjs: {
    website: 'https://nextjs.org/',
    github: 'vercel/next.js',
    description:
      'React framework for building server-side rendered and statically generated web applications with ease.',
  },
  nginx: {
    website: 'https://nginx.org/',
    description:
      'High-performance web server, reverse proxy, load balancer, and HTTP cache, known for its stability and efficiency.',
  }, // Official repo is Mercurial, GitHub is a mirror
  nodejs: {
    website: 'https://nodejs.org/',
    github: 'nodejs/node',
    description:
      "JavaScript runtime built on Chrome's V8 JavaScript engine, for building fast and scalable network applications.",
  },
  notion: {
    website: 'https://www.notion.so/',
    description:
      'All-in-one workspace for notes, tasks, wikis, and databases, enabling teams and individuals to collaborate.',
  },
  novu: {
    website: 'https://novu.co/',
    github: 'novuhq/novu',
    description:
      'Open-source notification infrastructure for managing all communication channels (email, SMS, push, chat) in one place.',
  },
  nuxtjs: {
    website: 'https://nuxtjs.org/',
    github: 'nuxt/nuxt',
    description:
      'Intuitive Vue framework for creating universal, static generated, or single-page Vue.js applications with ease.',
  },
  nxcloud: {
    website: 'https://nx.app/',
    description:
      'Computation cache and remote build execution platform for Nx monorepos, speeding up CI/CD pipelines.',
  },
  nxjs: {
    website: 'https://nx.dev/',
    github: 'nrwl/nx',
    description:
      'Build system with monorepo support and powerful integrations, helping scale development for JavaScript/TypeScript projects.',
  },
  oceanbase: {
    website: 'https://en.oceanbase.com/',
    github: 'oceanbase/oceanbase',
    description:
      'Distributed relational database system designed for high availability, scalability, and financial-grade consistency.',
  },
  okta: {
    website: 'https://www.okta.com/',
    description:
      'Identity and access management (IAM) platform providing secure user authentication and authorization for applications.',
  },
  onlineornot: {
    website: 'https://onlineornot.com/',
    description:
      'Uptime monitoring service for websites and APIs, providing alerts and status pages for online services.',
  },
  openai: {
    website: 'https://openai.com/',
    description:
      'AI research and deployment company, known for models like GPT for natural language processing and DALL·E for image generation.',
  },
  optimizely: {
    website: 'https://www.optimizely.com/',
    description:
      'Digital experience platform (DXP) offering A/B testing, personalization, and feature management for websites and applications.',
  },
  oraclecloud: {
    website: 'https://www.oracle.com/cloud/',
    description:
      'Suite of cloud computing services from Oracle, providing IaaS, PaaS, SaaS, and data management solutions.',
  },
  'ovh.database': {
    website: 'https://www.ovhcloud.com/en/public-cloud/databases/',
    description:
      'Managed database services by OVHcloud, offering various SQL and NoSQL database engines in the cloud.',
  },
  'ovh.dedicated': {
    website: 'https://www.ovhcloud.com/en/bare-metal/',
    description:
      'Bare metal server solutions by OVHcloud, providing dedicated hardware for high-performance computing needs.',
  },
  'ovh.kubernetes': {
    website: 'https://www.ovhcloud.com/en/public-cloud/kubernetes/',
    description:
      'Managed Kubernetes service by OVHcloud for deploying, scaling, and managing containerized applications.',
  },
  'ovh.storage': {
    website: 'https://www.ovhcloud.com/en/public-cloud/storage/',
    description:
      'Cloud storage solutions by OVHcloud, including object storage, block storage, and archive storage options.',
  },
  'ovh.vps': {
    website: 'https://www.ovhcloud.com/en/vps/',
    description:
      'Virtual Private Server (VPS) hosting solutions by OVHcloud, offering scalable and affordable virtualized servers.',
  },
  ovh: {
    website: 'https://www.ovhcloud.com/',
    description:
      'Global cloud provider offering a wide range of cloud computing services, including web hosting, dedicated servers, and public cloud solutions.',
  },
  pagerduty: {
    website: 'https://www.pagerduty.com/',
    description:
      'Incident response platform for real-time operations, helping teams detect, respond to, and resolve incidents.',
  },
  papertrail: {
    website: 'https://www.papertrail.com/',
    description:
      'Cloud-hosted log management service for collecting, searching, and analyzing log data from applications and servers.',
  },
  payloadcms: {
    website: 'https://payloadcms.com/',
    github: 'payloadcms/payload',
    description:
      'Headless CMS and application framework built with TypeScript, React, and Node.js, offering flexibility and control.',
  },
  paypal: {
    website: 'https://www.paypal.com/',
    description:
      'Online payments system supporting online money transfers and serving as an electronic alternative to traditional paper methods.',
  },
  percona: {
    website: 'https://www.percona.com/',
    description:
      'Company providing open-source database software, support, and services for MySQL, MongoDB, PostgreSQL, and MariaDB.',
  },
  perplexityai: {
    website: 'https://www.perplexity.ai/',
    description:
      'AI-powered search engine and conversational AI platform providing direct answers to questions with cited sources.',
  },
  phaserjs: {
    website: 'https://phaser.io/',
    github: 'photonstorm/phaser',
    description:
      'Fast, free, and fun open-source HTML5 game framework for making desktop and mobile browser games.',
  },
  php: {
    website: 'https://www.php.net/',
    github: 'php/php-src',
    description:
      'Widely-used open-source general-purpose scripting language especially suited for web development.',
  },
  phppest: {
    website: 'https://pestphp.com/',
    github: 'pestphp/pest',
    description:
      'Elegant PHP testing framework with a focus on simplicity and enjoyable developer experience, built on PHPUnit.',
  },
  phpstan: {
    website: 'https://phpstan.org/',
    github: 'phpstan/phpstan',
    description:
      'PHP static analysis tool for finding bugs in code without running it, focusing on type safety and error detection.',
  },
  phpunit: {
    website: 'https://phpunit.de/',
    github: 'sebastianbergmann/phpunit',
    description:
      'Programmer-oriented testing framework for PHP, an instance of the xUnit architecture for unit testing frameworks.',
  },
  pingdom: {
    website: 'https://www.pingdom.com/',
    description:
      'Website and server monitoring service offering uptime monitoring, real user monitoring, and page speed analysis.',
  },
  pirschanalytics: {
    website: 'https://pirsch.io/',
    description:
      'Privacy-friendly web analytics service focusing on simplicity and essential metrics without using cookies or tracking personal data.',
  },
  placekit: {
    website: 'https://placekit.io/',
    description:
      'Address autocompletion and geocoding API designed for developers to integrate location search into applications easily.',
  },
  planetscale: {
    website: 'https://planetscale.com/',
    description:
      'Serverless MySQL platform built on Vitess, offering scalability, developer workflows, and database branching.',
  },
  platformsh: {
    website: 'https://platform.sh/',
    description:
      'End-to-end PaaS for deploying and managing web applications and microservices with a focus on developer productivity.',
  },
  plausible: {
    website: 'https://plausible.io/',
    github: 'plausible/analytics',
    description:
      'Simple, lightweight (< 1 KB), and open-source web analytics service that is privacy-friendly and cookie-free.',
  },
  playwright: {
    website: 'https://playwright.dev/',
    github: 'microsoft/playwright',
    description:
      'Node.js library by Microsoft for automating Chromium, Firefox, and WebKit browsers with a single API.',
  },
  pnpm: {
    website: 'https://pnpm.io/',
    github: 'pnpm/pnpm',
    description:
      'Fast, disk space efficient package manager for JavaScript, using a content-addressable filesystem to store packages.',
  },
  postgresql: {
    website: 'https://www.postgresql.org/',
    github: 'postgres/postgres',
    description:
      'Powerful, open-source object-relational database system known for its reliability, feature robustness, and performance.',
  },
  postgrest: {
    website: 'https://postgrest.org/',
    github: 'PostgREST/postgrest',
    description:
      'Web server that turns your PostgreSQL database directly into a RESTful API, adding a Hasura-like layer.',
  },
  posthog: {
    website: 'https://posthog.com/',
    github: 'PostHog/posthog',
    description:
      'Open-source product analytics platform providing session recording, feature flags, A/B testing, and autocapture.',
  },
  postman: {
    website: 'https://www.postman.com/',
    description:
      'API platform for building and using APIs, offering tools for designing, testing, documenting, and mocking APIs.',
  },
  postmark: {
    website: 'https://postmarkapp.com/',
    description:
      'Transactional email service for developers, focusing on fast and reliable email delivery for applications.',
  },
  powershell: {
    website: 'https://learn.microsoft.com/en-us/powershell/',
    github: 'PowerShell/PowerShell',
    description:
      'Cross-platform task automation solution made up of a command-line shell, a scripting language, and a configuration management framework.',
  },
  preactjs: {
    website: 'https://preactjs.com/',
    github: 'preactjs/preact',
    description:
      'Fast 3kB alternative to React with the same modern API, offering a smaller library size and high performance.',
  },
  prestashop: {
    website: 'https://www.prestashop.com/',
    github: 'PrestaShop/PrestaShop',
    description:
      'Open-source e-commerce platform for creating and managing online stores, with a wide range of features and modules.',
  },
  prettier: {
    website: 'https://prettier.io/',
    github: 'prettier/prettier',
    description:
      'Opinionated code formatter that enforces a consistent style by parsing code and re-printing it with its own rules.',
  },
  prisma: {
    website: 'https://www.prisma.io/',
    github: 'prisma/prisma',
    description:
      'Next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, SQL Server, SQLite, MongoDB and CockroachDB.',
  },
  prismacloud: {
    website: 'https://www.paloaltonetworks.com/prisma/cloud',
    description:
      'Cloud Native Application Protection Platform (CNAPP) by Palo Alto Networks, providing comprehensive cloud security.',
  },
  prometheus: {
    website: 'https://prometheus.io/',
    github: 'prometheus/prometheus',
    description:
      'Open-source monitoring and alerting toolkit originally built at SoundCloud, now a standalone open source project.',
  },
  puppeteer: {
    website: 'https://pptr.dev/',
    github: 'puppeteer/puppeteer',
    description:
      'Node.js library providing a high-level API to control Chrome/Chromium over the DevTools Protocol.',
  },
  python: {
    website: 'https://www.python.org/',
    github: 'python/cpython',
    iconURL: 'https://avatars.githubusercontent.com/u/1525981?s=200&v=4',
    description:
      'Interpreted, high-level, general-purpose programming language known for its readability and versatility.',
  },
  pytorch: {
    website: 'https://pytorch.org/',
    github: 'pytorch/pytorch',
    description:
      'Open-source machine learning library based on the Torch library, used for applications such as computer vision and NLP.',
  },
  qdrant: {
    website: 'https://qdrant.tech/',
    github: 'qdrant/qdrant',
    description:
      'Vector similarity search engine and vector database, built for performance and scalability in AI applications.',
  },
  'qovery.cluster': {
    website: 'https://www.qovery.com/cluster',
    description:
      'Managed Kubernetes clusters provided by Qovery, simplifying deployment and scaling of containerized applications.',
  },
  'qovery.database': {
    website: 'https://www.qovery.com/database',
    description:
      'Managed database services offered by Qovery, supporting various SQL and NoSQL databases for easy integration.',
  },
  qovery: {
    website: 'https://www.qovery.com/',
    description:
      'Cloud platform for deploying applications with managed services like databases and Kubernetes clusters.',
  },
  questdb: {
    website: 'https://questdb.io/',
    github: 'questdb/questdb',
    description:
      'Open-source time-series database designed for high-performance ingestion and SQL analytics on time-series data.',
  },
  rabbitmq: {
    website: 'https://www.rabbitmq.com/',
    github: 'rabbitmq/rabbitmq-server',
    description:
      'Widely deployed open-source message broker that supports multiple messaging protocols for application integration.',
  },
  'railway.mongodb': {
    website: 'https://railway.app/template/mongodb',
    description:
      'Managed MongoDB service provided by Railway, simplifying database deployment and management on their platform.',
  },
  'railway.mysql': {
    website: 'https://railway.app/template/mysql',
    description:
      'Managed MySQL service by Railway, offering easy setup and integration for applications hosted on Railway.',
  },
  'railway.postgres': {
    website: 'https://railway.app/template/postgresql',
    description:
      'Managed PostgreSQL service on the Railway platform, facilitating quick deployment and scaling of Postgres databases.',
  },
  'railway.redis': {
    website: 'https://railway.app/template/redis',
    description:
      'Managed Redis service by Railway, providing a simple way to add caching and in-memory data storage to apps.',
  },
  railway: {
    website: 'https://railway.app/',
    description:
      'Infrastructure platform for deploying web applications with built-in databases, cron jobs, and auto-scaling.',
  },
  react: {
    website: 'https://react.dev/',
    github: 'facebook/react',
    description:
      'JavaScript library for building user interfaces, known for its component-based architecture and declarative programming style.',
  },
  reactemail: {
    website: 'https://react.email/',
    github: 'resend/react-email',
    description:
      'Component library and toolset for creating and sending beautiful emails with React.',
  },
  redis: {
    website: 'https://redis.io/',
    github: 'redis/redis',
    description:
      'In-memory data structure store, used as a database, cache, message broker, and streaming engine.',
  },
  redwoodjs: {
    website: 'https://redwoodjs.com/',
    github: 'redwoodjs/redwood',
    description:
      'Full-stack JavaScript framework for building modern web applications with React, GraphQL, and Prisma.',
  },
  refinedev: {
    website: 'https://refine.dev/',
    github: 'refinedev/refine',
    description:
      'React-based framework for building internal tools, admin panels, and dashboards rapidly.',
  },
  relativeci: {
    website: 'https://relative-ci.com/',
    description:
      'Service for tracking frontend bundle size and performance metrics, integrating with CI/CD pipelines.',
  },
  remixrun: {
    website: 'https://remix.run/',
    github: 'remix-run/remix',
    description:
      'Full-stack web framework focused on web standards and modern UX, enabling server-side rendering and routing with React.',
  },
  render: {
    website: 'https://render.com/',
    description:
      'Cloud platform for building and running applications and websites with free TLS, global CDN, and auto-deploys from Git.',
  },
  renovate: {
    website: 'https://github.com/renovatebot/renovate',
    github: 'renovatebot/renovate',
    description:
      'Automated dependency update tool for software projects, keeping dependencies current and secure.',
  },
  'replit.database': {
    website: 'https://docs.replit.com/hosting/databases/replit-database',
    description:
      'Simple key-value database integrated into the Replit development environment for quick data persistence.',
  },
  'replit.postgres': {
    website: 'https://docs.replit.com/hosting/databases/postgresql-databases',
    description:
      'Managed PostgreSQL service within Replit, allowing users to easily create and use Postgres databases in their projects.',
  },
  replit: {
    website: 'https://replit.com/',
    description:
      'Online IDE and collaborative coding platform supporting multiple programming languages and environments.',
  },
  resend: {
    website: 'https://resend.com/',
    description:
      'Email API platform for developers to send transactional and marketing emails with high deliverability.',
  },
  rethinkdb: {
    website: 'https://rethinkdb.com/',
    github: 'rethinkdb/rethinkdb',
    description: 'Open-source, scalable NoSQL database that pushes JSON to your apps in realtime.',
  },
  rollbar: {
    website: 'https://rollbar.com/',
    description:
      'Error monitoring and crash reporting service for web and mobile applications, providing real-time alerts and diagnostics.',
  },
  rollup: {
    website: 'https://rollupjs.org/',
    github: 'rollup/rollup',
    description:
      'Module bundler for JavaScript which compiles small pieces of code into something larger and more complex, like a library or application.',
  },
  ruby: {
    website: 'https://www.ruby-lang.org/',
    github: 'ruby/ruby',
    description:
      'Dynamic, open-source programming language with a focus on simplicity and productivity, known for its elegant syntax.',
  },
  rust: {
    website: 'https://www.rust-lang.org/',
    github: 'rust-lang/rust',
    description:
      'Systems programming language focused on speed, memory safety, and parallelism, enabling performant and reliable software.',
  },
  salesforce: {
    website: 'https://www.salesforce.com/',
    description:
      'Customer Relationship Management (CRM) platform for sales, service, marketing, and more.',
  },
  sanity: {
    website: 'https://www.sanity.io/',
    github: 'sanity-io/sanity',
    description:
      'Platform for structured content that powers digital experiences, offering a headless CMS and APIs.',
  },
  sap: {
    website: 'https://www.sap.com/',
    description:
      'Enterprise software company specializing in solutions for managing business operations and customer relations.',
  },
  sas: {
    website: 'https://www.sas.com/',
    description:
      'Software suite for advanced analytics, business intelligence, data management, and predictive analytics.',
  },
  'scaleway.container': {
    website: 'https://www.scaleway.com/en/containers/',
    description:
      'Managed container services by Scaleway, including Kubernetes Kapsule and container registry.',
  },
  'scaleway.database': {
    website: 'https://www.scaleway.com/en/database/',
    description:
      'Managed database services from Scaleway, supporting PostgreSQL, MySQL, and other engines.',
  },
  'scaleway.documentdb': {
    website: 'https://www.scaleway.com/en/document-database/',
    description:
      'Managed NoSQL document database service offered by Scaleway, compatible with MongoDB.',
  },
  'scaleway.elasticmetal': {
    website: 'https://www.scaleway.com/en/elastic-metal/',
    description:
      'Bare metal cloud servers by Scaleway, providing dedicated hardware for high-performance needs.',
  },
  'scaleway.function': {
    website: 'https://www.scaleway.com/en/serverless-functions/',
    description:
      'Serverless functions platform by Scaleway for running event-driven code without managing infrastructure.',
  },
  'scaleway.kubernetes': {
    website: 'https://www.scaleway.com/en/kubernetes-kapsule/',
    description:
      'Managed Kubernetes service (Kapsule) by Scaleway for deploying and scaling containerized applications.',
  },
  'scaleway.mq': {
    website: 'https://www.scaleway.com/en/managed-message-queues/',
    description:
      'Managed message queuing services by Scaleway, supporting protocols like NATS and SQS for microservice communication.',
  },
  'scaleway.redis': {
    website: 'https://www.scaleway.com/en/redis-database/',
    description:
      'Managed Redis database service by Scaleway, offering in-memory caching and data storage.',
  },
  'scaleway.secretmanager': {
    website: 'https://www.scaleway.com/en/secret-manager/',
    description:
      'Service by Scaleway for securely storing and managing API keys, passwords, and other secrets.',
  },
  'scaleway.storage': {
    website: 'https://www.scaleway.com/en/object-storage/',
    description:
      'Object storage and block storage solutions offered by Scaleway for scalable and durable data storage.',
  },
  scaleway: {
    website: 'https://www.scaleway.com/',
    description:
      'European cloud provider offering a range of IaaS and PaaS solutions, including compute, storage, and managed services.',
  },
  scoutapm: {
    website: 'https://scoutapm.com/',
    description:
      'Application performance monitoring (APM) service providing insights into application behavior and performance bottlenecks.',
  },
  scss: {
    website: 'https://sass-lang.com/',
    github: 'sass/sass',
    description:
      'CSS preprocessor that adds features like variables, nesting, and mixins to standard CSS.',
  },
  selenium: {
    website: 'https://www.selenium.dev/',
    github: 'SeleniumHQ/selenium',
    description:
      'Browser automation framework and ecosystem for web application testing across different browsers and platforms.',
  },
  sendgrid: {
    website: 'https://sendgrid.com/',
    description:
      'Cloud-based email delivery service for sending transactional and marketing emails at scale.',
  },
  sentry: {
    website: 'https://sentry.io/',
    github: 'getsentry/sentry',
    description:
      'Error tracking and performance monitoring platform that helps developers diagnose, fix, and optimize their code.',
  },
  sequelize: {
    website: 'https://sequelize.org/',
    github: 'sequelize/sequelize',
    description:
      'Promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.',
  },
  servicenow: {
    website: 'https://www.servicenow.com/',
    description:
      'Cloud platform for automating IT workflows and managing digital business processes.',
  },
  'shopify.hydrogen': {
    website: 'https://hydrogen.shopify.dev/',
    description:
      'React-based framework by Shopify for building custom storefronts with dynamic commerce experiences.',
  },
  shopify: {
    website: 'https://www.shopify.com/',
    description:
      'E-commerce platform for creating online stores and selling products across multiple channels.',
  },
  signoz: {
    website: 'https://signoz.io/',
    github: 'SigNoz/signoz',
    description:
      'Open-source observability platform providing metrics, traces, and logs for application monitoring.',
  },
  'sitecore.xmlcloud': {
    website: 'https://www.sitecore.com/products/xm-cloud',
    description:
      'Cloud-native CMS by Sitecore for creating and managing personalized digital experiences.',
  },
  sitecore: {
    website: 'https://www.sitecore.com/',
    description:
      'Digital experience platform (DXP) offering content management, commerce, and marketing automation solutions.',
  },
  slack: {
    website: 'https://slack.com/',
    description:
      'Collaboration hub that connects teams with the people, tools, and information they need to get work done.',
  },
  snowflake: {
    website: 'https://www.snowflake.com/',
    description:
      'Cloud data platform providing data warehousing, data lakes, data engineering, and data sharing capabilities.',
  },
  snyk: {
    website: 'https://snyk.io/',
    description:
      'Developer security platform for finding and fixing vulnerabilities in code, open source dependencies, and containers.',
  },
  socketio: {
    website: 'https://socket.io/',
    github: 'socketio/socket.io',
    description:
      'JavaScript library for real-time web applications, enabling bidirectional communication between clients and servers.',
  },
  solidjs: {
    website: 'https://www.solidjs.com/',
    github: 'solidjs/solid',
    description:
      'Declarative JavaScript library for building user interfaces with fine-grained reactivity and high performance.',
  },
  sonarcloud: {
    website: 'https://sonarcloud.io/',
    description:
      'Cloud-based code quality and security service for detecting bugs, vulnerabilities, and code smells in projects.',
  },
  sonarlint: {
    website: 'https://www.sonarsource.com/products/sonarlint/',
    description:
      'IDE extension that helps developers detect and fix quality issues as they write code.',
  },
  sonarqube: {
    website: 'https://www.sonarsource.com/products/sonarqube/',
    description:
      'Open-source platform for continuous inspection of code quality, performing automatic reviews with static analysis.',
  },
  splitio: {
    website: 'https://www.split.io/',
    description:
      'Feature flagging and experimentation platform for controlling feature releases and measuring their impact.',
  },
  splunk: {
    website: 'https://www.splunk.com/',
    description:
      'Software platform for searching, monitoring, and analyzing machine-generated big data via a web-style interface.',
  },
  sqlite: {
    website: 'https://www.sqlite.org/',
    github: 'sqlite/sqlite',
    description:
      'C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.',
  },
  sqreen: {
    website: 'https://www.datadoghq.com/product/application-security-monitoring/',
    description:
      'Application security monitoring and protection platform, focusing on runtime protection.',
  },
  squarespace: {
    website: 'https://www.squarespace.com/',
    description:
      'Platform for creating and managing websites, blogs, and online stores with a focus on simplicity and design.',
  },
  squareup: {
    website: 'https://squareup.com/',
    description:
      'Platform for accepting payments, managing inventory, and running a business, offering a range of tools and services.',
  },
  storybook: {
    website: 'https://storybook.js.org/',
    github: 'storybookjs/storybook',
    description:
      'Open-source tool for developing UI components in isolation, enabling developers to create reusable and composable UI components.',
  },
  strapi: {
    website: 'https://strapi.io/',
    github: 'strapi/strapi',
    description:
      'Headless CMS platform for building APIs and managing content, offering a flexible and extensible backend.',
  },
  stripe: {
    website: 'https://stripe.com/',
    description:
      'Platform for accepting payments, managing subscriptions, and building commerce experiences, offering a range of tools and services.',
  },
  styleci: {
    website: 'https://styleci.io/',
    description:
      'Automated code review and quality analysis platform for CSS, JavaScript, and PHP projects, helping developers ship better code faster.',
  },
  stylelint: {
    website: 'https://stylelint.io/',
    github: 'stylelint/stylelint',
    description:
      'Modern CSS linter that helps developers write consistent, maintainable, and bug-free stylesheets, with a focus on performance and developer experience.',
  },
  'supabase.auth': {
    website: 'https://supabase.com/docs/guides/auth',
    description:
      'Authentication and authorization platform for web and mobile applications, offering a range of tools and services for secure user authentication and access control.',
  },
  'supabase.functions': {
    website: 'https://supabase.com/docs/guides/functions',
    description:
      "Serverless functions platform for building custom backend logic, integrating with Supabase's authentication and database services.",
  },
  'supabase.postgres': {
    website: 'https://supabase.com/docs/guides/database',
    description:
      'PostgreSQL database service for storing and managing structured data, offering a flexible and scalable backend.',
  },
  'supabase.realtime': {
    website: 'https://supabase.com/docs/guides/realtime',
    description:
      'Real-time data synchronization platform for web and mobile applications, enabling real-time updates and collaborative editing.',
  },
  'supabase.storage': {
    website: 'https://supabase.com/docs/guides/storage',
    description:
      'Object storage service for storing and managing files, images, and other media, offering a scalable and secure backend.',
  },
  supabase: {
    website: 'https://supabase.com/',
    github: 'supabase/supabase',
    description:
      'Open-source platform for building secure, scalable, and customizable web applications, offering a range of tools and services for authentication, database management, and real-time data synchronization.',
  },
  surrealdb: {
    website: 'https://surrealdb.com/',
    github: 'surrealdb/surrealdb',
    description:
      'Open-source, real-time database for building scalable and maintainable applications, offering a flexible and powerful backend.',
  },
  sveltejs: {
    website: 'https://svelte.dev/',
    github: 'sveltejs/svelte',
    description:
      'Modern JavaScript framework for building user interfaces, offering a reactive programming model and a focus on performance.',
  },
  swift: {
    website: 'https://www.swift.org/',
    github: 'apple/swift',
    description:
      'Fast, safe, and expressive programming language for iOS, macOS, watchOS, tvOS, and Linux, developed by Apple.',
  },
  symfony: {
    website: 'https://symfony.com/',
    github: 'symfony/symfony',
    description:
      'PHP framework for building web applications, APIs, and microservices, offering a range of tools and services for development, testing, and deployment.',
  },
  tailscale: {
    website: 'https://tailscale.com/',
    description:
      'Secure, reliable, and easy-to-use virtual private network (VPN) service, enabling secure and private internet access from any device.',
  },
  tailwind: {
    website: 'https://tailwindcss.com/',
    github: 'tailwindlabs/tailwindcss',
    description:
      'Utility-first CSS framework for rapidly building custom designs, with a focus on utility classes and responsive design.',
  },
  tanstackstart: {
    website: 'https://tanstack.com/start/latest',
    github: 'TanStack/start',
    description:
      'Open-source library for building modern, performant, and accessible web applications with React, focusing on developer experience and performance.',
  },
  tdengine: {
    website: 'https://tdengine.com/',
    github: 'taosdata/TDengine',
    description:
      'Time-series database optimized for high-performance data ingestion, storage, and analysis, with a focus on simplicity and ease of use.',
  },
  teamcity: {
    website: 'https://www.jetbrains.com/teamcity/',
    description:
      'Continuous Integration/Continuous Delivery (CI/CD) platform for building, testing, and deploying software projects, offering a range of features and integrations for efficient development workflows.',
  },
  teamspeak: {
    website: 'https://www.teamspeak.com/',
    description:
      'Voice and text communication platform for teams, offering a range of features for team collaboration and communication.',
  },
  telegraf: {
    website: 'https://www.influxdata.com/time-series-platform/telegraf/',
    github: 'influxdata/telegraf',
    description:
      'Open-source plugin-driven server process for collecting and processing metrics, logs, and events, with a focus on performance and extensibility.',
  },
  telegram: {
    website: 'https://telegram.org/',
    description:
      'Messaging platform for staying in touch with friends, family, and colleagues, offering a range of features for communication and collaboration.',
  },
  tencentcloud: {
    website: 'https://www.tencentcloud.com/',
    description:
      'Cloud computing platform offering a range of services for building, deploying, and managing applications, with a focus on scalability, security, and cost-effectiveness.',
  },
  tensorflow: {
    website: 'https://www.tensorflow.org/',
    github: 'tensorflow/tensorflow',
    description:
      'Open-source software library for numerical computation using data flow graphs, with a focus on machine learning and deep neural networks.',
  },
  terraform: {
    website: 'https://www.terraform.io/',
    github: 'hashicorp/terraform',
    description:
      'Infrastructure as Code (IaC) tool for provisioning and managing infrastructure resources, with a focus on automation, consistency, and scalability.',
  },
  terragrunt: {
    website: 'https://terragrunt.gruntwork.io/',
    github: 'gruntwork-io/terragrunt',
    description:
      'Terraform automation tool for building infrastructure as code, with a focus on best practices, security, and scalability.',
  },
  tidb: {
    website: 'https://pingcap.com/products/tidb/',
    github: 'pingcap/tidb',
    description:
      'Distributed SQL database that supports horizontal scaling and high availability, with a focus on simplicity and ease of use.',
  },
  timescaledb: {
    website: 'https://www.timescale.com/',
    github: 'timescale/timescaledb',
    description:
      'Time-series database optimized for high-performance ingestion, storage, and analysis, with a focus on scalability and ease of use.',
  },
  tinybird: {
    website: 'https://www.tinybird.co/',
    description:
      'Real-time data platform for building scalable and performant applications, with a focus on simplicity and ease of use.',
  },
  traefik: {
    website: 'https://traefik.io/',
    github: 'traefik/traefik',
    description:
      'Modern HTTP reverse proxy and load balancer, designed for easy microservice deployment, with a focus on simplicity and security.',
  },
  travisci: {
    website: 'https://www.travis-ci.com/',
    description:
      'Hosted continuous integration service used to build and test software projects hosted on GitHub and Bitbucket.',
  },
  trufflesecurity: {
    website: 'https://trufflesecurity.com/',
    description:
      'Secrets detection and remediation platform, specialized in finding leaked credentials and sensitive data.',
  },
  turborepo: {
    website: 'https://turbo.build/repo',
    github: 'vercel/turbo',
    description:
      'High-performance build system for JavaScript and TypeScript monorepos, optimized for speed and efficiency.',
  },
  tursodb: {
    website: 'https://turso.tech/',
    github: 'tursodatabase/libsql',
    description:
      'Edge-hosted, distributed database based on libSQL, offering low-latency global data access.',
  },
  twigphp: {
    website: 'https://twig.symfony.com/',
    github: 'twigphp/Twig',
    description:
      'Flexible, fast, and secure template engine for PHP, commonly used by frameworks like Symfony.',
  },
  twilio: {
    website: 'https://www.twilio.com/',
    description:
      'Cloud communications platform as a service (CPaaS) for building voice, video, and messaging applications.',
  },
  twitter: {
    website: 'https://twitter.com/',
    description:
      "Social networking and microblogging service where users post and interact with messages known as 'tweets'.",
  },
  typescript: {
    website: 'https://www.typescriptlang.org/',
    github: 'microsoft/TypeScript',
    description:
      'Statically typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.',
  },
  typesense: {
    website: 'https://typesense.org/',
    github: 'typesense/typesense',
    description:
      'Lightning-fast, typo-tolerant, open-source search engine optimized for developer happiness and ease of use.',
  },
  typesensecloud: {
    website: 'https://cloud.typesense.org/',
    description:
      'Fully managed cloud service for Typesense, simplifying deployment, scaling, and maintenance of search infrastructure.',
  },
  'upstash.kafka': {
    website: 'https://upstash.com/kafka',
    description:
      'Serverless Kafka service provided by Upstash, offering managed event streaming without operational overhead.',
  },
  'upstash.qstash': {
    website: 'https://upstash.com/qstash',
    description:
      'Serverless message queuing and task scheduling service by Upstash, designed for HTTP-based workloads.',
  },
  'upstash.redis': {
    website: 'https://upstash.com/redis',
    description:
      'Serverless Redis service from Upstash, providing globally replicated, low-latency data storage.',
  },
  upstash: {
    website: 'https://upstash.com/',
    description:
      'Platform offering serverless data solutions, including Redis, Kafka, and QStash, for modern applications.',
  },
  uptimekuma: {
    website: 'https://github.com/louislam/uptime-kuma',
    github: 'louislam/uptime-kuma',
    description:
      'Self-hosted, open-source uptime monitoring tool with a user-friendly interface and various notification options.',
  },
  vale: {
    website: 'https://vale.sh/',
    github: 'errata-ai/vale',
    description:
      'Command-line tool for linting prose, enabling consistent style and grammar checking across various markup formats.',
  },
  'vercel.ai': {
    website: 'https://vercel.com/ai',
    description:
      'SDK provided by Vercel for easily integrating generative AI features into web applications.',
  },
  'vercel.analytics': {
    website: 'https://vercel.com/analytics',
    description:
      'Privacy-friendly, real-time analytics service by Vercel for monitoring website traffic and performance.',
  },
  'vercel.blob': {
    website: 'https://vercel.com/blob',
    description:
      'Globally distributed object storage service by Vercel, designed for fast and reliable file serving.',
  },
  'vercel.edge': {
    website: 'https://vercel.com/edge',
    description:
      'Platform by Vercel for deploying serverless functions at the edge, closer to users for reduced latency.',
  },
  'vercel.kv': {
    website: 'https://vercel.com/kv',
    description:
      'Serverless key-value store provided by Vercel, offering durable and fast data storage for edge functions.',
  },
  'vercel.postgres': {
    website: 'https://vercel.com/postgres',
    description:
      'Serverless PostgreSQL database service by Vercel, enabling easy integration of relational databases with Vercel projects.',
  },
  vercel: {
    website: 'https://vercel.com/',
    description:
      'Platform for frontend developers, providing tools and infrastructure for building, deploying, and scaling web applications.',
  },
  veriff: {
    website: 'https://www.veriff.com/',
    description:
      'AI-powered identity verification and KYC (Know Your Customer) solution for online businesses.',
  },
  vialink: {
    website: 'https://vialink.fr/',
    description:
      'Platform specializing in digital transformation, offering solutions for document management and process automation.',
  },
  victoriametrics: {
    website: 'https://victoriametrics.com/',
    github: 'VictoriaMetrics/VictoriaMetrics',
    description:
      'Fast, cost-effective, and scalable open-source time series database and monitoring solution.',
  },
  vite: {
    website: 'https://vitejs.dev/',
    github: 'vitejs/vite',
    description:
      'Next-generation frontend tooling that provides an extremely fast development server and optimized build process.',
  },
  vue: {
    website: 'https://vuejs.org/',
    github: 'vuejs/vue',
    description:
      'Progressive JavaScript framework for building user interfaces, incrementally adoptable and versatile.',
  },
  wasp: {
    website: 'https://wasp-lang.dev/',
    github: 'wasp-lang/wasp',
    description:
      'Full-stack, declarative web framework for React, Node.js, and Prisma, simplifying web app development.',
  },
  webflow: {
    website: 'https://webflow.com/',
    description:
      'Visual web development platform for designing, building, and launching responsive websites without coding.',
  },
  webpack: {
    website: 'https://webpack.js.org/',
    github: 'webpack/webpack',
    description:
      'Module bundler for JavaScript applications, processing modules with dependencies to generate static assets.',
  },
  wiz: {
    website: 'https://www.wiz.io/',
    description:
      'Cloud security platform providing full-stack visibility and risk assessment across cloud environments.',
  },
  woocommerce: {
    website: 'https://woocommerce.com/',
    github: 'woocommerce/woocommerce',
    description:
      'Open-source e-commerce plugin for WordPress, enabling online store creation and management.',
  },
  wordpress: {
    website: 'https://wordpress.org/',
    github: 'WordPress/wordpress-develop',
    description:
      'Popular open-source content management system (CMS) used for creating websites, blogs, and applications.',
  }, // Dev repo
  workos: {
    website: 'https://workos.com/',
    description:
      'Platform providing APIs for enterprise-ready features like Single Sign-On (SSO) and directory sync.',
  },
  xai: {
    website: 'https://x.ai/',
    description:
      'Company focused on developing artificial intelligence, particularly large language models (e.g., Grok).',
  },
  yarn: {
    website: 'https://yarnpkg.com/',
    github: 'yarnpkg/berry',
    description:
      'Fast, reliable, and secure dependency management tool for JavaScript projects, an alternative to npm.',
  },
  yii2: {
    website: 'https://www.yiiframework.com/',
    github: 'yiisoft/yii2',
    description:
      'High-performance PHP framework for developing Web 2.0 applications, known for its component-based architecture.',
  },
  yousign: {
    website: 'https://yousign.com/',
    description:
      'Electronic signature solution for businesses to streamline document approval workflows securely.',
  },
  zapier: {
    website: 'https://zapier.com/',
    description:
      'Online automation tool connecting apps and services to automate repetitive tasks without coding.',
  },
  zendesk: {
    website: 'https://www.zendesk.com/',
    description:
      'Customer service software and support ticket system for businesses to manage customer interactions.',
  },
  zig: {
    website: 'https://ziglang.org/',
    github: 'ziglang/zig',
    description:
      'General-purpose programming language and toolchain for maintaining robust, optimal, and reusable software.',
  },
  zipkin: {
    website: 'https://zipkin.io/',
    github: 'openzipkin/zipkin',
    description:
      'Distributed tracing system for collecting and analyzing timing data across microservices.',
  },
  zookeeper: {
    website: 'https://zookeeper.apache.org/',
    github: 'apache/zookeeper',
    description:
      'Centralized service for maintaining configuration information, naming, providing distributed synchronization, and group services.',
  },
  zoom: {
    website: 'https://zoom.us/',
    description:
      'Video conferencing platform for virtual meetings, webinars, chat, and collaboration.',
  },
  zuora: {
    website: 'https://www.zuora.com/',
    description:
      'Subscription management platform for businesses to manage recurring billing, revenue, and quotes.',
  },

  deepsource: {
    website: 'https://deepsource.com',
    description:
      'Automated static analysis platform for discovering and fixing bugs, anti-patterns, and security vulnerabilities in code.',
  },
  depotdev: {
    website: 'https://depot.dev',
    description:
      'Fast Docker image building service in the cloud, offering remote builders and caching for CI/CD pipelines.',
  },
  infisical: {
    website: 'https://infisical.com/',
    description:
      'Open-source platform for managing secrets and configuration for applications, with end-to-end encryption.',
  },
  mintlify: {
    website: 'https://mintlify.com/',
    description:
      'Platform for creating and maintaining beautiful, interactive documentation for software projects.',
  },
  vitest: {
    website: 'https://vitest.dev/',
    description:
      'Blazing fast Vite-native unit test framework, offering a modern testing experience for Vite projects.',
  },
  glsl: {
    website: 'https://www.khronos.org/opengl/wiki/Main_Page',
    description:
      'High-level shading language for graphics programming, used with OpenGL and Vulkan for creating visual effects.',
  },
  radixui: {
    website: 'https://www.radix-ui.com/',
    description:
      'Open-source UI component library for building accessible and customizable design systems with React.',
  },
  tiptap: {
    website: 'https://tiptap.dev/',
    description:
      'Headless, framework-agnostic rich text editor, providing a flexible foundation for building custom text editors.',
  },

  akamai: {
    website: 'https://www.akamai.com/',
    description:
      'Global content delivery network (CDN), cybersecurity, and cloud service provider for web and internet security.',
  },
  betterauth: {
    website: 'https://www.better-auth.com/',
    github: 'better-auth/better-auth',
    description:
      'Comprehensive and framework-agnostic authentication framework for TypeScript, offering features like email/password, social sign-on, 2FA, and multi-tenancy.',
  },
  browerbase: {
    website: 'https://www.browserbase.com/',
    description:
      'Headless browser automation platform providing APIs for web scraping, testing, and data extraction tasks.',
  },
  chargebee: {
    website: 'https://www.chargebee.com/',
    description:
      'Subscription billing and revenue management platform for SaaS and subscription-based businesses.',
  },
  firecrawl: {
    website: 'https://firecrawl.dev/',
    description:
      'Service for crawling and converting websites into structured data, useful for AI applications and data analysis.',
  },
  hetzner: {
    website: 'https://www.hetzner.com/',
    description:
      'Web hosting provider and data center operator offering dedicated servers, cloud solutions, and colocation services.',
  },
  hostinger: {
    website: 'https://www.hostinger.com/',
    description:
      'Web hosting provider offering shared hosting, VPS, and cloud hosting solutions for websites and applications.',
  },
  inngest: {
    website: 'https://www.inngest.com/',
    description:
      'Event-driven serverless platform for building reliable background jobs, workflows, and scheduled tasks.',
  },
  logtoio: {
    website: 'https://logto.io/',
    description:
      'Open-source identity solution for managing user authentication and authorization in applications.',
  },
  metabase: {
    website: 'https://www.metabase.com/',
    description:
      'Open-source business intelligence tool for asking questions about data and displaying answers in various formats.',
  },
  n8n: {
    website: 'https://n8n.io/',
    github: 'n8n-io/n8n',
    description:
      'Workflow automation platform offering code-like flexibility with no-code speed, featuring numerous integrations and AI capabilities for powerful automations with data control.',
  },
  paddle: {
    website: 'https://www.paddle.com/',
    description:
      'Revenue delivery platform for SaaS businesses, handling payments, subscriptions, taxes, and compliance.',
  },
  pinecone: {
    website: 'https://www.pinecone.io/',
    description:
      'Managed vector database service for building high-performance applications with semantic search and AI features.',
  },
  pulumi: {
    website: 'https://www.pulumi.com/',
    description:
      'Infrastructure as Code platform using familiar programming languages to provision and manage cloud resources.',
  },
  twentycrm: {
    website: 'https://twenty.com/',
    description:
      'Open-source CRM platform designed for flexibility and customization to manage customer relationships.',
  },
  'atlassian.bitbucketpipelines': {
    website: 'https://bitbucket.org/product/features/pipelines',
    description:
      'CI/CD service integrated into Bitbucket Cloud for automating build, test, and deployment workflows.',
  },
  'aws.codepipeline': {
    website: 'https://aws.amazon.com/codepipeline/',
    description:
      'Fully managed continuous delivery service by AWS for automating software release pipelines.',
  },
  biomejs: {
    website: 'https://www.biomejs.dev/',
    github: 'biomejs/biome',
    description:
      'Fast formatter and linter for web projects, designed to replace Prettier and ESLint with high performance.',
  },
  concourseci: {
    website: 'https://concourse-ci.org/',
    description:
      'Open-source continuous integration and delivery system with a focus on declarative pipelines and automation.',
  },
  readthedocs: {
    website: 'https://readthedocs.org/',
    description:
      'Platform for building, hosting, and versioning documentation for software projects, often from Sphinx or MkDocs.',
  },
  stytch: {
    website: 'https://stytch.com/',
    description:
      'Authentication platform providing APIs and SDKs for passwordless login, MFA, and user management.',
  },
  'aws.cognito': {
    website: 'https://aws.amazon.com/cognito/',
    description:
      'Service by AWS for adding user sign-up, sign-in, and access control to web and mobile apps quickly.',
  },
  frontegg: {
    website: 'https://frontegg.com/',
    description:
      'User management platform for B2B SaaS applications, offering authentication, authorization, and subscription features.',
  },
  fusionauth: {
    website: 'https://fusionauth.io/',
    description:
      'Developer-focused authentication, authorization, and user management platform for any application.',
  },
  hanko: {
    website: 'https://www.hanko.io/',
    description:
      'Open-source, passwordless authentication solution designed for passkey-first user experiences.',
  },
  kinde: {
    website: 'https://kinde.com/',
    description:
      'Authentication and user management platform for developers, simplifying secure sign-up, sign-in, and MFA.',
  },
  orysh: {
    website: 'https://ory.sh/',
    description:
      'Open-source identity and access management solutions, providing building blocks like OAuth2, OpenID Connect, and permissions.',
  },
  supertokens: {
    website: 'https://supertokens.com/',
    description:
      'Open-source authentication solution offering various recipes for session management, user roles, and third-party logins.',
  },
  swiftype: {
    website: 'https://swiftype.com/',
    description:
      'Site search and enterprise search platform, providing tools for creating and managing search experiences (acquired by Elastic).',
  },
  apideck: {
    website: 'https://apideck.com/',
    description:
      'Platform for unified API access, enabling integration with various SaaS applications through a single API.',
  },
  integrationapp: {
    website: 'https://integration.app/',
    description:
      'Service for building and managing integrations with third-party applications (specific details may vary by provider).',
  },
  mergedev: {
    website: 'https://merge.dev/',
    description:
      'Unified API platform for integrating with various HR, payroll, and accounting systems.',
  },
  trayio: {
    website: 'https://tray.io/',
    description:
      'General automation platform for connecting cloud services and automating complex workflows.',
  },
  useparagon: {
    website: 'https://useparagon.com/',
    description:
      'Embedded integration platform for SaaS companies to offer native integrations to their customers.',
  },
  kysely: {
    website: 'https://kysely.dev/',
    github: 'kysely-org/kysely',
    description:
      'Type-safe SQL query builder for TypeScript, enabling autocompletion and error prevention for database queries.',
  },
  asdf: {
    website: 'https://asdf-vm.com/',
    github: 'asdf-vm/asdf',
    description:
      'Extensible version manager with support for multiple languages and tools, managed via a single CLI.',
  },
  bundler: {
    website: 'https://bundler.io/',
    github: 'rubygems/bundler',
    description:
      'Dependency manager for Ruby projects, ensuring consistent gem versions across development and production.',
  },
  cargo: {
    website: 'https://doc.rust-lang.org/cargo/',
    github: 'rust-lang/cargo',
    description:
      'Package manager and build system for Rust projects, handling dependencies, compilation, and testing.',
  },
  goenv: {
    website: 'https://github.com/syndbg/goenv',
    github: 'syndbg/goenv',
    description:
      'Version manager for Go, allowing easy installation and switching between multiple Go versions.',
  },
  npm: {
    website: 'https://www.npmjs.com/',
    github: 'npm/cli',
    description:
      'Default package manager for Node.js, used for discovering, sharing, and managing JavaScript packages.',
  },
  poetry: {
    website: 'https://python-poetry.org/',
    github: 'python-poetry/poetry',
    description:
      'Dependency management and packaging tool for Python, simplifying project setup and dependency resolution.',
  },
  nuget: {
    website: 'https://www.nuget.org/',
    github: 'NuGet/NuGet.Client',
    description:
      'Package manager for .NET, enabling developers to create, share, and consume reusable code libraries.',
  },
  nvm: {
    website: 'https://github.com/nvm-sh/nvm',
    github: 'nvm-sh/nvm',
    description:
      'Node Version Manager, a command-line tool for managing multiple active Node.js versions.',
  },
  phpcomposer: {
    website: 'https://getcomposer.org/',
    github: 'composer/composer',
    description:
      'Dependency manager for PHP, facilitating the management of libraries and dependencies in PHP projects.',
  },
  phpenv: {
    website: 'https://github.com/phpenv/phpenv',
    github: 'phpenv/phpenv',
    description:
      'Version manager for PHP, allowing users to install and switch between multiple PHP versions.',
  },
  pipenv: {
    website: 'https://pipenv.pypa.io/en/latest/',
    github: 'pypa/pipenv',
    description:
      'Tool for managing Python project dependencies and virtual environments, combining pip and virtualenv.',
  },
  rubocop: {
    website: 'https://rubocop.org/',
    github: 'rubocop/rubocop',
    description:
      'Static code analyzer (linter) for Ruby, enforcing community style guidelines and detecting code issues.',
  },
  rubyenv: {
    website: 'https://github.com/rbenv/rbenv',
    github: 'rbenv/rbenv',
    description:
      'Version manager for Ruby, allowing easy installation and management of Ruby versions.',
  },
  withorb: {
    website: 'https://withorb.com',
    description:
      'Usage-based subscription management and billing infrastructure platform designed for flexible pricing and revenue workflows.',
  },
  dieselrs: {
    website: 'https://diesel.rs/',
    github: 'diesel-rs/diesel',
    description:
      'Safe, extensible ORM and query builder for Rust, designed for high performance and type safety.',
  },
  django: {
    website: 'https://www.djangoproject.com/',
    description:
      'High-level Python web framework encouraging rapid development and clean, pragmatic design.',
  },
  goent: {
    website: 'https://github.com/ent/ent',
    github: 'ent/ent',
    description:
      'Simple, yet powerful entity framework for Go, featuring schema definition as code and query generation.',
  },
  gorm: {
    website: 'https://gorm.io/',
    github: 'go-gorm/gorm',
    description:
      'Developer-friendly ORM library for Go, supporting various database systems and advanced features.',
  },
  rails: {
    website: 'https://rubyonrails.org/',
    description:
      'Full-stack web application framework written in Ruby, emphasizing convention over configuration (Ruby on Rails).',
  },
  sequelruby: {
    website: 'https://sequel.jeremyevans.net/',
    github: 'sequelize/sequelize', // Note: GitHub link points to sequelize, which might be an error in original data or intentional.
    description:
      'Database toolkit for Ruby, providing a simple, flexible, and powerful ORM and SQL builder.',
  },
  sqlalchemy: {
    website: 'https://www.sqlalchemy.org/',
    description:
      'SQL toolkit and Object-Relational Mapper for Python, offering flexibility and power for database interaction.',
  },
  typeorm: {
    website: 'https://typeorm.io/',
    github: 'typeorm/typeorm',
    description:
      'ORM for TypeScript and JavaScript, supporting multiple databases and enabling Active Record and Data Mapper patterns.',
  },
};

const extendedListTech: TechItemWithExtended[] = listTech.map((tech) => {
  const extended = extendedInfo[tech.key]!;

  return {
    ...tech,
    ...extended,
  };
});

export { extendedListTech };
