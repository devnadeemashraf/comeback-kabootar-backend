import 'reflect-metadata';

import { container } from 'tsyringe';

import { GetTemplateByIdService } from '../services/get-template-by-id.service';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { SERVICE_TOKENS } from '@/app/di/tokens/service.tokens';
import type { Template } from '@/entities/template';

describe('GetTemplateByIdService', () => {
  const id = 'template-uuid';
  const authorId = 'author-uuid';

  beforeEach(() => {
    container.register(SERVICE_TOKENS.GetTemplateByIdService, GetTemplateByIdService);
  });
  afterEach(() => container.reset());

  it('returns template when found and author matches', async () => {
    const template: Template = {
      id,
      authorId,
      title: 'T',
      subject: 'S',
      body: 'B',
      attachments: [],
      status: 'draft',
      isPublic: false,
      forkCount: 0,
      starCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockRepo = { findById: jest.fn().mockResolvedValue(template) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<GetTemplateByIdService>(
      SERVICE_TOKENS.GetTemplateByIdService,
    );
    const result = await service.execute(id, authorId);
    expect(mockRepo.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(template);
  });

  it('returns null when template not found', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<GetTemplateByIdService>(
      SERVICE_TOKENS.GetTemplateByIdService,
    );
    const result = await service.execute(id, authorId);
    expect(result).toBeNull();
  });

  it('returns null when author does not match', async () => {
    const template: Template = {
      id,
      authorId: 'other-author',
      title: 'T',
      subject: 'S',
      body: 'B',
      attachments: [],
      status: 'draft',
      isPublic: false,
      forkCount: 0,
      starCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockRepo = { findById: jest.fn().mockResolvedValue(template) };
    container.register(REPOSITORY_TOKENS.TemplateRepositoryPostgres, {
      useValue: mockRepo,
    });
    const service = container.resolve<GetTemplateByIdService>(
      SERVICE_TOKENS.GetTemplateByIdService,
    );
    const result = await service.execute(id, authorId);
    expect(result).toBeNull();
  });
});
