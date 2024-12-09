import type { Document } from "@contentful/rich-text-types";
import { z } from "zod";

export const contentfulImageSchema = z.object({
  sys: z.object({
    type: z.literal("Asset"),
  }),
  fields: z.object({
    title: z.string(),
    description: z.string(),
    file: z.object({
      url: z.string(),
      details: z.object({
        size: z.number(),
        image: z.object({
          width: z.number(),
          height: z.number(),
        }),
      }),
      fileName: z.string(),
      contentType: z.string(),
    }),
  }),
});

export type ContentfulImage = z.infer<typeof contentfulImageSchema>;

export const contentfulRichTextSchema = z.unknown() as z.ZodType<Document>;

export type ContentfulRichText = z.infer<typeof contentfulRichTextSchema>;

const _baseLink = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("link"),
      }),
    }),
  }),
  fields: z.object({
    label: z.string(),
    href: z.string().optional(),
    page: z.unknown(),
  }),
});

export type Link = z.infer<typeof _baseLink> & {
  fields: { page?: Page | undefined };
};

export const linkSchema: z.ZodType<Link> = _baseLink.extend({
  fields: _baseLink.shape.fields.extend({
    page: z.lazy(() => pageSchema).optional(),
  }),
});

const _baseShortLink = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("shortLink"),
      }),
    }),
  }),
  fields: z.object({
    label: z.string(),
    short: z.string().optional(),
    href: z.string().optional(),
    page: z.unknown(),
  }),
});

export type ShortLink = z.infer<typeof _baseShortLink> & {
  fields: { page?: Page | undefined };
};

export const shortLinkSchema: z.ZodType<ShortLink> = _baseShortLink.extend({
  fields: _baseShortLink.shape.fields.extend({
    page: z.lazy(() => pageSchema).optional(),
  }),
});

const _baseImageStack3 = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("imageStack3"),
      }),
    }),
  }),
  fields: z.object({
    images: z.array(contentfulImageSchema),
    border: z.boolean().optional(),
  }),
});

export type ImageStack3 = z.infer<typeof _baseImageStack3> & { fields: {} };

export const imageStack3Schema: z.ZodType<ImageStack3> =
  _baseImageStack3.extend({
    fields: _baseImageStack3.shape.fields.extend({}),
  });

const _baseImageStack5 = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("imageStack5"),
      }),
    }),
  }),
  fields: z.object({
    images: z.array(contentfulImageSchema),
    border: z.boolean().optional(),
  }),
});

export type ImageStack5 = z.infer<typeof _baseImageStack5> & { fields: {} };

export const imageStack5Schema: z.ZodType<ImageStack5> =
  _baseImageStack5.extend({
    fields: _baseImageStack5.shape.fields.extend({}),
  });

const _baseSEO = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("seo"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: contentfulImageSchema,
  }),
});

export type SEO = z.infer<typeof _baseSEO> & { fields: {} };

export const seoSchema: z.ZodType<SEO> = _baseSEO.extend({
  fields: _baseSEO.shape.fields.extend({}),
});

const _baseHero = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("hero"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: z.unknown(),
  }),
});

export type Hero = z.infer<typeof _baseHero> & {
  fields: { cta?: Link | undefined };
};

export const heroSchema: z.ZodType<Hero> = _baseHero.extend({
  fields: _baseHero.shape.fields.extend({
    cta: z.lazy(() => linkSchema).optional(),
  }),
});

const _baseFooter = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("footer"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    subtitle: z.string(),
    cta: z.unknown(),
    ctaBody: contentfulRichTextSchema,
    addressTitle: z.string(),
    addressEmail: z.unknown(),
    addressPhone: z.unknown(),
    addressOrg: z.string(),
    linksTitle: z.string(),
    linksItems: z.array(z.unknown()),
    aboutTitle: z.string(),
    aboutBody: contentfulRichTextSchema,
    aboutCta: z.unknown(),
    copyright: z.string(),
  }),
});

export type Footer = z.infer<typeof _baseFooter> & {
  fields: {
    cta: Link;
    addressEmail: Link;
    addressPhone: Link;
    aboutCta?: Link | undefined;
  };
};

export const footerSchema: z.ZodType<Footer> = _baseFooter.extend({
  fields: _baseFooter.shape.fields.extend({
    cta: z.lazy(() => linkSchema),
    addressEmail: z.lazy(() => linkSchema),
    addressPhone: z.lazy(() => linkSchema),
    aboutCta: z.lazy(() => linkSchema).optional(),
  }),
});

