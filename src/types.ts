export interface ContentfulLink {
  sys: {
    type: "Link";
    linkType: string;
    id: string;
  };
}

export interface ContentfulField {
  id: string;
  name: string;
  type: string;
  localized?: boolean;
  required?: boolean;
  validations?: any[];
  items?: {
    type: string;
    validations?: any[];
    linkType?: string;
  };
  linkType?: string;
}

export interface ContentfulContentType {
  sys: {
    space: ContentfulLink;
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: ContentfulLink;
    publishedVersion?: number;
    publishedAt?: string;
    firstPublishedAt?: string;
    createdBy?: ContentfulLink;
    updatedBy?: ContentfulLink;
    publishedBy?: ContentfulLink;
    version?: number;
  };
  displayField?: string;
  name: string;
  description?: string;
  fields: ContentfulField[];
}

export interface ContentfulSchema {
  contentTypes: ContentfulContentType[];
  tags: any[];
  editorInterfaces: any[];
  entries: any[];
  assets: any[];
  locales: any[];
  webhooks: any[];
  roles: any[];
}

export interface GeneratorOptions {
  /**
   * Path to the input Contentful schema JSON file
   */
  input: string;

  /**
   * Path where the generated TypeScript file should be written
   */
  output: string;

  /**
   * Whether to allow unknown keys in objects
   * @default false
   */
  passthrough?: boolean;

  /**
   * Whether to use z.unknown() for unsupported types instead of throwing an error
   * @default false
   */
  allowUnknown?: boolean;

  /**
   * Whether to generate flat schemas
   * @default false
   */
  flat?: boolean;
}

export type GeneratorConfig = Required<GeneratorOptions>;
