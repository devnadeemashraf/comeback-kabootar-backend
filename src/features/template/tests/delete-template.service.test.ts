import 'reflect-metadata';

import { container } from 'tsyringe';

import { DeleteTemplateService } from '../services/delete-template.service';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { SERVICE_TOKENS } from '@/app/di/tokens/service.tokens';

describe('DeleteTemplateService', () => {
  const id = 'template-uuid';
  const authorId = 'author-uuid';

  beforeEach(() => {
    container.register(SERVICE_TOKENS.DeleteTemplateService, DeleteTemplateService);
  });
  afterEach(() => container.reset());

  it('calls repo delete and does not throw when row deleted', async () => {
    const mockRepo = { delete: jest.fn().mockResolvedValue(true) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<DeleteTemplateService>(SERVICE_TOKENS.DeleteTemplateService);
    await service.execute(id, authorId);
    expect(mockRepo.delete).toHaveBeenCalledWith(id, authorId);
  });

  it('throws NotFoundError when no row deleted', async () => {
    const mockRepo = { delete: jest.fn().mockResolvedValue(false) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<DeleteTemplateService>(SERVICE_TOKENS.DeleteTemplateService);
    await expect(service.execute(id, authorId)).rejects.toThrow('Template not found');
  });
});
