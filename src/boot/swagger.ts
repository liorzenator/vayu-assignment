import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vayu API',
      version: '1.0.0',
      description: 'API documentation for Vayu service',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  // Scan docs folder for OpenAPI JSDoc annotations
  apis: ['src/docs/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
