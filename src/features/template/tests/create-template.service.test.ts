import 'reflect-metadata';

import { container } from 'tsyringe';

import { CreateTemplateService } from '../services/create-template.service';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { SERVICE_TOKENS } from '@/app/di/tokens/service.tokens';
import type { Template } from '@/entities/template';

describe('CreateTemplateService', () => {
  const authorId = 'author-uuid';
  const input = { title: 'T', subject: 'S', body: 'B', isPublic: false };

  beforeEach(() => {
    container.register(SERVICE_TOKENS.CreateTemplateService, CreateTemplateService);
  });
  afterEach(() => container.reset());

  it('calls repo create with authorId and input and returns template', async () => {
    const createdTemplate: Template = {
      id: 'new-id',
      authorId,
      title: input.title,
      subject: input.subject,
      body: input.body,
      attachments: [],
      status: 'draft',
      isPublic: false,
      forkCount: 0,
      starCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockRepo = { create: jest.fn().mockResolvedValue(createdTemplate) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<CreateTemplateService>(SERVICE_TOKENS.CreateTemplateService);
    const result = await service.execute(authorId, input, false);
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        authorId,
        title: input.title,
        subject: input.subject,
        body: input.body,
        status: 'draft',
      }),
    );
    expect(result).toEqual(createdTemplate);
  });

  it('throws ValidationError when attachment count exceeds free limit', async () => {
    const mockRepo = { create: jest.fn() };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<CreateTemplateService>(SERVICE_TOKENS.CreateTemplateService);
    await expect(
      service.execute(
        authorId,
        {
          ...input,
          attachments: [
            { key: 'k1', name: 'n1' },
            { key: 'k2', name: 'n2' },
            { key: 'k3', name: 'n3' },
          ],
        },
        false,
      ),
    ).rejects.toThrow(/Attachment count exceeds limit/);
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
