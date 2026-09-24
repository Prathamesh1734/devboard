const { z } = require("zod");

const createJobSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(3, "title must be at least 3 characters"),

  company: z
    .string({
      required_error: "company is req",
    })
    .min(2, "company must be at least 2 characters"),

  status: z.enum(["open", "closed", "interviewing"]).optional(),
});

// partial() makes every field in the object optional
// if a field is provided, it must still pass the original validation rules
const updateJobSchema = createJobSchema.partial();

module.exports = { createJobSchema, updateJobSchema };
