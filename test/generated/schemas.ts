import { z } from "zod";

export const linkSchema = z.object({
    label: z.string(),
    href: z.string()
  });

export type Link = z.infer<typeof linkSchema>;

export const shortLinkSchema = z.object({
    label: z.string(),
    href: z.string(),
    short: z.string().optional()
  });

export type ShortLink = z.infer<typeof shortLinkSchema>;

export const imageSchema = z.object({
    alt: z.string(),
    src: z.string()
  });

export type Image = z.infer<typeof imageSchema>;

export const imageStack3Schema = z.object({
    images: z.array(z.object({
    alt: z.string(),
    src: z.string()
  })),
    border: z.boolean().optional()
  });

export type ImageStack3 = z.infer<typeof imageStack3Schema>;

export const imageStack5Schema = z.object({
    images: z.array(z.object({
    alt: z.string(),
    src: z.string()
  })),
    border: z.boolean().optional()
  });

export type ImageStack5 = z.infer<typeof imageStack5Schema>;

export const seoSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.object({
    alt: z.string(),
    src: z.string()
  }).optional()
  });

export type SEO = z.infer<typeof seoSchema>;

export const heroSchema = z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional()
  });

export type Hero = z.infer<typeof heroSchema>;

export const footerSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    ctaBody: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    addressTitle: z.string(),
    addressEmail: z.object({
    label: z.string(),
    href: z.string()
  }),
    addressPhone: z.object({
    label: z.string(),
    href: z.string()
  }),
    addressOrg: z.string(),
    linksTitle: z.string(),
    linksItems: z.array(z.object({
    label: z.string(),
    href: z.string()
  })),
    aboutTitle: z.string(),
    aboutBody: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    aboutCta: z.object({
    label: z.string(),
    href: z.string()
  }).optional(),
    copyright: z.string()
  });

export type Footer = z.infer<typeof footerSchema>;

export const headerSchema = z.object({
    links: z.array(z.object({
    label: z.string(),
    href: z.string(),
    short: z.string().optional()
  })),
    cta: z.object({
    label: z.string(),
    href: z.string(),
    short: z.string().optional()
  })
  });

export type Header = z.infer<typeof headerSchema>;

export const marketingBannerCardSchema = z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    imageStack: z.object({
    images: z.array(z.object({
    alt: z.string(),
    src: z.string()
  })),
    border: z.boolean().optional()
  })
  });

export type MarketingBannerCard = z.infer<typeof marketingBannerCardSchema>;

export const contentCardSchema = z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional()
  });

export type ContentCard = z.infer<typeof contentCardSchema>;

export const consultationCardSchema = z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional(),
    imageStack: z.object({
    images: z.array(z.object({
    alt: z.string(),
    src: z.string()
  })),
    border: z.boolean().optional()
  })
  });

export type ConsultationCard = z.infer<typeof consultationCardSchema>;

export const clientsCardSchema = z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    imageStack: z.object({
    images: z.array(z.object({
    alt: z.string(),
    src: z.string()
  })),
    border: z.boolean().optional()
  })
  });

export type ClientsCard = z.infer<typeof clientsCardSchema>;

export const teaserCardSchema = z.object({
    title: z.string(),
    body: z.string(),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    image: z.object({
    alt: z.string(),
    src: z.string()
  })
  });

export type TeaserCard = z.infer<typeof teaserCardSchema>;

export const promotionCardSchema = z.object({
    title: z.string(),
    body: z.string(),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    image: z.object({
    alt: z.string(),
    src: z.string()
  })
  });

export type PromotionCard = z.infer<typeof promotionCardSchema>;

export const contentWithImageCardSchema = z.object({
    image: z.object({
    alt: z.string(),
    src: z.string()
  }),
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  })
  });

export type ContentWithImageCard = z.infer<typeof contentWithImageCardSchema>;

export const imageCardSchema = z.object({
    image: z.object({
    alt: z.string(),
    src: z.string()
  })
  });

export type ImageCard = z.infer<typeof imageCardSchema>;

export const formCardSchema = z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    form: z.string()
  });

export type FormCard = z.infer<typeof formCardSchema>;

export const bentoRow1Schema = z.object({
    column1: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    imageStack: z.object({
    images: z.array(z.object({
    alt: z.string(),
    src: z.string()
  })),
    border: z.boolean().optional()
  })
  }),
    column2: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional()
  })
  });

export type BentoRow1 = z.infer<typeof bentoRow1Schema>;

export const bentoRow2Schema = z.object({
    column1: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional()
  }),
    column2: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional()
  })
  });

export type BentoRow2 = z.infer<typeof bentoRow2Schema>;

export const bentoRow3Schema = z.object({
    column1: z.object({
    title: z.string(),
    body: z.string(),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    image: z.object({
    alt: z.string(),
    src: z.string()
  })
  }),
    column2: z.object({
    title: z.string(),
    body: z.string(),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    image: z.object({
    alt: z.string(),
    src: z.string()
  })
  }),
    column3: z.object({
    title: z.string(),
    body: z.string(),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    image: z.object({
    alt: z.string(),
    src: z.string()
  })
  })
  });

export type BentoRow3 = z.infer<typeof bentoRow3Schema>;

export const bentoRow4Schema = z.object({
    column1: z.object({
    image: z.object({
    alt: z.string(),
    src: z.string()
  })
  })
  });

export type BentoRow4 = z.infer<typeof bentoRow4Schema>;

export const bentoGridSchema = z.object({
    rows: z.array(z.object({
    column1: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    imageStack: z.object({
    images: z.array(z.object({
    alt: z.string(),
    src: z.string()
  })),
    border: z.boolean().optional()
  })
  }),
    column2: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional()
  })
  }))
  });

export type BentoGrid = z.infer<typeof bentoGridSchema>;

export const pageSchema = z.object({
    breadcrumbs: z.boolean().optional(),
    breadcrumbLabel: z.string().optional(),
    path: z.string().optional(),
    hero: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional()
  }),
    grid: z.object({
    rows: z.array(z.object({
    column1: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }),
    imageStack: z.object({
    images: z.array(z.object({
    alt: z.string(),
    src: z.string()
  })),
    border: z.boolean().optional()
  })
  }),
    column2: z.object({
    title: z.string(),
    body: z.object({
    nodeType: z.string(),
    content: z.array(z.any()),
    data: z.record(z.any()).optional()
  }),
    cta: z.object({
    label: z.string(),
    href: z.string()
  }).optional()
  })
  }))
  }).optional(),
    seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.object({
    alt: z.string(),
    src: z.string()
  }).optional()
  }).optional()
  });

export type Page = z.infer<typeof pageSchema>;
