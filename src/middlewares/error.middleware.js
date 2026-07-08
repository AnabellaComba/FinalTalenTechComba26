export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl
  });
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    error: error.message || "Error interno del servidor"
  });
};