const _baseHeader = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("header"),
      }),
    }),
  }),
  fields: z.object({
    links: z.array(z.unknown()),
    cta: z.unknown(),
  }),
});

export type Header = z.infer<typeof _baseHeader> & {
  fields: { cta: ShortLink };
};

export const headerSchema: z.ZodType<Header> = _baseHeader.extend({
  fields: _baseHeader.shape.fields.extend({
    cta: z.lazy(() => shortLinkSchema),
  }),
});

const _baseMarketingBannerCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("marketingBannerCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: z.unknown(),
    imageStack: z.unknown(),
  }),
});

export type MarketingBannerCard = z.infer<typeof _baseMarketingBannerCard> & {
  fields: { cta: Link; imageStack: ImageStack3 };
};

export const marketingBannerCardSchema: z.ZodType<MarketingBannerCard> =
  _baseMarketingBannerCard.extend({
    fields: _baseMarketingBannerCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema),
      imageStack: z.lazy(() => imageStack3Schema),
    }),
  });

const _baseContentCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("contentCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: z.unknown(),
  }),
});

export type ContentCard = z.infer<typeof _baseContentCard> & {
  fields: { cta?: Link | undefined };
};

export const contentCardSchema: z.ZodType<ContentCard> =
  _baseContentCard.extend({
    fields: _baseContentCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema).optional(),
    }),
  });

const _baseConsultationCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("consultationCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: z.unknown(),
    imageStack: z.unknown(),
  }),
});

export type ConsultationCard = z.infer<typeof _baseConsultationCard> & {
  fields: { cta?: Link | undefined; imageStack: ImageStack3 };
};

export const consultationCardSchema: z.ZodType<ConsultationCard> =
  _baseConsultationCard.extend({
    fields: _baseConsultationCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema).optional(),
      imageStack: z.lazy(() => imageStack3Schema),
    }),
  });

const _baseClientsCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("clientsCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    imageStack: z.unknown(),
  }),
});

export type ClientsCard = z.infer<typeof _baseClientsCard> & {
  fields: { imageStack: ImageStack5 };
};

export const clientsCardSchema: z.ZodType<ClientsCard> =
  _baseClientsCard.extend({
    fields: _baseClientsCard.shape.fields.extend({
      imageStack: z.lazy(() => imageStack5Schema),
    }),
  });

const _baseTeaserCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("teaserCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.string(),
    cta: z.unknown(),
    image: contentfulImageSchema,
  }),
});

export type TeaserCard = z.infer<typeof _baseTeaserCard> & {
  fields: { cta: Link };
};

export const teaserCardSchema: z.ZodType<TeaserCard> = _baseTeaserCard.extend({
  fields: _baseTeaserCard.shape.fields.extend({
    cta: z.lazy(() => linkSchema),
  }),
});

const _basePromotionCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("promotionCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.string(),
    cta: z.unknown(),
    image: contentfulImageSchema,
  }),
});

export type PromotionCard = z.infer<typeof _basePromotionCard> & {
  fields: { cta: Link };
};

export const promotionCardSchema: z.ZodType<PromotionCard> =
  _basePromotionCard.extend({
    fields: _basePromotionCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema),
    }),
  });

const _baseContentWithImageCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("contentWithImageCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: z.unknown(),
    image: contentfulImageSchema,
  }),
});

export type ContentWithImageCard = z.infer<typeof _baseContentWithImageCard> & {
  fields: { cta: Link };
};

export const contentWithImageCardSchema: z.ZodType<ContentWithImageCard> =
  _baseContentWithImageCard.extend({
    fields: _baseContentWithImageCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema),
    }),
  });

const _baseImageCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("imageCard"),
      }),
    }),
  }),
  fields: z.object({
    image: contentfulImageSchema,
  }),
});

export type ImageCard = z.infer<typeof _baseImageCard> & { fields: {} };

export const imageCardSchema: z.ZodType<ImageCard> = _baseImageCard.extend({
  fields: _baseImageCard.shape.fields.extend({}),
});

const _baseFormCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("formCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    form: z.string(),
  }),
});

export type FormCard = z.infer<typeof _baseFormCard> & { fields: {} };

export const formCardSchema: z.ZodType<FormCard> = _baseFormCard.extend({
  fields: _baseFormCard.shape.fields.extend({}),
});

const _baseBentoRow1 = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("bentoRow1"),
      }),
    }),
  }),
  fields: z.object({
    column1: z.unknown(),
    column2: z.unknown(),
  }),
});

