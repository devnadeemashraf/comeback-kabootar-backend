import 'reflect-metadata';

import { container } from 'tsyringe';

import {
  registerControllerBindings,
  registerInfrastructureBindings,
  registerRepositoryBindings,
  registerServiceBindings,
} from './bindings';

registerControllerBindings(container);
registerInfrastructureBindings(container);
registerRepositoryBindings(container);
registerServiceBindings(container);

export { container };
