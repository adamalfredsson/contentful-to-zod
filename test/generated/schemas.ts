import { z } from "zod";

export const contentfulRichTextSchema = z.object({
  data: z.record(z.unknown()),
  content: z.array(
    z.object({
      data: z.record(z.unknown()),
      content: z.array(
        z.object({
          data: z.record(z.unknown()),
          marks: z.array(
            z.object({
              type: z.string(),
            })
          ),
          value: z.string(),
          nodeType: z.literal("text"),
        })
      ),
      nodeType: z.literal("paragraph"),
    })
  ),
  nodeType: z.literal("document"),
});

export type ContentfulRichText = z.infer<typeof contentfulRichTextSchema>;

export const contentfulMediaSchema = z.object({
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
});

export type ContentfulMedia = z.infer<typeof contentfulMediaSchema>;

export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export type Link = z.infer<typeof linkSchema>;

export const shortLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  short: z.string().optional(),
});

export type ShortLink = z.infer<typeof shortLinkSchema>;

export const imageSchema = z.object({
  alt: z.string(),
  src: z.string(),
});

export type Image = z.infer<typeof imageSchema>;

export const imageStack3Schema = z.object({
  images: z.array(
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("image"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageSchema,
    })
  ),
  border: z.boolean().optional(),
});

export type ImageStack3 = z.infer<typeof imageStack3Schema>;

export const imageStack5Schema = z.object({
  images: z.array(
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("image"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageSchema,
    })
  ),
  border: z.boolean().optional(),
});

export type ImageStack5 = z.infer<typeof imageStack5Schema>;

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z
    .object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("image"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageSchema,
    })
    .optional(),
});

export type SEO = z.infer<typeof seoSchema>;

export const heroSchema = z.object({
  title: z.string(),
  body: contentfulRichTextSchema,
  cta: z
    .object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("link"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: linkSchema,
    })
    .optional(),
});

export type Hero = z.infer<typeof heroSchema>;

export const footerSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  cta: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("link"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: linkSchema,
  }),
  ctaBody: contentfulRichTextSchema,
  addressTitle: z.string(),
  addressEmail: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("link"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: linkSchema,
  }),
  addressPhone: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("link"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: linkSchema,
  }),
  addressOrg: z.string(),
  linksTitle: z.string(),
  linksItems: z.array(
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("link"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: linkSchema,
    })
  ),
  aboutTitle: z.string(),
  aboutBody: contentfulRichTextSchema,
  aboutCta: z
    .object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("link"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: linkSchema,
    })
    .optional(),
  copyright: z.string(),
});

export type Footer = z.infer<typeof footerSchema>;

export const headerSchema = z.object({
  links: z.array(
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("shortLink"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: shortLinkSchema,
    })
  ),
  cta: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("shortLink"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: shortLinkSchema,
  }),
});

export type Header = z.infer<typeof headerSchema>;

export const marketingBannerCardSchema = z.object({
  title: z.string(),
  body: contentfulRichTextSchema,
  cta: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("link"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: linkSchema,
  }),
  imageStack: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("imageStack3"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: imageStack3Schema,
  }),
});

export type MarketingBannerCard = z.infer<typeof marketingBannerCardSchema>;

export const contentCardSchema = z.object({
  title: z.string(),
  body: contentfulRichTextSchema,
  cta: z
    .object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("link"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: linkSchema,
    })
    .optional(),
});

export type ContentCard = z.infer<typeof contentCardSchema>;

export const consultationCardSchema = z.object({
  title: z.string(),
  body: contentfulRichTextSchema,
  cta: z
    .object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("link"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: linkSchema,
    })
    .optional(),
  imageStack: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("imageStack3"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: imageStack3Schema,
  }),
});

export type ConsultationCard = z.infer<typeof consultationCardSchema>;

export const clientsCardSchema = z.object({
  title: z.string(),
  body: contentfulRichTextSchema,
  imageStack: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("imageStack5"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: imageStack5Schema,
  }),
});

export type ClientsCard = z.infer<typeof clientsCardSchema>;

export const teaserCardSchema = z.object({
  title: z.string(),
  body: z.string(),
  cta: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("link"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: linkSchema,
  }),
  image: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("image"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: imageSchema,
  }),
});

export type TeaserCard = z.infer<typeof teaserCardSchema>;

export const promotionCardSchema = z.object({
  title: z.string(),
  body: z.string(),
  cta: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("link"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: linkSchema,
  }),
  image: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("image"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: imageSchema,
  }),
});

export type PromotionCard = z.infer<typeof promotionCardSchema>;