export type BentoRow1 = z.infer<typeof _baseBentoRow1> & {
  fields: {
    column1:
      | MarketingBannerCard
      | ImageCard
      | FormCard
      | ContentCard
      | ContentWithImageCard;
    column2: ContentCard | ImageCard;
  };
};

export const bentoRow1Schema: z.ZodType<BentoRow1> = _baseBentoRow1.extend({
  fields: _baseBentoRow1.shape.fields.extend({
    column1: z.lazy(() =>
      z.union([
        marketingBannerCardSchema,
        imageCardSchema,
        formCardSchema,
        contentCardSchema,
        contentWithImageCardSchema,
      ])
    ),
    column2: z.lazy(() => z.union([contentCardSchema, imageCardSchema])),
  }),
});

const _baseBentoRow2 = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("bentoRow2"),
      }),
    }),
  }),
  fields: z.object({
    column1: z.unknown(),
    column2: z.unknown(),
  }),
});

export type BentoRow2 = z.infer<typeof _baseBentoRow2> & {
  fields: {
    column1: ContentCard | ImageCard;
    column2: ContentCard | ImageCard | ContentWithImageCard;
  };
};

export const bentoRow2Schema: z.ZodType<BentoRow2> = _baseBentoRow2.extend({
  fields: _baseBentoRow2.shape.fields.extend({
    column1: z.lazy(() => z.union([contentCardSchema, imageCardSchema])),
    column2: z.lazy(() =>
      z.union([contentCardSchema, imageCardSchema, contentWithImageCardSchema])
    ),
  }),
});

const _baseBentoRow3 = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("bentoRow3"),
      }),
    }),
  }),
  fields: z.object({
    column1: z.unknown(),
    column2: z.unknown(),
    column3: z.unknown(),
  }),
});

export type BentoRow3 = z.infer<typeof _baseBentoRow3> & {
  fields: {
    column1: PromotionCard | ContentCard | ImageCard;
    column2: TeaserCard | ImageCard;
    column3: TeaserCard | ImageCard;
  };
};

export const bentoRow3Schema: z.ZodType<BentoRow3> = _baseBentoRow3.extend({
  fields: _baseBentoRow3.shape.fields.extend({
    column1: z.lazy(() =>
      z.union([promotionCardSchema, contentCardSchema, imageCardSchema])
    ),
    column2: z.lazy(() => z.union([teaserCardSchema, imageCardSchema])),
    column3: z.lazy(() => z.union([teaserCardSchema, imageCardSchema])),
  }),
});

const _baseBentoRow4 = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("bentoRow4"),
      }),
    }),
  }),
  fields: z.object({
    column1: z.unknown(),
  }),
});

export type BentoRow4 = z.infer<typeof _baseBentoRow4> & {
  fields: { column1: ImageCard | ConsultationCard | ClientsCard };
};

export const bentoRow4Schema: z.ZodType<BentoRow4> = _baseBentoRow4.extend({
  fields: _baseBentoRow4.shape.fields.extend({
    column1: z.lazy(() =>
      z.union([imageCardSchema, consultationCardSchema, clientsCardSchema])
    ),
  }),
});

const _basePage = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("page"),
      }),
    }),
  }),
  fields: z.object({
    breadcrumbs: z.boolean().optional(),
    breadcrumbLabel: z.string().optional(),
    path: z.string(),
    hero: z.unknown(),
    content: z.array(z.unknown()),
    seo: z.unknown(),
    layout: z.unknown(),
  }),
});

export type Page = z.infer<typeof _basePage> & {
  fields: { hero: Hero; seo?: SEO | undefined; layout: Layout };
};

export const pageSchema: z.ZodType<Page> = _basePage.extend({
  fields: _basePage.shape.fields.extend({
    hero: z.lazy(() => heroSchema),
    seo: z.lazy(() => seoSchema).optional(),
    layout: z.lazy(() => layoutSchema),
  }),
});

const _baseLayout = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("layout"),
      }),
    }),
  }),
  fields: z.object({
    header: z.unknown(),
    footer: z.unknown(),
    seo: z.unknown(),
  }),
});

export type Layout = z.infer<typeof _baseLayout> & {
  fields: { header: Header; footer: Footer; seo: SEO };
};

export const layoutSchema: z.ZodType<Layout> = _baseLayout.extend({
  fields: _baseLayout.shape.fields.extend({
    header: z.lazy(() => headerSchema),
    footer: z.lazy(() => footerSchema),
    seo: z.lazy(() => seoSchema),
  }),
});
