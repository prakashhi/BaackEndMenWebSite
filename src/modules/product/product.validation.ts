export const createProductSchema = {
  body: {
    type: "object",
    required: ["name", "price", "category_id"],
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      category_id: { type: "number" },
      image: { type: "string" },
    },
  },
};

export const updateProductSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      category_id: { type: "number" },
      image: { type: "string" },
    },
  },
};
