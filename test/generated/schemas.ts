import type { Document } from "@contentful/rich-text-types";
import { z } from "zod";

export const contentfulMediaSchema = z.object({
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
        image: z
          .object({
            width: z.number(),
            height: z.number(),
          })
          .optional(),
      }),
      fileName: z.string(),
      contentType: z.string(),
    }),
  }),
});

export type ContentfulMedia = z.infer<typeof contentfulMediaSchema>;

export const contentfulRichTextSchema = z.unknown() as z.ZodType<Document>;

export type ContentfulRichText = z.infer<typeof contentfulRichTextSchema>;

const baseLink = z.object({
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

export type Link = z.infer<typeof baseLink> & {
  fields: { page?: Page | undefined };
};

export const linkSchema: z.ZodType<Link> = baseLink.extend({
  fields: baseLink.shape.fields.extend({
    page: z.lazy(() => pageSchema).optional(),
  }),
});

const baseShortLink = z.object({
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

export type ShortLink = z.infer<typeof baseShortLink> & {
  fields: { page?: Page | undefined };
};

export const shortLinkSchema: z.ZodType<ShortLink> = baseShortLink.extend({
  fields: baseShortLink.shape.fields.extend({
    page: z.lazy(() => pageSchema).optional(),
  }),
});

const baseImageStack3 = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("imageStack3"),
      }),
    }),
  }),
  fields: z.object({
    images: z.array(
      z
        .object({
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
                image: z
                  .object({
                    width: z.number(),
                    height: z.number(),
                  })
                  .optional(),
              }),
              fileName: z.string(),
              contentType: z.string(),
            }),
          }),
        })
        .optional()
    ),
    border: z.boolean().optional(),
  }),
});

export type ImageStack3 = z.infer<typeof baseImageStack3> & { fields: {} };

export const imageStack3Schema: z.ZodType<ImageStack3> = baseImageStack3.extend(
  {
    fields: baseImageStack3.shape.fields.extend({}),
  }
);

const baseImageStack5 = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("imageStack5"),
      }),
    }),
  }),
  fields: z.object({
    images: z.array(
      z
        .object({
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
                image: z
                  .object({
                    width: z.number(),
                    height: z.number(),
                  })
                  .optional(),
              }),
              fileName: z.string(),
              contentType: z.string(),
            }),
          }),
        })
        .optional()
    ),
    border: z.boolean().optional(),
  }),
});

export type ImageStack5 = z.infer<typeof baseImageStack5> & { fields: {} };

export const imageStack5Schema: z.ZodType<ImageStack5> = baseImageStack5.extend(
  {
    fields: baseImageStack5.shape.fields.extend({}),
  }
);

const baseSEO = z.object({
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
    image: z.object({
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
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    }),
  }),
});

export type SEO = z.infer<typeof baseSEO> & { fields: {} };

export const seoSchema: z.ZodType<SEO> = baseSEO.extend({
  fields: baseSEO.shape.fields.extend({}),
});

const baseHero = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("hero"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.unknown(),
    cta: z.unknown(),
  }),
});

export type Hero = z.infer<typeof baseHero> & {
  fields: { cta?: Link | undefined };
};

export const heroSchema: z.ZodType<Hero> = baseHero.extend({
  fields: baseHero.shape.fields.extend({
    cta: z.lazy(() => linkSchema).optional(),
  }),
});

const baseFooter = z.object({
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
    ctaBody: z.unknown(),
    addressTitle: z.string(),
    addressEmail: z.unknown(),
    addressPhone: z.unknown(),
    addressOrg: z.string(),
    linksTitle: z.string(),
    linksItems: z.unknown(),
    aboutTitle: z.string(),
    aboutBody: z.unknown(),
    aboutCta: z.unknown(),
    copyright: z.string(),
  }),
});

export type Footer = z.infer<typeof baseFooter> & {
  fields: {
    cta: Link;
    addressEmail: Link;
    addressPhone: Link;
    linksItems: Link[];
    aboutCta?: Link | undefined;
  };
};

export const footerSchema: z.ZodType<Footer> = baseFooter.extend({
  fields: baseFooter.shape.fields.extend({
    cta: z.lazy(() => linkSchema),
    addressEmail: z.lazy(() => linkSchema),
    addressPhone: z.lazy(() => linkSchema),
    linksItems: z.lazy(() => z.array(linkSchema)),
    aboutCta: z.lazy(() => linkSchema).optional(),
  }),
});

