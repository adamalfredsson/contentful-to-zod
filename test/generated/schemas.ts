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
  sys: z.object({
    contentType: z.object({
      id: z.literal("link"),
    }),
  }),
  fields: z.object({
    label: z.string(),
    href: z.string(),
  }),
});

export type Link = z.infer<typeof linkSchema>;

export const shortLinkSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("shortLink"),
    }),
  }),
  fields: z.object({
    label: z.string(),
    href: z.string(),
    short: z.string().optional(),
  }),
});

export type ShortLink = z.infer<typeof shortLinkSchema>;

export const imageSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("image"),
    }),
  }),
  fields: z.object({
    alt: z.string(),
    src: z.string(),
  }),
});

export type Image = z.infer<typeof imageSchema>;

export const imageStack3Schema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("imageStack3"),
    }),
  }),
  fields: z.object({
    images: z.array(imageSchema),
    border: z.boolean().optional(),
  }),
});

export type ImageStack3 = z.infer<typeof imageStack3Schema>;

export const imageStack5Schema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("imageStack5"),
    }),
  }),
  fields: z.object({
    images: z.array(imageSchema),
    border: z.boolean().optional(),
  }),
});

export type ImageStack5 = z.infer<typeof imageStack5Schema>;

export const seoSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("seo"),
    }),
  }),
  fields: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z
      .object({
        sys: z.object({
          contentType: z.object({
            sys: z.object({
              id: z.literal("image"),
            }),
          }),
        }),
        fields: z.object({
          sys: z.object({
            contentType: z.object({
              id: z.literal("image"),
            }),
          }),
          fields: z.object({
            alt: z.string(),
            src: z.string(),
          }),
        }),
      })
      .optional(),
  }),
});

export type SEO = z.infer<typeof seoSchema>;

export const heroSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("hero"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: z
      .object({
        sys: z.object({
          contentType: z.object({
            sys: z.object({
              id: z.literal("link"),
            }),
          }),
        }),
        fields: z.object({
          sys: z.object({
            contentType: z.object({
              id: z.literal("link"),
            }),
          }),
          fields: z.object({
            label: z.string(),
            href: z.string(),
          }),
        }),
      })
      .optional(),
  }),
});

export type Hero = z.infer<typeof heroSchema>;

export const footerSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("footer"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    subtitle: z.string(),
    cta: linkSchema,
    ctaBody: contentfulRichTextSchema,
    addressTitle: z.string(),
    addressEmail: linkSchema,
    addressPhone: linkSchema,
    addressOrg: z.string(),
    linksTitle: z.string(),
    linksItems: z.array(linkSchema),
    aboutTitle: z.string(),
    aboutBody: contentfulRichTextSchema,
    aboutCta: z
      .object({
        sys: z.object({
          contentType: z.object({
            sys: z.object({
              id: z.literal("link"),
            }),
          }),
        }),
        fields: z.object({
          sys: z.object({
            contentType: z.object({
              id: z.literal("link"),
            }),
          }),
          fields: z.object({
            label: z.string(),
            href: z.string(),
          }),
        }),
      })
      .optional(),
    copyright: z.string(),
  }),
});

export type Footer = z.infer<typeof footerSchema>;

export const headerSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("header"),
    }),
  }),
  fields: z.object({
    links: z.array(shortLinkSchema),
    cta: shortLinkSchema,
  }),
});

export type Header = z.infer<typeof headerSchema>;

export const marketingBannerCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("marketingBannerCard"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: linkSchema,
    imageStack: imageStack3Schema,
  }),
});

export type MarketingBannerCard = z.infer<typeof marketingBannerCardSchema>;

export const contentCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("contentCard"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: z
      .object({
        sys: z.object({
          contentType: z.object({
            sys: z.object({
              id: z.literal("link"),
            }),
          }),
        }),
        fields: z.object({
          sys: z.object({
            contentType: z.object({
              id: z.literal("link"),
            }),
          }),
          fields: z.object({
            label: z.string(),
            href: z.string(),
          }),
        }),
      })
      .optional(),
  }),
});

export type ContentCard = z.infer<typeof contentCardSchema>;

export const consultationCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("consultationCard"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: z
      .object({
        sys: z.object({
          contentType: z.object({
            sys: z.object({
              id: z.literal("link"),
            }),
          }),
        }),
        fields: z.object({
          sys: z.object({
            contentType: z.object({
              id: z.literal("link"),
            }),
          }),
          fields: z.object({
            label: z.string(),
            href: z.string(),
          }),
        }),
      })
      .optional(),
    imageStack: imageStack3Schema,
  }),
});

