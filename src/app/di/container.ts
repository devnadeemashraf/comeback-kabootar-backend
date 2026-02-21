import 'reflect-metadata';

import { container } from 'tsyringe';

import { registerBindings } from './bindings';

registerBindings(container);

export { container };
