import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { trimEnd } from 'lodash';

export async function setupSwagger(
  app: INestApplication,
  version: string,
  apiUrl = '/',
): Promise<void> {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Youtube Companion API')
    .setDescription(
      `Youtube Companion API provides access to tools used for youtubers to create content with an ease.`,
    )
    .setContact('Youtube Companion', 'https://sksaddam.com', 'sksaddamh08@gmail.com')
    .setVersion(version)
    .addBearerAuth();

  //   documentBuilder.addServer('https://api.youtube-companion.com', 'Production');

  if (process.env.NODE_ENV === 'development') {
    documentBuilder.addServer('http://localhost:3001', 'Localhost');
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());

  SwaggerModule.setup('/api/doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API documentation',
  });

  Logger.log(`Documentation: ${trimEnd(apiUrl, '/')}/api/doc`);
}