export type ConsultationCard = z.infer<typeof consultationCardSchema>;

export const clientsCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("clientsCard"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    imageStack: imageStack5Schema,
  }),
});

export type ClientsCard = z.infer<typeof clientsCardSchema>;

export const teaserCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("teaserCard"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.string(),
    cta: linkSchema,
    image: imageSchema,
  }),
});

export type TeaserCard = z.infer<typeof teaserCardSchema>;

export const promotionCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("promotionCard"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: z.string(),
    cta: linkSchema,
    image: imageSchema,
  }),
});

export type PromotionCard = z.infer<typeof promotionCardSchema>;

export const contentWithImageCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("contentWithImageCard"),
    }),
  }),
  fields: z.object({
    image: imageSchema,
    title: z.string(),
    body: contentfulRichTextSchema,
    cta: linkSchema,
  }),
});

export type ContentWithImageCard = z.infer<typeof contentWithImageCardSchema>;

export const imageCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("imageCard"),
    }),
  }),
  fields: z.object({
    image: z
      .object({
        sys: z.object({
          contentType: z.object({
            sys: z.object({
              id: z.literal("image"),
            }),
          }),
        }),
        fields: z.object({
          sys: z.object({
            contentType: z.object({
              id: z.literal("image"),
            }),
          }),
          fields: z.object({
            alt: z.string(),
            src: z.string(),
          }),
        }),
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
  }),
});

export type ImageCard = z.infer<typeof imageCardSchema>;

export const formCardSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("formCard"),
    }),
  }),
  fields: z.object({
    title: z.string(),
    body: contentfulRichTextSchema,
    form: z.string(),
  }),
});

export type FormCard = z.infer<typeof formCardSchema>;

export const bentoRow1Schema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("bentoRow1"),
    }),
  }),
  fields: z.object({
    column1: z.union([
      marketingBannerCardSchema,
      imageCardSchema,
      formCardSchema,
      contentCardSchema,
      contentWithImageCardSchema,
    ]),
    column2: z.union([contentCardSchema, imageCardSchema]),
  }),
});

export type BentoRow1 = z.infer<typeof bentoRow1Schema>;

export const bentoRow2Schema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("bentoRow2"),
    }),
  }),
  fields: z.object({
    column1: z.union([contentCardSchema, imageCardSchema]),
    column2: z.union([
      contentCardSchema,
      imageCardSchema,
      contentWithImageCardSchema,
    ]),
  }),
});

export type BentoRow2 = z.infer<typeof bentoRow2Schema>;

export const bentoRow3Schema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("bentoRow3"),
    }),
  }),
  fields: z.object({
    column1: z.union([promotionCardSchema, contentCardSchema, imageCardSchema]),
    column2: z.union([teaserCardSchema, imageCardSchema]),
    column3: z.union([teaserCardSchema, imageCardSchema]),
  }),
});

export type BentoRow3 = z.infer<typeof bentoRow3Schema>;

export const bentoRow4Schema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("bentoRow4"),
    }),
  }),
  fields: z.object({
    column1: z.union([
      imageCardSchema,
      consultationCardSchema,
      clientsCardSchema,
    ]),
  }),
});

export type BentoRow4 = z.infer<typeof bentoRow4Schema>;

export const pageSchema = z.object({
  sys: z.object({
    contentType: z.object({
      id: z.literal("page"),
    }),
  }),
  fields: z.object({
    breadcrumbs: z.boolean().optional(),
    breadcrumbLabel: z.string().optional(),
    path: z.string().optional(),
    hero: heroSchema,
    content: z.array(
      z.union([
        bentoRow1Schema,
        bentoRow2Schema,
        bentoRow3Schema,
        bentoRow4Schema,
      ])
    ),
    seo: z
      .object({
        sys: z.object({
          contentType: z.object({
            sys: z.object({
              id: z.literal("seo"),
            }),
          }),
        }),
        fields: z.object({
          sys: z.object({
            contentType: z.object({
              id: z.literal("seo"),
            }),
          }),
          fields: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            image: z
              .object({
                sys: z.object({
                  contentType: z.object({
                    sys: z.object({
                      id: z.literal("image"),
                    }),
                  }),
                }),
                fields: z.object({
                  sys: z.object({
                    contentType: z.object({
                      id: z.literal("image"),
                    }),
                  }),
                  fields: z.object({
                    alt: z.string(),
                    src: z.string(),
                  }),
                }),
              })
              .optional(),
          }),
        }),
      })
      .optional(),
  }),
});

export type Page = z.infer<typeof pageSchema>;