const baseHeader = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("header"),
      }),
    }),
  }),
  fields: z.object({
    links: z.unknown(),
    cta: z.unknown(),
  }),
});

export type Header = z.infer<typeof baseHeader> & {
  fields: { links: ShortLink[]; cta: ShortLink };
};

export const headerSchema: z.ZodType<Header> = baseHeader.extend({
  fields: baseHeader.shape.fields.extend({
    links: z.lazy(() => z.array(shortLinkSchema)),
    cta: z.lazy(() => shortLinkSchema),
  }),
});

const baseMarketingBannerCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("marketingBannerCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.unknown(),
    cta: z.unknown(),
    imageStack: z.unknown(),
  }),
});

export type MarketingBannerCard = z.infer<typeof baseMarketingBannerCard> & {
  fields: { cta: Link; imageStack: ImageStack3 };
};

export const marketingBannerCardSchema: z.ZodType<MarketingBannerCard> =
  baseMarketingBannerCard.extend({
    fields: baseMarketingBannerCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema),
      imageStack: z.lazy(() => imageStack3Schema),
    }),
  });

const baseContentCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("contentCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.unknown(),
    cta: z.unknown(),
  }),
});

export type ContentCard = z.infer<typeof baseContentCard> & {
  fields: { cta?: Link | undefined };
};

export const contentCardSchema: z.ZodType<ContentCard> = baseContentCard.extend(
  {
    fields: baseContentCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema).optional(),
    }),
  }
);

const baseConsultationCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("consultationCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.unknown(),
    cta: z.unknown(),
    imageStack: z.unknown(),
  }),
});

export type ConsultationCard = z.infer<typeof baseConsultationCard> & {
  fields: { cta?: Link | undefined; imageStack: ImageStack3 };
};

export const consultationCardSchema: z.ZodType<ConsultationCard> =
  baseConsultationCard.extend({
    fields: baseConsultationCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema).optional(),
      imageStack: z.lazy(() => imageStack3Schema),
    }),
  });

const baseClientsCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("clientsCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.unknown(),
    imageStack: z.unknown(),
  }),
});

export type ClientsCard = z.infer<typeof baseClientsCard> & {
  fields: { imageStack: ImageStack5 };
};

export const clientsCardSchema: z.ZodType<ClientsCard> = baseClientsCard.extend(
  {
    fields: baseClientsCard.shape.fields.extend({
      imageStack: z.lazy(() => imageStack5Schema),
    }),
  }
);

const baseTeaserCard = z.object({
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
    image: z.object({
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
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    }),
  }),
});

export type TeaserCard = z.infer<typeof baseTeaserCard> & {
  fields: { cta: Link };
};

export const teaserCardSchema: z.ZodType<TeaserCard> = baseTeaserCard.extend({
  fields: baseTeaserCard.shape.fields.extend({
    cta: z.lazy(() => linkSchema),
  }),
});

const basePromotionCard = z.object({
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
    image: z.object({
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
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    }),
  }),
});

export type PromotionCard = z.infer<typeof basePromotionCard> & {
  fields: { cta: Link };
};

export const promotionCardSchema: z.ZodType<PromotionCard> =
  basePromotionCard.extend({
    fields: basePromotionCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema),
    }),
  });

const baseContentWithImageCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("contentWithImageCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.unknown(),
    cta: z.unknown(),
    image: z.object({
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
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    }),
  }),
});

export type ContentWithImageCard = z.infer<typeof baseContentWithImageCard> & {
  fields: { cta: Link };
};

export const contentWithImageCardSchema: z.ZodType<ContentWithImageCard> =
  baseContentWithImageCard.extend({
    fields: baseContentWithImageCard.shape.fields.extend({
      cta: z.lazy(() => linkSchema),
    }),
  });

const baseImageCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("imageCard"),
      }),
    }),
  }),
  fields: z.object({
    image: z.object({
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
            image: z
              .object({
                width: z.number(),
                height: z.number(),
              })
              .optional(),
          }),
          fileName: z.string(),
          contentType: z.string(),
        }),
      }),
    }),
  }),
});

