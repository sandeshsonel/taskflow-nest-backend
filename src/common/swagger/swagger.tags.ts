import { SwaggerTag } from './swagger.enums';

export interface ISwaggerTag {
  name: SwaggerTag;
  description: string;
}

export const swaggerTags: ISwaggerTag[] = [
  {
    name: SwaggerTag.APP,
    description: 'Root endpoint & API metadata',
  },
  {
    name: SwaggerTag.HEALTH,
    description: 'Liveness, readiness & dependency health checks',
  },
  {
    name: SwaggerTag.ACCOUNT,
    description: 'User registration, login & profile management',
  },
  {
    name: SwaggerTag.BUG_REPORT,
    description: 'Public endpoint for reporting bugs and issues',
  },
  {
    name: SwaggerTag.TASK,
    description: 'Task management and assignments',
  },
];
