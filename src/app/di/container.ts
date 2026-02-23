import 'reflect-metadata';

import { container } from 'tsyringe';

import {
  registerContextBindings,
  registerControllerBindings,
  registerInfrastructureBindings,
  registerRepositoryBindings,
  registerServiceBindings,
} from './bindings';

registerControllerBindings(container);
registerInfrastructureBindings(container);
registerRepositoryBindings(container);
registerContextBindings(container);
registerServiceBindings(container);

export { container };
