import 'reflect-metadata';

import { container } from 'tsyringe';

import { GetAllTemplatesService } from '../services/get-all-templates.service';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { SERVICE_TOKENS } from '@/app/di/tokens/service.tokens';
import type { Template } from '@/entities/template';

describe('GetAllTemplatesService', () => {
  const authorId = 'author-uuid';

  beforeEach(() => {
    container.register(SERVICE_TOKENS.GetAllTemplatesService, GetAllTemplatesService);
  });
  afterEach(() => container.reset());

  it('calls findAllForAuthorById with authorId and returns result', async () => {
    const templates: Template[] = [
      {
        id: 't1',
        authorId,
        title: 'T1',
        subject: 'S1',
        body: 'B1',
        attachments: [],
        status: 'draft',
        isPublic: false,
        forkCount: 0,
        starCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const mockRepo = {
      findAllForAuthorById: jest.fn().mockResolvedValue(templates),
    };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<GetAllTemplatesService>(
      SERVICE_TOKENS.GetAllTemplatesService,
    );
    const result = await service.execute(authorId);
    expect(mockRepo.findAllForAuthorById).toHaveBeenCalledWith(authorId);
    expect(result).toEqual(templates);
  });

  it('returns empty array when repo returns empty', async () => {
    const mockRepo = { findAllForAuthorById: jest.fn().mockResolvedValue([]) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<GetAllTemplatesService>(
      SERVICE_TOKENS.GetAllTemplatesService,
    );
    const result = await service.execute(authorId);
    expect(result).toEqual([]);
  });
});
