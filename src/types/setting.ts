export interface TSetting {
  id: string;
  attributes: {
    logo?: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    url: string;
    version: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}
