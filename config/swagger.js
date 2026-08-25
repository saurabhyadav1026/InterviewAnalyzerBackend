import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const port = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Interview Analyzer API Docs",
      version: "1.0.0",
      description: "API Documentation for Interview Analyzer backend platforms, student dashboards, and tests.",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  // Parse JSDoc comments from routes and controller files
  apis: ["./routes/*.js", "./controllers/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
};

export default setupSwagger;
