import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gas-by-Gas API',
      version: '1.0.0',
      description: 'API documentation for GasByGas system',
    },
    servers: [
      {
        url: process.env.BASE_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
      },
      schemas: {
        Outlet: {
          type: 'object',
          required: ['name', 'location'],
          properties: {
            name: { type: 'string' },
            location: { type: 'string' },
            manager: { type: 'string', description: 'User ID of outlet manager' }
          }
        },
        PublicOutlet: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            location: { type: 'string' },
            district: { type: 'string' },
            contact: { type: 'string' }
          }
        }
      }
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log(`Swagger docs available at ${process.env.BASE_URL}/api-docs`);
};

export default swaggerDocs; 