export type ImageCard = z.infer<typeof baseImageCard> & { fields: {} };

export const imageCardSchema: z.ZodType<ImageCard> = baseImageCard.extend({
  fields: baseImageCard.shape.fields.extend({}),
});

const baseFormCard = z.object({
  sys: z.object({
    contentType: z.object({
      sys: z.object({
        id: z.literal("formCard"),
      }),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.unknown(),
    form: z.string(),
  }),
});

export type FormCard = z.infer<typeof baseFormCard> & { fields: {} };

export const formCardSchema: z.ZodType<FormCard> = baseFormCard.extend({
  fields: baseFormCard.shape.fields.extend({}),
});

const baseBentoRow1 = z.object({
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

export type BentoRow1 = z.infer<typeof baseBentoRow1> & {
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

export const bentoRow1Schema: z.ZodType<BentoRow1> = baseBentoRow1.extend({
  fields: baseBentoRow1.shape.fields.extend({
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

const baseBentoRow2 = z.object({
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

export type BentoRow2 = z.infer<typeof baseBentoRow2> & {
  fields: {
    column1: ContentCard | ImageCard;
    column2: ContentCard | ImageCard | ContentWithImageCard;
  };
};

export const bentoRow2Schema: z.ZodType<BentoRow2> = baseBentoRow2.extend({
  fields: baseBentoRow2.shape.fields.extend({
    column1: z.lazy(() => z.union([contentCardSchema, imageCardSchema])),
    column2: z.lazy(() =>
      z.union([contentCardSchema, imageCardSchema, contentWithImageCardSchema])
    ),
  }),
});

const baseBentoRow3 = z.object({
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

export type BentoRow3 = z.infer<typeof baseBentoRow3> & {
  fields: {
    column1: PromotionCard | ContentCard | ImageCard;
    column2: TeaserCard | ImageCard;
    column3: TeaserCard | ImageCard;
  };
};

export const bentoRow3Schema: z.ZodType<BentoRow3> = baseBentoRow3.extend({
  fields: baseBentoRow3.shape.fields.extend({
    column1: z.lazy(() =>
      z.union([promotionCardSchema, contentCardSchema, imageCardSchema])
    ),
    column2: z.lazy(() => z.union([teaserCardSchema, imageCardSchema])),
    column3: z.lazy(() => z.union([teaserCardSchema, imageCardSchema])),
  }),
});

const baseBentoRow4 = z.object({
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

export type BentoRow4 = z.infer<typeof baseBentoRow4> & {
  fields: { column1: ImageCard | ConsultationCard | ClientsCard };
};

export const bentoRow4Schema: z.ZodType<BentoRow4> = baseBentoRow4.extend({
  fields: baseBentoRow4.shape.fields.extend({
    column1: z.lazy(() =>
      z.union([imageCardSchema, consultationCardSchema, clientsCardSchema])
    ),
  }),
});

const basePage = z.object({
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
    content: z.unknown(),
    seo: z.unknown(),
    layout: z.unknown(),
  }),
});

export type Page = z.infer<typeof basePage> & {
  fields: {
    hero: Hero;
    content: (BentoRow1 | BentoRow2 | BentoRow3 | BentoRow4)[];
    seo?: SEO | undefined;
    layout: Layout;
  };
};

export const pageSchema: z.ZodType<Page> = basePage.extend({
  fields: basePage.shape.fields.extend({
    hero: z.lazy(() => heroSchema),
    content: z.lazy(() =>
      z.array(
        z.union([
          bentoRow1Schema,
          bentoRow2Schema,
          bentoRow3Schema,
          bentoRow4Schema,
        ])
      )
    ),
    seo: z.lazy(() => seoSchema).optional(),
    layout: z.lazy(() => layoutSchema),
  }),
});

const baseLayout = z.object({
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

export type Layout = z.infer<typeof baseLayout> & {
  fields: { header: Header; footer: Footer; seo: SEO };
};

export const layoutSchema: z.ZodType<Layout> = baseLayout.extend({
  fields: baseLayout.shape.fields.extend({
    header: z.lazy(() => headerSchema),
    footer: z.lazy(() => footerSchema),
    seo: z.lazy(() => seoSchema),
  }),
});
