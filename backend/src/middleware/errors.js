export function notFound(req, res) {
  res
    .status(404)
    .json({
      error: {
        code: "NOT_FOUND",
        message: "The requested resource was not found.",
      },
    });
}
export function errorHandler(err, req, res, next) {
  req.log?.error({ err: err.message }, "request failed");
  if (err?.name === "ZodError")
    return res
      .status(400)
      .json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Some information is invalid.",
          fields: err.flatten?.().fieldErrors || {},
        },
      });
  if (err?.code === "P2002")
    return res
      .status(409)
      .json({
        error: { code: "CONFLICT", message: "That record already exists." },
      });
  res
    .status(500)
    .json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Forma could not complete the request.",
      },
    });
}
