import 'reflect-metadata';

import { container } from 'tsyringe';

import { UpdateTemplateService } from '../services/update-template.service';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { SERVICE_TOKENS } from '@/app/di/tokens/service.tokens';
import type { Template } from '@/entities/template';

describe('UpdateTemplateService', () => {
  const id = 'template-uuid';
  const authorId = 'author-uuid';
  const updatedTemplate: Template = {
    id,
    authorId,
    title: 'Updated',
    subject: 'S',
    body: 'B',
    attachments: [],
    status: 'ready',
    isPublic: false,
    forkCount: 0,
    starCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    container.register(SERVICE_TOKENS.UpdateTemplateService, UpdateTemplateService);
  });
  afterEach(() => container.reset());

  it('calls repo update and returns updated template', async () => {
    const mockRepo = { update: jest.fn().mockResolvedValue(updatedTemplate) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<UpdateTemplateService>(SERVICE_TOKENS.UpdateTemplateService);
    const result = await service.execute(
      id,
      authorId,
      { title: 'Updated', status: 'ready' },
      false,
    );
    expect(mockRepo.update).toHaveBeenCalledWith(id, authorId, expect.any(Object));
    expect(result).toEqual(updatedTemplate);
  });

  it('throws NotFoundError when repo returns null', async () => {
    const mockRepo = { update: jest.fn().mockResolvedValue(null) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<UpdateTemplateService>(SERVICE_TOKENS.UpdateTemplateService);
    await expect(service.execute(id, authorId, { title: 'Updated' }, false)).rejects.toThrow(
      'Template not found',
    );
  });
});