export const contentWithImageCardSchema = z.object({
  image: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("image"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: imageSchema,
  }),
  title: z.string(),
  body: contentfulRichTextSchema,
  cta: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("link"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: linkSchema,
  }),
});

export type ContentWithImageCard = z.infer<typeof contentWithImageCardSchema>;

export const imageCardSchema = z.object({
  image: z
    .object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("image"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageSchema,
    })
    .optional(),
  img: z.object({
    sys: z.object({
      type: z.literal("Link"),
      linkType: z.literal("Asset"),
      id: z.string(),
    }),
    fields: contentfulMediaSchema,
  }),
});

export type ImageCard = z.infer<typeof imageCardSchema>;

export const formCardSchema = z.object({
  title: z.string(),
  body: contentfulRichTextSchema,
  form: z.string(),
});

export type FormCard = z.infer<typeof formCardSchema>;

export const bentoRow1Schema = z.object({
  column1: z.union([
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("marketingBannerCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: marketingBannerCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("imageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("formCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: formCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("contentCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: contentCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("contentWithImageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: contentWithImageCardSchema,
    }),
  ]),
  column2: z.union([
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("contentCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: contentCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("imageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageCardSchema,
    }),
  ]),
});

export type BentoRow1 = z.infer<typeof bentoRow1Schema>;

export const bentoRow2Schema = z.object({
  column1: z.union([
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("contentCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: contentCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("imageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageCardSchema,
    }),
  ]),
  column2: z.union([
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("contentCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: contentCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("imageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("contentWithImageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: contentWithImageCardSchema,
    }),
  ]),
});

export type BentoRow2 = z.infer<typeof bentoRow2Schema>;

export const bentoRow3Schema = z.object({
  column1: z.union([
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("promotionCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: promotionCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("contentCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: contentCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("imageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageCardSchema,
    }),
  ]),
  column2: z.union([
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("teaserCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: teaserCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("imageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageCardSchema,
    }),
  ]),
  column3: z.union([
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("teaserCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: teaserCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("imageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageCardSchema,
    }),
  ]),
});

export type BentoRow3 = z.infer<typeof bentoRow3Schema>;

export const bentoRow4Schema = z.object({
  column1: z.union([
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("imageCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: imageCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("consultationCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: consultationCardSchema,
    }),
    z.object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("clientsCard"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: clientsCardSchema,
    }),
  ]),
});

export type BentoRow4 = z.infer<typeof bentoRow4Schema>;

export const pageSchema = z.object({
  breadcrumbs: z.boolean().optional(),
  breadcrumbLabel: z.string().optional(),
  path: z.string().optional(),
  hero: z.object({
    sys: z.object({
      id: z.string(),
      type: z.string(),
      linkType: z.string().optional(),
      contentType: z.object({
        sys: z.object({
          id: z.literal("hero"),
          linkType: z.literal("Entry"),
          type: z.literal("Link"),
        }),
      }),
    }),
    fields: heroSchema,
  }),
  content: z.array(
    z.union([
      z.object({
        sys: z.object({
          id: z.string(),
          type: z.string(),
          linkType: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              id: z.literal("bentoRow1"),
              linkType: z.literal("Entry"),
              type: z.literal("Link"),
            }),
          }),
        }),
        fields: bentoRow1Schema,
      }),
      z.object({
        sys: z.object({
          id: z.string(),
          type: z.string(),
          linkType: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              id: z.literal("bentoRow2"),
              linkType: z.literal("Entry"),
              type: z.literal("Link"),
            }),
          }),
        }),
        fields: bentoRow2Schema,
      }),
      z.object({
        sys: z.object({
          id: z.string(),
          type: z.string(),
          linkType: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              id: z.literal("bentoRow3"),
              linkType: z.literal("Entry"),
              type: z.literal("Link"),
            }),
          }),
        }),
        fields: bentoRow3Schema,
      }),
      z.object({
        sys: z.object({
          id: z.string(),
          type: z.string(),
          linkType: z.string().optional(),
          contentType: z.object({
            sys: z.object({
              id: z.literal("bentoRow4"),
              linkType: z.literal("Entry"),
              type: z.literal("Link"),
            }),
          }),
        }),
        fields: bentoRow4Schema,
      }),
    ])
  ),
  seo: z
    .object({
      sys: z.object({
        id: z.string(),
        type: z.string(),
        linkType: z.string().optional(),
        contentType: z.object({
          sys: z.object({
            id: z.literal("seo"),
            linkType: z.literal("Entry"),
            type: z.literal("Link"),
          }),
        }),
      }),
      fields: seoSchema,
    })
    .optional(),
});

export type Page = z.infer<typeof pageSchema>;
