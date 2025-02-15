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
        },
        Delivery: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string',
              example: '65f7b1e66a2d4c3a74e3f4a3'
            },
            outletId: {
              type: 'string',
              example: '65f7b1e66a2d4c3a74e3f4a2',
              description: 'Reference to Outlet ID'
            },
            requestId: {
              type: 'string',
              example: '65f7b1e66a2d4c3a74e3f4a1',
              description: 'Reference to Gas Request ID'
            },
            scheduledDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-20T14:30:00Z'
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'delivered', 'canceled'],
              example: 'scheduled'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T09:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T09:00:00Z'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Missing or invalid authentication token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'No token provided' }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Insufficient permissions' }
                }
              }
            }
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